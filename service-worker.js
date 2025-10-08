const CACHE_NAME = 'orange-store-v3';
const urlsToCache = [
  '/orangestore/',
  '/orangestore/index.html',
  '/orangestore/login.html',
  '/orangestore/accesorios.html',
  '/orangestore/repuestos.html',
  '/orangestore/logo.png',
  '/orangestore/logopeq.png',
  '/orangestore/fondo1.jpg',
  '/orangestore/fondo2.jpg',
  '/orangestore/fondo3.jpg',
  '/orangestore/fondo4.jpg',
  '/orangestore/precios.json'
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
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Responder desde caché o red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      }).catch(() => caches.match('/orangestore/index.html'))
    )
  );
});

