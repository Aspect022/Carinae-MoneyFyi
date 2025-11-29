'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left: Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors">
          <Image src="/logo.png" alt="MoneyFyi Logo" width={28} height={28} className="h-7 w-7 object-contain" />
          MoneyFyi
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
        </div>
        
        {/* Right: Theme Toggle + Login Button */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
