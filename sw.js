/* Service worker: l'app si apre anche senza connessione (palestre senza campo). */
const CACHE = 'aelis-v9';
const CORE = ['./', 'index.html', 'app.js', 'cloud.js', 'config.js', 'privacy.html', 'manifest.webmanifest', 'icons/favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // database e accesso: mai in cache (dati personali)
  if (url.hostname.endsWith('supabase.co')) return;
  if (url.origin === location.origin) {
    // pagina e file dell'app: prima la rete, poi la copia salvata.
    // Gli indirizzi con parametri (link d'invito, reset password) non vengono salvati.
    const key = url.search ? 'index.html' : req;
    e.respondWith(fetch(req).then(r => { if (r.ok && !url.search) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; })
      .catch(() => caches.match(key).then(r => r || caches.match('index.html'))));
    return;
  }
  // caratteri tipografici e libreria di accesso (versione fissa): prima la copia salvata
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; })));
  }
});

// notifiche push: le manda il server (funzione "push" su Supabase)
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'AELIS Training', {
    body: d.body || '', tag: d.tag, renotify: !!d.tag,
    icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
    data: { url: d.url || '' }
  }));
});
// tocco sulla notifica: apre l'app nel punto giusto (chat, agenda, scheda...)
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const q = (e.notification.data && e.notification.data.url) || '';
  const target = new URL('./' + q, self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) { if ('focus' in w) { w.postMessage({ type: 'open', url: q }); return w.focus(); } }
    return self.clients.openWindow(target);
  }));
});
