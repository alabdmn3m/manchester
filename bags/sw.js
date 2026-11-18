// يحفظ صفحة الشنط على الجهاز لتعمل داخل المولات إن ضعفت الشبكة
const C = 'bags-v2';
const FILES = ['./', './index.html', './og.jpg', './img/e902248eed96.webp', './img/9b9194051835.webp', './img/8a04f5139f53.webp', './img/ncs.webp', './img/e5035483f560.webp', './img/a8a27d8166d3.webp', './img/3dad8a0ce8b9.webp'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bags-') && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin || !u.pathname.includes('/bags/')) return;
  if (r.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html')) {
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put('./index.html', cp)); } return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => m || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })));
});
