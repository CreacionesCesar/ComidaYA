// Service Worker para notificaciones push (Firebase Cloud Messaging).
// Este archivo tiene que estar en la RAÍZ del sitio, junto a index.html.

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAcMw2SLHZoCs_QWbnbJgiplPdyVif0DAw",
  authDomain: "comidaya-d53f5.firebaseapp.com",
  projectId: "comidaya-d53f5",
  storageBucket: "comidaya-d53f5.firebasestorage.app",
  messagingSenderId: "354124817879",
  appId: "1:354124817879:web:1ca83247d403e19ce7d792"
});

const messaging = firebase.messaging();

// Se dispara cuando llega un push y la app NO está abierta/visible en primer plano.
messaging.onBackgroundMessage((payload) => {
  const titulo = (payload.notification && payload.notification.title) || "Nuevo pedido";
  const opciones = {
    body: (payload.notification && payload.notification.body) || "Tenés un pedido nuevo",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: payload.data || {},
    tag: "pedido-nuevo",
    renotify: true,
    vibrate: [200, 100, 200]
  };
  self.registration.showNotification(titulo, opciones);
});

// Si tocan la notificación, abre (o enfoca) la app en la pantalla de admin.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("#admin") && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./#admin");
    })
  );
});
