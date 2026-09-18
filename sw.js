const CACHE_NAME = 'nenapp-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './ciudadano.html',
  './chofer.html',
  './css/styles.css',
  './js/config.js',
  './js/script-ciudadano.js',
  './js/script-chofer.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Para las peticiones a la API (Google Sheets), siempre ir a la red
  if (event.request.url.includes("script.google.com")) {
      return; 
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso cacheado si existe, sino lo descarga
        return response || fetch(event.request);
      })
  );
});
