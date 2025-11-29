'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Notification } from '@/lib/notification-types'
import { X, AlertCircle, Calendar, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AlertDetailModalProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
}

export function AlertDetailModal({ notification, isOpen, onClose }: AlertDetailModalProps) {
  if (!notification) return null

  const getSeverityBadge = (type: Notification['type']) => {
    switch (type) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Fraud Alert</Badge>
      case 'warning':
        return <Badge className="bg-orange-500 text-white text-xs hover:bg-orange-600">Compliance</Badge>
      case 'success':
        return <Badge className="bg-green-500 text-white text-xs hover:bg-green-600">Success</Badge>
      case 'info':
        return <Badge className="bg-blue-500 text-white text-xs hover:bg-blue-600">Info</Badge>
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500'
    if (score >= 60) return 'bg-orange-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-[700px] overflow-y-auto p-0 sm:rounded-xl">
        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-background p-6 pb-4">
          <div className="flex items-center gap-3">
            {getSeverityBadge(notification.type)}
            <DialogTitle className="text-xl font-bold">{notification.title}</DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 p-6 pt-4">
          {/* Summary Card */}
          {notification.details && (
            <div className="rounded-lg border bg-accent/50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {notification.details.amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold text-foreground">{notification.details.amount}</p>
                  </div>
                )}
                {notification.details.vendor && (
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor</p>
                    <p className="text-lg font-semibold text-foreground">{notification.details.vendor}</p>
                  </div>
                )}
                {notification.details.date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="text-sm font-medium text-foreground">{notification.details.date}</p>
                  </div>
                )}
                {notification.details.transactionId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-xs text-foreground">{notification.details.transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Risk Analysis */}
          {notification.details?.riskScore !== undefined && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Risk Analysis</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Risk Score</span>
                  <span className="text-lg font-bold text-foreground">{notification.details.riskScore}/100</span>
                </div>
                <Progress 
                  value={notification.details.riskScore} 
                  className="h-2"
                  indicatorClassName={getRiskColor(notification.details.riskScore)}
                />
              </div>

              {notification.details.detectedPatterns && notification.details.detectedPatterns.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Detected Patterns:</p>
                  <ul className="space-y-1.5">
                    {notification.details.detectedPatterns.map((pattern, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recommended Actions */}
          {notification.details?.recommendedActions && notification.details.recommendedActions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Recommended Actions</h3>
              <ol className="space-y-2">
                {notification.details.recommendedActions.map((action, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-foreground">{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Transaction History */}
          {notification.details?.transactionHistory && notification.details.transactionHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Amount</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {notification.details.transactionHistory.map((transaction, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="px-4 py-2 text-foreground">{transaction.date}</td>
                          <td className="px-4 py-2 font-medium text-foreground">{transaction.amount}</td>
                          <td className="px-4 py-2">
                            <Badge 
                              variant={transaction.status === 'Completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{transaction.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Evidence */}
          {notification.details?.evidenceUrl && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Evidence</h3>
              <div className="relative h-48 cursor-pointer overflow-hidden rounded-lg border hover:opacity-90">
                <Image
                  src={notification.details.evidenceUrl || "/placeholder.svg"}
                  alt="Evidence document"
                  fill
                  className="object-cover"
                />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Full Document
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col gap-2 border-t bg-background p-6 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Dismiss Alert
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            Mark as Resolved
          </Button>
          <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground">
            Report False Positive
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
