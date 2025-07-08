const CACHE_NAME = 'qr-scanner-cache-v1';
const URLS_TO_CACHE = [
  './scanner.html',
  './service-worker.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js'
];

// Install event: cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event: take control immediately
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Fetch event: serve from cache, update on network; support reload param
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  // If reload param is present, fetch from network and update cache
  if (url.searchParams.has('reload')) {
    const cleanUrl = url.origin + url.pathname;
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(cleanUrl, responseClone));
          return response;
        })
        .catch(() => caches.match(cleanUrl))
    );
    return;
  }
  // Default: network-first strategy, fallback to cache if offline
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});