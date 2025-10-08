const CACHE_NAME = 'orange-store-v2';
const urlsToCache = [
  './',
  './index.html',
  './accesorios.html',
  './repuestos.html',
  './login.html',
  './logo.png',
  './logopeq.png',
  './fondo1.jpg',
  './fondo2.jpg',
  './fondo3.jpg',
  './fondo4.jpg',
  './precios.json',
  './repuestos.json',
  './manifest.json'
];

// Instalar y cachear
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar y limpiar viejos caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('./index.html'))
  );
});
