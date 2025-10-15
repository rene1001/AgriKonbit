/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'agrikonbit-v1.0.0';
const RUNTIME_CACHE = 'agrikonbit-runtime-v1';

// Assets critiques à mettre en cache immédiatement
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/logo192.png',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des assets critiques');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()) // Active immédiatement
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend contrôle immédiatement
  );
});

// Stratégie de fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes externes (CDN, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Stratégie : Network First pour API, Cache First pour assets
  if (url.pathname.startsWith('/api/')) {
    // API : Network First (toujours frais)
    event.respondWith(networkFirst(request));
  } else if (url.pathname.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp)$/)) {
    // Assets statiques : Cache First (performance)
    event.respondWith(cacheFirst(request));
  } else {
    // HTML et autres : Network First avec fallback
    event.respondWith(networkFirst(request));
  }
});

// Stratégie Network First
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    // Mettre en cache les réponses réussies
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Réseau indisponible, utilisation du cache pour:', request.url);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback pour les pages HTML
    if (request.headers.get('accept').includes('text/html')) {
      const offlineResponse = await cache.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Pas de cache disponible
    return new Response('Hors ligne', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Stratégie Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Mettre à jour le cache en arrière-plan
    fetch(request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse);
      }
    }).catch(() => {
      // Échec silencieux, on a déjà le cache
    });
    
    return cachedResponse;
  }
  
  // Pas en cache, récupérer du réseau
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Échec de récupération:', request.url);
    return new Response('Asset non disponible', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urls);
    });
  }
});

// Background Sync (optionnel - pour requêtes hors ligne)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Logique de synchronisation des données hors ligne
  console.log('[Service Worker] Synchronisation des données...');
}

// Notifications Push (optionnel)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification reçue');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'AgriKonbit';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/logo192.png',
    badge: '/favicon.svg',
    data: data.url
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestion du clic sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

console.log('[Service Worker] Chargé et prêt !');
