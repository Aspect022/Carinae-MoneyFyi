'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, Flag, ChevronDown, ChevronUp, Check, FileText, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransactionFilters } from '@/components/transaction-filters'
import { TransactionDetailSheet } from '@/components/transaction-detail-sheet'
import { Transaction } from '@/lib/transaction-types'

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'UPI',
    vendor: 'Tech Solutions Pvt Ltd',
    description: 'Software License Renewal',
    amount: 45000,
    balanceAfter: 3250000,
    date: new Date('2025-01-15'),
    time: '14:23:15',
    transactionId: 'TXN20250115142315789',
    referenceNumber: 'REF789456123',
    status: 'flagged',
    category: 'vendor_payment',
    flags: ['Unusual amount for this vendor', 'First transaction with new account', 'Weekend transaction'],
    riskScore: 75,
    from: { account: 'XXXX1234', bank: 'HDFC Bank' },
    to: { name: 'Tech Solutions Pvt Ltd', account: 'YYYY5678', bank: 'ICICI Bank' },
    documents: [
      { type: 'invoice', url: '/invoice1.pdf', thumbnail: '/invoice-thumb.jpg' },
    ],
  },
  {
    id: '2',
    type: 'NEFT',
    vendor: 'Office Supplies Co',
    description: 'Monthly Stationery Purchase',
    amount: 8500,
    balanceAfter: 3295000,
    date: new Date('2025-01-14'),
    time: '10:45:32',
    transactionId: 'TXN20250114104532456',
    referenceNumber: 'REF456789012',
    status: 'completed',
    category: 'vendor_payment',
    from: { account: 'XXXX1234', bank: 'HDFC Bank' },
    to: { name: 'Office Supplies Co', account: 'ZZZZ9012', bank: 'State Bank of India' },
  },
  {
    id: '3',
    type: 'CHEQUE',
    vendor: 'Employee Salary - Raj Kumar',
    description: 'January 2025 Salary',
    amount: 75000,
    balanceAfter: 3220000,
    date: new Date('2025-01-10'),
    time: '09:00:00',
    transactionId: 'CHQ20250110090000123',
    referenceNumber: 'CHQ123456',
    status: 'completed',
    category: 'salary',
    from: { account: 'XXXX1234', bank: 'HDFC Bank' },
    to: { name: 'Raj Kumar', account: 'AAAA1111', bank: 'Axis Bank' },
  },
  {
    id: '4',
    type: 'UPI',
    vendor: 'Maharashtra Electricity Board',
    description: 'Electricity Bill Payment',
    amount: 12350,
    balanceAfter: 3303500,
    date: new Date('2025-01-08'),
    time: '16:20:10',
    transactionId: 'TXN20250108162010789',
    referenceNumber: 'REF789012345',
    status: 'completed',
    category: 'utility',
    from: { account: 'XXXX1234', bank: 'HDFC Bank' },
    to: { name: 'Maharashtra Electricity Board', account: 'MSEB2222', bank: 'SBI' },
  },
  {
    id: '5',
    type: 'CARD',
    vendor: 'Amazon Business',
    description: 'Office Equipment Purchase',
    amount: 34500,
    balanceAfter: 3269000,
    date: new Date('2025-01-07'),
    time: '11:15:45',
    transactionId: 'CRD20250107111545987',
    referenceNumber: 'REF987654321',
    status: 'pending',
    category: 'other',
    from: { account: 'XXXX1234', bank: 'HDFC Bank' },
    to: { name: 'Amazon Business', account: 'AMZ3333', bank: 'ICICI Bank' },
  },
]

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortValue, setSortValue] = useState('date-desc')
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const totalAmount = mockTransactions.reduce((sum, t) => sum + t.amount, 0)
  const hasSelectedTransactions = selectedTransactions.length > 0

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'UPI':
        return 'bg-blue-500'
      case 'NEFT':
        return 'bg-green-500'
      case 'CHEQUE':
        return 'bg-purple-500'
      case 'ATM':
        return 'bg-orange-500'
      case 'CARD':
        return 'bg-pink-500'
      default:
        return 'bg-muted'
    }
  }

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setSheetOpen(true)
  }

  const toggleTransactionSelection = (id: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const selectAllTransactions = () => {
    if (selectedTransactions.length === mockTransactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(mockTransactions.map((t) => t.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Card className="flex items-center gap-2 px-4 py-2">
            <span className="text-sm text-muted-foreground">Total (30 days):</span>
            <span className="text-lg font-bold">{formatAmount(totalAmount)}</span>
          </Card>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <TransactionFilters
        onSearchChange={setSearchValue}
        onSortChange={setSortValue}
        searchValue={searchValue}
        sortValue={sortValue}
      />

      {/* Bulk Actions Bar */}
      {hasSelectedTransactions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary bg-primary/5 p-4"
        >
          <span className="text-sm font-medium">
            {selectedTransactions.length} transaction(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <Check className="h-4 w-4" />
              Mark as Reviewed
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Tag className="h-4 w-4" />
              Categorize
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedTransactions([])}
            >
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {/* Select All */}
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            checked={selectedTransactions.length === mockTransactions.length}
            onCheckedChange={selectAllTransactions}
          />
          <span className="text-sm text-muted-foreground">Select all</span>
        </div>

        {mockTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                'group relative cursor-pointer overflow-hidden transition-all hover:shadow-md',
                transaction.status === 'flagged' && 'border-l-4 border-l-yellow-500',
                selectedTransactions.includes(transaction.id) && 'border-primary bg-primary/5'
              )}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Checkbox */}
                <Checkbox
                  checked={selectedTransactions.includes(transaction.id)}
                  onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Icon */}
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white',
                    getTypeColor(transaction.type)
                  )}
                >
                  <span className="text-xs font-bold">{transaction.type}</span>
                </div>

                {/* Content */}
                <div
                  className="flex flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{transaction.vendor}</p>
                      {transaction.status === 'flagged' && (
                        <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-600">
                          <Flag className="h-3 w-3" />
                          Review Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {transaction.date.toLocaleDateString('en-IN')} • {transaction.time}
                      </span>
                      <span className="hidden font-mono md:inline">• {transaction.transactionId}</span>
                      {transaction.category && (
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <div className="space-y-1">
                      <p
                        className={cn(
                          'text-lg font-bold tabular-nums',
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {transaction.amount > 0 ? '+' : '-'} {formatAmount(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground md:text-right">
                        Bal: {formatAmount(transaction.balanceAfter)}
                      </p>
                    </div>
                    {transaction.status === 'flagged' && (
                      <Flag className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing 1-{mockTransactions.length} of 1,247 transactions
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
