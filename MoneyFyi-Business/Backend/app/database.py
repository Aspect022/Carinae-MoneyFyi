from __future__ import annotations

import logging
from typing import AsyncIterator, Optional

from supabase import Client, create_client

from .config import settings

logger = logging.getLogger("moneyfyi.backend.database")

_supabase_client: Optional[Client] = None


def init_supabase_client() -> Client:
    """Initialise and cache the Supabase client.

    Returns:
        Client: The Supabase Python client instance.

    Raises:
        RuntimeError: If the Supabase client cannot be created.
    """

    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    try:
        client: Client = create_client(str(settings.supabase_url), settings.supabase_service_key)
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("Failed to initialise Supabase client")
        raise RuntimeError("Could not initialise Supabase client") from exc

    _supabase_client = client
    return client


def get_supabase() -> Client:
    """Get a Supabase client instance for use in request handlers.

    This uses a simple module-level cache which is safe for typical FastAPI usage.
    """

    return init_supabase_client()


async def check_database_health() -> bool:
    """Perform a lightweight health check against Supabase/PostgreSQL.

    Returns:
        bool: True if the connection appears healthy, False otherwise.
    """

    try:
        client: Client = get_supabase()
        # Simple query against a lightweight table; auth.users always exists.
        response = client.table("profiles").select("id").limit(1).execute()
        if getattr(response, "data", None) is not None:
            return True
        return False
    except Exception as exc:  # pragma: no cover - defensive
        logger.error("Supabase health check failed: %s", exc)
        return False


__all__ = ["get_supabase", "check_database_health"]


