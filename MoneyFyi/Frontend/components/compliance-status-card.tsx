import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FileText, Percent, AlertTriangle, ArrowRight } from 'lucide-react'

interface ComplianceItem {
  id: string
  label: string
  icon: React.ReactNode
  status: 'filed' | 'pending' | 'matched' | 'issues'
  statusText: string
  statusColor: string
  progress?: number
  issueCount?: number
}

const complianceData: ComplianceItem[] = [
  {
    id: '1',
    label: 'GST Returns',
    icon: <FileText className="h-5 w-5" />,
    status: 'pending',
    statusText: '⏳ Pending (Nov)',
    statusColor: 'text-orange-600',
    progress: 65,
  },
  {
    id: '2',
    label: 'TDS Deductions',
    icon: <Percent className="h-5 w-5" />,
    status: 'matched',
    statusText: '✓ All matched',
    statusColor: 'text-[--success-green]',
  },
  {
    id: '3',
    label: 'Invoice Mismatches',
    icon: <AlertTriangle className="h-5 w-5" />,
    status: 'issues',
    statusText: '⚠️ 2 issues found',
    statusColor: 'text-orange-600',
    issueCount: 2,
  },
]

export function ComplianceStatusCard() {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ animationDelay: '700ms' }}>
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track regulatory filings and requirements
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {complianceData.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start gap-4 py-4">
                {/* Icon */}
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-foreground">{item.label}</h4>
                      <p className={`mt-1 text-sm font-medium ${item.statusColor}`}>
                        {item.statusText}
                      </p>
                    </div>
                    
                    {/* Status Badge/Icon */}
                    <div className="flex items-center gap-2">
                      {item.status === 'matched' && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                          <span className="text-sm text-[--success-green]">✓</span>
                        </div>
                      )}
                      {item.issueCount && (
                        <Badge variant="destructive" className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                          {item.issueCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {item.progress !== undefined && (
                    <div className="space-y-1">
                      <Progress value={item.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {item.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Divider (not for last item) */}
              {index < complianceData.length - 1 && (
                <div className="border-t border-gray-100 dark:border-gray-800" />
              )}
            </div>
          ))}
        </div>

        {/* View Report Link */}
        <div className="mt-6 pt-4 border-t">
          <Button variant="link" className="h-auto p-0 text-primary hover:text-primary/80">
            View Detailed Report
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
