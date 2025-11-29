from typing import Generator, Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status

from .config import settings

def get_current_user_id() -> UUID:
    """
    Prototype dependency: Returns a hardcoded test user ID.
    In production, this would verify the JWT token.
    """
    try:
        return UUID(settings.test_user_id)
    except ValueError:
        # Fallback if config is invalid, though it should be a valid UUID string
        return UUID("00000000-0000-0000-0000-000000000000")
