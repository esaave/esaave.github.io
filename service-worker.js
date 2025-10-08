const CACHE_NAME = 'orange-store-v3';
const urlsToCache = [
  '/',                     // La URL raíz de tu PWA (ej: https://user.github.io/repo/)
  '/index.html',           // Archivo principal
  '/login.html',
  '/accesorios.html',
  '/repuestos.html',
  '/logo.png',
  '/logopeq.png',
  '/fondo1.jpg',
  '/fondo2.jpg',
  '/fondo3.jpg',
  '/fondo4.jpg',
  '/precios.json'
  // IMPORTANTE: Si tienes archivos CSS o JS, inclúyelos aquí también, por ejemplo:
  // '/style.css',
  // '/app.js'
];

// Instalar y cachear recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activar y eliminar versiones viejas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !cacheWhitelist.includes(k)).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// ----------------------------------------------------
// RESPONDER DESDE CACHÉ O RED (Estrategia Cache-First con Fallback)
// ----------------------------------------------------
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo aplica la lógica a los recursos de tu mismo origen.
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request).then(response => {
      // 1. Cache-First: Devuelve la respuesta si está en la caché
      if (response) {
        return response;
      }

      // 2. Si no está en caché, va a la red
      return fetch(request)
        .then(res => {
          // Verifica si la respuesta es válida para cachear
          if (!res || res.status !== 200 || res.type !== 'basic') {
            return res;
          }

          // Cachea el recurso (solo si viene de la red)
          const responseToCache = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          
          return res;
        })
        .catch(err => {
          // 3. Fallo de red: Si es una solicitud de navegación (HTML), devuelve la página principal
          if (request.mode === 'navigate' || 
              (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
            // Devuelve la página de inicio cacheada
            return caches.match('/index.html');
          }
          
          // Para otros recursos (imágenes, json), devuelve una respuesta de error para evitar fallos.
          return new Response(null, { status: 503, statusText: 'Offline' });
        });
    })
  );
});
