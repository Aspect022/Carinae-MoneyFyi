"""
Encrypted transaction download service
"""
import base64
import json
import logging
from fastapi import HTTPException

from ..database import get_supabase
from ..config import get_settings
from .crypto_service import get_encryption_manager

logger = logging.getLogger("moneyfyi.backend.encrypted_download")


class EncryptedDownloadService:
    """Service for downloading and decrypting transaction files"""
    
    def __init__(self):
        self.settings = get_settings()
        self.encryptor = get_encryption_manager()
        self.supabase = get_supabase()
        self.bucket = self.settings.encrypted_bucket_name
    
    async def download_and_decrypt(self, transaction_id: str, user_id: str):
        """
        Download and decrypt transaction:
        1. Fetch metadata from DB
        2. Download encrypted file
        3. Decrypt file bytes
        4. Decrypt normalized JSON
        5. Return both
        """
        try:
            # Fetch from DB
            response = self.supabase.table("encrypted_transactions") \
                .select("*") \
                .eq("id", transaction_id) \
                .eq("user_id", user_id) \
                .single() \
                .execute()
            
            if not response.data:
                raise HTTPException(404, "Transaction not found")
            
            txn = response.data
            logger.info(f"Downloading transaction: {transaction_id}")
            
            # Download encrypted file from storage
            file_response = self.supabase.storage.from_(self.bucket).download(
                txn["encrypted_file_path"]
            )
            
            # Decrypt file (file_response is already bytes)
            encrypted_file_b64 = base64.b64encode(file_response).decode('utf-8')
            decrypted_file = self.encryptor.decrypt(encrypted_file_b64)
            
            # Decrypt normalized JSON
            decrypted_json_bytes = self.encryptor.decrypt(txn["encrypted_normalized_json"])
            normalized = json.loads(decrypted_json_bytes.decode('utf-8'))
            
            logger.info(f"Successfully decrypted transaction: {transaction_id}")
            
            return {
                "transaction_id": transaction_id,
                "filename": txn["original_filename"],
                "file_data": base64.b64encode(decrypted_file).decode('utf-8'),
                "normalized_json": normalized,
                "vendor": txn["vendor_name"],
                "amount": txn["amount"],
                "transaction_date": txn["transaction_date"],
                "transaction_type": txn["transaction_type"],
                "created_at": txn["created_at"]
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.exception(f"Download failed: {e}")
            raise HTTPException(500, f"Download failed: {str(e)}")


# Singleton
_download_service = None


def get_encrypted_download_service():
    """Get or create singleton download service"""
    global _download_service
    if _download_service is None:
        _download_service = EncryptedDownloadService()
    return _download_service
