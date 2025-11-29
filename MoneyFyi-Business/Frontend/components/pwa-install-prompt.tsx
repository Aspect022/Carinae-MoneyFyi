'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Download, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(isInStandaloneMode)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if prompt was dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) return

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Show iOS prompt after a delay if on iOS and not installed
    if (iOS && !isInStandaloneMode) {
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
        clearTimeout(timer)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true')
    setShowPrompt(false)
  }

  // Don't show if already installed or on landing/auth pages
  if (isStandalone || !showPrompt) return null
  if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname.startsWith('/auth'))) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
      <Card className="border-primary bg-card p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full p-1 hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Download className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Install MoneyFyi</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isIOS 
                ? 'Tap the share button and select "Add to Home Screen"'
                : 'Install for easier access and offline use'
              }
            </p>
            
            {!isIOS ? (
              <Button
                onClick={handleInstall}
                size="sm"
                className="mt-3 w-full"
              >
                Install App
              </Button>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-accent p-2 text-xs">
                <Share className="h-4 w-4 text-primary" />
                <span>Tap <strong>Share</strong> then <strong>Add to Home Screen</strong></span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
