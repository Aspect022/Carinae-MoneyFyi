'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Building, Calendar, Clock, Hash, ArrowRight, AlertTriangle, ShieldCheck, ShieldAlert, FileText, Upload, Download } from 'lucide-react'
import { Transaction } from '@/lib/transaction-types'
import { cn } from '@/lib/utils'

interface TransactionDetailSheetProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailSheet({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailSheetProps) {
  if (!transaction) return null

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

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-green-500'
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', getTypeColor(transaction.type))} />
                <span className="text-sm text-muted-foreground">{transaction.type}</span>
              </div>
              <div className="text-2xl font-bold">
                {formatAmount(transaction.amount)}
              </div>
              <Badge
                variant={
                  transaction.status === 'completed'
                    ? 'default'
                    : transaction.status === 'flagged'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {transaction.status}
              </Badge>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Transaction Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Transaction Information</h3>
            <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
              <div className="flex items-start justify-between">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium text-right">{transaction.description}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Date & Time
                </span>
                <span className="font-mono">
                  {transaction.date.toLocaleDateString('en-IN')} {transaction.time}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Transaction ID
                </span>
                <span className="font-mono text-xs">{transaction.transactionId}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reference Number</span>
                <span className="font-mono text-xs">{transaction.referenceNumber}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Balance After</span>
                <span className="font-semibold">{formatAmount(transaction.balanceAfter)}</span>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="space-y-3">
            <h3 className="font-semibold">Parties Involved</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building className="h-4 w-4" />
                  From
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{transaction.from.bank}</p>
                  <p className="font-mono text-sm text-muted-foreground">
                    Account: {transaction.from.account}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building className="h-4 w-4" />
                  To
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{transaction.to.name}</p>
                  <p className="font-mono text-sm text-muted-foreground">
                    Account: {transaction.to.account}
                  </p>
                  <p className="text-sm text-muted-foreground">{transaction.to.bank}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis (if flagged) */}
          {transaction.status === 'flagged' && transaction.riskScore && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Risk Analysis
              </h3>
              <div className="space-y-4 rounded-lg border border-orange-500/20 bg-orange-50/50 p-4 dark:bg-orange-950/20">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Risk Score</span>
                    <span className={cn('text-lg font-bold', getRiskColor(transaction.riskScore))}>
                      {transaction.riskScore}/100
                    </span>
                  </div>
                  <Progress value={transaction.riskScore} className="h-2" />
                </div>

                {transaction.flags && transaction.flags.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Flags Detected:</p>
                    <ul className="space-y-1">
                      {transaction.flags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-lg bg-background p-3">
                  <p className="mb-1 text-sm font-medium">Recommendation:</p>
                  <p className="text-sm text-muted-foreground">
                    Review this transaction carefully. Consider verifying with the vendor and
                    checking associated documentation before marking as safe.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Related Documents */}
          {transaction.documents && transaction.documents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Related Documents</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {transaction.documents.map((doc, index) => (
                  <button
                    key={index}
                    className="group relative overflow-hidden rounded-lg border border-border p-3 text-left transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <FileText className="h-5 w-5 text-primary" />
                      <Download className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110" />
                    </div>
                    <p className="text-sm font-medium capitalize">{doc.type}</p>
                    <p className="text-xs text-muted-foreground">Click to view</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes">Add Note</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this transaction..."
              defaultValue={transaction.notes}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold">Actions</h3>
            <div className="flex flex-col gap-2">
              {transaction.status === 'flagged' && (
                <>
                  <Button className="w-full gap-2" variant="default">
                    <ShieldCheck className="h-4 w-4" />
                    Mark as Safe
                  </Button>
                  <Button className="w-full gap-2" variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    Report Fraud
                  </Button>
                </>
              )}
              <Button className="w-full gap-2" variant="outline">
                <Upload className="h-4 w-4" />
                Link Invoice
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Download className="h-4 w-4" />
                Export Details
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
