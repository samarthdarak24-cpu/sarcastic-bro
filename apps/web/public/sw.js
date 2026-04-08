// Service Worker for ODOP Connect - Offline functionality
const CACHE_NAME = 'odop-connect-v1';
const RUNTIME_CACHE = 'odop-connect-runtime-v1';
const API_CACHE = 'odop-connect-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.tsx',
  '/styles/globals.css',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((response) => response || createOfflineResponse());
        })
    );
  }

  // Static assets - Cache first, network fallback
  if (request.method === 'GET' && 
      (request.destination === 'style' || 
       request.destination === 'script' || 
       request.destination === 'font' ||
       request.destination === 'image')) {
    event.respondWith(
      caches.match(request)
        .then((response) => response || fetch(request))
        .catch(() => createOfflineAsset(request.destination))
    );
  }

  // HTML pages - Network first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((response) => response || caches.match('/offline.html'));
        })
    );
  }
});

// Create offline response
function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      status: 'offline',
      message: 'You are currently offline. Data will sync when connection is restored.',
      timestamp: new Date().toISOString()
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 503,
      statusText: 'Service Unavailable'
    }
  );
}

// Create offline asset fallback
function createOfflineAsset(destination) {
  if (destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#666" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  return new Response('/* Offline */', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    // This will be implemented with Dexie.js
    console.log('Service Worker: Syncing offline data');
    // Get pending requests from indexedDB
    // Send them to server
    // Clear offline queue on success
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification from ODOP Connect',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'odop-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('ODOP Connect', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
