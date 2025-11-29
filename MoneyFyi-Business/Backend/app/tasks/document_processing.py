import logging
import os
from uuid import UUID
from datetime import datetime, timezone
from pathlib import Path

from ..database import init_supabase_client
from ..services.gemini_service import gemini_service

logger = logging.getLogger("moneyfyi.backend.tasks")

async def process_document_task(document_id: str, user_id: UUID):
    """
    Background task to process a document:
    1. Download file from Supabase Storage
    2. Send to Gemini for extraction
    3. Update document record with extracted data
    4. Create transaction records
    """
    logger.info(f"Starting processing for document {document_id}")
    
    supabase = init_supabase_client()
    
    try:
        # 1. Get document details
        doc_response = supabase.table("documents").select("*").eq("id", document_id).execute()
        if not doc_response.data:
            logger.error(f"Document {document_id} not found")
            return
        
        document = doc_response.data[0]
        file_url = document["file_url"]
        
        # Extract storage path from URL or reconstruct it
        # file_url format: https://[project].supabase.co/storage/v1/object/public/documents/[path]
       # We can download using the path from the URL
        storage_path = file_url.split('/documents/')[-1] if '/documents/' in file_url else None
        
        if not storage_path:
            logger.error(f"Could not extract storage path from URL: {file_url}")
            return
        
        # Update status to processing
        supabase.table("documents").update({
            "status": "processing",
            "processed_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", document_id).execute()
        
        # 2. Download file
        # Note: Supabase-py storage download returns bytes
        try:
            file_data = supabase.storage.from_("documents").download(storage_path)
        except Exception as e:
            logger.error(f"Failed to download file: {e}")
            raise e
            
        # 3. Select Prompt based on document type
        doc_type = document.get("document_type", "bank_statement")
        prompt_file = "bank_statement_prompt.txt"
        if doc_type == "invoice":
            prompt_file = "invoice_prompt.txt"
        elif doc_type == "upi_log":
            prompt_file = "upi_log_prompt.txt" # We need to create this one too if used
            
        prompt_path = Path(__file__).parent.parent / "prompts" / prompt_file
        
        if not prompt_path.exists():
            # Fallback prompt if file missing
            prompt = "Extract all financial data from this image in JSON format."
        else:
            with open(prompt_path, "r") as f:
                prompt = f.read()
                
        # 4. Call Gemini
        logger.info(f"Calling Gemini for document {document_id}")
        extracted_data = await gemini_service.extract_data_from_image(file_data, prompt)
        
        # 5. Update Document with extracted data
        supabase.table("documents").update({
            "status": "completed",
            "extracted_data": extracted_data,
            "processed_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", document_id).execute()
        
        # 6. Create Transactions
        # We should parse the extracted_data and insert into transactions table
        await create_transactions_from_extraction(supabase, document_id, user_id, extracted_data, doc_type)
        
        logger.info(f"Successfully processed document {document_id}")
        
    except Exception as e:
        logger.exception(f"Error processing document {document_id}")
        supabase.table("documents").update({
            "status": "failed",
            "processed_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", document_id).execute()

async def create_transactions_from_extraction(supabase, document_id, user_id, data, doc_type):
    """Helper to insert extracted transactions into the database."""
    from .analysis_tasks import analyze_transaction_task
    
    transactions_to_insert = []
    
    if doc_type == "bank_statement":
        txns = data.get("transactions", [])
        for txn in txns:
            # Basic validation
            if not txn.get("date") or not txn.get("description"):
                continue
                
            t_data = {
                "document_id": document_id,
                "user_id": str(user_id),
                "date": txn.get("date"),
                "description": txn.get("description"),
                "debit": txn.get("debit", 0),
                "credit": txn.get("credit", 0),
                "balance": txn.get("balance", 0),
                "transaction_mode": "unknown",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            transactions_to_insert.append(t_data)
            
    elif doc_type == "invoice":
        # Create one transaction for the invoice total
        if data.get("total_amount"):
            t_data = {
                "document_id": document_id,
                "user_id": str(user_id),
                "date": data.get("invoice_date", datetime.now().date().isoformat()),
                "description": f"Invoice {data.get('invoice_number')} - {data.get('vendor_name')}",
                "debit": data.get("total_amount"),
                "credit": 0,
                "balance": 0,
                "vendor_name": data.get("vendor_name"),
                "transaction_mode": "invoice",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            transactions_to_insert.append(t_data)
    
    if transactions_to_insert:
        response = supabase.table("transactions").insert(transactions_to_insert).execute()
        
        # Trigger analysis for each new transaction
        if response.data:
            for new_txn in response.data:
                # We can't await background tasks here easily without the BackgroundTasks object
                # But since we are already in a background task, we can just await the function directly
                # or fire and forget. Awaiting is safer for now to ensure completion.
                try:
                    await analyze_transaction_task(new_txn["id"], user_id)
                except Exception as e:
                    logger.error(f"Failed to trigger analysis for {new_txn['id']}: {e}")
