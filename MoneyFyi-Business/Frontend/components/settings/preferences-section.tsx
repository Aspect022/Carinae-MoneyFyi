'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function PreferencesSection() {
  const { toast } = useToast()
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [language, setLanguage] = useState('english')
  const [currencyFormat, setCurrencyFormat] = useState('indian')
  const [dateFormat, setDateFormat] = useState('dd-mm-yyyy')
  const [defaultView, setDefaultView] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)

  const handleDownloadData = () => {
    toast({
      title: 'Export started',
      description: 'Your data export has been started. You will receive an email shortly.',
    })
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Language & Localization */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Localization</CardTitle>
          <CardDescription>Customize language and regional settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Select defaultValue="ist">
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ist">(GMT+5:30) India Standard Time</SelectItem>
                <SelectItem value="pst">(GMT-8:00) Pacific Standard Time</SelectItem>
                <SelectItem value="est">(GMT-5:00) Eastern Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>Customize how data is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Currency Display Format</Label>
            <RadioGroup value={currencyFormat} onValueChange={setCurrencyFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="indian" id="indian" />
                <Label htmlFor="indian" className="font-normal">
                  ₹1,23,456.78 (Indian)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="international" id="international" />
                <Label htmlFor="international" className="font-normal">
                  ₹123,456.78 (International)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Date Format</Label>
            <RadioGroup value={dateFormat} onValueChange={setDateFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dd-mm-yyyy" id="dd-mm-yyyy" />
                <Label htmlFor="dd-mm-yyyy" className="font-normal">
                  DD-MM-YYYY
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mm-dd-yyyy" id="mm-dd-yyyy" />
                <Label htmlFor="mm-dd-yyyy" className="font-normal">
                  MM-DD-YYYY
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yyyy-mm-dd" id="yyyy-mm-dd" />
                <Label htmlFor="yyyy-mm-dd" className="font-normal">
                  YYYY-MM-DD
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Preferences</CardTitle>
          <CardDescription>Customize your dashboard experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultView">Default View</Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger id="defaultView">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="transactions">Transactions</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sidebarCollapsed">Sidebar collapsed by default</Label>
              <p className="text-sm text-muted-foreground">Start with a collapsed sidebar</p>
            </div>
            <Switch
              id="sidebarCollapsed"
              checked={sidebarCollapsed}
              onCheckedChange={setSidebarCollapsed}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showOnboarding">Show onboarding tips</Label>
              <p className="text-sm text-muted-foreground">Display helpful tooltips for new features</p>
            </div>
            <Switch
              id="showOnboarding"
              checked={showOnboarding}
              onCheckedChange={setShowOnboarding}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data and account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <h3 className="font-medium">Download my data</h3>
              <p className="text-sm text-muted-foreground">Export all your data in JSON format</p>
            </div>
            <Button variant="outline" onClick={handleDownloadData}>
              Download
            </Button>
          </div>

          <div className="rounded-lg border border-destructive/50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-medium text-destructive">Delete my account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be
                    undone.
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action is permanent and cannot be undone. All your data will be
                        permanently deleted.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="deleteConfirm">
                          Type <span className="font-bold">DELETE</span> to confirm
                        </Label>
                        <Input
                          id="deleteConfirm"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="DELETE"
                        />
                      </div>

                      <div className="rounded-lg bg-destructive/10 p-3">
                        <p className="text-sm text-destructive">
                          Warning: This will permanently delete your account, all transactions, documents,
                          and settings. This action cannot be reversed.
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteConfirmation('')}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== 'DELETE'}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
