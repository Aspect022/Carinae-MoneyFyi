'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface VendorRisk {
  rank: number
  vendor: string
  monthlySpend: number
  riskLevel: 'low' | 'medium' | 'high'
  transactionCount: number
  details: string
}

const vendorData: VendorRisk[] = [
  {
    rank: 1,
    vendor: 'ABC Suppliers',
    monthlySpend: 245000,
    riskLevel: 'low',
    transactionCount: 18,
    details: '18 transactions • Avg payment delay: 3 days',
  },
  {
    rank: 2,
    vendor: 'XYZ Distributors',
    monthlySpend: 180000,
    riskLevel: 'medium',
    transactionCount: 12,
    details: '12 transactions • 2 invoice mismatches detected',
  },
  {
    rank: 3,
    vendor: 'New Vendor 123',
    monthlySpend: 45000,
    riskLevel: 'high',
    transactionCount: 1,
    details: '1 transaction • No history • Large first payment',
  },
  {
    rank: 4,
    vendor: 'Prime Materials Co',
    monthlySpend: 125000,
    riskLevel: 'low',
    transactionCount: 24,
    details: '24 transactions • Consistent payment pattern',
  },
  {
    rank: 5,
    vendor: 'Tech Solutions Ltd',
    monthlySpend: 89000,
    riskLevel: 'medium',
    transactionCount: 8,
    details: '8 transactions • 1 late payment last month',
  },
]

type SortKey = 'rank' | 'vendor' | 'monthlySpend' | 'riskLevel' | 'transactionCount'
type SortOrder = 'asc' | 'desc'

export function VendorRiskTable() {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedData = [...vendorData].sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1
    
    if (sortKey === 'riskLevel') {
      const riskOrder = { high: 3, medium: 2, low: 1 }
      return (riskOrder[a.riskLevel] - riskOrder[b.riskLevel]) * order
    }
    
    if (typeof a[sortKey] === 'string') {
      return a[sortKey].localeCompare(b[sortKey] as string) * order
    }
    
    return ((a[sortKey] as number) - (b[sortKey] as number)) * order
  })

  const getRiskBadgeStyles = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
    }
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => (
    <ArrowUpDown 
      className={`ml-1 inline h-4 w-4 ${sortKey === columnKey ? 'text-primary' : 'text-muted-foreground'}`}
    />
  )

  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
      <CardHeader>
        <CardTitle>Vendor Risk Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Top vendors by spending with risk assessment
        </p>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th 
                  className="cursor-pointer pb-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort('rank')}
                >
                  Rank
                  <SortIcon columnKey="rank" />
                </th>
                <th 
                  className="cursor-pointer pb-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort('vendor')}
                >
                  Vendor Name
                  <SortIcon columnKey="vendor" />
                </th>
                <th 
                  className="cursor-pointer pb-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort('monthlySpend')}
                >
                  Monthly Spend
                  <SortIcon columnKey="monthlySpend" />
                </th>
                <th 
                  className="cursor-pointer pb-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort('riskLevel')}
                >
                  Risk Level
                  <SortIcon columnKey="riskLevel" />
                </th>
                <th 
                  className="cursor-pointer pb-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort('transactionCount')}
                >
                  Transactions
                  <SortIcon columnKey="transactionCount" />
                </th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((vendor) => (
                <tr
                  key={vendor.rank}
                  className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                  onClick={() => setExpandedRow(expandedRow === vendor.rank ? null : vendor.rank)}
                >
                  <td className="py-4 text-sm font-medium text-foreground">
                    {vendor.rank}
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-base font-bold text-foreground">
                        {vendor.vendor}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {vendor.details}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-sm font-medium text-foreground">
                    ₹{vendor.monthlySpend.toLocaleString('en-IN')}/mo
                  </td>
                  <td className="py-4">
                    <Badge className={getRiskBadgeStyles(vendor.riskLevel)}>
                      {vendor.riskLevel === 'low' && '🟢 '}
                      {vendor.riskLevel === 'medium' && '🟡 '}
                      {vendor.riskLevel === 'high' && '🔴 '}
                      {vendor.riskLevel.charAt(0).toUpperCase() + vendor.riskLevel.slice(1)} Risk
                    </Badge>
                  </td>
                  <td className="py-4 text-sm text-foreground">
                    {vendor.transactionCount}
                  </td>
                  <td className="py-4 text-right">
                    <Button size="sm" variant="ghost">
                      {expandedRow === vendor.rank ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {sortedData.map((vendor) => (
            <div
              key={vendor.rank}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      #{vendor.rank}
                    </span>
                    <Badge className={getRiskBadgeStyles(vendor.riskLevel)}>
                      {vendor.riskLevel === 'low' && '🟢 '}
                      {vendor.riskLevel === 'medium' && '🟡 '}
                      {vendor.riskLevel === 'high' && '🔴 '}
                      {vendor.riskLevel.charAt(0).toUpperCase() + vendor.riskLevel.slice(1)}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {vendor.vendor}
                  </h3>
                </div>
              </div>
              <div className="mb-2 font-mono text-xl font-medium text-foreground">
                ₹{vendor.monthlySpend.toLocaleString('en-IN')}/mo
              </div>
              <div className="mb-2 text-sm text-muted-foreground">
                {vendor.transactionCount} transactions
              </div>
              <div className="text-xs text-muted-foreground">
                {vendor.details}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
