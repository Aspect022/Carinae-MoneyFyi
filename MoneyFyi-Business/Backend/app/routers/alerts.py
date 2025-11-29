from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from ..database import get_supabase
from ..dependencies import get_current_user_id
from ..schemas import AlertResponse

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=List[AlertResponse])
async def list_alerts(
    limit: int = 50,
    offset: int = 0,
    is_read: Optional[bool] = None,
    severity: Optional[str] = None,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """List user's alerts."""
    
    query = supabase.table("alerts").select("*").eq("user_id", str(user_id))
    
    if is_read is not None:
        query = query.eq("is_read", is_read)
    if severity:
        query = query.eq("severity", severity)
        
    query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
    
    response = query.execute()
    
    return response.data

@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(
    alert_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Get alert details."""
    
    response = supabase.table("alerts").select("*").eq("id", str(alert_id)).eq("user_id", str(user_id)).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
        
    return response.data[0]

@router.put("/{alert_id}/read", response_model=AlertResponse)
async def mark_alert_read(
    alert_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Mark alert as read."""
    
    response = supabase.table("alerts").update({"is_read": True}).eq("id", str(alert_id)).eq("user_id", str(user_id)).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
        
    return response.data[0]

@router.put("/{alert_id}/resolve", response_model=AlertResponse)
async def mark_alert_resolved(
    alert_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Mark alert as resolved."""
    
    response = supabase.table("alerts").update({"is_resolved": True}).eq("id", str(alert_id)).eq("user_id", str(user_id)).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
        
    return response.data[0]
