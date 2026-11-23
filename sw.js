// ゲームポータル (game list): network first, cache as fallback (offline). Only the list's own files —
// each game (/kropki/, /dungeon-chain/ …) has its own service worker.
const C = 'asobiba-v24', OWN = ['/', '/index.html', '/manifest.json', '/manifest.json?v=8', '/icon-192-v4.png', '/icon-512-v4.png', '/apple-touch-icon-v4.png', '/favicon-v4.png', '/icon-maskable-512-v5.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(OWN)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('asobiba-') && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !OWN.includes(u.pathname)) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
