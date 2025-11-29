'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, CreditCard, Plug, SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationsSection } from '@/components/settings/notifications-section'
import { SecuritySection } from '@/components/settings/security-section'
import { BillingSection } from '@/components/settings/billing-section'
import { IntegrationsSection } from '@/components/settings/integrations-section'
import { PreferencesSection } from '@/components/settings/preferences-section'

const settingsSections = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('notifications')

  const renderSection = () => {
    switch (activeSection) {
      case 'notifications':
        return <NotificationsSection />
      case 'security':
        return <SecuritySection />
      case 'billing':
        return <BillingSection />
      case 'integrations':
        return <IntegrationsSection />
      case 'preferences':
        return <PreferencesSection />
      default:
        return <NotificationsSection />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Left: Navigation Sidebar */}
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <nav className="space-y-1 rounded-lg border border-border bg-card p-2">
            {settingsSections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Right: Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  )
}
