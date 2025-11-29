# API Endpoints Specification

Base URL: /api/v1

## Authentication
All endpoints require JWT token in header:
Authorization: Bearer <supabase_jwt_token>

## Endpoints

### Health Check
GET /health
- No auth required
- Returns: {"status": "healthy", "timestamp": "..."}

### User Profile
GET /user/profile
- Returns user profile data

PUT /user/profile
- Body: UserProfileUpdate schema
- Returns updated profile

### Documents
POST /documents
- Body: {storage_path, file_name, file_type, file_size, document_type}
- Creates document record
- Triggers background processing
- Returns: {id, status}

GET /documents
- Query params: ?status=completed&limit=50&offset=0
- Returns: {documents: [...], total: 123}

GET /documents/{document_id}
- Returns full document with extracted_data

DELETE /documents/{document_id}
- Soft delete document

### Transactions
GET /transactions
- Query params: ?start_date=2024-01-01&end_date=2024-12-31&limit=100&offset=0
- Returns: {transactions: [...], total: 456}

GET /transactions/{transaction_id}
- Returns single transaction details

### Alerts
GET /alerts
- Query params: ?is_read=false&severity=critical
- Returns: {alerts: [...], total: 10}

PUT /alerts/{alert_id}/read
- Marks alert as read

PUT /alerts/{alert_id}/resolve
- Marks alert as resolved

### Vendors
GET /vendors
- Query params: ?risk_level=high
- Returns: {vendors: [...], total: 25}

### Processing (Internal)
POST /internal/process-document
- Background job endpoint
- Body: {document_id}
- Not exposed publicly
