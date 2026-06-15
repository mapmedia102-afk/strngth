const CACHE_VERSION = 'strngth-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// App shell
const PRECACHE_URLS = [
  '/strngth',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/apple-touch-icon.png',
];

// Small always-used image sets — pre-cached at install time so they're ready
// before the user opens any page that shows them.
const IMAGE_PRECACHE = [
  '/strngth/muscles/chest.png',      '/strngth/muscles/biceps.png',
  '/strngth/muscles/triceps.png',    '/strngth/muscles/back.png',
  '/strngth/muscles/shoulders.png',  '/strngth/muscles/abs.png',
  '/strngth/muscles/quadriceps.png', '/strngth/muscles/hamstrings.png',
  '/strngth/muscles/hips.png',       '/strngth/muscles/calves.png',
  '/strngth/muscles/forearms.png',   '/strngth/muscles/neck.png',
  '/strngth/badges/badge-wood.png',  '/strngth/badges/badge-bronze.png',
  '/strngth/badges/badge-silver.png','/strngth/badges/badge-gold.png',
  '/strngth/badges/badge-platinum.png', '/strngth/badges/badge-diamond.png',
  '/strngth/badges/badge-champion.png', '/strngth/badges/badge-titan.png',
  '/strngth/badges/badge-olympian.png',
  '/strngth/splits/abs.png',         '/strngth/splits/back.png',
  '/strngth/splits/biceps.png',      '/strngth/splits/calves.png',
  '/strngth/splits/chest.png',       '/strngth/splits/forearms.png',
  '/strngth/splits/hamstrings.png',  '/strngth/splits/quads.png',
  '/strngth/splits/shoulders.png',
];

// Exercise images — cached in the background after activate (one at a time,
// no blocking) so they're ready before the user opens the exercise library.
const EXERCISE_NAMES = [
  'ab-wheel','arnold-press','barbell-curl','barbell-row','bench-press',
  'cable-crunch','cable-curl','cable-fly','cable-pushdown','cable-row',
  'chest-dips','clamshell','close-bench','crunch','dead-hang','deadlift',
  'donkey-raise','face-pull','farmers-walk','front-raise','front-squat',
  'glute-bridge','good-morning','hammer-curl','hip-abduct','hip-thrust',
  'incline-curl','incline-db-press','lat-pulldown','lateral-raise',
  'leg-curl','leg-ext','leg-press','leg-raise','lunge','neck-ext',
  'neck-flex','ohp','overhead-ext','pec-deck','plank','preacher-curl',
  'pull-up','push-up','rdl','rev-wrist','seated-curl','seated-raise',
  'shrugs','single-row','skull-crusher','squat','standing-raise',
  'sumo-squat','tricep-dips','wrist-curl',
];

// Both dark and light variants
const EXERCISE_IMAGES = EXERCISE_NAMES.flatMap(n => [
  `/strngth/exercises/${n}-v2.png`,
  `/strngth/exercises/${n}-light-v2.png`,
]);

const BYPASS_PATTERNS = [
  /firestore\.googleapis\.com/,
  /firebase\.googleapis\.com/,
  /identitytoolkit\.googleapis\.com/,
  /securetoken\.googleapis\.com/,
  /firebaseinstallations\.googleapis\.com/,
  /googleapis\.com/,
  /chrome-extension:\/\//,
  /extensions\//,
  /__\/auth\//,
  /\/_next\/webpack-hmr/,
  /\/_next\/static\/webpack/,
];

function shouldBypass(url) {
  return BYPASS_PATTERNS.some(p => p.test(url));
}

function isStrngthImage(url) {
  return (
    url.includes('/strngth/exercises/') ||
    url.includes('/strngth/badges/') ||
    url.includes('/strngth/muscles/') ||
    url.includes('/strngth/splits/')
  );
}

// ── Install: pre-cache app shell + muscles/badges/splits ──────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(c => c.addAll(PRECACHE_URLS).catch(() => {})),
      caches.open(IMAGE_CACHE).then(c => c.addAll(IMAGE_PRECACHE).catch(() => {})),
    ]).then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches, then quietly warm the exercise image cache ─────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('strngth-') && k !== STATIC_CACHE && k !== RUNTIME_CACHE && k !== IMAGE_CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Background-warm exercise images one at a time so we don't spike the
        // network. Skips anything already in the cache (e.g. previously fetched).
        caches.open(IMAGE_CACHE).then(cache => {
          let i = 0;
          function next() {
            if (i >= EXERCISE_IMAGES.length) return;
            const url = EXERCISE_IMAGES[i++];
            cache.match(url).then(cached => {
              if (!cached) {
                fetch(url).then(res => { if (res.ok) cache.put(url, res.clone()); }).catch(() => {});
              }
              setTimeout(next, 50); // 50ms gap — gentle on the network
            });
          }
          next();
        });
      })
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = request.url;

  if (request.method !== 'GET') return;
  if (shouldBypass(url)) return;

  // Next.js static assets — cache-first (hash-named, immutable)
  if (url.includes('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Strngth images — cache-first, populate on miss
  if (isStrngthImage(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => new Response('', { status: 404 }));
        })
      )
    );
    return;
  }

  // Icons and manifest — cache-first
  if (url.includes('/icons/') || url.includes('/manifest.json') || url.includes('/apple-touch-icon')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(request).then(cached => cached || fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  // Navigation — network-first, fall back to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) caches.open(RUNTIME_CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match('/strngth'))
        )
    );
    return;
  }
});
