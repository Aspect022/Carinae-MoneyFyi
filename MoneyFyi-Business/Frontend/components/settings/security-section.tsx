'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils' // Added missing cn import
import { Check, X, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Session, LoginHistory } from '@/lib/settings-types'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

const sessions: Session[] = [
  {
    id: '1',
    device: 'Windows PC - Chrome',
    location: 'Bangalore, India',
    ip: '103.15.123.45',
    lastActive: '2 minutes ago',
    isCurrent: true,
  },
  {
    id: '2',
    device: 'iPhone 13 - Safari',
    location: 'Bangalore, India',
    ip: '103.15.123.45',
    lastActive: '1 hour ago',
    isCurrent: false,
  },
]

const loginHistory: LoginHistory[] = [
  {
    id: '1',
    date: '2025-01-15 10:23 AM',
    device: 'Windows PC - Chrome',
    location: 'Bangalore, India',
    ip: '103.15.123.45',
    status: 'success',
  },
  {
    id: '2',
    date: '2025-01-14 09:15 AM',
    device: 'iPhone 13 - Safari',
    location: 'Bangalore, India',
    ip: '103.15.123.45',
    status: 'success',
  },
  {
    id: '3',
    date: '2025-01-13 08:45 AM',
    device: 'Windows PC - Chrome',
    location: 'Mumbai, India',
    ip: '103.14.112.32',
    status: 'failed',
  },
]

export function SecuritySection() {
  const { toast } = useToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  const newPassword = watch('newPassword')

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 'none', color: 'bg-muted', text: '' }
    
    const hasLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    
    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
    
    if (score <= 2) return { strength: 'weak', color: 'bg-destructive', text: 'Weak' }
    if (score <= 4) return { strength: 'medium', color: 'bg-yellow-500', text: 'Medium' }
    return { strength: 'strong', color: 'bg-green-500', text: 'Strong' }
  }

  const passwordStrength = getPasswordStrength(newPassword || '')

  const onSubmit = (data: PasswordFormValues) => {
    console.log('[v0] Password change submitted:', data)
    toast({
      title: 'Password updated',
      description: 'Your password has been successfully changed.',
    })
    reset()
  }

  const getDeviceIcon = (device: string) => {
    if (device.includes('PC')) return <Monitor className="h-4 w-4" />
    if (device.includes('iPhone') || device.includes('Android')) return <Smartphone className="h-4 w-4" />
    return <Tablet className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" type="password" {...register('currentPassword')} />
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" {...register('newPassword')} />
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                        style={{
                          width:
                            passwordStrength.strength === 'weak'
                              ? '33%'
                              : passwordStrength.strength === 'medium'
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{passwordStrength.text}</span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      {newPassword.length >= 8 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span>Uppercase & lowercase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[0-9]/.test(newPassword) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span>Number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[^A-Za-z0-9]/.test(newPassword) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span>Special character</span>
                    </div>
                  </div>
                </div>
              )}
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="twoFactor" className="text-base">
                  Status
                </Label>
                {twoFactorEnabled ? (
                  <Badge variant="default" className="bg-green-500">
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Protect your account with 2FA
              </p>
            </div>
            <Switch
              id="twoFactor"
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          {twoFactorEnabled && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Backup codes
              </Button>
              <Button variant="outline" size="sm">
                Authenticator app
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage devices currently logged into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4',
                  session.isCurrent && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex items-start gap-3">
                  {getDeviceIcon(session.device)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.isCurrent && (
                        <Badge variant="default" className="h-5 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{session.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.ip} • Last active {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button variant="destructive" size="sm">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>Recent login attempts to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((login) => (
                  <TableRow key={login.id}>
                    <TableCell className="font-medium">{login.date}</TableCell>
                    <TableCell>{login.device}</TableCell>
                    <TableCell>{login.location}</TableCell>
                    <TableCell>{login.ip}</TableCell>
                    <TableCell>
                      {login.status === 'success' ? (
                        <Badge variant="default" className="bg-green-500">
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button variant="link" className="h-auto p-0">
              Download full history
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
