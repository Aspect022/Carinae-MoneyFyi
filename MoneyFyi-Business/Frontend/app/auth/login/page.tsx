"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { Building2 } from 'lucide-react'

// Test credentials
const TEST_EMAIL = "admin@moneyfyi.com"
const TEST_PASSWORD = "admin123"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simple validation against test credentials
    setTimeout(() => {
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        // Store simple auth flag in localStorage
        localStorage.setItem('authenticated', 'true')
        router.push("/dashboard")
      } else {
        setError("Invalid credentials. Use: admin@moneyfyi.com / admin123")
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground">MoneyFyi</h1>
            <p className="text-sm text-muted-foreground">Financial Intelligence Dashboard</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@moneyfyi.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="admin123"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <Link
                    href="/"
                    className="font-medium text-primary hover:underline"
                  >
                    ← Back to home
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Test Credentials Hint */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-center text-xs text-muted-foreground">
                <strong>Test Credentials:</strong> admin@moneyfyi.com / admin123
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
