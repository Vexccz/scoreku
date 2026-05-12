/* ScoreKu Service Worker
 * - Cache-first for static assets (JS/CSS/images/fonts)
 * - Stale-while-revalidate for API calls (/api/*)
 * - Network-first for navigation requests (HTML) with offline fallback
 */

const SW_VERSION = 'scoreku-v1.0.0'
const STATIC_CACHE = `static-${SW_VERSION}`
const API_CACHE = `api-${SW_VERSION}`

// Minimal precache — Vite hashes most assets, so we let them cache on demand.
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== API_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

function isStaticAsset(request) {
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return false
  return /\.(?:js|css|png|jpg|jpeg|svg|webp|gif|ico|woff2?|ttf|otf)$/i.test(
    url.pathname
  )
}

function isApiRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/')
}

// Cache-first for static assets
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response && response.ok && response.type !== 'opaque') {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return cached || Response.error()
  }
}

// Stale-while-revalidate for API calls
async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE)
  const cached = await cache.match(request)
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  return cached || network
}

// Network-first for navigation HTML
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response && response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put('/', response.clone())
    }
    return response
  } catch {
    const cached = await caches.match('/')
    if (cached) return cached
    return new Response('<h1>Offline</h1><p>ScoreKu needs a connection for this page.</p>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }
  if (isApiRequest(request)) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request))
  }
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
