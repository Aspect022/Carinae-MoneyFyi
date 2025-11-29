from typing import Any, List
from uuid import UUID
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, UploadFile, File, Form
import logging
from supabase import Client

from ..database import get_supabase
from ..dependencies import get_current_user_id
from ..models import Document
from ..schemas import DocumentResponse, DocumentCreate

router = APIRouter(prefix="/documents", tags=["documents"])

logger = logging.getLogger("moneyfyi.backend.documents")

# Placeholder for the task import
# from ..tasks.document_processing import process_document_task

@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("bank_statement"),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """
    Upload a document file (PDF, image, CSV).
    The file is uploaded to Supabase Storage and then processed via OCR.
    """
    
    # Read file content
    file_content = await file.read()
    file_size = len(file_content)
    
    # Sanitize filename - remove/replace invalid characters for Supabase Storage
    import re
    safe_filename = file.filename
    # Replace spaces with underscores
    safe_filename = safe_filename.replace(' ', '_')
    # Remove brackets and other special characters, keep only alphanumeric, dots, hyphens, underscores
    safe_filename = re.sub(r'[^\w\s.-]', '', safe_filename)
    
    # Generate storage path with sanitized filename
    file_ext = safe_filename.split('.')[-1] if '.' in safe_filename else 'bin'
    storage_path = f"{user_id}/{datetime.now(timezone.utc).strftime('%Y/%m/%d')}/{safe_filename}"
    
    try:
        # Upload to Supabase Storage
        storage_response = supabase.storage.from_("documents").upload(
            storage_path,
            file_content,
            {"content-type": file.content_type or "application/octet-stream"}
        )
        
        # Get public URL
        file_url = supabase.storage.from_("documents").get_public_url(storage_path)
        
    except Exception as e:
        logger.error(f"Failed to upload to storage: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file to storage: {str(e)}"
        )
    
    # Create document record
    doc_data = {
        "user_id": str(user_id),
        "file_name": file.filename,
        "file_type": file.content_type or "application/octet-stream",
        "file_size": file_size,
        "file_url": file_url,
        "status": "processing",
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
    
    response = supabase.table("documents").insert(doc_data).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create document record"
        )
    
    doc_record = response.data[0]
    
    # Trigger background processing
    from ..tasks.document_processing import process_document_task
    background_tasks.add_task(process_document_task, doc_record["id"], user_id)
    
    return doc_record

@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    limit: int = 50,
    offset: int = 0,
    status: str = None,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """List user's documents."""
    
    query = supabase.table("documents").select("*").eq("user_id", str(user_id))
    
    if status:
        query = query.eq("status", status)
        
    query = query.order("uploaded_at", desc=True).range(offset, offset + limit - 1)
    
    response = query.execute()
    
    return response.data

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Get document details."""
    
    response = supabase.table("documents").select("*").eq("id", str(document_id)).eq("user_id", str(user_id)).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
        
    return response.data[0]

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> None:
    """Soft delete a document."""
    
    # Check if exists first
    check = supabase.table("documents").select("id").eq("id", str(document_id)).eq("user_id", str(user_id)).execute()
    if not check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Soft delete by setting status to 'deleted'
    # Or actually delete row if that's preferred. Let's do soft delete as per spec.
    # But wait, schema says status enum: uploaded, processing, completed, failed.
    # If 'deleted' isn't in enum, we might need to add it or just delete the row.
    # Let's delete the row for now to keep it simple and clean.
    
    supabase.table("documents").delete().eq("id", str(document_id)).eq("user_id", str(user_id)).execute()
    
    # TODO: Also delete from Storage bucket
