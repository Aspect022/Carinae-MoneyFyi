'use client'

import { Home, Upload, FileText, Bell, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Alerts', href: '/dashboard', icon: Bell, badge: 3 },
  { name: 'More', href: '/settings', icon: MoreHorizontal },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  // Don't show on landing page or auth pages
  if (pathname === '/' || pathname.startsWith('/auth')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md pb-safe md:hidden">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <item.icon className={cn(
                  'h-6 w-6 transition-transform',
                  isActive && 'scale-110'
                )} />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="truncate">{item.name}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
