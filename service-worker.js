const CACHE_NAME = 'radio-smg-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './icon512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Para los streams de radio, no cachear (solo el HTML y assets)
  if (event.request.url.includes('.aac') ||
      event.request.url.includes('.mp3') ||
      event.request.url.includes('stream')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
