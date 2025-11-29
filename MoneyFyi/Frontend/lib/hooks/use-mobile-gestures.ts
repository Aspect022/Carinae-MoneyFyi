'use client'

import { useEffect, useRef, useState } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipeGesture(handlers: SwipeHandlers, threshold = 50) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    touchEnd.current = null
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return

    const xDiff = touchStart.current.x - touchEnd.current.x
    const yDiff = touchStart.current.y - touchEnd.current.y

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Horizontal swipe
      if (Math.abs(xDiff) > threshold) {
        if (xDiff > 0) {
          handlers.onSwipeLeft?.()
        } else {
          handlers.onSwipeRight?.()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(yDiff) > threshold) {
        if (yDiff > 0) {
          handlers.onSwipeUp?.()
        } else {
          handlers.onSwipeDown?.()
        }
      }
    }
  }

  return { onTouchStart, onTouchMove, onTouchEnd }
}

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const threshold = 80

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === 0) return

      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current

      if (distance > 0) {
        setPullDistance(Math.min(distance, threshold * 1.5))
        setIsPulling(distance > threshold)
      }
    }

    const handleTouchEnd = async () => {
      if (isPulling) {
        await onRefresh()
      }
      setIsPulling(false)
      setPullDistance(0)
      startY.current = 0
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, onRefresh])

  return { isPulling, pullDistance }
}

export function useHapticFeedback() {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  return {
    light: () => vibrate(10),
    medium: () => vibrate(20),
    heavy: () => vibrate(30),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([20, 100, 20]),
  }
}
