// Service Worker for Beauty Clinic PWA
// Strategy: cache-first for static assets, network-first for HTML, with offline fallback.

const CACHE_NAME = "beauty-clinic-v1";
const OFFLINE_URL = "/offline.html";
const STATIC_ASSETS = [
  "/",
  "/ar",
  "/en",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Skip Next.js internals and API
  if (url.pathname.startsWith("/_next/webpack") || url.pathname.startsWith("/api/auth")) return;

  // For navigation requests — network-first with offline fallback
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // For static assets (CSS/JS/images/fonts) — cache-first
  if (req.destination === "style" || req.destination === "script" || req.destination === "font" || req.destination === "image") {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Default — try network, fallback to cache
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((r) => r || Response.error()))
  );
});
