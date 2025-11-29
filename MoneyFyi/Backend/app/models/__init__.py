from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import UUID


@dataclass
class UserProfile:
    """Dataclass representing the user_profiles table."""

    id: UUID
    user_id: UUID
    business_name: str
    business_type: str
    gstin: Optional[str]
    pan: Optional[str]
    phone: str
    whatsapp_number: str
    address: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "UserProfile":
        """Create a UserProfile instance from a dictionary."""

        return cls(**data)

    def to_dict(self) -> Dict[str, Any]:
        """Serialise the dataclass to a plain dictionary."""

        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "business_name": self.business_name,
            "business_type": self.business_type,
            "gstin": self.gstin,
            "pan": self.pan,
            "phone": self.phone,
            "whatsapp_number": self.whatsapp_number,
            "address": self.address,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


@dataclass
class Document:
    """Dataclass representing the documents table."""

    id: UUID
    user_id: UUID
    file_name: str
    file_type: str
    file_size: int
    storage_path: str
    document_type: str
    status: str
    extracted_data: Dict[str, Any]
    error_message: Optional[str]
    uploaded_at: datetime
    processed_at: Optional[datetime]

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Document":
        """Create a Document instance from a dictionary."""

        return cls(**data)

    def to_dict(self) -> Dict[str, Any]:
        """Serialise the dataclass to a plain dictionary."""

        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "file_name": self.file_name,
            "file_type": self.file_type,
            "file_size": self.file_size,
            "storage_path": self.storage_path,
            "document_type": self.document_type,
            "status": self.status,
            "extracted_data": self.extracted_data,
            "error_message": self.error_message,
            "uploaded_at": self.uploaded_at.isoformat(),
            "processed_at": self.processed_at.isoformat() if self.processed_at else None,
        }


@dataclass
class Transaction:
    """Dataclass representing the transactions table."""

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

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Transaction":
        """Create a Transaction instance from a dictionary."""

        return cls(**data)

    def to_dict(self) -> Dict[str, Any]:
        """Serialise the dataclass to a plain dictionary."""

        return {
            "id": str(self.id),
            "document_id": str(self.document_id),
            "user_id": str(self.user_id),
            "transaction_date": self.transaction_date.isoformat(),
            "description": self.description,
            "debit": str(self.debit),
            "credit": str(self.credit),
            "balance": str(self.balance),
            "category": self.category,
            "vendor_name": self.vendor_name,
            "transaction_mode": self.transaction_mode,
            "is_flagged": self.is_flagged,
            "risk_score": self.risk_score,
            "created_at": self.created_at.isoformat(),
        }


@dataclass
class Alert:
    """Dataclass representing the alerts table."""

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

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Alert":
        """Create an Alert instance from a dictionary."""

        return cls(**data)

    def to_dict(self) -> Dict[str, Any]:
        """Serialise the dataclass to a plain dictionary."""

        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "alert_type": self.alert_type,
            "severity": self.severity,
            "title": self.title,
            "description": self.description,
            "amount": str(self.amount) if self.amount is not None else None,
            "related_transaction_id": str(self.related_transaction_id)
            if self.related_transaction_id is not None
            else None,
            "related_document_id": str(self.related_document_id) if self.related_document_id is not None else None,
            "is_read": self.is_read,
            "is_resolved": self.is_resolved,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
        }


@dataclass
class Vendor:
    """Dataclass representing the vendors table."""

    id: UUID
    user_id: UUID
    name: str
    gstin: Optional[str]
    total_transactions: int
    total_amount: Decimal
    risk_level: str
    risk_score: int
    first_transaction_date: Optional[date]
    last_transaction_date: Optional[date]
    average_payment_delay: Optional[int]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Vendor":
        """Create a Vendor instance from a dictionary."""

        return cls(**data)

    def to_dict(self) -> Dict[str, Any]:
        """Serialise the dataclass to a plain dictionary."""

        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "name": self.name,
            "gstin": self.gstin,
            "total_transactions": self.total_transactions,
            "total_amount": str(self.total_amount),
            "risk_level": self.risk_level,
            "risk_score": self.risk_score,
            "first_transaction_date": self.first_transaction_date.isoformat()
            if self.first_transaction_date
            else None,
            "last_transaction_date": self.last_transaction_date.isoformat() if self.last_transaction_date else None,
            "average_payment_delay": self.average_payment_delay,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


__all__ = ["UserProfile", "Document", "Transaction", "Alert", "Vendor"]


