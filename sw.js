// Service worker mínimo: solo guarda el "cascarón" de la app para que abra
// aunque no haya conexión. El menú, los pedidos y todo lo demás siguen
// viajando siempre en vivo contra Firebase, esto no los cachea.
const CACHE_NAME = "comidaya-shell-v1";
const ARCHIVOS_APP = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS_APP))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(nombres =>
      Promise.all(nombres.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Solo intervenimos la navegación principal (abrir la página).
  // Todo lo demás (Firebase, fuentes, etc.) va directo a la red, sin tocar.
  if(event.request.mode === "navigate"){
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
  }
});
