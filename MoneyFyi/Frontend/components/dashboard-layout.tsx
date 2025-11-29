'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutDashboard, Upload, FileText, Settings, Search, Menu, ChevronLeft, LogOut, User, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NotificationDropdown } from './notification-dropdown'
import { ThemeToggle } from '@/components/theme-toggle'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: FileText },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 transition-opacity hover:opacity-80">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary overflow-hidden">
          <Image src="/logo.png" alt="MoneyFyi Logo" width={40} height={40} className="h-full w-full object-contain" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-xl font-bold text-sidebar-foreground">MoneyFyi</span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:-translate-y-0.5',
                sidebarCollapsed && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Button (Desktop only) */}
      <div className="hidden border-t border-sidebar-border p-3 lg:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full justify-center"
        >
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform duration-300',
              sidebarCollapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:block',
          sidebarCollapsed ? 'w-20' : 'w-60'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-60 p-0 lg:hidden">
          <div className="bg-sidebar">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-3 shadow-sm md:h-16 md:px-4 lg:px-6">
          {/* Left: Mobile Menu + Search */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-48 pl-10 md:w-64 lg:w-80"
              />
            </div>
          </div>

          {/* Right: Notifications + Theme Toggle + User */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 gap-2 px-2 md:h-10">
                  <Avatar className="h-7 w-7 md:h-8 md:w-8">
                    <AvatarImage src="/placeholder.svg" alt="User avatar" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      RK
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium lg:inline-block">
                    Raj Kumar
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-md border border-border">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-popover-foreground">Raj Kumar</p>
                    <p className="text-xs text-muted-foreground">raj@business.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background px-3 py-4 pb-16 md:px-4 md:py-6 md:pb-8 lg:px-8">
          <div className="mx-auto max-w-screen-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
