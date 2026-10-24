const VERSION = "my-portfolio-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/offline.html";
const MAX_CACHED_PAGES = 30;
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/en",
  "/ar",
  "/pictures/favicon.ico",
  "/pictures/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("my-portfolio-") &&
                key !== STATIC_CACHE &&
                key !== PAGE_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheable(response) {
  const cacheControl = response.headers.get("Cache-Control") || "";
  return (
    response.status === 200 &&
    response.type === "basic" &&
    !/\b(private|no-store)\b/i.test(cacheControl)
  );
}

async function cacheResponse(cacheName, request, response) {
  if (isCacheable(response)) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function trimPageCache(cache) {
  const keys = await cache.keys();
  const excess = keys.length - MAX_CACHED_PAGES;
  if (excess > 0) {
    await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
  }
}

async function handleNavigation(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
      await trimPageCache(cache);
    }
    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (await caches.match(OFFLINE_URL)) ||
      Response.error()
    );
  }
}

async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const isHashedNextAsset = new URL(request.url).pathname.startsWith(
    "/_next/static/",
  );
  const cached = await cache.match(request);

  if (cached && isHashedNextAsset) return cached;

  try {
    const response = await fetch(request);
    return await cacheResponse(STATIC_CACHE, request, response);
  } catch {
    return cached || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:css|js|woff2?|ttf|otf|png|jpe?g|webp|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(handleStaticAsset(request));
  }
});
