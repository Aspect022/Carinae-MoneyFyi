import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Brain, Bell, AlertTriangle, CheckCircle2, Shield, TrendingUp, FileText, Lock, Zap, IndianRupee, ChevronRight, Play } from 'lucide-react'
import { LandingNavbar } from '@/components/landing-navbar'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-background px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Zap className="h-4 w-4" />
                Built for Indian SMEs & Accountants
              </div>
              
              <h1 className="text-balance text-5xl font-bold leading-tight text-foreground lg:text-6xl">
                Your AI CFO — Detect Financial Risks Before They Hurt Your Business
              </h1>
              
              <p className="text-balance text-xl text-muted-foreground leading-relaxed">
                Upload bank statements, invoices, and UPI logs. Get fraud alerts, GST compliance checks, and cashflow forecasts — automatically.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/auth/login">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base">
                    Get Started — It's Free
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-base border-border">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 text-primary" />
                  Bank-grade encryption
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  Insights in under 30 seconds
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  Built for Indian businesses
                </div>
              </div>
            </div>
            
            {/* Right Image Placeholder */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
                <img 
                  src="/modern-financial-dashboard-with-charts-and-alerts.jpg" 
                  alt="MoneyFyi Dashboard Preview" 
                  className="h-full w-full object-cover rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-muted">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, automated, and intelligent</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <Card className="relative border-2 border-border hover:border-primary transition-colors bg-card">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                1
              </div>
              <CardHeader className="pt-8">
                <Upload className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-card-foreground">Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  PDFs, images, CSVs — bank statements, invoices, UPI logs.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="relative border-2 border-border hover:border-primary transition-colors bg-card">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                2
              </div>
              <CardHeader className="pt-8">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-card-foreground">AI Scans Everything</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detects fraud, compliance issues, vendor risks & patterns.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="relative border-2 border-border hover:border-primary transition-colors bg-card">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                3
              </div>
              <CardHeader className="pt-8">
                <Bell className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-card-foreground">Receive Smart Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Instant alerts, forecasts & recommendations in your dashboard or WhatsApp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="px-6 py-20 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Problems MoneyFyi Solves</h2>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Pain Points */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Pain Points SMEs Face</h3>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-lg text-muted-foreground">Fraudulent transactions go unnoticed</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-lg text-muted-foreground">GST mismatches and missed filing deadlines</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-lg text-muted-foreground">Vendor overcharging or duplicate invoices</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-lg text-muted-foreground">Cashflow surprises at month-end</p>
              </div>
            </div>
            
            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-6">How MoneyFyi Fixes Them</h3>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">Real-time fraud alerts</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">Automated GST & compliance validation</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">Vendor risk scoring</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">Cashflow forecasting (30-90 days)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="px-6 py-20 bg-muted">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Features Preview</h2>
            <p className="text-xl text-muted-foreground">Powerful insights at your fingertips</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-card-foreground">Fraud Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suspicious transactions, duplicates, round numbers, anomalies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-card-foreground">GST & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  GSTIN validation, invoice mismatch detection, deadlines.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-card-foreground">AI Cashflow Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See shortages before they happen.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <Bell className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-card-foreground">Smart Vendor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Risk score, payment patterns, red flags.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 py-20 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Experience insights your accountant will love
            </h2>
            <p className="text-sm text-muted-foreground">No sensitive data shown. Sample visuals.</p>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src="/financial-dashboard-with-fraud-alerts-cashflow-cha.jpg" 
              alt="Dashboard Preview" 
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 py-20 bg-background">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Is my data safe?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. We use bank-grade AES-256 encryption, DPDP compliant storage, and never store your bank credentials.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">What documents can I upload?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bank statements (PDF/CSV), invoices, UPI transaction logs, GST returns, and vendor bills.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Do you store my bank credentials?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No. We never ask for or store your bank login credentials. You only upload documents.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">How accurate are the insights?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI models achieve 95%+ accuracy on fraud detection and compliance checks, trained on Indian financial data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Can accountants use this?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  MoneyFyi is designed for both business owners and their accountants to collaborate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="pricing" className="px-6 py-20 bg-gradient-to-br from-primary to-primary/90">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Start detecting financial risks in minutes
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            No credit card required. Cancel anytime.
          </p>
          <Link href="/auth/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 bg-background text-foreground hover:bg-background/90">
              Create Free Account
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4">MoneyFyi</h3>
              <p className="text-sm text-muted-foreground">
                Your AI-powered financial risk detection platform
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-card-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/login" className="hover:text-primary">Features</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-card-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/login" className="hover:text-primary">About</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-card-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/login" className="hover:text-primary">Terms</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">DPDP Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MoneyFyi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
