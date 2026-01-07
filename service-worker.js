const CACHE_NAME = 'running-metronome-v1';
const ASSETS = [
  './',
  './index.html',
  './music.mp3',
  'https://cdn-icons-png.flaticon.com/512/3843/3843034.png'
];

// 安裝並快取資源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 攔截請求，優先從快取抓東西
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
