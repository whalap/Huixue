/* 注册全站 Service Worker（仅在 http/https/localhost 下生效；file:// 直接打开会自动跳过） */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (e) {
      console.warn('SW 注册失败（需通过 localhost 或 https 打开才能安装/离线）：', e.message);
    });
  });
}
