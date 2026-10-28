// O Farol do Corvo: guarda o jogo para abrir sem rede (imagens e sons ficam em cache à medida que são usados).
const CACHE = "farol-v1";
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "index.html", "en.html", "manifest.json"])).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin && !u.hostname.endsWith("fonts.googleapis.com") && !u.hostname.endsWith("fonts.gstatic.com")) return;
  const media = /\.(webp|png|mp3)$/.test(u.pathname);
  if (media) { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return res; }))); return; }
  e.respondWith(fetch(e.request).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return res; }).catch(() => caches.match(e.request)));
});
