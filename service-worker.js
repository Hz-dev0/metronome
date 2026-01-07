const CACHE_NAME = 'running-metronome-v1';
const MUSIC_URL = 'https://res.cloudinary.com/dvbwcjpdu/video/upload/v1767812963/music_1_xih1u2.mp3';

const ASSETS = [
  './',
  './index.html',
  'https://cdn-icons-png.flaticon.com/512/3843/3843034.png',
  MUSIC_URL
];

// 安裝並快取檔案
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 攔截請求，優先從快取讀取（實現離線功能）
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
