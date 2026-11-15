/* ============================================================
   慧学学习网络 · 本地账号系统（无后端，数据存于本机浏览器）
   ------------------------------------------------------------
   本实现为「本地账号」：注册 / 登录 / 登出均在当前设备生效，
   密码经 SHA-256 + 随机盐哈希后存储，明文绝不落盘。

   跨设备同步需开启云服务后将“存储层”替换为云端调用——
   届时仅改本文件的读写函数即可，页面调用接口（register/login/
   logout/current/isLoggedIn）保持不变。
   ============================================================ */
(function () {
  'use strict';
  if (window.Account) return;

  var KEY_USERS   = 'hx_accounts_v1';   // [{id,email,nick,salt,pwHash,createdAt}]
  var KEY_SESSION = 'hx_session_v1';    // 当前登录用户 id

  /* ---------- 底层存储（localStorage） ---------- */
  function readUsers() {
    try { return JSON.parse(localStorage.getItem(KEY_USERS) || '[]'); }
    catch (e) { return []; }
  }
  function writeUsers(arr) {
    try { localStorage.setItem(KEY_USERS, JSON.stringify(arr)); } catch (e) {}
  }

  /* ---------- 工具 ---------- */
  function uuid() {
    return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }
  function b64(buf) {
    var bytes = new Uint8Array(buf), s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function randomSalt() {
    var a = new Uint8Array(9);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else for (var i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
    return b64(a);
  }
  function sha256hex(str) {
    if (window.crypto && crypto.subtle) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
        .then(function (buf) { return b64(buf); });
    }
    // 退化哈希：仅在浏览器不支持 Web Crypto（如 file:// 非安全上下文）时启用
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return Promise.resolve('fm_' + h.toString(16));
  }

  /* ---------- 对外接口 ---------- */
  var Account = {
    /* 是否已登录（同步读取，供导航栏即时判断） */
    isLoggedIn: function () { return !!this.current(); },

    /* 取当前用户公开信息（不含密码哈希），未登录返回 null */
    current: function () {
      try {
        var id = localStorage.getItem(KEY_SESSION);
        if (!id) return null;
        var u = readUsers().filter(function (x) { return x.id === id; })[0];
        if (!u) return null;
        return { id: u.id, email: u.email, nick: u.nick, createdAt: u.createdAt };
      } catch (e) { return null; }
    },

    /* 注册：{email, nick, password} → Promise<user> ，失败抛 {code,msg} */
    register: function (opts) {
      opts = opts || {};
      var email = (opts.email || '').trim().toLowerCase();
      var nick  = (opts.nick  || '').trim();
      var pw    = opts.password || '';
      return Promise.resolve().then(function () {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw { code: 'email', msg: '请输入有效的邮箱地址' };
        if (nick.length < 1 || nick.length > 20)      throw { code: 'nick',  msg: '昵称长度 1–20 字' };
        if (pw.length < 6)                            throw { code: 'password', msg: '密码至少 6 位' };
        var users = readUsers();
        if (users.some(function (x) { return x.email === email; }))
          throw { code: 'email', msg: '该邮箱已注册，请直接登录' };
        var s = randomSalt();
        return sha256hex(s + '|' + pw).then(function (hash) {
          var u = { id: uuid(), email: email, nick: nick, salt: s, pwHash: hash, createdAt: Date.now() };
          users.push(u); writeUsers(users);
          localStorage.setItem(KEY_SESSION, u.id);
          return { id: u.id, email: u.email, nick: u.nick };
        });
      });
    },

    /* 登录：{email, password} → Promise<user> ，失败抛 {code,msg} */
    login: function (opts) {
      opts = opts || {};
      var email = (opts.email || '').trim().toLowerCase();
      var pw    = opts.password || '';
      return Promise.resolve().then(function () {
        if (!email || !pw) throw { code: 'auth', msg: '请输入邮箱和密码' };
        var u = readUsers().filter(function (x) { return x.email === email; })[0];
        if (!u) throw { code: 'auth', msg: '该邮箱尚未注册' };
        return sha256hex(u.salt + '|' + pw).then(function (hash) {
          if (hash !== u.pwHash) throw { code: 'auth', msg: '密码不正确' };
          localStorage.setItem(KEY_SESSION, u.id);
          return { id: u.id, email: u.email, nick: u.nick };
        });
      });
    },

    /* 登出 */
    logout: function () { try { localStorage.removeItem(KEY_SESSION); } catch (e) {} },

    /* 修改昵称 */
    setNick: function (nick) {
      nick = (nick || '').trim();
      if (nick.length < 1 || nick.length > 20) throw { code: 'nick', msg: '昵称长度 1–20 字' };
      var cur = this.current(); if (!cur) throw { code: 'auth', msg: '请先登录' };
      var users = readUsers();
      for (var i = 0; i < users.length; i++) if (users[i].id === cur.id) users[i].nick = nick;
      writeUsers(users); return cur.id;
    }
  };

  window.Account = Account;

  /* 通知导航栏等监听者：账号模块已就绪 */
  try { window.dispatchEvent(new Event('hx-account-ready')); } catch (e) {}
})();
