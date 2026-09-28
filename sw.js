// SEWA HOSPITAL emergency PWA cleanup worker
// This version removes the old service worker/cache so the site always loads fresh from GitHub Pages.
const OLD_PREFIX = 'sewa-hospital-';
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(OLD_PREFIX)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({type:'window', includeUncontrolled:true}))
      .then(clients => clients.forEach(client => client.navigate(client.url + (client.url.includes('?') ? '&' : '?') + 'sewa-reset=' + Date.now())))
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request));
});
