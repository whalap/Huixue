/* E听说练习 Service Worker：缓存应用外壳，支持离线。
   页面（html / 导航）走「网络优先」：修完 bug 重新发布后，iPad 不会继续拿旧缓存。
   改版本号会清掉旧缓存，避免旧代码一直生效。 */
const CACHE = 'eershuo-v2';
const ASSETS = [
  './',
  './index.html',
  './data.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  // 页面与 html：网络优先，失败才回退缓存（保证改动能立刻生效）
  if (req.mode === 'navigate' || /\.html?$|\/$/.test(url.pathname)) {
    e.respondWith(
      fetch(req).then(function (r) {
        if (r && r.status === 200) {
          var cp = r.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); });
        }
        return r;
      }).catch(function () {
        return caches.match(req).then(function (m) { return m || caches.match('./index.html'); });
      })
    );
    return;
  }

  // 其余静态资源：缓存优先 + 后台刷新
  e.respondWith(
    caches.match(req).then(function (cached) {
      var net = fetch(req).then(function (r) {
        if (r && r.status === 200) {
          var cp = r.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); });
        }
        return r;
      }).catch(function () { return cached; });
      return cached || net;
    })
  );
});
