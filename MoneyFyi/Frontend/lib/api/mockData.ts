import { Transaction, Anomaly, ComplianceCheck, CashflowForecast } from './types'

const vendors = [
  'ABC Suppliers', 'XYZ Distributors', 'Sharma Traders',
  'Mumbai Wholesalers', 'Delhi Enterprises', 'Raj Electronics',
  'Gupta & Sons', 'National Trading Co', 'NEW_VENDOR_123',
  'Patel Industries', 'Singh Enterprises', 'Kumar Traders'
]

const categories = ['Raw Materials', 'Office Supplies', 'Services', 'Utilities', 'Equipment', 'Consulting', 'Marketing']

export function generateMockTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = []
  const today = new Date()
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)
    
    const isDebit = Math.random() > 0.3
    const vendor = vendors[Math.floor(Math.random() * vendors.length)]
    const mode = ['UPI', 'NEFT', 'RTGS', 'Cheque', 'Card'][Math.floor(Math.random() * 5)] as any
    
    // Generate realistic Indian amounts
    let amount: number
    if (Math.random() > 0.8) {
      // Round numbers (more suspicious)
      amount = [10000, 25000, 50000, 100000, 200000][Math.floor(Math.random() * 5)]
    } else {
      amount = Math.floor(Math.random() * 150000) + 500
    }
    
    // 5% chance of being flagged
    const flagged = Math.random() < 0.05 || vendor === 'NEW_VENDOR_123'
    
    transactions.push({
      id: `TXN${Date.now()}-${i}`,
      date: date.toISOString().split('T')[0],
      vendor_name: vendor,
      amount,
      type: isDebit ? 'debit' : 'credit',
      mode,
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `${isDebit ? 'Payment to' : 'Receipt from'} ${vendor}`,
      flagged,
      risk_score: flagged ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40)
    })
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function generateAnomalies(): Anomaly[] {
  return [
    {
      transaction_id: 'TXN001',
      risk_score: 87,
      risk_level: 'critical',
      flags: ['new_vendor', 'large_amount', 'weekend_transaction'],
      explanation: 'First-time transaction with NEW_VENDOR_123 for ₹1,50,000 during weekend hours.',
      recommended_action: 'Verify vendor credentials and obtain approval from authorized personnel before processing.'
    },
    {
      transaction_id: 'TXN045',
      risk_score: 72,
      risk_level: 'high',
      flags: ['duplicate_transaction', 'same_day'],
      explanation: 'Duplicate payment of ₹50,000 to ABC Suppliers within 2 hours.',
      recommended_action: 'Check with accounts team to confirm if this is a legitimate double payment.'
    },
    {
      transaction_id: 'TXN123',
      risk_score: 65,
      risk_level: 'high',
      flags: ['round_number', 'unusual_amount'],
      explanation: 'Round number transaction of exactly ₹1,00,000 which deviates from typical payment patterns.',
      recommended_action: 'Verify invoice details and confirm payment amount with vendor.'
    }
  ]
}

export function generateComplianceIssues(): ComplianceCheck {
  return {
    gst_status: 'issues',
    tds_status: 'pending',
    issues: [
      {
        type: 'filing_deadline',
        severity: 'critical',
        description: 'GSTR-1 filing due in 3 days',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount_affected: 450000
      },
      {
        type: 'missing_tds',
        severity: 'high',
        description: 'TDS not deducted on 5 transactions totaling ₹2,50,000',
        amount_affected: 250000
      },
      {
        type: 'gst_mismatch',
        severity: 'medium',
        description: 'GST invoice mismatch detected for 3 vendors',
        amount_affected: 75000
      }
    ],
    next_filing_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    compliance_score: 72
  }
}

export function generateCashflowForecast(days: number = 90): CashflowForecast {
  const predictions = []
  let currentBalance = 5000000 // Starting balance ₹50 lakhs
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    // Simulate realistic cashflow patterns
    const dailyChange = (Math.random() - 0.45) * 100000 // Slight negative bias
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.3 : 1
    const monthEndFactor = date.getDate() > 25 ? 1.5 : 1 // More activity at month end
    
    currentBalance += dailyChange * weekendFactor * monthEndFactor
    
    // Add some volatility
    currentBalance += (Math.random() - 0.5) * 50000
    
    const confidence = 0.95 - (i / days) * 0.25 // Decreasing confidence over time
    
    let alert = undefined
    if (currentBalance < 1000000) {
      alert = {
        type: 'shortage' as const,
        severity: 'critical' as const,
        message: 'Cash balance predicted to fall below ₹10 lakhs'
      }
    } else if (currentBalance < 2000000) {
      alert = {
        type: 'shortage' as const,
        severity: 'warning' as const,
        message: 'Cash balance approaching minimum threshold'
      }
    }
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predicted_balance: Math.round(currentBalance),
      confidence,
      trend: dailyChange > 0 ? 'increasing' as const : dailyChange < 0 ? 'decreasing' as const : 'stable' as const,
      alert
    })
  }
  
  const balances = predictions.map(p => p.predicted_balance)
  const maxBalance = Math.max(...balances)
  const minBalance = Math.min(...balances)
  const maxIndex = balances.indexOf(maxBalance)
  const minIndex = balances.indexOf(minBalance)
  
  return {
    forecast_period: days,
    predictions,
    insights: {
      peak_balance: {
        date: predictions[maxIndex].date,
        amount: maxBalance
      },
      lowest_balance: {
        date: predictions[minIndex].date,
        amount: minBalance
      },
      net_change: predictions[predictions.length - 1].predicted_balance - predictions[0].predicted_balance,
      high_risk_dates: predictions
        .filter(p => p.alert?.severity === 'critical')
        .map(p => p.date)
    }
  }
}
