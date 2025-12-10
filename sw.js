
const CACHE_NAME = 'micorp-v5';
const ASSETS_TO_CACHE = [
  '/pages/index.html',
  '/pages/about.html',
  '/pages/products.html',
  '/pages/contact.html',
  '/pages/it-products.html',
  '/pages/automobiles.html',
  '/pages/clients.html',
  '/pages/why-choose-us.html',
  '/pages/machinery.html',
  '/pages/hardware.html',
  '/pages/medical-equipment.html',
  '/pages/furniture.html',
  '/css/style.css',
  '/css/animations.css',
  '/js/main.js',
  '/js/animations.js',
  '/js/chatbot.js',
  '/assets/images/MiCORP_Logo.png',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-144x144.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
    