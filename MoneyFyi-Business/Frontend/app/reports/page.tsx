import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Download, FileText, TrendingUp, AlertTriangle, Calendar } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      name: 'Monthly Financial Summary',
      description: 'Complete overview of income, expenses, and cashflow',
      date: 'January 2025',
      status: 'ready',
      fileSize: '2.4 MB',
      icon: FileText,
    },
    {
      id: 2,
      name: 'Vendor Risk Analysis',
      description: 'Detailed risk scoring and transaction patterns',
      date: 'January 2025',
      status: 'ready',
      fileSize: '1.8 MB',
      icon: AlertTriangle,
    },
    {
      id: 3,
      name: 'GST Compliance Report',
      description: 'GSTIN validation, mismatches, and filing status',
      date: 'Q4 2024',
      status: 'ready',
      fileSize: '3.2 MB',
      icon: FileText,
    },
    {
      id: 4,
      name: 'Fraud Detection Summary',
      description: 'All flagged transactions and anomalies',
      date: 'Last 30 Days',
      status: 'processing',
      fileSize: '1.2 MB',
      icon: AlertTriangle,
    },
    {
      id: 5,
      name: 'Cashflow Forecast',
      description: '90-day projection with confidence intervals',
      date: 'Feb-Apr 2025',
      status: 'ready',
      fileSize: '856 KB',
      icon: TrendingUp,
    },
    {
      id: 6,
      name: 'Transaction History',
      description: 'Complete transaction log with categorization',
      date: 'December 2024',
      status: 'ready',
      fileSize: '4.1 MB',
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="mt-2 text-muted-foreground">
            Download detailed financial reports and analysis
          </p>
        </div>
        <Button className="bg-[#0F8F6E] hover:bg-[#0D7A5E]">
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Custom Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available Reports</CardDescription>
            <CardTitle className="text-3xl">6</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Calendar className="mr-1 inline h-3 w-3" />
              Last updated today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Downloads</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Storage Used</CardDescription>
            <CardTitle className="text-3xl">13.5 MB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              of 1 GB available
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F8F6E]/10">
                    <Icon className="h-6 w-6 text-[#0F8F6E]" />
                  </div>
                  <Badge
                    variant={report.status === 'ready' ? 'default' : 'secondary'}
                    className={report.status === 'ready' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : ''}
                  >
                    {report.status === 'ready' ? 'Ready' : 'Processing'}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg">{report.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {report.date}
                    </span>
                    <span>{report.fileSize}</span>
                  </div>
                  <Button
                    className="w-full bg-[#0F8F6E] hover:bg-[#0D7A5E]"
                    disabled={report.status === 'processing'}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
