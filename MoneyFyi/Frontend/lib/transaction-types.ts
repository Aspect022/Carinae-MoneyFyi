export type TransactionType = 'UPI' | 'NEFT' | 'CHEQUE' | 'ATM' | 'CARD'
export type TransactionStatus = 'completed' | 'flagged' | 'pending' | 'failed'
export type TransactionCategory = 'vendor_payment' | 'salary' | 'utility' | 'other'

export interface Transaction {
  id: string
  type: TransactionType
  vendor: string
  description: string
  amount: number
  balanceAfter: number
  date: Date
  time: string
  transactionId: string
  referenceNumber: string
  status: TransactionStatus
  category?: TransactionCategory
  flags?: string[]
  riskScore?: number
  from: {
    account: string
    bank: string
  }
  to: {
    name: string
    account: string
    bank: string
  }
  documents?: {
    type: 'invoice' | 'receipt'
    url: string
    thumbnail: string
  }[]
  notes?: string
}
