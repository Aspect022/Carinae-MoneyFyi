export type NotificationSeverity = 'critical' | 'warning' | 'info' | 'success'

export interface Notification {
  id: string
  type: NotificationSeverity
  title: string
  description: string
  time: string
  read: boolean
  actionLabel?: string
  icon: string
  details?: NotificationDetails
}

export interface NotificationDetails {
  amount?: string
  vendor?: string
  date?: string
  transactionId?: string
  riskScore?: number
  detectedPatterns?: string[]
  recommendedActions?: string[]
  transactionHistory?: TransactionHistoryItem[]
  evidenceUrl?: string
}

export interface TransactionHistoryItem {
  date: string
  amount: string
  status: string
  description: string
}
