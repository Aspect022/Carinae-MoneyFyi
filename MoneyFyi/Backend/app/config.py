from __future__ import annotations

from typing import Literal

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or a .env file."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore")

    # Supabase configuration
    supabase_url: AnyHttpUrl = Field("https://example.supabase.co", alias="SUPABASE_URL")
    supabase_service_key: str = Field("dummy_service_key", alias="SUPABASE_SERVICE_ROLE_KEY")
    supabase_anon_key: str = Field("dummy_anon_key", alias="SUPABASE_ANON_KEY")

    # Redis / Celery
    redis_url: str = Field("redis://localhost:6379/0", alias="REDIS_URL")

    # App settings
    environment: Literal["development", "production"] = Field("development", alias="ENVIRONMENT")
    log_level: Literal["debug", "info", "warning", "error", "critical"] = Field("info", alias="LOG_LEVEL")
    
    # Prototype Settings
    test_user_id: str = Field("00000000-0000-0000-0000-000000000000", description="Test User ID for prototype")
    
    # AI Configuration
    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    
    # Notifications
    n8n_webhook_url: str = Field("https://n8n.example.com/webhook/alert", alias="N8N_WEBHOOK_URL")
    
    # Encryption
    encryption_key: str = Field(..., description="Base64-encoded AES-256 key", alias="ENCRYPTION_KEY")
    key_version: str = Field("v1", description="Encryption key version", alias="KEY_VERSION")
    encrypted_bucket_name: str = Field("encrypted-files", description="Supabase bucket for encrypted files", alias="ENCRYPTED_BUCKET_NAME")


def get_settings() -> Settings:
    """Return application settings singleton."""
    return Settings()


settings = get_settings()


