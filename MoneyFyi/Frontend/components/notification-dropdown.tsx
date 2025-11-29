'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, AlertCircle, Calendar, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Notification } from '@/lib/notification-types'
import { AlertDetailModal } from './alert-detail-modal'

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Suspicious Transaction Detected',
    description: '₹45,000 to NEW_VENDOR_ABC',
    time: '5 minutes ago',
    read: false,
    actionLabel: 'Review Now',
    icon: 'alert',
    details: {
      amount: '₹45,000',
      vendor: 'NEW_VENDOR_ABC',
      date: 'Jan 15, 2025 2:35 PM',
      transactionId: 'TXN-2025-001-4532',
      riskScore: 85,
      detectedPatterns: [
        'First transaction with vendor',
        'Amount exceeds threshold',
        'Round number transaction'
      ],
      recommendedActions: [
        'Verify vendor identity',
        'Check invoice documentation',
        'Contact vendor for confirmation'
      ],
      transactionHistory: [
        { date: 'Jan 15, 2025', amount: '₹45,000', status: 'Pending', description: 'Payment to NEW_VENDOR_ABC' },
        { date: 'Jan 10, 2025', amount: '₹12,500', status: 'Completed', description: 'Payment to Vendor XYZ' },
        { date: 'Jan 8, 2025', amount: '₹8,300', status: 'Completed', description: 'Payment to Supplier ABC' }
      ],
      evidenceUrl: '/business-invoice.png'
    }
  },
  {
    id: '2',
    type: 'warning',
    title: 'GST Filing Due Soon',
    description: 'Q3 2025 deadline in 5 days',
    time: '2 hours ago',
    read: false,
    actionLabel: 'View Details',
    icon: 'calendar',
    details: {
      date: 'Jan 20, 2025',
      transactionId: 'GST-Q3-2025',
      recommendedActions: [
        'Review quarterly transactions',
        'Verify input tax credits',
        'Submit GSTR-1 form',
        'File GSTR-3B return'
      ]
    }
  },
  {
    id: '3',
    type: 'success',
    title: 'Statement Processing Complete',
    description: 'Bank_Statement_Oct2025.pdf',
    time: '1 day ago',
    read: false,
    actionLabel: 'View Report',
    icon: 'check',
    details: {
      date: 'Jan 14, 2025',
      transactionId: 'PROC-2025-001',
      recommendedActions: [
        'Review processed transactions',
        'Check for anomalies',
        'Download summary report'
      ]
    }
  }
]

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'alert':
        return AlertCircle
      case 'calendar':
        return Calendar
      case 'check':
        return CheckCircle
      default:
        return Bell
    }
  }

  const getSeverityColors = (type: Notification['type']) => {
    switch (type) {
      case 'critical':
        return {
          dot: 'bg-red-500',
          icon: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
          button: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'warning':
        return {
          dot: 'bg-orange-500',
          icon: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
          button: 'bg-orange-600 hover:bg-orange-700 text-white'
        }
      case 'success':
        return {
          dot: 'bg-green-500',
          icon: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
          button: 'bg-green-600 hover:bg-green-700 text-white'
        }
      case 'info':
        return {
          dot: 'bg-blue-500',
          icon: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn('relative', className)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground"
              >
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[400px] p-0 bg-background/95 backdrop-blur-md border-border">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[600px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.slice(0, 5).map((notification) => {
                  const Icon = getIcon(notification.icon)
                  const colors = getSeverityColors(notification.type)

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="cursor-pointer p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex gap-3">
                        {/* Unread Indicator */}
                        <div className="pt-1">
                          {!notification.read && (
                            <div className={cn('h-2 w-2 rounded-full', colors.dot)} />
                          )}
                        </div>

                        {/* Icon */}
                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', colors.icon)}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-tight text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                          {notification.actionLabel && (
                            <Button
                              size="sm"
                              className={cn('mt-2 h-7 text-xs', colors.button)}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleNotificationClick(notification)
                              }}
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="mb-2 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No new notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t p-3">
              <Button variant="ghost" className="w-full text-sm text-primary hover:underline">
                View All Notifications
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Detail Modal */}
      <AlertDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedNotification(null)
        }}
      />
    </>
  )
}
