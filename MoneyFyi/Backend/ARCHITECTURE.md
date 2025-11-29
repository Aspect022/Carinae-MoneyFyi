# MoneyFyi Backend Architecture

## Tech Stack
- FastAPI (Python 3.11)
- Supabase (PostgreSQL + Auth + Storage)
- Redis (task queue)
- Celery (background jobs)

## Database
- Primary: Supabase PostgreSQL
- All tables have RLS enabled
- Use Supabase client for all DB operations

## Authentication
- Supabase Auth (JWT tokens)
- All routes require auth except /health
- Extract user_id from JWT in middleware

## API Design Principles
- RESTful endpoints
- Pydantic models for validation
- Proper error handling (try/except)
- Return consistent JSON responses
- Use HTTP status codes correctly

## File Upload Flow
1. Frontend uploads to Supabase Storage directly
2. Frontend calls backend with storage_path
3. Backend creates document record
4. Background job processes document

## Naming Conventions
- snake_case for Python
- Descriptive variable names
- Type hints everywhere
- Docstrings for functions