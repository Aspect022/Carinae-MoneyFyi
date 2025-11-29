export interface Transaction {
  id: string
  date: string
  vendor_name: string
  amount: number
  transaction_type: 'UPI' | 'NEFT' | 'RTGS' | 'IMPS' | 'CHEQUE' | 'CASH'
  category?: string
  description?: string
  status?: 'completed' | 'pending' | 'failed'
  is_flagged: boolean
  flag_reason?: string
  risk_level?: 'low' | 'medium' | 'high' | 'critical'
  reference_number?: string
  user_id: string
  created_at: string
  updated_at?: string
}

export interface Anomaly {
  transaction_id: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  flags: string[]
  explanation: string
  recommended_action: string
}

export interface ComplianceCheck {
  gst_status: 'compliant' | 'pending' | 'issues'
  tds_status: 'compliant' | 'pending' | 'issues'
  issues: Array<{
    type: 'gst_mismatch' | 'missing_tds' | 'filing_deadline'
    severity: 'critical' | 'high' | 'medium'
    description: string
    deadline?: string
    amount_affected?: number
  }>
  next_filing_date: string
  compliance_score: number
}

export interface CashflowForecast {
  forecast_period: number
  predictions: Array<{
    date: string
    predicted_balance: number
    confidence: number
    trend: 'increasing' | 'decreasing' | 'stable'
    alert?: {
      type: 'shortage' | 'surplus'
      severity: 'critical' | 'warning' | 'info'
      message: string
    }
  }>
  insights: {
    peak_balance: { date: string; amount: number }
    lowest_balance: { date: string; amount: number }
    net_change: number
    high_risk_dates: string[]
  }
}

export interface DocumentAnalysisResponse {
  id: string
  status: 'processing' | 'completed' | 'failed'
  document_type: 'bank_statement' | 'invoice' | 'upi_log'
  extracted_data: {
    transactions: Transaction[]
    metadata: {
      account_number?: string
      statement_period?: string
      vendor_name?: string
      invoice_number?: string
    }
  }
  processing_time: number
  confidence_score: number
}

export interface InsightResponse {
  executive_summary: string
  top_risks: Array<{
    type: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    description: string
    impact: string
    recommendation: string
  }>
  vendor_insights: Array<{
    vendor_name: string
    risk_level: 'low' | 'medium' | 'high'
    total_spend: number
    transaction_count: number
    notes: string
  }>
  overall_health_score: number
}
