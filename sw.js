const CACHE_NAME = 'micorp-cache-v12'; // Incremented version for update
const urlsToCache = [
  // HTML Pages are relative to the service worker's location (root)
  'pages/index.html',
  'pages/about.html',
  'pages/products.html',
  'pages/it-products.html',
  'pages/automobiles.html',
  'pages/food-stuff.html', // New Page
  'pages/why-choose-us.html',
  'pages/clients.html',
  'pages/contact.html',
  
  // CSS and JS files
  'css/style.css',
  'css/animations.css',
  'js/main.js',
  'js/animations.js',
  'js/chatbot.js',
  'manifest.json',

  // Core Logos & PWA Icons
  'assets/images/MiCORP_Logo.png',
  'assets/images/MiCORP_Logo.jpg',
  'assets/images/icons/icon-144x144.png',
  'assets/images/icons/icon-192x192.png',
  'assets/images/icons/icon-512x512.png',
  
  // Hero Images
  'assets/images/hero/Homepage_Desktop.jpg',
  'assets/images/hero/Homepage_Mobile.jpg',
  'assets/images/hero/Homepage_Tablet.jpg',
  'assets/images/hero/Products_Hero.jpg',
  'assets/images/hero/why-us.jpg',
  'assets/images/hero/Our Client.jpg',
  'assets/images/hero/get-touch.jpg',

  // General Page Images
  'assets/images/About_us_office.jpg',
  'assets/images/Our-office.jpg',
  'assets/images/Electronics_Img.jpg',
  'assets/images/IT_Products_Img.jpg',
  'assets/images/Automobiles.jpg',
  'assets/images/Commercial_images.jpg',
  'assets/images/Hardware_solution.jpg',
  'assets/images/food-stuff/Food_Stuff_Category.jpg', // New Image

  // Client Logos
  'assets/images/clients/ABS_logo.png',
  'assets/images/clients/UAC_Logo.jpg',
  'assets/images/clients/Bizpro_logo.png',

  // Brand Logos (.webp format)
  'assets/images/Logos/Defy.webp',
  'assets/images/Logos/Dell.webp',
  'assets/images/Logos/Ekotek.webp',
  'assets/images/Logos/Hikvision.webp',
  'assets/images/Logos/HP.webp',
  'assets/images/Logos/Icestream.webp',
  'assets/images/Logos/Lenevo.webp',
  'assets/images/Logos/Luminous.webp',
  'assets/images/Logos/Philips.webp',
  'assets/images/Logos/Samsung.webp',
  'assets/images/Logos/Sony.webp',
  'assets/images/Logos/TCL.webp',
  'assets/images/Logos/Westpool.webp',

  // Electronics Images
  'assets/images/electronics/mobile.webp',
  'assets/images/electronics/Smart_home.jpg',
  'assets/images/electronics/Electronics.jpg',
  'assets/images/electronics/Wearable.jpg',
  
  // IT Product Images
  'assets/images/it-products/IT_Products_Hero.jpg',
  'assets/images/it-products/Enterprise routers.jpg',
  'assets/images/it-products/network-switch.jpg',
  'assets/images/it-products/wireless solutions.jpg',
  'assets/images/it-products/Enterprise servers.jpg',
  'assets/images/it-products/storage systems.jpg',
  'assets/images/it-products/Backup and recovery.jpg',
  'assets/images/it-products/Next-Gen Firewalls.webp',
  'assets/images/it-products/Endpoint Security.webp',
  'assets/images/it-products/Enterprise Software.jpg',

  // Automobile Images
  'assets/images/Automotive Solutions/Automobiles_Hero.jpg',
  'assets/images/Automotive Solutions/premium-sedans.jpg',
  'assets/images/Automotive Solutions/Luxury SUVs.jpeg',
  'assets/images/Automotive Solutions/Sports Cars.webp',
  'assets/images/Automotive Solutions/Pickup Trucks.jpg',
  'assets/images/Automotive Solutions/Delivery Vans.jpg',
  'assets/images/Automotive Solutions/Heavy Trucks.webp',
  
  // Food Stuff Images (New)
  'assets/images/food-stuff/food-stuff_hero.jpg',
  'assets/images/food-stuff/rice.jpg',
  'assets/images/food-stuff/sugar.jpg',
  'assets/images/food-stuff/oil.jpg',

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
        const cachePromises = urlsToCache.map(urlToCache => {
            let request = new Request(urlToCache, {cache: 'reload'});
            return fetch(request)
              .then(response => {
                if (!response.ok) {
                  throw new TypeError(`Failed to fetch ${urlToCache}: status ${response.status}`);
                }
                return cache.put(urlToCache, response);
              })
              .catch(err => {
                console.warn(`Could not cache ${urlToCache}:`, err.message);
              });
        });
        return Promise.all(cachePromises);
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

  // Ignore non-GET requests and specific external domains.
  if (request.method !== 'GET' || request.url.includes('formspree.io') || request.url.startsWith('chrome-extension://')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Navigation strategy: Network first, falling back to cache, then to a fallback page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // If network fails, try the cache for the requested page.
        return caches.match(request).then(cachedResponse => {
          // If the page is in the cache, serve it.
          // Otherwise, serve the main index.html as a final fallback.
          return cachedResponse || caches.match('pages/index.html');
        });
      })
    );
    return;
  }

  // Cache-first strategy for all other assets (CSS, JS, images, fonts).
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // If the asset is in the cache, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the asset is not in the cache, fetch it from the network.
        return fetch(request).then(networkResponse => {
          // Check if we received a valid response.
          if (networkResponse && networkResponse.status === 200) {
            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = networkResponse.clone();
            // Open the cache and add the new asset.
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
  );
});