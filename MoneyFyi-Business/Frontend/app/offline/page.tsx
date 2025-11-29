'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            It looks like you've lost your internet connection. Some features may be limited until you're back online.
          </p>
          
          <div className="rounded-lg bg-muted p-4 text-sm">
            <h4 className="font-semibold mb-2">What you can still do:</h4>
            <ul className="space-y-1 text-left text-muted-foreground">
              <li>• View cached dashboard data</li>
              <li>• Browse previously loaded transactions</li>
              <li>• Prepare documents for upload (syncs when online)</li>
            </ul>
          </div>

          <Button
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <p className="text-xs text-muted-foreground">
            Your data will sync automatically when connection is restored
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
