const CACHE = 'storybook-shell-v7'
const SHELL = [
  '/bible-storybook/',
  '/bible-storybook/index.html',
  '/bible-storybook/home.html',
  '/bible-storybook/bible.html',
  '/bible-storybook/bible/GEN/1.html',
  '/bible-storybook/manifest.webmanifest',
  '/bible-storybook/favicon.ico',
  '/bible-storybook/icon-192.png',
  '/bible-storybook/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (event.request.method !== 'GET') return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone()
          void caches.open(CACHE).then((cache) => cache.put(event.request, copy))
          return response
        })
        .catch(async () => (await caches.match(event.request)) || (await caches.match('/bible-storybook/index.html'))),
    )
    return
  }

  const asset = url.pathname.includes('/_expo/') || url.pathname.includes('/assets/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')
  if (!asset) return
  event.respondWith(
    caches.match(event.request).then((hit) => {
      if (hit) return hit
      return fetch(event.request).then((response) => {
        const copy = response.clone()
        void caches.open(CACHE).then((cache) => cache.put(event.request, copy))
        return response
      })
    }),
  )
})
