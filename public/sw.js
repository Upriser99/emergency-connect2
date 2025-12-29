// Service Worker for Emergency Connect
// Caches static assets for offline functionality

const CACHE_NAME = 'emergency-connect-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/js/app.js',
  '/src/css/styles.css',
  '/src/css/styles-phase1.css',
  '/src/css/styles-phase3.css',
  '/src/css/styles-phase4.css',
  '/src/css/styles-phase5.css',
  '/src/css/styles-phase6.css',
  '/src/css/styles-polish.css',
  '/src/css/compact-layout.css',
  '/src/css/favorite-badges.css',
  '/src/js/translations.js',
  '/src/js/favorites.js',
  '/src/js/emergency-tools.js',
  '/src/js/guides.js',
  '/public/manifest.json',
  '/public/icons/favicon.png',
  '/public/icons/icon-192.png',
  '/public/icons/icon-512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache the new response
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});
