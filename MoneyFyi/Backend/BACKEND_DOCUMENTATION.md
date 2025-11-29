# MoneyFyi Backend - Complete Technical Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [AI Pipeline](#ai-pipeline)
6. [Services](#services)
7. [Environment Configuration](#environment-configuration)
8. [Deployment](#deployment)
9. [Testing](#testing)

---

## 1. System Overview

**MoneyFyi Backend** is a FastAPI-based financial intelligence platform that provides:
- OCR-powered document processing using Google Gemini Vision
- AI-driven fraud detection and compliance checking
- Cashflow forecasting
- Executive insights generation
- Real-time alert system with webhook notifications

### Tech Stack
- **Framework**: FastAPI (Python 3.11+)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **AI/ML**: Google Gemini 1.5 Flash (Vision & LLM)
- **Storage**: Supabase Storage
- **Notifications**: n8n webhooks
- **Authentication**: Supabase Auth (JWT) - prototype uses test user ID

---

## 2. Architecture

### Directory Structure
```
Backend/
├── app/
│   ├── config.py                 # Environment configuration
│   ├── database.py               # Supabase client initialization
│   ├── dependencies.py           # FastAPI dependencies (user context)
│   ├── main.py                   # Application entry point
│   ├── models/
│   │   └── __init__.py          # Pydantic data models
│   ├── schemas/
│   │   └── __init__.py          # Request/Response schemas
│   ├── routers/
│   │   ├── user.py              # User profile endpoints
│   │   ├── documents.py         # Document management
│   │   ├── transactions.py      # Transaction queries
│   │   ├── alerts.py            # Alert management
│   │   └── insights.py          # AI insights endpoints
│   ├── services/
│   │   ├── gemini_service.py    # Google Gemini API wrapper
│   │   ├── ai_service.py        # AI engine integration
│   │   └── webhook_service.py   # n8n webhook client
│   ├── tasks/
│   │   ├── document_processing.py  # OCR & extraction
│   │   └── analysis_tasks.py       # AI analysis pipeline
│   └── prompts/
│       ├── bank_statement_prompt.txt
│       └── invoice_prompt.txt
├── ai_engine/                    # Local AI agents (submodule)
├── requirements.txt
└── .env
```

### Request Flow

```
Client Request → Router → Dependencies → Business Logic → Response
                                              ↓
                                    Background Task (async)
```

---

## 3. Database Schema

All tables use Row Level Security (RLS).

**Key Tables**: `profiles`, `transactions`, `documents`, `alerts`, `vendors`, `cashflow_forecasts`

See `database_setup.sql` for complete schema.

---

## 4. API Endpoints

**Base URL**: `/api/v1`

- User: `/user/profile` (GET, POST, PUT)
- Documents: `/documents` (GET, POST, DELETE)
- Transactions: `/transactions` (GET)
- Alerts: `/alerts` (GET, PUT)
- Insights: `/insights/executive-summary`, `/insights/cashflow`, `/insights/compliance`

**API Docs**: `http://localhost:8000/docs`

---

## 5. AI Pipeline

```
Transaction → DataNormalizer → FraudGuard → Cashflow → Compliance → Insights
```

Agents: FraudGuardAgent, CashflowOracle, ComplianceMateAgent, InsightAgent

---

## 6. Services

- **gemini_service**: OCR & LLM via Google Gemini
- **ai_service**: Local AI agent orchestration
- **webhook_service**: n8n alert notifications

---

## 7. Environment Configuration

Required variables in `.env`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `N8N_WEBHOOK_URL`

---

## 8. Deployment

**Local**:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Production**: Use Docker, enable Redis/Celery, implement full JWT auth

---

## 9. Testing

Visit `http://localhost:8000/docs` for interactive API testing.

---

**Quick Start**: Setup DB → Configure`.env` → Install deps → Run server → Test via Swagger UI
