const CACHE_NAME = 'actividades-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/icons/icon-16x16.png',
  '/icons/icon-32x32.png',
  // ... otros recursos
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación del Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Si encontramos la respuesta en cache, la devolvemos
        if (response) {
          return response;
        }
        
        // Si no está en cache, hacemos la petición a la red
        return fetch(event.request);
      }
    )
  );
});

// Activar el Service Worker y limpiar cachés antiguas
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});