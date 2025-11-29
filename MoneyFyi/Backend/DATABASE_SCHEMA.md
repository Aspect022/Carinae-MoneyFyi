# Database Schema

## Tables

### users (managed by Supabase Auth)
- id: uuid (primary key)
- email: text
- created_at: timestamp

### user_profiles
- id: uuid (primary key)
- user_id: uuid (references auth.users)
- business_name: text
- business_type: text
- gstin: text (nullable)
- pan: text (nullable)
- phone: text
- whatsapp_number: text
- address: jsonb
- created_at: timestamp
- updated_at: timestamp

### documents
- id: uuid (primary key)
- user_id: uuid (references auth.users)
- file_name: text
- file_type: text (pdf, csv, image)
- file_size: bigint
- storage_path: text
- document_type: text (bank_statement, invoice, upi_log)
- status: text (uploaded, processing, completed, failed)
- extracted_data: jsonb
- error_message: text (nullable)
- uploaded_at: timestamp
- processed_at: timestamp (nullable)

### transactions
- id: uuid (primary key)
- document_id: uuid (references documents)
- user_id: uuid (references auth.users)
- transaction_date: date
- description: text
- debit: decimal(15,2)
- credit: decimal(15,2)
- balance: decimal(15,2)
- category: text (nullable)
- vendor_name: text (nullable)
- transaction_mode: text (upi, neft, rtgs, cheque, card, atm)
- is_flagged: boolean (default false)
- risk_score: integer (0-100, nullable)
- created_at: timestamp

### alerts
- id: uuid (primary key)
- user_id: uuid (references auth.users)
- alert_type: text (fraud, compliance, cashflow)
- severity: text (critical, high, medium, low)
- title: text
- description: text
- amount: decimal(15,2) (nullable)
- related_transaction_id: uuid (nullable)
- related_document_id: uuid (nullable)
- is_read: boolean (default false)
- is_resolved: boolean (default false)
- metadata: jsonb (nullable)
- created_at: timestamp

### vendors
- id: uuid (primary key)
- user_id: uuid (references auth.users)
- name: text
- gstin: text (nullable)
- total_transactions: integer (default 0)
- total_amount: decimal(15,2) (default 0)
- risk_level: text (low, medium, high)
- risk_score: integer (0-100)
- first_transaction_date: date (nullable)
- last_transaction_date: date (nullable)
- average_payment_delay: integer (nullable)
- metadata: jsonb (nullable)
- created_at: timestamp
- updated_at: timestamp

## Indexes
- documents: (user_id, status), (user_id, uploaded_at)
- transactions: (user_id, transaction_date), (document_id)
- alerts: (user_id, is_read, created_at)
- vendors: (user_id, risk_level)

## RLS Policies
All tables: Users can only access their own data