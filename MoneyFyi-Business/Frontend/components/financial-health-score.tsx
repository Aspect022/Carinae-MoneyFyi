'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface HealthIndicator {
  label: string
  status: 'good' | 'medium' | 'bad'
  icon: 'check' | 'warning' | 'error'
}

const indicators: HealthIndicator[] = [
  { label: 'Compliance', status: 'good', icon: 'check' },
  { label: 'Fraud Risk', status: 'medium', icon: 'warning' },
  { label: 'Cashflow', status: 'good', icon: 'check' },
]

export function FinancialHealthScore() {
  const score = 72
  const scoreColor = score > 70 ? 'text-[--success-green]' : score >= 40 ? 'text-yellow-600' : 'text-red-600'
  const strokeColor = score > 70 ? '#0F8F6E' : score >= 40 ? '#F59E0B' : '#EF4444'
  
  // Calculate circle parameters
  const size = 160
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ animationDelay: '400ms' }}>
      <CardHeader>
        <CardTitle>Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Circular Progress Indicator */}
        <div className="relative mb-6">
          <svg width={size} height={size} className="rotate-[-90deg]">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`font-mono text-4xl font-bold ${scoreColor}`}>
              {score}
            </div>
            <div className="text-sm text-muted-foreground">/ 100</div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="w-full space-y-3">
          {indicators.map((indicator, index) => (
            <div
              key={indicator.label}
              className="flex items-center justify-between rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
            >
              <span className="text-sm font-medium text-foreground">
                {indicator.label}
              </span>
              <div className="flex items-center gap-2">
                {indicator.status === 'good' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-[--success-green]" />
                    <span className="text-sm font-medium text-[--success-green]">Good</span>
                  </>
                )}
                {indicator.status === 'medium' && (
                  <>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">Medium</span>
                  </>
                )}
                {indicator.status === 'bad' && (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Poor</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Last Updated */}
        <p className="mt-4 text-xs text-muted-foreground">
          Last Updated: 1h ago
        </p>
      </CardContent>
    </Card>
  )
}
