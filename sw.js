// Service Worker for image caching and performance optimization
const CACHE_NAME = 'portfolio-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/img/ME-1.png',
  '/index.html',
  '/src/main.tsx',
];

// Files to cache (images, fonts, etc.)
const CACHEABLE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.ico',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.log('Service Worker: Cache failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version, but also update cache in background
            event.waitUntil(
              fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.ok) {
                    caches.open(CACHE_NAME)
                      .then((cache) => {
                        cache.put(request, networkResponse.clone());
                      });
                  }
                })
                .catch(() => {})
            );
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then((networkResponse) => {
              // Cache successful responses
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    // Only cache images and static assets
                    const extension = '.' + url.pathname.split('.').pop();
                    if (CACHEABLE_EXTENSIONS.includes(extension)) {
                      cache.put(request, responseClone);
                    }
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // Return offline fallback if available
              if (request.destination === 'image') {
                return new Response(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#4a72f5" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>`,
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
            });
        })
    );
  } else {
    // For cross-origin requests, just fetch normally
    event.respondWith(fetch(request));
  }
});
