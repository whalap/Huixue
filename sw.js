/* 慧学学习网络 · 全站 Service Worker
   统一接管整个站点（含 E听说 / 点读 / A1–B1 / 单元习题），支持离线 + 可“安装”到桌面/iPad 主屏。
   策略：安装时预缓存外壳；运行时按需缓存所有访问过的页面与资源（含课文 mp3），离线即可用。 */
const CACHE = 'huixue-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './pwa-register.js',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './E%E8%AF%B4%E5%90%AC%E7%BB%83%E4%B9%A0/index.html',
  './01_%E8%AF%BE%E6%9C%AC%E5%90%8C%E6%AD%A5_%E6%B2%AA%E6%95%99%E7%89%88%E4%B8%83%E4%B8%8A/%E7%82%B9%E8%AF%BB%E5%AD%A6%E4%B9%A0%E5%8C%85/Unit0_%E6%80%BB%E7%9B%AE%E5%BD%95_%E7%82%B9%E8%AF%BB%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (u) {
        return c.add(u).catch(function () { /* 单个缺失不阻断安装 */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 不处理跨域

  // 页面导航：网络优先，失败回退缓存 / 首页
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (r) { cachePut(req, r.clone()); return r; })
        .catch(function () {
          return caches.match(req).then(function (m) { return m || caches.match('./index.html'); });
        })
    );
    return;
  }

  // 静态资源：缓存优先 + 后台刷新（stale-while-revalidate）
  e.respondWith(
    caches.match(req).then(function (cached) {
      var net = fetch(req).then(function (r) {
        if (r && r.status === 200) cachePut(req, r.clone());
        return r;
      }).catch(function () { return cached; });
      return cached ? withRange(req, cached).catch(function () { return net; }) : net;
    })
  );
});

function cachePut(req, resp) {
  if (!resp || resp.status !== 200) return;
  caches.open(CACHE).then(function (c) { c.put(req, resp).catch(function () {}); });
}

/* 支持音频 Range 请求（离线时断点续播 / 拖动进度） */
function withRange(req, resp) {
  var range = req.headers.get('Range');
  if (!range) return Promise.resolve(resp);
  var m = /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) return Promise.resolve(resp);
  return resp.arrayBuffer().then(function (buf) {
    var total = buf.byteLength;
    var start = m[1] ? parseInt(m[1], 10) : 0;
    var end = m[2] ? parseInt(m[2], 10) : total - 1;
    if (start > total) start = 0;
    if (end >= total) end = total - 1;
    var slice = buf.slice(start, end + 1);
    var headers = new Headers();
    resp.headers.forEach(function (v, k) { headers.set(k, v); });
    headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + total);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Length', String(slice.byteLength));
    return new Response(slice, { status: 206, statusText: 'Partial Content', headers: headers });
  });
}
