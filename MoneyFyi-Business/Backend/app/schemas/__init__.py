from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserProfileBase(BaseModel):
    """Base fields shared across user profile schemas."""

    business_name: str = Field(..., min_length=1, max_length=255)
    business_type: str = Field(..., min_length=1, max_length=255)
    gstin: Optional[str] = Field(
        default=None,
        description="15 character alphanumeric GSTIN.",
        min_length=15,
        max_length=15,
    )
    pan: Optional[str] = Field(
        default=None,
        description="10 character uppercase PAN.",
        min_length=10,
        max_length=10,
    )
    phone: str = Field(..., description="Indian phone number in format +91XXXXXXXXXX.")
    whatsapp_number: str = Field(..., description="Indian WhatsApp number in format +91XXXXXXXXXX.")
    address: Dict[str, Any] = Field(default_factory=dict)

    @field_validator("gstin")
    @classmethod
    def validate_gstin(cls, value: Optional[str]) -> Optional[str]:
        """Validate GSTIN format if provided."""

        if value is None:
            return value
        if len(value) != 15 or not value.isalnum():
            raise ValueError("GSTIN must be 15 alphanumeric characters.")
        return value.upper()

    @field_validator("pan")
    @classmethod
    def validate_pan(cls, value: Optional[str]) -> Optional[str]:
        """Validate PAN format if provided."""

        if value is None:
            return value
        if len(value) != 10 or not value.isalnum() or not value.isupper():
            raise ValueError("PAN must be 10 uppercase alphanumeric characters.")
        return value

    @field_validator("phone", "whatsapp_number")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        """Validate Indian phone number format."""

        if not value.startswith("+91"):
            raise ValueError("Phone number must start with +91.")
        digits = value[3:]
        if len(digits) != 10 or not digits.isdigit():
            raise ValueError("Phone number must contain 10 digits after +91.")
        return value


class UserProfileCreate(UserProfileBase):
    """Schema for creating a new user profile."""

    email: EmailStr = Field(..., description="User email address.")


class UserProfileUpdate(UserProfileBase):
    """Schema for updating an existing user profile (all fields optional)."""

    business_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    business_type: Optional[str] = Field(default=None, min_length=1, max_length=255)
    phone: Optional[str] = Field(default=None, description="Indian phone number in format +91XXXXXXXXXX.")
    whatsapp_number: Optional[str] = Field(default=None, description="Indian WhatsApp number in format +91XXXXXXXXXX.")
    address: Optional[Dict[str, Any]] = None


class UserProfileResponse(UserProfileBase):
    """Schema returned for user profile responses."""

    id: UUID
    user_id: UUID
    email: EmailStr
    created_at: datetime
    updated_at: datetime


class DocumentCreate(BaseModel):
    """Schema for creating a document record after upload to Supabase Storage."""

    storage_path: str = Field(..., min_length=1)
    file_name: str = Field(..., min_length=1)
    file_type: str = Field(..., description="File type such as pdf, csv, image.")
    file_size: int = Field(..., ge=0)
    document_type: str = Field(..., description="Document type such as bank_statement, invoice, upi_log.")


class DocumentResponse(BaseModel):
    """Schema returned for document records."""

    id: UUID
    user_id: UUID
    file_name: str
    file_type: str
    file_size: int
    file_url: str  # Changed from storage_path
    status: str
    extracted_data: Optional[Dict[str, Any]] = None  # Made optional with default None
    transaction_id: Optional[UUID] = None  # Added from actual schema
    uploaded_at: datetime
    processed_at: Optional[datetime] = None


class TransactionResponse(BaseModel):
    """Schema returned for transaction records."""

    id: UUID
    document_id: UUID
    user_id: UUID
    transaction_date: date
    description: str
    debit: Decimal
    credit: Decimal
    balance: Decimal
    category: Optional[str]
    vendor_name: Optional[str]
    transaction_mode: str
    is_flagged: bool
    risk_score: Optional[int]
    created_at: datetime


class AlertResponse(BaseModel):
    """Schema returned for alert records."""

    id: UUID
    user_id: UUID
    alert_type: str
    severity: str
    title: str
    description: str
    amount: Optional[Decimal]
    related_transaction_id: Optional[UUID]
    related_document_id: Optional[UUID]
    is_read: bool
    is_resolved: bool
    metadata: Optional[Dict[str, Any]]
    created_at: datetime


__all__ = [
    "UserProfileCreate",
    "UserProfileUpdate",
    "UserProfileResponse",
    "DocumentCreate",
    "DocumentResponse",
    "TransactionResponse",
    "AlertResponse",
]


