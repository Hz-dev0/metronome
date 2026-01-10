// 每次更新版本請修改此處的日期標籤
const CACHE_NAME = 'running-metronome-v2026.01.10'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app.png',
  'https://res.cloudinary.com/dvbwcjpdu/video/upload/v1767812963/music_1_xih1u2.mp3'
];

// 1. 安裝階段：強制跳過等待
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在預載新版本資源...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. 激活階段：清理所有舊版快取
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

// 3. 抓取階段：優化策略
self.addEventListener('fetch', (e) => {
  // 對於音樂檔案，建議採用 Network First 策略，或直接走快取
  // 這裡維持 Cache First 但加入防呆，確保沒快取時能抓到網路資源
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      
      return fetch(e.request).then(response => {
        // 如果是有效回應且是同源資源，考慮存入快取（可選）
        return response;
      }).catch(err => {
        console.error('Fetch failed:', err);
      });
    })
  );
});
