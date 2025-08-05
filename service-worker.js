const CACHE_NAME = 'qr-scanner-cache-v1';
const URLS_TO_CACHE = [
  // HTML pages
  './',
  './index.html',
  './create_signature.html',
  './notarize.html',
  './register_farm.html',
  './report_contribution.html',
  './report_dao_expenses.html',
  './report_inventory_movement.html',
  './report_sales.html',
  './report_tree_planting.html',
  './scanner.html',
  './verify_request.html',
  './withdraw_voting_rights.html',
  // Scripts
  './menu.js',
  './service-worker.js',
  // External libraries
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
  // Assets
  './assets/brazil.png',
  './assets/usa.png',
  // Google Apps Script API endpoints (dynamic data)                                                                           │
  'https://script.google.com/macros/s/AKfycbygmwRbyqse-dpCYMco0rb93NSgg-Jc1QIw7kUiBM7CZK6jnWnMB5DEjdoX_eCsvVs7/exec',          │
  'https://script.google.com/macros/s/AKfycbztpV3TUIRn3ftNW1aGHAKw32OBJrp_p1Pr9mMAttoyWFZyQgBRPU2T6eGhkmJtz7xV/exec'
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
  // Handle Google Apps Script API calls: network-first with cache fallback
  if (url.origin === 'https://script.google.com' && url.pathname.startsWith('/macros/s/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  // Default: network-first strategy for all other requests, fallback to cache if offline
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