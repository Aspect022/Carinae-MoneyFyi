// MoneyFyi Service Worker for PWA offline support
const CACHE_NAME = 'moneyfyi-v1'
const STATIC_CACHE = 'moneyfyi-static-v1'
const DYNAMIC_CACHE = 'moneyfyi-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/upload',
  '/reports',
  '/offline',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
]

// Install service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch strategy: Network first for API, Cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // API requests: Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cached version
          return caches.match(request)
        })
    )
    return
  }

  // Static assets: Cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response
        }

        // Clone and cache the response
        const responseClone = response.clone()
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone)
        })

        return response
      }).catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline')
        }
      })
    })
  )
})

// Background sync for offline uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-uploads') {
    console.log('[SW] Syncing offline uploads...')
    event.waitUntil(syncOfflineUploads())
  }
})

async function syncOfflineUploads() {
  // Get pending uploads from IndexedDB and sync them
  // This would integrate with your actual upload logic
  console.log('[SW] Checking for pending uploads...')
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'MoneyFyi Alert'
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.url || '/dashboard',
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/dashboard')
    )
  }
})
