from typing import Any, List, Optional
from uuid import UUID
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client

from ..database import get_supabase
from ..dependencies import get_current_user_id
from ..schemas import TransactionResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("", response_model=List[TransactionResponse])
async def list_transactions(
    limit: int = 50,
    offset: int = 0,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    flagged: Optional[bool] = None,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """List user's transactions with filtering."""
    
    query = supabase.table("transactions").select("*").eq("user_id", str(user_id))
    
    if start_date:
        query = query.gte("date", start_date.isoformat())
    if end_date:
        query = query.lte("date", end_date.isoformat())
    if flagged is not None:
        query = query.eq("is_flagged", flagged)
        
    query = query.order("date", desc=True).range(offset, offset + limit - 1)
    
    response = query.execute()
    
    return response.data

@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Get transaction details."""
    
    response = supabase.table("transactions").select("*").eq("id", str(transaction_id)).eq("user_id", str(user_id)).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
        
    return response.data[0]

@router.post("/analyze", status_code=status.HTTP_202_ACCEPTED)
async def analyze_transactions(
    transaction_ids: List[UUID],
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """
    Trigger fraud analysis on specific transactions.
    """
    # Placeholder for AI integration
    return {"status": "analysis_queued", "count": len(transaction_ids)}
