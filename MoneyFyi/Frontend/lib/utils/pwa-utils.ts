'use client'

// Check if app is installed as PWA
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    })
    console.log('[PWA] Service Worker registered:', registration)
    return registration
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error)
    return null
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission()
  }

  return Notification.permission
}

// Show notification
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  const permission = await requestNotificationPermission()
  
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    })
  }
}

// Share API wrapper
export async function shareContent(data: ShareData): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.share) {
    return false
  }

  try {
    await navigator.share(data)
    return true
  } catch (error) {
    console.error('[PWA] Share failed:', error)
    return false
  }
}

// Check network status
export function useOnlineStatus(): boolean {
  if (typeof window === 'undefined') return true
  
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Add 'use client' directive
import { useEffect, useState } from 'react'
