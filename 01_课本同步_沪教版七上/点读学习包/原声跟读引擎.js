/* ============================================================
   原声跟读引擎 · 慧学学习网络 · 沪教版七上（U1–U8 Reading 原声切片）
   供 8 个单元点读学习页共用：
     YS.playSentence(unit, idx, cb)   播放第 idx 句原声切片（0 起）
     YS.playAll(unit, count, opt)     整篇原声连读（缺切片句由 onmissing 兜底）
     YS.toggleRec(unit, idx, row, btn) 句级录音跟读（回放对比）
     YS.stop()                        停止全部原声/录音
   单词点读不走本引擎（继续用浏览器语音合成）。
   ============================================================ */
window.YS = (function(){
'use strict';

/* 各单元 Reading 原声文件（相对 点读学习包/ 目录） */
var AUDIO = {
  1:'../../七上课文和单词音频2026/七上U1单元听力/01%20Unit%201%20Reading.mp3',
  2:'../../七上课文和单词音频2026/七上U2单元听力/01%20Unit%202%20Reading.mp3',
  3:'../../七上课文和单词音频2026/七上U3单元听力/01%20Unit%203%20Reading.mp3',
  4:'../../七上课文和单词音频2026/七上U4单元听力/01%20Unit%204%20Reading.mp3',
  5:'../../七上课文和单词音频2026/七上U5单元听力/01%20Unit%205%20Reading.mp3',
  6:'../../七上课文和单词音频2026/七上U6单元听力/01%20Unit%206%20Reading.mp3',
  7:'../../七上课文和单词音频2026/七上U7单元听力/01%20Unit%207%20Reading.mp3',
  8:'../../七上课文和单词音频2026/七上U8单元听力/01%20Unit%208%20Reading.mp3'
};

/* 原声切片时间表（与课文逐句对齐）：
   每句 [起始秒, 结束秒, 短语1词数, ...]；null = 教材录音未收录该句 */
var SEG = {
1:[[26.95,37.16,5,3,1,5,6],[38.46,45.71,6,6],[46.35,52.22,12],[53.26,59.4,12],[60.3,67.72,17],[68.96,72.08,6],[73,77.72,4,1,4],[78.47,82.94,5,1,6],[84.09,88.06,7,1,1],[89.05,95.36,1,1,4,9],[96.74,103.01,7,1,8],null,[104.37,107.55,9],[109.18,115.88,7,12],[115.88,123.72,15]],
2:[[21.79,26.96,5,7],[27.71,30.41,2,1,7],[31.55,39.9,3,2,15],[40.99,48.47,2,1,5,8],[49.41,51.13,1,1,4],[52.43,58.14,5,1,7],[59.13,64,8,1,5],[65.27,70.35,5,1,4],[71.77,79.08,2,1,3,2,1,2,7],[80.13,85.84,8,5],[87.15,90.77,12],[92.25,96.14,7,1],[96.34,103.31,3,2,6,1,1],[104.65,108.7,4,1,4,1,1],[109.94,113.81,8,1,3],[115.01,118.68,10],[119.79,122.81,4,1,3],[123.67,128.56,2,1,11]],
3:[[28.11,35.4,5,1,8],[37.77,46.61,16],[47.22,51.61,8],[52.31,56.98,11],[57.9,60.57,6],[60.6,64.92,2,1,7],[65.65,70.87,5,1,6],[72.09,78.4,1,8],[79.29,83.52,9],[83.52,90.31,12],[91.41,96.03,13],[96.85,101.57,12],[102.77,111.41,1,5,1,6],[112.41,122.31,4,12],[122.95,126.55,7],[127.35,130.75,6],[130.75,135.82,6,1,7],[137.82,145.68,1,4,8],[145.68,152.14,11],[152.81,157.83,11]],
4:[[27.41,30.63,6],[31.53,36.99,11],[36.99,42.05,10],[42.79,49.81,11],[50.49,57.21,8,1,3],[57.99,63.61,13],[64.97,69.49,10],[70.37,76.27,10,1,2],[76.96,81.93,7,1,3],[83.19,87.75,8],[87.75,92.01,8],[92.96,98.23,9],[99.19,104.76,12],[105.75,115.47,15],[116.35,127.12,20],[127.75,133.67,13],[134.57,140.34,10]],
5:[[33.43,39.75,15],[40.65,44.6,1,1,5,2],[44.75,48.72,1,5,3],[49.84,59.78,9,1,1,8],[60.63,67.22,15,1],[67.87,72.84,5,1,4],[74.09,79.71,19],[81.37,88.49,18],[89.91,93.13,10],[94.2,97.17,9],[97.31,102.81,1,13],[104.45,110.07,4,1,12],[111.05,114.17,8],[115.05,119.5,9],[120.47,123.49,3,1,4],[124.77,128.09,10],[128.95,131.82,3,1,1,1,2]],
6:[[24.55,30.35,9],[31.11,38.33,16],[39.27,43.39,8],[45.54,53.7,1,4,1,5],[54.37,60.4,3,1,7],[60.4,67.19,4,1,10],[67.75,80.34,15,1,3,1,3],[81.07,86.19,3,1,11],[88.37,92.63,2,5],[93.49,98.96,8,1,1],[98.96,104.7,11],[104.7,108.81,9],[112.77,118.09,3,1,8],[118.91,122.28,7],[123.17,128.34,11],[129.51,134.27,7],[134.27,137.68,9]],
7:[[30.94,37.81,9,1,3],[38.41,41.38,6,1,1],[42.69,47.16,9,1,3],[51.09,56.31,11],[57.41,67.74,11,1,2],[70.16,76.74,2,1,4,3],[77.61,86.17,6,8],[86.17,90.01,1,3,2],[90.41,101.83,1,2,1,5,1],[107.21,116.83,3,5,3],[116.83,123.34,2,5,1,2],[123.53,129.5,13],[133.01,137.71,8,2],[137.87,145.74,12,2],[146.12,154.12,5,1,2,4],[156.69,172.68,1,3,1,1,1,1,17],[175.74,190.03,8,10,5]],
8:[[29.79,33.5,8],[33.5,41.51,14],[42.05,45.02,8],[45.2,51.64,13],[52.53,55.7,8],[56.39,61.28,2,1,8],[62,67.27,13],[68.01,71.56,9],[72.35,83.02,22],[89.17,91.59,4,1,2],[92.66,97.83,12],[98.71,102.73,10],[106.39,116.41,8,10,1,4],[117.12,123.81,14],[124.49,130.94,11],[131.84,138.53,6,4,1,3],[139.36,144.21,1,1,9]]
};

/* ---------- 注入样式（跟读按钮 / 我的录音） ---------- */
try{
  var st = document.createElement('style');
  st.textContent =
    '#passage .sent{padding-right:118px;}' +
    '.sent-ops{position:absolute;right:6px;top:50%;transform:translateY(-50%);display:flex;gap:7px;align-items:center;}' +
    '.sent-ops .sent-btn{position:static;transform:none;}' +
    '.sent-btn.rec{background:var(--teal-soft);color:var(--teal);font-size:15px;}' +
    '.sent-btn.rec:hover{background:var(--teal);color:#fff;}' +
    '.sent-btn.playing{background:var(--coral);color:#fff;}' +
    '#passage .mine{display:none;align-items:center;gap:10px;margin:-4px 0 12px;background:#F7F6F2;' +
      'border:1px solid var(--line);border-radius:10px;padding:8px 11px;}' +
    '#passage .mine.on{display:flex;}' +
    '#passage .mine audio{height:30px;flex:1;min-width:0;}' +
    '#passage .mine .tagx{font-size:11.5px;color:var(--green);flex:none;}' +
    '#passage .mine .clr{font-size:11.5px;color:#9AA0A8;cursor:pointer;flex:none;border:none;background:none;}' +
    '#passage .mine .clr:hover{color:var(--red);}' +
    '@media (max-width:600px){#passage .sent{padding-right:128px;}}';
  document.head.appendChild(st);
}catch(e){}

/* ---------- 播放状态 ---------- */
var cur = null;          /* 当前原声 Audio */
var mediaRec = null, recChunks = [], recRow = null;
var allToken = 0;        /* 整篇连读令牌（重点击即作废旧序列） */

function detach(a){
  a.ontimeupdate = null; a.onended = null; a.onerror = null; a.onloadedmetadata = null;
}
function stopAudio(){
  if (cur){
    var a = cur; cur = null;
    detach(a);
    try{ a.pause(); }catch(e){}
  }
}
function stopRec(){
  if (mediaRec && mediaRec.state !== 'inactive'){ try{ mediaRec.stop(); }catch(e){} }
}
function stop(){ allToken++; stopAudio(); stopRec(); }

/* 播放 [start,end) 原声片段 */
function playRange(unit, start, end, cb){
  stopAudio();
  var a = new Audio(AUDIO[unit]);
  cur = a;
  var done = false;
  function finish(){
    if (done) return; done = true;
    detach(a);
    try{ a.pause(); }catch(e){}
    if (cur === a) cur = null;
    if (cb && cb.onend) cb.onend();
  }
  function fail(){
    if (done) return; done = true;
    detach(a);
    if (cur === a) cur = null;
    if (cb && cb.onfail) cb.onfail();
  }
  a.ontimeupdate = function(){ if (a.currentTime >= end - 0.03) finish(); };
  a.onended = finish;
  a.onerror = fail;
  function go(){
    try{ a.currentTime = start; }catch(e){}
    a.play().then(function(){ if (cb && cb.onstart) cb.onstart(); }).catch(fail);
  }
  if (a.readyState >= 1) go(); else a.onloadedmetadata = go;
}

function segOf(unit, idx){
  return (SEG[unit] && SEG[unit][idx]) ? SEG[unit][idx] : null;
}

/* 播放第 idx 句原声切片；无切片时回调 onmissing（由页面决定 AI 兜底） */
function playSentence(unit, idx, cb){
  cb = cb || {};
  var seg = segOf(unit, idx);
  if (!seg){ if (cb.onmissing) cb.onmissing(); return; }
  var btn = cb.btn || null;
  playRange(unit, seg[0], seg[1], {
    onstart: function(){ if (btn) btn.classList.add('playing'); if (cb.onstart) cb.onstart(); },
    onend:   function(){ if (btn) btn.classList.remove('playing'); if (cb.onend) cb.onend(); },
    onfail:  function(){ if (btn) btn.classList.remove('playing');
                         if (cb.onfail) cb.onfail();
                         else if (cb.onmissing) cb.onmissing(); }
  });
}

/* 整篇连读：原声逐句；缺切片句调用 onmissing(i, next) 兜底后继续 */
function playAll(unit, count, opt){
  stop();
  var token = ++allToken;
  opt = opt || {};
  var gap = opt.gap || 320;
  var i = 0;
  function next(){
    if (token !== allToken) return;
    if (i >= count){ if (opt.onend) opt.onend(); return; }
    var idx = i; i++;
    if (opt.onstart) opt.onstart(idx);
    var seg = segOf(unit, idx);
    if (seg){
      playRange(unit, seg[0], seg[1], {
        onend: function(){ if (token === allToken) setTimeout(function(){ if (token === allToken) next(); }, gap); },
        onfail: function(){ if (token === allToken){ if (opt.onmissing) opt.onmissing(idx, next); else next(); } }
      });
    } else {
      if (opt.onmissing) opt.onmissing(idx, next);
      else next();
    }
  }
  next();
}

/* 句级录音跟读：录完自动回放，可删除重录 */
function toggleRec(unit, idx, row, btn){
  if (mediaRec && recRow === row){ stopRec(); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    alert('当前环境不支持录音（请用 Chrome / Edge 打开本页并允许麦克风）'); return;
  }
  if (!window.MediaRecorder){ alert('当前浏览器不支持录音（MediaRecorder）'); return; }
  stop();
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    recChunks = [];
    try { mediaRec = new MediaRecorder(stream); }
    catch(e){ alert('录音器启动失败：' + e.message); return; }
    recRow = row;
    mediaRec.ondataavailable = function(e){ if (e.data && e.data.size) recChunks.push(e.data); };
    mediaRec.onstop = function(){
      stream.getTracks().forEach(function(t){ t.stop(); });
      var box = row.querySelector('.mine');
      var au = box ? box.querySelector('audio') : null;
      if (au){
        au.src = URL.createObjectURL(new Blob(recChunks, {type: mediaRec.mimeType || 'audio/webm'}));
        box.classList.add('on');
      }
      if (btn) btn.textContent = '🎤';
      mediaRec = null; recRow = null;
    };
    mediaRec.start();
    if (btn) btn.textContent = '■';
  }).catch(function(){
    alert('麦克风权限被拒绝：请在浏览器地址栏左侧允许麦克风后重试');
  });
}

return {
  playSentence: playSentence,
  playAll: playAll,
  toggleRec: toggleRec,
  stop: stop,
  hasSlice: function(unit, idx){ return !!segOf(unit, idx); }
};
})();
