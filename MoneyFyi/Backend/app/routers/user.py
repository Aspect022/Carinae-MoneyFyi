from typing import Any, Dict
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from ..database import get_supabase
from ..dependencies import get_current_user_id
from ..models import UserProfile
from ..schemas import UserProfileResponse, UserProfileUpdate, UserProfileCreate

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Get the current user's profile."""
    
    response = supabase.table("profiles").select("*").eq("id", str(user_id)).execute()
    
    if not response.data:
        # For prototype: if profile doesn't exist, return a mock one or 404
        # Let's return 404 so the frontend knows to create one
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
        
    return response.data[0]

@router.post("/profile", response_model=UserProfileResponse)
async def create_user_profile(
    profile: UserProfileCreate,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Create a new user profile."""
    
    # Check if exists
    existing = supabase.table("profiles").select("id").eq("id", str(user_id)).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )
    
    data = profile.model_dump()
    data["id"] = str(user_id)
    
    response = supabase.table("profiles").insert(data).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create profile"
        )
        
    return response.data[0]

@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile: UserProfileUpdate,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Any:
    """Update the current user's profile."""
    
    data = profile.model_dump(exclude_unset=True)
    
    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
        
    data["updated_at"] = "now()"
    
    response = supabase.table("profiles").update(data).eq("id", str(user_id)).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
        
    return response.data[0]
