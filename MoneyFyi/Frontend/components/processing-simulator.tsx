'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ProcessingStep {
  agent: 'doc_scan' | 'anomaly' | 'compliance' | 'cashflow' | 'insight'
  label: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  duration: number
}

const agentIcons = {
  doc_scan: FileText,
  anomaly: AlertTriangle,
  compliance: CheckCircle2,
  cashflow: TrendingUp,
  insight: Sparkles
}

const agentColors = {
  doc_scan: 'text-blue-500',
  anomaly: 'text-orange-500',
  compliance: 'text-green-500',
  cashflow: 'text-purple-500',
  insight: 'text-pink-500'
}

interface ProcessingSimulatorProps {
  onComplete?: () => void
}

export function ProcessingSimulator({ onComplete }: ProcessingSimulatorProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { agent: 'doc_scan', label: 'Extracting text from document...', status: 'pending', progress: 0, duration: 3000 },
    { agent: 'doc_scan', label: 'Parsing transaction data...', status: 'pending', progress: 0, duration: 2000 },
    { agent: 'anomaly', label: 'Detecting anomalies...', status: 'pending', progress: 0, duration: 4000 },
    { agent: 'compliance', label: 'Checking GST compliance...', status: 'pending', progress: 0, duration: 3000 },
    { agent: 'cashflow', label: 'Forecasting cashflow...', status: 'pending', progress: 0, duration: 5000 },
    { agent: 'insight', label: 'Generating AI insights...', status: 'pending', progress: 0, duration: 4000 },
  ])
  
  const [currentStep, setCurrentStep] = useState(0)
  
  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete?.()
      return
    }
    
    // Update current step to processing
    setSteps(prev => prev.map((step, idx) => 
      idx === currentStep ? { ...step, status: 'processing' as const } : step
    ))
    
    // Animate progress
    const duration = steps[currentStep].duration
    const interval = 50
    const increment = (100 / duration) * interval
    
    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += increment
      
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)
        
        // Mark as completed
        setSteps(prev => prev.map((step, idx) => 
          idx === currentStep ? { ...step, status: 'completed' as const, progress: 100 } : step
        ))
        
        // Move to next step
        setTimeout(() => setCurrentStep(prev => prev + 1), 500)
      } else {
        setSteps(prev => prev.map((step, idx) => 
          idx === currentStep ? { ...step, progress: currentProgress } : step
        ))
      }
    }, interval)
    
    return () => clearInterval(progressInterval)
  }, [currentStep, steps, onComplete])
  
  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <h3 className="text-lg font-semibold">Processing Document</h3>
        </div>
        
        {steps.map((step, idx) => {
          const Icon = agentIcons[step.agent]
          const colorClass = agentColors[step.agent]
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className={`${step.status === 'processing' ? 'animate-pulse' : ''}`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Icon className={`h-5 w-5 ${colorClass}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${step.status === 'processing' ? 'font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  {step.status !== 'pending' && (
                    <Progress value={step.progress} className="h-1 mt-1" />
                  )}
                </div>
                {step.status === 'completed' && (
                  <span className="text-xs text-green-600">Completed</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
