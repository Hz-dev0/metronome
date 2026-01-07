const CACHE_NAME = 'running-metronome-v3'; // 升級版本號以強制更新
const ASSETS = [
  './',
  './index.html',
  'https://cdn-icons-png.flaticon.com/512/3843/3843034.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // 強制跳過等待，立即生效
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
});

self.addEventListener('fetch', (e) => {
  // 對於 Cloudinary 這種外部網址，我們不強行攔截快取，讓它走一般網路請求
  if (e.request.url.includes('cloudinary.com')) {
    return; 
  }
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
