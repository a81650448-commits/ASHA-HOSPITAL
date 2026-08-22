const CACHE = 'sewa-hospital-v1';
const APP_SHELL = [
  '/ASHA-HOSPITAL/',
  '/ASHA-HOSPITAL/index.html',
  '/ASHA-HOSPITAL/manifest.webmanifest',
  '/ASHA-HOSPITAL/icons/icon-192.png',
  '/ASHA-HOSPITAL/icons/icon-512.png',
  '/ASHA-HOSPITAL/icons/icon-512-maskable.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('/ASHA-HOSPITAL/')))
  );
});
