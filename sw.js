const CACHE_NAME = 'micorp-cache-v17'; // Incremented version to force update
const urlsToCache = [
  // HTML Page Shells (FIXED: Absolute paths from root, no /pages/ directory)
  '/index.html',
  '/about.html',
  '/products.html',
  '/it-products.html',
  '/automobiles.html',
  '/food-stuff.html',
  '/why-choose-us.html',
  '/clients.html',
  '/contact.html',
  
  // CSS and JS files (Absolute paths from root)
  '/css/style.css?v=1.8',
  '/css/animations.css?v=1.8',
  '/js/main.js?v=1.8',
  '/js/animations.js?v=1.8',
  '/js/chatbot.js?v=1.8',
  '/js/router.js?v=1.8',
  '/manifest.json',

  // Core Logos & PWA Icons (Absolute paths from root)
  '/assets/images/MiCORP_Logo.png',
  '/assets/images/MiCORP_Logo.jpg',
  '/assets/images/icons/icon-144x144.png',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-512x512.png',
  
  // Hero Images (Absolute paths from root)
  '/assets/images/hero/Homepage_Desktop.jpg',
  '/assets/images/hero/Homepage_Mobile.jpg',
  '/assets/images/hero/Homepage_Tablet.jpg',
  '/assets/images/hero/IT_Products.jpg',
  '/assets/images/hero/why-us.jpg',
  '/assets/images/hero/Our Client.jpg',
  '/assets/images/hero/get-touch.jpg',

  // General Page Images (Absolute paths from root)
  '/assets/images/About_us_office.jpg',
  '/assets/images/Our-office.jpg',
  '/assets/images/Electronics_Img.jpg',
  '/assets/images/IT_Products_Img.jpg',
  '/assets/images/Automobiles.jpg',
  '/assets/images/Commercial_images.jpg',
  '/assets/images/Hardware_solution.jpg',
  
  // Client Logos (Absolute paths from root)
  '/assets/images/clients/ABS_logo.png',
  '/assets/images/clients/UAC_Logo.jpg',
  '/assets/images/clients/Bizpro_logo.png',

  // Brand Logos (Absolute paths from root)
  '/assets/images/Logos/Sony.webp',
  '/assets/images/Logos/Samsung.webp',
  '/assets/images/Logos/HP.webp',
  '/assets/images/Logos/Dell.webp',
  '/assets/images/Logos/Lenevo.webp',
  '/assets/images/Logos/TCL.webp',
  '/assets/images/Logos/Philips.webp',
  '/assets/images/Logos/Hikvision.webp',
  '/assets/images/Logos/Luminous.webp',
  '/assets/images/Logos/Defy.webp',
  '/assets/images/Logos/Westpool.webp',
  '/assets/images/Logos/Icestream.webp',
  '/assets/images/Logos/Ekotek.webp',

  // Electronics Images (Absolute paths from root)
  '/assets/images/electronics/mobile.webp',
  '/assets/images/electronics/Smart_home.jpg',
  '/assets/images/electronics/Electronics.jpg',
  '/assets/images/electronics/Wearable.jpg',
  
  // IT Product Images (Absolute paths from root)
  '/assets/images/it-products/IT_Products_Hero.jpg',
  '/assets/images/it-products/Enterprise routers.jpg',
  '/assets/images/it-products/network-switch.jpg',
  '/assets/images/it-products/wireless solutions.jpg',
  '/assets/images/it-products/Enterprise servers.jpg',
  '/assets/images/it-products/storage systems.jpg',
  '/assets/images/it-products/Backup and recovery.jpg',

  // Automobile Images (Absolute paths from root)
  '/assets/images/Automotive Solutions/Automobiles_Hero.jpg',
  '/assets/images/Automotive Solutions/premium-sedans.jpg',
  '/assets/images/Automotive Solutions/Luxury SUVs.jpeg',
  '/assets/images/Automotive Solutions/Sports Cars.webp',
  '/assets/images/Automotive Solutions/Pickup Trucks.jpg',
  '/assets/images/Automotive Solutions/Delivery Vans.jpg',
  '/assets/images/Automotive Solutions/Heavy Trucks.webp',
  
  // Food Stuff Images (Absolute paths from root)
  '/assets/images/food-stuff/Food_Stuff_Category.webp',
  '/assets/images/food-stuff/Rice.webp',
  '/assets/images/food-stuff/sugar.webp',
  '/assets/images/food-stuff/oil.webp',

  // External resources
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching core assets for version:', CACHE_NAME);
        // Use { cache: 'reload' } for external resources to ensure they are fresh on install
        const requests = urlsToCache.map(url => {
          if (url.startsWith('http')) {
            return new Request(url, { cache: 'reload' });
          }
          return url;
        });
        return cache.addAll(requests);
      })
      .catch(err => {
        console.error('Cache open/addAll failed during install:', err);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) 
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignore non-GET requests and requests to external services like Formspree
  if (request.method !== 'GET' || request.url.includes('formspree.io') || request.url.startsWith('chrome-extension://')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Network-first for HTML navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // FIXED: If network fails, serve the main shell from cache (correct path)
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Cache-first for all other static assets
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // If we have a cached response, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network, cache it, and return the response
        return fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
  );
});