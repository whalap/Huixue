/* Pre-A1 起步线 · 共享引擎：发音 / 录音 / 存档 / 卡片 / 小测 / 项目页
   页面只需 <div id="app"></div> + PA1.unit({...}) 或 PA1.proj({...}) */
window.PA1 = (function () {
  'use strict';

  var CUR = null, ST = {}, QZ = [], GTAB = '';

  /* ---------------- 基础工具 ---------------- */
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function href(p){ return encodeURI(String(p == null ? '' : p)); }
  function lg(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function ls(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
  var P = 'prea1_v1_';
  function load(n){ try { return JSON.parse(lg(P + 'u' + n) || '{}') || {}; } catch(e){ return {}; } }
  function save(n, o){ ls(P + 'u' + n, JSON.stringify(o)); }

  /* ---------------- 发音（TTS） ---------------- */
  var VS = [];
  function voices(){
    try { var v = window.speechSynthesis.getVoices(); if (v && v.length) VS = v; } catch(e){}
    return VS;
  }
  if (window.speechSynthesis) {
    try { speechSynthesis.onvoiceschanged = voices; } catch(e){}
    setTimeout(voices, 200); setTimeout(voices, 900);
  }
  function pick(){
    var v = voices(), i, best = null, female = null, any = null;
    for (i = 0; i < v.length; i++) {
      var lg2 = (v[i].lang || '').replace(/_/g, '-').toLowerCase();
      if (lg2.indexOf('en') !== 0) continue;
      if (!any) any = v[i];
      if (/female|zira|kate|serena|moira|tessa|fiona|yuna|samantha|victoria|karen|google uk english female|google us english/i.test(v[i].name || '')) female = v[i];
      if (lg2.indexOf('en-gb') === 0) best = v[i];
    }
    return female || best || any || null;
  }
  function speak(t, rate, cb){
    if (!window.speechSynthesis || !t) { if (cb) cb(); return; }
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(t));
      var v = pick();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-GB'; }
      u.rate = rate || 0.85; u.pitch = 1; u.volume = 1;
      if (cb) u.onend = cb;
      speechSynthesis.speak(u);
    } catch(e){ if (cb) cb(); }
  }

  /* ---------------- 录音 ---------------- */
  var REC = { mr: null, stream: null, chunks: [], btn: null, slot: null, si: -1 };
  function stopRec(){
    try { if (REC.mr) REC.mr.stop(); } catch(e){}
  }
  function recToggle(btn, slot, si){
    if (REC.mr && REC.mr.state === 'recording') { stopRec(); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      slot.innerHTML = '<div class="hint">⚠ 这个环境不能录音：请用文件夹里的「启动.bat」打开（localhost），或用 https 链接；点读与发音不受影响。</div>';
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(st){
      var MR = window.MediaRecorder || window.webkitMediaRecorder;
      if (!MR) {
        slot.innerHTML = '<div class="hint">⚠ 本浏览器不支持录音；点读与发音不受影响。</div>';
        st.getTracks().forEach(function(t){ t.stop(); });
        return;
      }
      REC.stream = st; REC.chunks = []; REC.btn = btn; REC.slot = slot; REC.si = si;
      REC.mr = new MR(st);
      REC.mr.ondataavailable = function(e){ if (e.data && e.data.size) REC.chunks.push(e.data); };
      REC.mr.onstop = function(){
        var url = '';
        try {
          var blob = new Blob(REC.chunks, { type: (REC.chunks[0] && REC.chunks[0].type) || 'audio/webm' });
          url = URL.createObjectURL(blob);
        } catch(e){}
        slot.innerHTML = url
          ? '<audio controls src="' + url + '"></audio><div class="hint">🔊 你刚才的录音 —— 点播放，跟原声对比；不满意就再录一次。</div>'
          : '<div class="hint">⚠ 录音没存下来，请再试一次。</div>';
        try { REC.stream.getTracks().forEach(function(t){ t.stop(); }); } catch(e){}
        REC.mr = null;
        if (REC.btn) { REC.btn.classList.remove('on'); REC.btn.textContent = '● 录音'; }
        if (REC.si >= 0 && CUR) {
          ST.s = ST.s || {}; ST.s[REC.si] = 1; save(CUR.n, ST); updProg();
        }
        REC.si = -1;
      };
      REC.mr.start();
      btn.classList.add('on'); btn.textContent = '■ 停止';
      slot.innerHTML = '<div class="hint"><span class="rec-dot"></span>正在录音…… 先听一遍，再跟读一遍，然后点「停止」。</div>';
    }).catch(function(err){
      slot.innerHTML = '<div class="hint">⚠ 麦克风没开（' + esc((err && err.name) || '未知') + '）。用「启动.bat」打开的 localhost 可以录音；点读与发音不受影响。</div>';
    });
  }

  /* ---------------- 公共骨架 ---------------- */
  function topBar(){
    return '<div class="pgtop">'
      + '<a href="' + href('Pre-A1 主页.html') + '">🔤 Pre-A1 主页</a>'
      + '<a href="' + href('index.html') + '">🏛️ 四级总站</a>'
      + '<a href="' + href('../index.html') + '">🏠 慧学首页</a>'
      + '<span class="sp"></span>'
      + '<a href="' + href('语法练习_A1-A2-B1-B2.html') + '">✍️ 语法练习</a>'
      + '<a href="' + href('英语音标48音训练.html') + '">🔤 48 音标</a>'
      + '</div>';
  }
  function hero(o, kind){
    var total = (o.vocab ? o.vocab.length : 0) + (o.sents ? o.sents.length : 0);
    var done = 0;
    if (kind === 'unit') {
      done = Object.keys(ST.w || {}).length + Object.keys(ST.s || {}).length;
    }
    var h = '<div class="hero"><div class="badge">' + esc(o.emo || '🔤') + '</div><div class="ht">'
      + '<div class="kick">' + esc(o.beast || 'PRE-A1') + ' · UNIT ' + o.n + '</div>'
      + '<h1>' + esc(o.en || '') + '<small>' + esc(o.cn || '') + '</small></h1>';
    if (kind === 'unit') h += '<div class="goal">' + esc(o.goal || '') + '</div>';
    else h += '<div class="goal">' + esc(o.make || '') + '</div>';
    h += '</div>';
    if (kind === 'unit') {
      h += '<div class="prog"><div class="lb">本单元进度</div>'
        + '<div class="nm"><span data-pdone>' + done + '</span> / ' + total + '</div>'
        + '<div class="bar"><i data-pbar style="width:' + (total ? (done / total * 100) : 0) + '%"></i></div></div>';
    } else {
      h += '<div class="prog"><div class="lb">项目自检</div>'
        + '<div class="nm"><span data-cdone>0</span> / ' + (o.checks ? o.checks.length : 0) + '</div>'
        + '<div class="bar"><i data-cbar style="width:0%"></i></div></div>';
    }
    h += '</div>';
    return h;
  }
  function nav(o, kind){
    var h = '<div class="pgnav"><div class="lb">本线内跳转</div><div class="row">';
    if (o.prev) h += '<a href="' + href(o.prev) + '">← 上一单元</a>';
    if (o.next) h += '<a href="' + href(o.next) + '">下一单元 →</a>';
    h += '<a class="hot" href="' + href('Pre-A1 主页.html') + '">🔤 Pre-A1 主页</a>';
    if (kind === 'unit' && o.proj) h += '<a class="hot" href="' + href(o.proj) + '">🧩 做项目：' + esc(o.projName || '') + '</a>';
    if (kind === 'proj' && o.unitFile) h += '<a class="hot" href="' + href(o.unitFile) + '">🎧 回本单元跟读</a>';
    h += '</div><div class="lb">跨线跳转</div><div class="row">'
      + '<a href="' + href('A1 主页.html') + '">🌱 A1 启程线</a>'
      + '<a href="' + href('A2 主页.html') + '">📗 A2 日常线</a>'
      + '<a href="' + href('B1 主页.html') + '">🌉 B1 过渡线</a>'
      + '<a href="' + href('index.html') + '">🏛️ 四级总站</a>'
      + '<a href="' + href('../01_课本同步_沪教版七上/点读学习包/Unit0_总目录_点读学习中心.html') + '">📚 课本同步</a>'
      + '<a href="' + href('../01_课本同步_沪教版七上/原声课文跟读.html') + '">🎧 原声课文</a>'
      + '<a href="' + href('../E听说练习/index.html') + '">🎤 中考 E 听说</a>'
      + '<a href="' + href('../index.html') + '">🏠 慧学首页</a>'
      + '</div></div>';
    return h;
  }
  function updProg(){
    if (!CUR) return;
    var total = (CUR.vocab ? CUR.vocab.length : 0) + (CUR.sents ? CUR.sents.length : 0);
    var done = Object.keys(ST.w || {}).length + Object.keys(ST.s || {}).length;
    var a = document.querySelector('[data-pdone]'), b = document.querySelector('[data-pbar]');
    if (a) a.textContent = done;
    if (b) b.style.width = (total ? (done / total * 100) : 0) + '%';
  }

  /* ---------------- 跟读单元页 ---------------- */
  function vcard(v, i){
    var got = (ST.w || {})[v.w] ? ' got' : '';
    var done = (ST.w || {})[v.w] ? ' done' : '';
    return '<div class="vcard' + done + '" data-g="' + esc(v.g || '') + '">'
      + '<div class="vt"><span class="vw">' + esc(v.w) + '</span>'
      + (v.ipa ? '<span class="vipa">' + esc(v.ipa) + '</span>' : '')
      + (v.snd ? '<span class="vsnd">' + esc(v.snd) + '</span>' : '')
      + '</div>'
      + '<div class="vcn">' + esc(v.cn) + '</div>'
      + '<div class="vex" data-act="ex" data-t="' + esc(v.ex) + '">' + esc(v.ex)
      + '<span class="cn hide">' + esc(v.excn) + '</span></div>'
      + '<div class="vacts">'
      + '<button class="b-play" data-act="say" data-t="' + esc(v.w) + '" data-r="0.85">🔊 发音</button>'
      + '<button class="b-slow" data-act="say" data-t="' + esc(v.w) + '" data-r="0.6">🐢 慢速</button>'
      + '<button class="b-ok' + got + '" data-act="got" data-w="' + esc(v.w) + '">' + (got ? '✓ 已掌握' : '✓ 标掌握') + '</button>'
      + '</div></div>';
  }
  function sentRow(s, i){
    var got = (ST.s || {})[i] ? ' ✓' : '';
    return '<div class="srow"><div class="sr">'
      + '<span class="sidx">' + (i + 1) + '</span>'
      + '<span class="sen" data-act="say" data-t="' + esc(s.en) + '" data-r="0.85">' + esc(s.en) + '</span>'
      + '<span class="sacts">'
      + '<button class="b-play" data-act="say" data-t="' + esc(s.en) + '" data-r="0.85">🔊 听</button>'
      + '<button class="b-play" data-act="say" data-t="' + esc(s.en) + '" data-r="0.6">🐢 慢</button>'
      + '<button class="b-rec" data-act="rec" data-si="' + i + '">● 录音' + got + '</button>'
      + '</span></div>'
      + '<div class="scn">' + esc(s.cn) + '</div>'
      + '<div class="slot" data-slot="' + i + '"></div></div>';
  }
  function pickHTML(p, i, kind){
    var h = '<div class="pk" data-pk="' + kind + i + '"><div class="pq"><span class="no">' + (i + 1) + '</span>';
    if (kind === 'd') {
      h += '<span class="say" data-act="say" data-t="' + esc(p.say) + '" data-r="0.8">🔊 ' + esc(p.say) + '</span>';
      if (p.sayCn) h += '<span style="font-weight:400;color:var(--sub);font-size:12.5px">' + esc(p.sayCn) + '</span>';
    } else {
      h += esc(p.q);
    }
    h += '</div>';
    if (p.h) h += '<div class="ph">' + esc(p.h) + '</div>';
    h += '<div class="opts">';
    (p.opts || []).forEach(function(op, j){
      h += '<button class="opt" data-act="pick" data-kind="' + kind + '" data-i="' + i + '" data-j="' + j + '">' + esc(op) + '</button>';
    });
    h += '</div><div class="fb" data-fb="' + kind + i + '"></div></div>';
    return h;
  }
  function qzProg(){
    var total = CUR.quiz.length, done = 0, right = 0;
    QZ.forEach(function(v){ if (v !== null) { done++; if (v) right++; } });
    var bar = document.querySelector('[data-qp]');
    if (bar) bar.style.width = (done / total * 100) + '%';
    if (done === total) {
      var sum = document.querySelector('[data-qsum]');
      if (sum) {
        sum.style.display = 'block';
        sum.innerHTML = '本单元小测：<b>' + right + ' / ' + total + '</b>　'
          + (right === total ? '🌟 全对 —— 可以进下一单元了。'
            : right >= Math.ceil(total * 0.7) ? '👍 过关 —— 把错的题再点一遍，下次就稳了。'
            : '↩️ 先回「词汇」和「跟读」再过一遍，然后重做。');
      }
    }
  }
  function onPick(kind, i, j){
    var p = (kind === 'd' ? CUR.drill.items : CUR.quiz)[i];
    if (!p) return;
    var box = document.querySelector('[data-pk="' + kind + i + '"]');
    var fb = document.querySelector('[data-fb="' + kind + i + '"]');
    if (!box || box.getAttribute('data-done')) return;
    box.setAttribute('data-done', '1');
    var ok = (j === p.a);
    Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(b, x){
      if (x === p.a) b.classList.add('ok');
      else if (x === j) b.classList.add('bad');
      else b.classList.add('dim');
    });
    fb.className = 'fb ' + (ok ? 'ok' : 'bad');
    fb.textContent = (ok ? '✅ 对了！' : '❌ 正确答案是「' + p.opts[p.a] + '」。')
      + (p.tip ? '　' + p.tip : '');
    if (kind === 'q') { QZ[i] = ok ? 1 : 0; qzProg(); }
  }
  function unit(o){
    CUR = o; ST = load(o.n); QZ = [];
    for (var q = 0; q < (o.quiz || []).length; q++) QZ.push(null);
    ST.w = ST.w || {}; ST.s = ST.s || {};

    var gs = [], i;
    (o.vocab || []).forEach(function(v){ if (v.g && gs.indexOf(v.g) < 0) gs.push(v.g); });
    GTAB = gs[0] || '';

    var h = topBar() + '<div class="wrap">' + hero(o, 'unit');
    if (o.tip) h += '<div class="tip">' + esc(o.tip) + '</div>';

    h += '<div class="tabs">'
      + '<button class="on" data-tab="v">📖 词汇</button>'
      + '<button data-tab="s">🎧 跟读</button>'
      + '<button data-tab="d">🎯 活动</button>'
      + '<button data-tab="q">📝 小测</button>'
      + '</div>';

    /* 词汇 */
    h += '<div class="tabpane on" data-pane="v">';
    if (gs.length > 1) {
      h += '<div class="grps">';
      gs.forEach(function(g, k){
        h += '<button data-grp="' + esc(g) + '" class="' + (k === 0 ? 'on' : '') + '">' + esc(g) + '</button>';
      });
      h += '</div>';
    }
    h += '<div class="vgrid">';
    (o.vocab || []).forEach(function(v, k){ h += vcard(v, k); });
    h += '</div></div>';

    /* 跟读 */
    h += '<div class="tabpane" data-pane="s">'
      + '<div class="playall">'
      + '<button class="btn" data-act="all">▶️ 连播全部</button>'
      + '<button class="btn ghost" data-act="allslow">🐢 慢速连播</button>'
      + '<span class="hint" style="margin-left:6px">先听整句，再点「录音」跟读一遍，回放对比。</span>'
      + '</div><div class="slist">';
    (o.sents || []).forEach(function(s, k){ h += sentRow(s, k); });
    h += '</div></div>';

    /* 活动 */
    h += '<div class="tabpane" data-pane="d">'
      + '<div class="pk" style="background:var(--panel2);border-color:var(--line2)">'
      + '<div class="ph" style="margin:0">🎯 <b style="color:var(--main)">' + esc((o.drill && o.drill.h) || '听一听，选一选') + '</b><br>'
      + '点喇叭听发音，再选答案。选错会直接告诉你正确答案。</div></div>';
    ((o.drill && o.drill.items) || []).forEach(function(p, k){ h += pickHTML(p, k, 'd'); });
    h += '</div>';

    /* 小测 */
    h += '<div class="tabpane" data-pane="q">'
      + '<div class="qprog"><i data-qp></i></div>';
    (o.quiz || []).forEach(function(p, k){ h += pickHTML(p, k, 'q'); });
    h += '<div class="qsum" data-qsum></div>'
      + '<div style="text-align:center;margin:14px 0"><button class="btn ghost" data-act="rq">🔄 重做小测</button></div>'
      + '</div>';

    h += nav(o, 'unit') + '</div>';
    h += '<footer>Pre-A1 起步线 · Unit ' + o.n + ' · 零基础先听清、再开口 · 进度存在本机浏览器</footer>';

    var app = document.getElementById('app');
    if (!app) { document.body.insertAdjacentHTML('afterbegin', '<div id="app"></div>'); app = document.getElementById('app'); }
    app.innerHTML = h;

    if (gs.length > 1) applyGrp();
    bind();
    return o;
  }
  function applyGrp(){
    Array.prototype.forEach.call(document.querySelectorAll('.vcard'), function(c){
      c.style.display = (c.getAttribute('data-g') === GTAB) ? '' : 'none';
    });
    Array.prototype.forEach.call(document.querySelectorAll('.grps button'), function(b){
      b.classList.toggle('on', b.getAttribute('data-grp') === GTAB);
    });
  }
  function tabs(name){
    Array.prototype.forEach.call(document.querySelectorAll('.tabs button'), function(b){
      b.classList.toggle('on', b.getAttribute('data-tab') === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.tabpane'), function(p){
      p.classList.toggle('on', p.getAttribute('data-pane') === name);
    });
  }

  /* ---------------- 项目页 ---------------- */
  function proj(o){
    CUR = o; ST = load(o.n); ST.c = ST.c || {};
    var h = topBar() + '<div class="wrap">' + hero(o, 'proj');
    if (o.tip) h += '<div class="tip">' + esc(o.tip) + '</div>';

    h += '<div class="pcard"><h3><span class="no">1</span>你要做出什么</h3>'
      + '<div style="font-size:14px;line-height:1.9">' + esc(o.make || '') + '</div></div>';

    h += '<div class="pcard"><h3><span class="no">2</span>怎么做</h3><ol class="steps">';
    (o.steps || []).forEach(function(s){ h += '<li>' + s + '</li>'; });
    h += '</ol></div>';

    if (o.scaffold) {
      h += '<div class="pcard"><h3><span class="no">3</span>语言支架（点句子可发音）</h3><div class="scaffold">';
      (o.scaffold.lines || []).forEach(function(l){
        h += '<div class="ln"><span class="en" data-act="say" data-t="' + esc(l.en) + '" data-r="0.85">🔊 ' + esc(l.en) + '</span>'
          + '<span class="cn">' + esc(l.cn) + '</span></div>';
      });
      h += '</div>';
      if (o.scaffold.words && o.scaffold.words.length) {
        h += '<div class="wbox">';
        o.scaffold.words.forEach(function(w){
          h += '<span data-act="say" data-t="' + esc(w) + '" data-r="0.85">' + esc(w) + '</span>';
        });
        h += '</div><div class="hint" style="margin-top:8px">上面这些词点一下就能听，写的时候不会读就先点一遍。</div>';
      }
      h += '</div>';
    }

    if (o.demo) {
      h += '<div class="pcard"><h3><span class="no">4</span>样例（照着这个写）</h3>'
        + '<div class="scaffold" style="background:#0b1210">';
      (o.demo || []).forEach(function(d){
        if (d.t) h += '<div class="hint" style="margin:6px 0 2px">' + esc(d.t) + '</div>';
        h += '<div class="ln"><span class="en" data-act="say" data-t="' + esc(d.en) + '" data-r="0.85">🔊 ' + esc(d.en) + '</span>'
          + '<span class="cn">' + esc(d.cn) + '</span></div>';
      });
      h += '</div></div>';
    }

    var checks = o.checks || [];
    h += '<div class="pcard"><h3><span class="no">5</span>自检清单（做完打勾）</h3><div class="chk">';
    checks.forEach(function(c, i){
      var on = ST.c[i] ? ' done' : '';
      h += '<label class="' + on + '"><input type="checkbox" data-chk="' + i + '"' + (ST.c[i] ? ' checked' : '') + '><span>' + c + '</span></label>';
    });
    h += '</div></div>';

    h += '<div class="pcard"><h3><span class="no">6</span>我的成品</h3>'
      + '<textarea class="out" data-out placeholder="' + esc(o.ph || '把你的英文写在这里……') + '"></textarea>'
      + '<div class="savnote"><button class="btn" data-act="saveout">💾 保存到本机</button>'
      + '　<span data-outnote>写完点保存，下次打开还在。</span></div></div>';

    h += nav(o, 'proj') + '</div>';
    h += '<footer>Pre-A1 起步线 · Unit ' + o.n + ' 项目 · 先做出来，再做得更好 · 进度存在本机浏览器</footer>';

    var app = document.getElementById('app');
    if (!app) { document.body.insertAdjacentHTML('afterbegin', '<div id="app"></div>'); app = document.getElementById('app'); }
    app.innerHTML = h;

    var ta = document.querySelector('[data-out]');
    if (ta) {
      var k = P + 'u' + o.n + '_out';
      try { ta.value = lg(k) || ''; } catch(e){}
      ta.addEventListener('input', function(){ ls(k, ta.value); });
    }
    updChecks();
    bind();
    return o;
  }
  function updChecks(){
    var o = CUR; if (!o) return;
    var total = (o.checks || []).length, done = 0;
    for (var i = 0; i < total; i++) if (ST.c[i]) done++;
    var a = document.querySelector('[data-cdone]'), b = document.querySelector('[data-cbar]');
    if (a) a.textContent = done;
    if (b) b.style.width = (total ? (done / total * 100) : 0) + '%';
  }

  /* ---------------- 事件委托 ---------------- */
  var SEQ = { on: false, list: [], i: 0, rate: 0.85 };
  function runSeq(){
    if (!SEQ.on || SEQ.i >= SEQ.list.length) {
      SEQ.on = false;
      var b = document.querySelector('[data-act="all"]');
      if (b) b.textContent = '▶️ 连播全部';
      return;
    }
    speak(SEQ.list[SEQ.i], SEQ.rate, function(){
      SEQ.i++; setTimeout(runSeq, 320);
    });
  }
  function bind(){
    document.addEventListener('click', function(e){
      var t = e.target;
      while (t && t !== document && !t.getAttribute('data-act')) t = t.parentNode;
      if (!t || t === document) {
        var tb = e.target;
        while (tb && tb !== document && !tb.getAttribute('data-tab')) tb = tb.parentNode;
        if (tb && tb !== document && tb.getAttribute('data-tab')) { tabs(tb.getAttribute('data-tab')); return; }
        var gb = e.target;
        while (gb && gb !== document && !gb.getAttribute('data-grp')) gb = gb.parentNode;
        if (gb && gb !== document && gb.getAttribute('data-grp')) { GTAB = gb.getAttribute('data-grp'); applyGrp(); }
        return;
      }
      var a = t.getAttribute('data-act'), i, si;

      if (a === 'say') { speak(t.getAttribute('data-t'), parseFloat(t.getAttribute('data-r')) || 0.85); return; }

      if (a === 'ex') {
        var cn = t.querySelector('.cn');
        if (cn) cn.classList.toggle('hide');
        else speak(t.getAttribute('data-t'), 0.85);
        return;
      }

      if (a === 'got') {
        var w = t.getAttribute('data-w');
        ST.w = ST.w || {};
        if (ST.w[w]) { delete ST.w[w]; t.classList.remove('got'); t.textContent = '✓ 标掌握'; var c = t.closest ? t.closest('.vcard') : null; if (c) c.classList.remove('done'); }
        else { ST.w[w] = 1; t.classList.add('got'); t.textContent = '✓ 已掌握'; var c2 = t.closest ? t.closest('.vcard') : null; if (c2) c2.classList.add('done'); }
        save(CUR.n, ST); updProg();
        return;
      }

      if (a === 'rec') {
        si = parseInt(t.getAttribute('data-si'), 10);
        var row = t.parentNode.parentNode.parentNode;
        var slot = row.querySelector('[data-slot="' + si + '"]') || row.querySelector('.slot');
        recToggle(t, slot, si);
        return;
      }

      if (a === 'all' || a === 'allslow') {
        if (SEQ.on) { SEQ.on = false; t.textContent = (a === 'all' ? '▶️ 连播全部' : '🐢 慢速连播'); return; }
        SEQ.list = (CUR.sents || []).map(function(s){ return s.en; });
        SEQ.i = 0; SEQ.rate = (a === 'allslow' ? 0.62 : 0.85); SEQ.on = true;
        t.textContent = '⏹ 停止';
        runSeq();
        return;
      }

      if (a === 'pick') {
        onPick(t.getAttribute('data-kind'), parseInt(t.getAttribute('data-i'), 10), parseInt(t.getAttribute('data-j'), 10));
        return;
      }

      if (a === 'rq') {
        QZ = QZ.map(function(){ return null; });
        Array.prototype.forEach.call(document.querySelectorAll('.pk'), function(p){
          p.removeAttribute('data-done');
          Array.prototype.forEach.call(p.querySelectorAll('.opt'), function(b){ b.className = 'opt'; });
        });
        Array.prototype.forEach.call(document.querySelectorAll('.fb'), function(f){ f.className = 'fb'; f.textContent = ''; });
        var qp = document.querySelector('[data-qp]'); if (qp) qp.style.width = '0%';
        var qs = document.querySelector('[data-qsum]'); if (qs) { qs.style.display = 'none'; qs.innerHTML = ''; }
        return;
      }

      if (a === 'saveout') {
        var ta2 = document.querySelector('[data-out]');
        if (ta2) { ls(P + 'u' + CUR.n + '_out', ta2.value); }
        var nt = document.querySelector('[data-outnote]');
        if (nt) { nt.textContent = '✅ 已保存（' + new Date().toLocaleTimeString() + '）'; }
        return;
      }
    });

    document.addEventListener('change', function(e){
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-chk') !== null) {
        i = parseInt(t.getAttribute('data-chk'), 10);
        ST.c = ST.c || {};
        if (t.checked) ST.c[i] = 1; else delete ST.c[i];
        save(CUR.n, ST);
        var lb = t.parentNode;
        if (lb) lb.classList.toggle('done', t.checked);
        updChecks();
      }
    });
  }

  return { unit: unit, proj: proj, speak: speak, stop: function(){ try { speechSynthesis.cancel(); } catch(e){} SEQ.on = false; } };
})();
