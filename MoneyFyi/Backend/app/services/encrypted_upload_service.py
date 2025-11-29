"""
Encrypted transaction upload service
"""
import uuid
import json
import base64
import logging
from datetime import datetime, timezone
from fastapi import UploadFile, HTTPException

from ..database import get_supabase
from ..config import get_settings
from .crypto_service import get_encryption_manager
from ...ai_engine.data_normalizer_agent import DataNormalizerAgent

logger = logging.getLogger("moneyfyi.backend.encrypted_upload")


class EncryptedUploadService:
    """Service for uploading and encrypting transaction files"""
    
    def __init__(self):
        self.settings = get_settings()
        self.encryptor = get_encryption_manager()
        self.supabase = get_supabase()
        self.normalizer = DataNormalizerAgent()
        self.bucket = self.settings.encrypted_bucket_name
    
    async def upload_and_encrypt(self, file: UploadFile, user_id: str):
        """
        Upload file with end-to-end encryption:
        1. Read file bytes
        2. Normalize with AI
        3. Encrypt file
        4. Encrypt normalized JSON
        5. Upload to encrypted storage
        6. Save metadata to DB
        """
        storage_path = None
        
        try:
            # Read file
            file_bytes = await file.read()
            file_size = len(file_bytes)
            
            max_size = self.settings.max_file_size_mb * 1024 * 1024 if hasattr(self.settings, 'max_file_size_mb') else 50 * 1024 * 1024
            if file_size > max_size:
                raise HTTPException(413, f"File too large. Max: {max_size // (1024*1024)}MB")
            
            logger.info(f"Processing file upload: {file.filename}, size: {file_size} bytes")
            
            # Normalize data
            try:
                file_text = file_bytes.decode('utf-8')
            except:
                # If binary file, encode to base64 for normalization
                file_text = base64.b64encode(file_bytes).decode('utf-8')
            
            normalized = self.normalizer.normalize(file_text)
            logger.info(f"Normalized data: vendor={normalized.get('vendor')}, amount={normalized.get('amount')}")
            
            # Encrypt file bytes
            encrypted_file = self.encryptor.encrypt(file_bytes)
            
            # Encrypt normalized JSON
            normalized_json = json.dumps(normalized)
            encrypted_json = self.encryptor.encrypt(normalized_json.encode('utf-8'))
            
            # Generate storage path
            storage_path = f"{user_id}/{uuid.uuid4()}.enc"
            
            # Convert encrypted base64 to binary for storage
            encrypted_binary = base64.b64decode(encrypted_file)
            
            # Upload to Supabase Storage
            self.supabase.storage.from_(self.bucket).upload(
                path=storage_path,
                file=encrypted_binary,
                file_options={"content-type": "application/octet-stream"}
            )
            
            logger.info(f"Uploaded encrypted file to: {storage_path}")
            
            # Insert metadata to DB
            db_data = {
                "user_id": user_id,
                "encrypted_file_path": storage_path,
                "encrypted_normalized_json": encrypted_json,
                "vendor_name": normalized.get("vendor"),
                "amount": float(normalized.get("amount", 0)),
                "transaction_date": normalized.get("date"),
                "transaction_type": normalized.get("type", "debit"),
                "key_version": self.settings.key_version,
                "original_filename": file.filename,
                "file_size_bytes": file_size,
                "mime_type": file.content_type or "application/octet-stream",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            
            response = self.supabase.table("encrypted_transactions").insert(db_data).execute()
            
            if not response.data:
                raise HTTPException(500, "Failed to create encrypted transaction record")
            
            transaction_id = response.data[0]["id"]
            
            logger.info(f"Created encrypted transaction: {transaction_id}")
            
            return {
                "transaction_id": transaction_id,
                "status": "success",
                "message": "File uploaded and encrypted successfully"
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.exception(f"Upload failed: {e}")
            # Cleanup on failure
            if storage_path:
                try:
                    self.supabase.storage.from_(self.bucket).remove([storage_path])
                except:
                    pass
            raise HTTPException(500, f"Upload failed: {str(e)}")


# Singleton
_upload_service = None


def get_encrypted_upload_service():
    """Get or create singleton upload service"""
    global _upload_service
    if _upload_service is None:
        _upload_service = EncryptedUploadService()
    return _upload_service
