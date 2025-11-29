'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mail, MessageSquare, Bell, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const notificationSchema = z.object({
  emailEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  weeklySummary: z.boolean(),
  fraudAlerts: z.enum(['immediate', 'off']),
  complianceDeadlines: z.enum(['7days', '3days', 'off']),
  cashflowWarnings: z.enum(['immediate', 'daily', 'off']),
  transactionSummary: z.enum(['daily', 'weekly', 'monthly', 'off']),
  quietHoursEnabled: z.boolean(),
  quietHoursFrom: z.string(),
  quietHoursTo: z.string(),
  suspiciousTransactionAmount: z.number().min(0),
  minimumCashflowWarning: z.number().min(0),
  largeDebitThreshold: z.number().min(0),
})

type NotificationFormValues = z.infer<typeof notificationSchema>

export function NotificationsSection() {
  const { toast } = useToast()

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailEnabled: true,
      whatsappEnabled: true,
      pushEnabled: false,
      weeklySummary: true,
      fraudAlerts: 'immediate',
      complianceDeadlines: '7days',
      cashflowWarnings: 'immediate',
      transactionSummary: 'weekly',
      quietHoursEnabled: true,
      quietHoursFrom: '22:00',
      quietHoursTo: '08:00',
      suspiciousTransactionAmount: 40000,
      minimumCashflowWarning: 20000,
      largeDebitThreshold: 50000,
    },
  })

  const values = watch()

  const onSubmit = (data: NotificationFormValues) => {
    console.log('[v0] Notification settings submitted:', data)
    toast({
      title: 'Settings updated',
      description: 'Your notification preferences have been saved.',
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="emailEnabled" className="text-base">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
            </div>
            <Switch
              id="emailEnabled"
              checked={values.emailEnabled}
              onCheckedChange={(checked) => setValue('emailEnabled', checked, { shouldDirty: true })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="whatsappEnabled" className="text-base">
                  WhatsApp Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Requires phone verification</p>
              </div>
            </div>
            <Switch
              id="whatsappEnabled"
              checked={values.whatsappEnabled}
              onCheckedChange={(checked) =>
                setValue('whatsappEnabled', checked, { shouldDirty: true })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="pushEnabled" className="text-base">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Browser notifications</p>
              </div>
            </div>
            <Switch
              id="pushEnabled"
              checked={values.pushEnabled}
              onCheckedChange={(checked) => setValue('pushEnabled', checked, { shouldDirty: true })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="weeklySummary" className="text-base">
                  Weekly Summary Email
                </Label>
                <p className="text-sm text-muted-foreground">Get a weekly digest</p>
              </div>
            </div>
            <Switch
              id="weeklySummary"
              checked={values.weeklySummary}
              onCheckedChange={(checked) =>
                setValue('weeklySummary', checked, { shouldDirty: true })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert Types */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
          <CardDescription>Configure frequency for different types of alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Fraud Alerts</Label>
              <p className="text-sm text-muted-foreground">Critical security notifications</p>
            </div>
            <Select
              value={values.fraudAlerts}
              onValueChange={(value: 'immediate' | 'off') =>
                setValue('fraudAlerts', value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Compliance Deadlines</Label>
              <p className="text-sm text-muted-foreground">Upcoming compliance reminders</p>
            </div>
            <Select
              value={values.complianceDeadlines}
              onValueChange={(value: '7days' | '3days' | 'off') =>
                setValue('complianceDeadlines', value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 days before</SelectItem>
                <SelectItem value="3days">3 days before</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Cashflow Warnings</Label>
              <p className="text-sm text-muted-foreground">Low balance alerts</p>
            </div>
            <Select
              value={values.cashflowWarnings}
              onValueChange={(value: 'immediate' | 'daily' | 'off') =>
                setValue('cashflowWarnings', value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Transaction Summary</Label>
              <p className="text-sm text-muted-foreground">Regular transaction reports</p>
            </div>
            <Select
              value={values.transactionSummary}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'off') =>
                setValue('transactionSummary', value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>Set times when you don't want to be disturbed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="quietHoursEnabled" className="text-base">
              Enable quiet hours
            </Label>
            <Switch
              id="quietHoursEnabled"
              checked={values.quietHoursEnabled}
              onCheckedChange={(checked) =>
                setValue('quietHoursEnabled', checked, { shouldDirty: true })
              }
            />
          </div>

          {values.quietHoursEnabled && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quietHoursFrom">From</Label>
                  <Input
                    id="quietHoursFrom"
                    type="time"
                    value={values.quietHoursFrom}
                    onChange={(e) =>
                      setValue('quietHoursFrom', e.target.value, { shouldDirty: true })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quietHoursTo">To</Label>
                  <Input
                    id="quietHoursTo"
                    type="time"
                    value={values.quietHoursTo}
                    onChange={(e) =>
                      setValue('quietHoursTo', e.target.value, { shouldDirty: true })
                    }
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                No alerts during these hours except critical
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Threshold Settings</CardTitle>
          <CardDescription>Customize when you receive alerts based on amounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="suspiciousTransactionAmount">Suspicious transaction amount (₹)</Label>
            <Input
              id="suspiciousTransactionAmount"
              type="number"
              value={values.suspiciousTransactionAmount}
              onChange={(e) =>
                setValue('suspiciousTransactionAmount', Number(e.target.value), {
                  shouldDirty: true,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumCashflowWarning">Minimum cashflow warning (₹)</Label>
            <Input
              id="minimumCashflowWarning"
              type="number"
              value={values.minimumCashflowWarning}
              onChange={(e) =>
                setValue('minimumCashflowWarning', Number(e.target.value), { shouldDirty: true })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="largeDebitThreshold">Large debit threshold (₹)</Label>
            <Input
              id="largeDebitThreshold"
              type="number"
              value={values.largeDebitThreshold}
              onChange={(e) =>
                setValue('largeDebitThreshold', Number(e.target.value), { shouldDirty: true })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
