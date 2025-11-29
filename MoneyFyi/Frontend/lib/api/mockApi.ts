import { DocumentAnalysisResponse, InsightResponse, Transaction, Anomaly, ComplianceCheck, CashflowForecast } from './types'
import { generateMockTransactions, generateAnomalies, generateComplianceIssues, generateCashflowForecast } from './mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class MockAPI {
  async analyzeDocument(file: File): Promise<DocumentAnalysisResponse> {
    // Simulate processing delay
    await delay(5000)
    
    // Determine document type from filename
    const fileName = file.name.toLowerCase()
    let docType: 'bank_statement' | 'invoice' | 'upi_log' = 'bank_statement'
    if (fileName.includes('invoice')) docType = 'invoice'
    if (fileName.includes('upi')) docType = 'upi_log'
    
    // Generate mock transactions
    const transactionCount = Math.floor(Math.random() * 50) + 20
    const transactions = generateMockTransactions(transactionCount)
    
    return {
      id: `DOC${Date.now()}`,
      status: 'completed',
      document_type: docType,
      extracted_data: {
        transactions,
        metadata: {
          account_number: '1234567890',
          statement_period: 'Jan 2024 - Mar 2024',
          vendor_name: docType === 'invoice' ? 'ABC Suppliers' : undefined,
          invoice_number: docType === 'invoice' ? `INV${Date.now()}` : undefined
        }
      },
      processing_time: 5000,
      confidence_score: Math.random() * 0.15 + 0.85 // 85-100%
    }
  }
  
  async getAnomalies(): Promise<Anomaly[]> {
    await delay(1000)
    return generateAnomalies()
  }
  
  async getComplianceCheck(): Promise<ComplianceCheck> {
    await delay(1500)
    return generateComplianceIssues()
  }
  
  async getCashflowForecast(days: number = 90): Promise<CashflowForecast> {
    await delay(2000)
    return generateCashflowForecast(days)
  }
  
  async generateInsights(): Promise<InsightResponse> {
    await delay(3000)
    
    return {
      executive_summary: 'Your business shows healthy cashflow with moderate risk exposure. Key concerns include GST filing deadline approaching and 3 high-risk transactions requiring review.',
      top_risks: [
        {
          type: 'Compliance Risk',
          severity: 'critical',
          description: 'GSTR-1 filing due in 3 days',
          impact: '₹4,50,000 in pending GST filings',
          recommendation: 'Complete GST filing immediately to avoid penalties'
        },
        {
          type: 'Fraud Risk',
          severity: 'high',
          description: 'New vendor transaction flagged',
          impact: '₹1,50,000 payment to unverified vendor',
          recommendation: 'Verify vendor credentials before processing payment'
        },
        {
          type: 'Cashflow Risk',
          severity: 'medium',
          description: 'Predicted shortage in 15 days',
          impact: 'Balance may fall below ₹10 lakhs',
          recommendation: 'Arrange credit facility or delay large payments'
        }
      ],
      vendor_insights: [
        {
          vendor_name: 'ABC Suppliers',
          risk_level: 'low',
          total_spend: 2500000,
          transaction_count: 45,
          notes: 'Reliable vendor with consistent payment history'
        },
        {
          vendor_name: 'NEW_VENDOR_123',
          risk_level: 'high',
          total_spend: 150000,
          transaction_count: 1,
          notes: 'New vendor - requires verification'
        },
        {
          vendor_name: 'XYZ Distributors',
          risk_level: 'medium',
          total_spend: 1800000,
          transaction_count: 32,
          notes: 'Payment delays noted in 3 recent transactions'
        }
      ],
      overall_health_score: 76
    }
  }
  
  async getTransactions(limit: number = 50): Promise<Transaction[]> {
    await delay(800)
    return generateMockTransactions(limit)
  }
}

export const mockApi = new MockAPI()
