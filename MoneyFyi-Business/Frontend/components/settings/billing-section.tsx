'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Check, Download, CreditCardIcon } from 'lucide-react'
import type { Invoice } from '@/lib/settings-types'

const invoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2025-001', date: 'Jan 1, 2025', amount: 499, status: 'paid' },
  { id: '2', invoiceNumber: 'INV-2024-012', date: 'Dec 1, 2024', amount: 499, status: 'paid' },
  { id: '3', invoiceNumber: 'INV-2024-011', date: 'Nov 1, 2024', amount: 499, status: 'paid' },
]

const plans = [
  {
    name: 'Free',
    price: '0',
    features: ['10 documents/month', 'Basic analytics', 'Email support'],
    isCurrent: false,
  },
  {
    name: 'Starter',
    price: '499',
    features: [
      '100 documents/month',
      'Advanced analytics',
      'WhatsApp alerts',
      'Priority support',
      '5 GB storage',
    ],
    isCurrent: true,
  },
  {
    name: 'Pro',
    price: '999',
    features: [
      'Unlimited documents',
      'AI-powered insights',
      'Custom integrations',
      '24/7 support',
      '50 GB storage',
      'API access',
    ],
    isCurrent: false,
  },
]

export function BillingSection() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Starter Plan</h3>
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>
              <p className="text-3xl font-bold">₹499/month</p>
              <p className="text-sm text-muted-foreground">Next billing on Dec 15, 2025</p>
            </div>
            <Button>Upgrade Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>Choose the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-lg border p-6',
                  plan.isCurrent && 'border-primary bg-primary/5'
                )}
              >
                {plan.isCurrent && (
                  <Badge className="absolute right-4 top-4" variant="default">
                    Current
                  </Badge>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.isCurrent ? 'outline' : 'default'}
                    disabled={plan.isCurrent}
                  >
                    {plan.isCurrent
                      ? 'Current Plan'
                      : plan.price === '0'
                      ? 'Downgrade'
                      : 'Upgrade'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage This Month */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Track your current usage against plan limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Documents processed</span>
              <span className="font-medium">45 / 100</span>
            </div>
            <Progress value={45} className="h-2" />
            <p className="text-xs text-muted-foreground">45% used</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>WhatsApp alerts sent</span>
              <span className="font-medium">12 / 500</span>
            </div>
            <Progress value={2.4} className="h-2" />
            <p className="text-xs text-muted-foreground">2.4% used</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Storage used</span>
              <span className="font-medium">1.2 GB / 5 GB</span>
            </div>
            <Progress value={24} className="h-2" />
            <p className="text-xs text-muted-foreground">24% used</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCardIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/26</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Update
              </Button>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>

          <Button variant="outline">Add Payment Method</Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    {invoice.status === 'paid' ? (
                      <Badge variant="default" className="bg-green-500">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
