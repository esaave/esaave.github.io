// ======================================================
// 🌐 Orange Store PWA - Service Worker (versión v3.5.2)
// ======================================================

const CACHE_NAME = 'orange-store-v3.5.2';
const urlsToCache = [
  '/',                     
  '/index.html',           
  '/login.html',
  '/accesorios.html',
  '/repuestos.html',
  '/logo.png',
  '/logopeq.png',
  '/fondo1.jpg',
  '/fondo2.jpg',
  '/fondo3.jpg',
  '/fondo4.jpg',
  '/repuestos.json',
  '/precios.json',
  '/offline.html',
  '/comunicado.json',
  '/manifest.json'
  '/r04.html'
  '/s04.html'
  '/b15.html'
  '/administracion.html'
  // Añade aquí tus archivos JS o CSS si existen
];

// ======================================================
// 🧱 INSTALACIÓN: Cachea todos los recursos necesarios
// ======================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // toma control inmediato
  );
});

// ======================================================
// ♻️ ACTIVACIÓN: Limpia versiones viejas de caché
// ======================================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('🧹 Eliminando caché vieja:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim(); // controla todas las páginas abiertas
});

// ======================================================
// ⚡ FETCH: Estrategia Cache-First con fallback a red
// ======================================================
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo procesamos peticiones del mismo dominio
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request)
      .then(response => {
        // 1️⃣ Devuelve desde caché si existe
        if (response) {
          return response;
        }

        // 2️⃣ Si no, busca en la red y guarda en caché dinámico
        return fetch(request)
          .then(res => {
            if (!res || res.status !== 200 || res.type !== 'basic') {
              return res;
            }

            const responseToCache = res.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });

            return res;
          })
          .catch(() => {
            // 3️⃣ Fallback offline: devolver index.html si es navegación
            if (request.mode === 'navigate' || 
                (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
              return caches.match('/index.html');
            }

            // Para otros recursos, devolvemos respuesta vacía
            return new Response('Offline', { status: 503, statusText: 'Sin conexión' });
          });
      })
  );
});
