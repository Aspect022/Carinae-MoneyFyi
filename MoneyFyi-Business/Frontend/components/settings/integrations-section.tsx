'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { MessageSquare, HardDrive, FileText, Copy, Trash2, Plus } from 'lucide-react'
import type { Integration, APIKey, Webhook } from '@/lib/settings-types'

const integrations: Integration[] = [
  {
    id: '1',
    name: 'WhatsApp Business',
    logo: '',
    description: 'Receive alerts on WhatsApp',
    status: 'connected',
  },
  {
    id: '2',
    name: 'Google Drive',
    logo: '',
    description: 'Auto-backup documents',
    status: 'available',
  },
  {
    id: '3',
    name: 'Zoho Books',
    logo: '',
    description: 'Sync transactions',
    status: 'coming-soon',
  },
  {
    id: '4',
    name: 'Tally',
    logo: '',
    description: 'Import/export data',
    status: 'coming-soon',
  },
]

const apiKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API',
    key: 'sk-••••••••••••1234',
    created: 'Jan 10, 2025',
    lastUsed: '2 hours ago',
  },
  {
    id: '2',
    name: 'Development API',
    key: 'sk-••••••••••••5678',
    created: 'Dec 15, 2024',
    lastUsed: '1 day ago',
  },
]

const webhooks: Webhook[] = [
  {
    id: '1',
    url: 'https://api.example.com/webhooks/moneyfyi',
    events: ['transaction.created', 'alert.triggered'],
    active: true,
  },
]

export function IntegrationsSection() {
  const [newWebhook, setNewWebhook] = useState('')

  const getIntegrationIcon = (name: string) => {
    if (name.includes('WhatsApp')) return <MessageSquare className="h-8 w-8 text-green-600" />
    if (name.includes('Drive')) return <HardDrive className="h-8 w-8 text-blue-600" />
    return <FileText className="h-8 w-8 text-orange-600" />
  }

  return (
    <div className="space-y-6">
      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect your favorite tools and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="relative rounded-lg border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    {getIntegrationIcon(integration.name)}
                    {integration.status === 'connected' ? (
                      <Badge variant="default" className="bg-green-500">
                        Connected
                      </Badge>
                    ) : integration.status === 'coming-soon' ? (
                      <Badge variant="secondary">Coming Soon</Badge>
                    ) : null}
                  </div>

                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>

                  {integration.status === 'connected' ? (
                    <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                  ) : integration.status === 'available' ? (
                    <Button size="sm" className="w-full">
                      Connect
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="font-medium">{apiKey.name}</p>
                  <p className="font-mono text-sm text-muted-foreground">{apiKey.key}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {apiKey.created} • Last used {apiKey.lastUsed}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Configure webhook endpoints to receive real-time updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://api.example.com/webhooks"
              value={newWebhook}
              onChange={(e) => setNewWebhook(e.target.value)}
            />
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{webhook.url}</p>
                      <Switch checked={webhook.active} />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
