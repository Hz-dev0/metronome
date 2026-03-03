const CACHE_NAME = 'running-metronome-v2026.03.03';
const MUSIC_CACHE_NAME = 'running-metronome-music'; // 獨立、永不刪除
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app.png',
];
const MUSIC_URL = 'https://res.cloudinary.com/dvbwcjpdu/video/upload/v1767812963/music_1_xih1u2.mp3';

// 1. 安裝階段
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在預載新版本資源...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. 激活階段：只清理舊介面快取，保留音樂快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== MUSIC_CACHE_NAME) {
            console.log('清理舊快取:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
      });
    })
  );
});

// 3. 抓取階段
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // 音樂：Cache First，有就用快取，沒有才抓網路並存起來
  if (url === MUSIC_URL) {
    e.respondWith(
      caches.open(MUSIC_CACHE_NAME).then(cache =>
        cache.match(e.request).then(res => {
          if (res) return res;
          return fetch(e.request).then(response => {
            cache.put(e.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // 介面資源：Cache First
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request).catch(err => {
        console.error('Fetch failed:', err);
      });
    })
  );
});
