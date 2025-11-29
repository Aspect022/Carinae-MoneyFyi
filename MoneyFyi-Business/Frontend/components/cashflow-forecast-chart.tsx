'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceDot,
  ReferenceLine,
  Area, 
  AreaChart,
  Legend
} from 'recharts'
import { Download, FileDown, TrendingUp, TrendingDown, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type TimeRange = '7D' | '30D' | '90D'

interface DataPoint {
  date: string
  balance: number
  confidenceHigh: number
  confidenceLow: number
  change: number
  confidence: number
  isToday: boolean
  isAlert?: boolean
  alertMessage?: string
}

const generateForecastData = (days: number): DataPoint[] => {
  const data: DataPoint[] = []
  const today = new Date()
  let previousBalance = 55000
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    // Create realistic cashflow pattern with dip on day 22
    let balance: number
    if (i === 22) {
      balance = 12000 // Critical shortage
    } else if (i > 18 && i < 26) {
      balance = 30000 - (Math.abs(i - 22) * 1500) // Gradual dip
    } else if (i === 15) {
      balance = 78500 // Peak
    } else {
      balance = 50000 + Math.sin(i / 10) * 15000 + Math.random() * 8000
    }
    
    balance = Math.round(balance)
    const change = i === 0 ? 0 : balance - previousBalance
    
    // Confidence intervals (wider as we go further into future)
    const confidenceWidth = 5000 + (i * 200)
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance,
      confidenceHigh: balance + confidenceWidth,
      confidenceLow: Math.max(0, balance - confidenceWidth),
      change,
      confidence: Math.max(60, 95 - i * 0.3),
      isToday: i === 0,
      isAlert: i === 22,
      alertMessage: i === 22 ? 'Cash Shortage Risk' : undefined
    })
    
    previousBalance = balance
  }
  
  return data
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DataPoint
    const isBelow40K = data.balance < 40000
    const isBelow20K = data.balance < 20000
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border bg-background p-4 shadow-lg"
      >
        <p className="mb-2 text-sm font-semibold text-muted-foreground">{data.date}</p>
        <p className="mb-1 font-mono text-xl font-bold text-foreground">
          ₹{data.balance.toLocaleString('en-IN')}
        </p>
        <p className="mb-2 text-xs text-muted-foreground">
          Confidence: {data.confidence.toFixed(0)}%
        </p>
        {data.change !== 0 && (
          <div className="flex items-center gap-1 text-sm">
            <span className={data.change > 0 ? 'text-green-600' : 'text-red-600'}>
              {data.change > 0 ? '+' : ''}₹{Math.abs(data.change).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-muted-foreground">from previous day</span>
          </div>
        )}
        {isBelow40K && (
          <div className={`mt-2 rounded-md p-2 text-xs ${isBelow20K ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
            {isBelow20K ? '⚠️ Critical: Below safe limit' : '⚠️ Warning: Below safe limit'}
          </div>
        )}
      </motion.div>
    )
  }
  return null
}

const AlertDetailPopup = ({ alert, onClose }: { alert: DataPoint, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-md rounded-lg bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{alert.alertMessage}</h3>
              <p className="text-sm text-muted-foreground">{alert.date}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Predicted Balance</p>
            <p className="font-mono text-2xl font-bold text-red-600">
              ₹{alert.balance.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-950/20">
            <p className="mb-2 text-sm font-semibold text-orange-900 dark:text-orange-100">
              Recommended Action
            </p>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Consider delaying vendor payment to ABC Corp (₹25,000) or accelerating receivables from XYZ Ltd.
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            View Detailed Analysis
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function CashflowForecastChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('90D')
  const [selectedAlert, setSelectedAlert] = useState<DataPoint | null>(null)
  
  const daysMap = { '7D': 7, '30D': 30, '90D': 90 }
  const data = generateForecastData(daysMap[timeRange])
  
  const peakBalance = Math.max(...data.map(d => d.balance))
  const lowestBalance = Math.min(...data.map(d => d.balance))
  const peakDate = data.find(d => d.balance === peakBalance)?.date
  const lowestDate = data.find(d => d.balance === lowestBalance)?.date
  const netChange = data[data.length - 1].balance - data[0].balance
  const percentChange = ((netChange / data[0].balance) * 100).toFixed(1)
  
  const exportAsPNG = () => {
    alert('Export as PNG feature would integrate with html2canvas library')
  }
  
  const exportAsCSV = () => {
    const csv = [
      ['Date', 'Balance', 'Confidence High', 'Confidence Low', 'Confidence %'],
      ...data.map(d => [d.date, d.balance, d.confidenceHigh, d.confidenceLow, d.confidence.toFixed(0)])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cashflow-forecast-${timeRange}.csv`
    a.click()
  }
  
  const alertData = data.find(d => d.isAlert)
  
  return (
    <>
      <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Cashflow Forecast</CardTitle>
              <p className="text-sm text-muted-foreground">{daysMap[timeRange]}-day projection</p>
            </div>
            
            <div className="flex gap-2">
              {(['7D', '30D', '90D'] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {/* Green gradient for safe zone */}
                  <linearGradient id="colorBalanceSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F8F6E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0F8F6E" stopOpacity={0.05}/>
                  </linearGradient>
                  {/* Orange gradient for warning zone */}
                  <linearGradient id="colorBalanceWarning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                  {/* Red gradient for critical zone */}
                  <linearGradient id="colorBalanceCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                  </linearGradient>
                  {/* Confidence interval gradient */}
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F8F6E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0F8F6E" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  interval={timeRange === '7D' ? 0 : timeRange === '30D' ? 4 : 12}
                />
                
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  domain={[0, 100000]}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <ReferenceLine 
                  y={40000} 
                  stroke="#94A3B8" 
                  strokeDasharray="5 5"
                  label={{ value: 'Safe Limit', position: 'right', fill: '#94A3B8', fontSize: 12 }}
                />
                
                <ReferenceLine 
                  y={20000} 
                  stroke="#EF4444" 
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
                
                <ReferenceLine 
                  x={data[0].date} 
                  stroke="#0F8F6E" 
                  strokeDasharray="3 3"
                  label={{ value: 'Today', position: 'top', fill: '#0F8F6E', fontSize: 12 }}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="confidenceHigh"
                  stroke="none"
                  fill="url(#colorConfidence)"
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="confidenceLow"
                  stroke="none"
                  fill="#fff"
                  animationDuration={1500}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#0F8F6E" 
                  strokeWidth={2}
                  fill="url(#colorBalanceSafe)"
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
                
                {alertData && (
                  <ReferenceDot 
                    x={alertData.date} 
                    y={alertData.balance} 
                    r={8} 
                    fill="#EF4444" 
                    stroke="#fff" 
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedAlert(alertData)}
                  >
                    <animate
                      attributeName="r"
                      from="8"
                      to="12"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="1"
                      to="0.5"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </ReferenceDot>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span>Predicted Balance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-6 border-t-2 border-dashed border-muted-foreground"></div>
              <span>Safe Limit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span>Critical Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 bg-primary/10"></div>
              <span>Confidence Range</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportAsPNG}>
              <Download className="mr-2 h-4 w-4" />
              Export as PNG
            </Button>
            <Button variant="outline" size="sm" onClick={exportAsCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Download Data CSV
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="animate-in fade-in-50 slide-in-from-bottom-4" style={{ animationDelay: '600ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Peak Balance</p>
                <p className="mt-1 font-mono text-xl font-bold text-foreground">
                  ₹{peakBalance.toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">on {peakDate}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-950/20">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-in fade-in-50 slide-in-from-bottom-4" style={{ animationDelay: '700ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lowest Point</p>
                <p className="mt-1 font-mono text-xl font-bold text-red-600">
                  ₹{lowestBalance.toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">on {lowestDate} ⚠️</p>
              </div>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-950/20">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-in fade-in-50 slide-in-from-bottom-4" style={{ animationDelay: '800ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Change</p>
                <p className={`mt-1 font-mono text-xl font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netChange >= 0 ? '+' : ''}₹{Math.abs(netChange).toLocaleString('en-IN')}
                </p>
                <p className={`mt-1 text-xs ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netChange >= 0 ? '+' : ''}{percentChange}% over {timeRange}
                </p>
              </div>
              <div className={`rounded-full p-3 ${netChange >= 0 ? 'bg-green-100 dark:bg-green-950/20' : 'bg-red-100 dark:bg-red-950/20'}`}>
                {netChange >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AnimatePresence>
        {selectedAlert && (
          <AlertDetailPopup alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
