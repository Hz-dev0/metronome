const CACHE_NAME = 'running-metronome-v2026.01.6'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app.png',
  'https://res.cloudinary.com/dvbwcjpdu/video/upload/v1767812963/music_1_xih1u2.mp3'
];

// 1. 安裝階段
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. 激活階段
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('清理舊快取:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 抓取階段
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
