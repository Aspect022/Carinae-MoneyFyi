export interface ProfileFormData {
  businessName: string
  businessType: string
  gstin: string
  pan: string
  industry: string
  employeeCount: string
  email: string
  phone: string
  alternativeEmail?: string
  whatsappNumber: string
  sameAsPhone: boolean
  streetAddress: string
  city: string
  state: string
  pinCode: string
}

export interface NotificationSettings {
  emailEnabled: boolean
  whatsappEnabled: boolean
  pushEnabled: boolean
  weeklySummary: boolean
  fraudAlerts: 'immediate' | 'off'
  complianceDeadlines: '7days' | '3days' | 'off'
  cashflowWarnings: 'immediate' | 'daily' | 'off'
  transactionSummary: 'daily' | 'weekly' | 'monthly' | 'off'
  quietHoursEnabled: boolean
  quietHoursFrom: string
  quietHoursTo: string
  suspiciousTransactionAmount: number
  minimumCashflowWarning: number
  largeDebitThreshold: number
}

export interface SecurityFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface Session {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
}

export interface LoginHistory {
  id: string
  date: string
  device: string
  location: string
  ip: string
  status: 'success' | 'failed'
}

export interface PaymentMethod {
  id: string
  type: 'visa' | 'mastercard'
  last4: string
  expiry: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  status: 'paid' | 'pending'
}

export interface Integration {
  id: string
  name: string
  logo: string
  description: string
  status: 'connected' | 'available' | 'coming-soon'
}

export interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  active: boolean
}
