/* ============================================================
   慧学学习网络 · 统一顶部返回导航（自动注入）
   ------------------------------------------------------------
   用法：在 </head> 前加一行
     <script src="../site-nav.js" defer></script>
   （根目录页面用 src="site-nav.js"）

   做两件事：
   1) 页面顶部注入「← 返回本层主页」+ 右上「🏠 网站总页」两个链接
      —— 取代原来每页底部那一大排跨线链接；
   2) 自动隐藏旧的底部「练完了？换一条线继续」杂链接块。
   层级判断按路径自动推导，无需每页配置。
   ============================================================ */
(function () {
  'use strict';
  if (window.__HX_NAV__) return;
  window.__HX_NAV__ = 1;

  function dec(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }
  var P = dec(location.pathname).replace(/\\/g, '/');
  var FILE = P.substring(P.lastIndexOf('/') + 1) || 'index.html';
  var DIR = P.substring(0, P.lastIndexOf('/') + 1);

  /* ---------- 1. 仓库根相对前缀 ---------- */
  var up = '';
  if (/\/A1-B1网页\/$/.test(DIR))               up = '../';
  else if (/\/E听说练习\/$/.test(DIR))           up = '../';
  else if (/\/大脑远征队\/$/.test(DIR))          up = '../';
  else if (/\/点读学习包\/$/.test(DIR))          up = '../../';
  else if (/\/单元习题与测试\/$/.test(DIR))      up = '../../';
  else if (/\/01_课本同步_沪教版七上\/$/.test(DIR)) up = '../';
  else                                          up = '';

  var SITE = up + 'index.html';
  var ARCHIVE = up + '学习档案.html';
  var AT_ROOT = (up === '' && FILE === 'index.html');
  var AT_ARCHIVE = /学习档案\.html$/.test(FILE);

  /* ---------- 2. 本层次主页 ---------- */
  var local = null;

  if (/\/A1-B1网页\/$/.test(DIR)) {
    if (FILE === 'index.html') {
      local = null;                                  /* 跟读四级总站：本身就是本层 */
    } else if (/主页\.html$/.test(FILE)) {
      local = { label: '跟读四级总站', href: 'index.html' };
    } else {
      var m = FILE.match(/^(Pre-A1|A1|A2|B1)(\s|$)/);
      if (m && /Unit\d+/.test(FILE)) {
        local = { label: m[1] + ' 主页', href: m[1] + ' 主页.html' };
      } else {
        local = { label: '跟读四级总站', href: 'index.html' };
      }
    }
  } else if (/\/E听说练习\/$/.test(DIR)) {
    local = { label: '网站总页', href: SITE };
  } else if (/\/点读学习包\/$/.test(DIR)) {
    local = /^Unit0_总目录/.test(FILE)
      ? { label: '网站总页', href: SITE }
      : { label: '点读学习总目录', href: 'Unit0_总目录_点读学习中心.html' };
  } else if (/\/单元习题与测试\/$/.test(DIR)) {
    local = { label: '点读学习总目录', href: '../点读学习包/Unit0_总目录_点读学习中心.html' };
  } else if (/\/大脑远征队\/$/.test(DIR)) {
    if (/^Ch0-大脑营地/.test(FILE))       local = { label: '网站总页', href: SITE };
    else if (/^Ch0-通关地图/.test(FILE))  local = { label: '远征大本营', href: 'Ch0-大脑营地.html' };
    else                                  local = { label: '通关地图', href: 'Ch0-通关地图.html' };
  } else {
    local = null;                                    /* 仓库根：不显示返回 */
  }

  /* ---------- 3. 样式 ---------- */
  var CSS = [
    '#hx-nav-bar{display:flex;align-items:center;gap:10px;padding:7px 14px;',
    'background:#14110C;border-bottom:1px solid rgba(212,175,55,.35);',
    'font-family:-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;',
    'font-size:12.5px;line-height:1.45;flex-wrap:wrap;position:relative;z-index:9000}',
    '#hx-nav-bar a{color:#E8C969;text-decoration:none;border:1px solid rgba(212,175,55,.42);',
    'border-radius:999px;padding:4px 12px;font-weight:700;white-space:nowrap;',
    'transition:background .12s,color .12s,border-color .12s}',
    '#hx-nav-bar a:hover{background:#D4AF37;color:#14110C;border-color:#D4AF37}',
    '#hx-nav-bar .hx-gap{flex:1;min-width:8px}',
    '#hx-nav-bar .hx-cur{color:#7E7668;font-size:12px;padding:4px 4px;white-space:nowrap}',
    '@media(max-width:520px){#hx-nav-bar{font-size:12px;padding:6px 10px;gap:7px}}'
  ].join('');

  /* ---------- 4. 注入 ---------- */
  function inject() {
    if (!document.body || document.getElementById('hx-nav-bar')) return;

    var st = document.createElement('style');
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);

    var bar = document.createElement('div');
    bar.id = 'hx-nav-bar';

    var h = '';
    if (local) {
      h += '<a href="' + local.href + '">← 返回' + local.label + '</a>';
    } else if (AT_ROOT) {
      h += '<span class="hx-cur">慧学学习网络</span>';
    } else {
      h += '<a href="' + SITE + '">← 返回网站总页</a>';
    }
    h += '<span class="hx-gap"></span>';
    if (AT_ARCHIVE) {
      h += '<span class="hx-cur">📋 当前：学习档案</span>';
    } else {
      h += '<a href="' + ARCHIVE + '" title="汇总四条线的练习记录与错题，可导出发给老师">📋 学习档案</a>';
    }
    if (AT_ROOT) {
      h += '<span class="hx-cur">🏠 当前：网站总页</span>';
    } else {
      h += '<a href="' + SITE + '">🏠 网站总页</a>';
    }
    bar.innerHTML = h;

    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* ---------- 5. 隐藏旧的底部跨线链接块 ---------- */
  function killLegacy() {
    var all = document.querySelectorAll('div,section,footer,aside,nav,p,h2,h3,h4,span');
    var best = null, bestN = 1e9;
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.id === 'hx-nav-bar' || el === document.body || el === document.documentElement) continue;
      var t = el.textContent || '';
      if (t.indexOf('换一条线') < 0) continue;
      var n = el.querySelectorAll('a').length;
      if (n < 3 || n > 20) continue;
      if (t.length > 900) continue;
      if (n <= bestN) { bestN = n; best = el; }
    }
    if (best) {
      best.style.display = 'none';
      best.setAttribute('data-hx-legacy-nav', '1');
    }
  }

  function boot() {
    try { inject(); } catch (e) {}
    try { killLegacy(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
