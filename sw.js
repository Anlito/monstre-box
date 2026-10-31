/* Service de l'appli : garde les fichiers en mémoire pour marcher sans réseau.
   Réseau d'abord (pour recevoir les mises à jour), mémoire si pas de réseau. */
const CACHE = "monstre-box-v4";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "icone-192.png", "icone-512.png", "icone-maskable-512.png", "apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((rep) => { const copie = rep.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); return rep; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
