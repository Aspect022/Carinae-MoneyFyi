from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator, Dict

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings

logger = logging.getLogger("moneyfyi.backend")
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan hook for startup and shutdown events."""

    from .database import check_database_health  # Local import to avoid circular dependencies

    logger.info("Starting MoneyFyi backend in %s mode", settings.environment)

    db_healthy: bool = await check_database_health()
    if db_healthy:
        logger.info("Supabase database connection healthy")
    else:
        logger.error("Supabase database connection failed")

    yield

    logger.info("Shutting down MoneyFyi backend")


app = FastAPI(
    title="MoneyFyi Backend",
    version="1.0.0",
    lifespan=lifespan,
)

from .routers import user, documents, transactions, alerts, insights, encrypted_transactions
app.include_router(user.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")
app.include_router(transactions.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(insights.router, prefix="/api/v1")
app.include_router(encrypted_transactions.router, prefix="/api/v1")






app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://money-fyi.vercel.app",
        "http://localhost:3000",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle uncaught exceptions and return a safe JSON response."""

    logger.exception("Unhandled exception for path %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle validation errors with a consistent JSON structure."""

    logger.warning("Validation error for path %s: %s", request.url.path, exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


@app.get("/health", tags=["health"])
async def health_check() -> Dict[str, Any]:
    """Health check endpoint (no authentication required)."""

    from datetime import datetime, timezone

    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


__all__ = ["app"]


