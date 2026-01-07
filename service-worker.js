const CACHE_NAME = 'running-metronome-v4'; // 每次更新 HTML 後請手動改這個編號
const ASSETS = [
  './',
  './index.html',
  'https://cdn-icons-png.flaticon.com/512/3843/3843034.png'
];

// 1. 安裝階段：強制跳過等待，讓新的 SW 立即生效
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. 激活階段：刪除所有不是當前 CACHE_NAME 的舊快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('正在清理舊快取:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // 讓新 SW 立即接管頁面
  );
});

// 3. 抓取階段
self.addEventListener('fetch', (e) => {
  // 排除外部音樂網址，不進行快取攔截，確保抓到最新的
  if (e.request.url.includes('cloudinary.com')) return;

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
