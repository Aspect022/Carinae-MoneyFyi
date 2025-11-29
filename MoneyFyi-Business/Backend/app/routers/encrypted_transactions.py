"""
Encrypted transaction API endpoints
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from datetime import datetime

from ..dependencies import get_user_id
from ..services.encrypted_upload_service import get_encrypted_upload_service
from ..services.encrypted_download_service import get_encrypted_download_service
from ..database import get_supabase

router = APIRouter(prefix="/encrypted-transactions", tags=["Encrypted Transactions"])


# Response models
class UploadResponse(BaseModel):
    transaction_id: str
    status: str
    message: str


class DownloadResponse(BaseModel):
    transaction_id: str
    filename: str
    file_data: str
    normalized_json: Dict[str, Any]
    vendor: str
    amount: float
    transaction_date: str
    transaction_type: str
    created_at: str


class TransactionListItem(BaseModel):
    id: str
    vendor_name: str
    amount: float
    transaction_date: str
    transaction_type: str
    original_filename: str
    created_at: str


class TransactionListResponse(BaseModel):
    transactions: List[TransactionListItem]
    total: int


@router.post("/upload", response_model=UploadResponse)
async def upload_encrypted_transaction(
    file: UploadFile = File(...),
    user_id: str = Depends(get_user_id)
):
    """
    Upload and encrypt transaction file
    
    Flow:
    1. Read file
    2. Normalize with AI
    3. Encrypt file bytes
    4. Encrypt normalized JSON
    5. Upload to encrypted storage
    6. Save metadata
    """
    service = get_encrypted_upload_service()
    return await service.upload_and_encrypt(file, user_id)


@router.get("/{transaction_id}/download", response_model=DownloadResponse)
async def download_encrypted_transaction(
    transaction_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    Download and decrypt transaction
    
    Returns:
    - Decrypted file (base64)
    - Decrypted normalized JSON
    - Metadata
    """
    service = get_encrypted_download_service()
    return await service.download_and_decrypt(transaction_id, user_id)


@router.get("/", response_model=TransactionListResponse)
async def list_encrypted_transactions(
    user_id: str = Depends(get_user_id),
    limit: int = 50,
    offset: int = 0
):
    """List user's encrypted transactions (metadata only, not decrypted)"""
    supabase = get_supabase()
    
    response = supabase.table("encrypted_transactions") \
        .select("id, vendor_name, amount, transaction_date, transaction_type, original_filename, created_at") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .range(offset, offset + limit - 1) \
        .execute()
    
    return {
        "transactions": response.data,
        "total": len(response.data)
    }
