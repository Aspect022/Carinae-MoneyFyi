import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, AlertTriangle, FileText, Upload, Share2, Settings } from 'lucide-react'
import { FinancialHealthScore } from '@/components/financial-health-score'
import { CashflowForecastChart } from '@/components/cashflow-forecast-chart'
import { VendorRiskTable } from '@/components/vendor-risk-table'
import { ComplianceStatusCard } from '@/components/compliance-status-card'

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-4">
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-muted-foreground md:text-sm">
            Monitor your financial health and alerts
          </p>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="w-full sm:w-[160px] md:w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Urgent Alerts Section */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-foreground md:mb-4 md:text-lg">Urgent Alerts</h2>
        <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
          {/* FRAUD ALERT - Critical */}
          <Card className="animate-in fade-in-50 slide-in-from-bottom-4 border-l-4 border-l-red-500 bg-red-50 duration-500 dark:bg-red-950/20" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
                    Suspicious UPI Transaction
                  </h3>
                  <div className="mt-2 font-mono text-xl font-bold text-red-700 dark:text-red-300 md:text-2xl">
                    ₹45,000
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <div className="space-y-1 text-xs md:text-sm">
                <p className="text-red-800 dark:text-red-200">
                  <span className="font-medium">Vendor:</span> NEW_VENDOR_ABC
                </p>
                <p className="text-red-700 dark:text-red-300">
                  First transaction with new vendor exceeds ₹40K threshold
                </p>
              </div>
              <Button size="sm" className="w-full bg-red-600 text-white hover:bg-red-700">
                View Details →
              </Button>
            </CardContent>
          </Card>

          {/* COMPLIANCE ALERT - High */}
          <Card className="animate-in fade-in-50 slide-in-from-bottom-4 border-l-4 border-l-orange-500 bg-orange-50 duration-500 dark:bg-orange-950/20" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                    GST Filing Due in 5 Days
                  </h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <p className="text-xs text-orange-700 dark:text-orange-300 md:text-sm">
                Missing GSTR-3B for Oct-Dec period
              </p>
              <Button size="sm" variant="outline" className="w-full border-orange-500 text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-950">
                Prepare Documents →
              </Button>
            </CardContent>
          </Card>

          {/* CASHFLOW ALERT - Medium */}
          <Card className="animate-in fade-in-50 slide-in-from-bottom-4 border-l-4 border-l-yellow-500 bg-yellow-50 duration-500 dark:bg-yellow-950/20" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                    Predicted Shortage on 22-Nov-2025
                  </h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 md:text-sm">
                Projected balance: ₹12,000 (below safe limit)
              </p>
              <Button size="sm" variant="outline" className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-950">
                View Forecast →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Two Column Layout - Financial Health & Cashflow */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <FinancialHealthScore />
        <CashflowForecastChart />
      </div>

      {/* Vendor Risk Analysis */}
      <VendorRiskTable />

      {/* Compliance Status */}
      <ComplianceStatusCard />
    </div>
  )
}
