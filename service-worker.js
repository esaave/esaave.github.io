const CACHE_NAME = 'orange-store-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/accesorios.html',
  '/repuestos.html',
  '/login.html',
  '/logo.png',
  '/logopeq.png',
  '/fondo1.jpg',
  '/fondo2.jpg',
  '/fondo3.jpg',
  '/fondo4.jpg',
  '/precios.json',
  '/repuestos.json'
];

// Instalar Service Worker y cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Servir desde cache o red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
