/* 补丁脚本：① 求助口袋卡回填 Ch3-Ch6（Ch7/Ch8 已有，幂等跳过）② 全部章节加「回主页」入口
 * 锚点均从各章成品核实过；rep 未命中会进 miss 报告。 */
var fs = require("fs");
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var FILES = ["Ch3-遗忘迷宫.html","Ch4-理解冰山.html","Ch5-否定斗技场.html","Ch6-语言风暴.html","Ch7-关系回声.html","Ch8-能量峡谷.html"];
var HOME = "Ch0-大脑营地.html";
var miss = [];

/* ---- ① 求助口袋卡（与 build_social.js 中一致） ---- */
var HELP_BADGE = [
'function helpBadge(size){',
'  return \'<svg viewBox="0 0 48 48" width="\'+size+\'" height="\'+size+\'" style="display:block">\'+',
'  \'<rect x="10" y="8" width="28" height="34" rx="5" fill="rgba(216,180,90,.1)" stroke="#f0d68a" stroke-width="2.5"/>\'+',
'  \'<path d="M24 16 v10 M18 21 h12" stroke="#f0d68a" stroke-width="3" stroke-linecap="round"/>\'+',
'  \'<path d="M15 32 q9 6 18 0" stroke="#f0d68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");

var HELP_CARD = [
'  var hc=el("div","cdx-card");',
'  var ht=el("div","cdx-t"); ht.innerHTML=helpBadge(60);',
'  hc.appendChild(ht);',
'  hc.appendChild(el("div","cdx-name","求助口袋卡"));',
'  hc.appendChild(el("div","mantra","求助不是软弱，是精准调用资源。"));',
'  var hnote=el("div","note-sec");',
'  hnote.appendChild(el("div",null,"正面：写下 3 个你信得过的大人 —— ①＿＿＿ ②＿＿＿ ③＿＿＿"));',
'  hnote.appendChild(el("div",null,"背面：54321 着陆 —— 看 5 样 · 摸 4 样 · 听 3 声 · 闻 2 样 · 尝 1 味"));',
'  hnote.appendChild(el("div",null,"心里乱的时候：先着陆，再找人说。"));',
'  hc.appendChild(hnote);',
'  g.appendChild(hc);'
].join("\n");

FILES.forEach(function (f) {
  var p = DIR + f;
  var s = fs.readFileSync(p, "utf8");
  var n = 0;
  function rep(a, b) {
    if (s.indexOf(a) >= 0) { s = s.replace(a, b); n++; }
    else miss.push(f + " :: " + a.slice(0, 46).replace(/\n/g, "\\n"));
  }

  /* ①-a helpBadge 函数（幂等） */
  if (s.indexOf("function helpBadge") < 0) {
    rep("function comboBadge(locked,size){", HELP_BADGE + "function comboBadge(locked,size){");
  }
  /* ①-b 图鉴末尾求助卡（幂等） */
  if (s.indexOf("求助口袋卡") < 0) {
    rep('    c.appendChild(el("div","note-sec",cn.desc));\n    g.appendChild(c);\n  });\n  show("scr-codex");',
        '    c.appendChild(el("div","note-sec",cn.desc));\n    g.appendChild(c);\n  });\n' + HELP_CARD + '\n  show("scr-codex");');
  }

  /* ②-a 标题页菜单：加「回主页」按钮 */
  rep('    <button id="btn-help2" class="btn ghost">❓ 玩法说明</button>',
      '    <button id="btn-help2" class="btn ghost">❓ 玩法说明</button>\n    <button id="btn-home" class="btn ghost">🏟 回主页</button>');
  rep('  $("#btn-help2").onclick=function(){helpReturn="scr-title";show("scr-help");};',
      '  $("#btn-help2").onclick=function(){helpReturn="scr-title";show("scr-help");};\n  $("#btn-home").onclick=function(){location.href="' + HOME + '";};');

  /* ②-b 暂停菜单：加「回主页」按钮 */
  rep('      <button class="btn ghost" id="btn-quit">返回标题</button>',
      '      <button class="btn ghost" id="btn-quit">返回标题</button>\n      <button class="btn ghost" id="btn-home-pause">🏟 回主页</button>');
  rep('  $("#btn-quit").onclick=function(){closeModal("#overlay-pause");refreshTitle();show("scr-title");};',
      '  $("#btn-quit").onclick=function(){closeModal("#overlay-pause");refreshTitle();show("scr-title");};\n  $("#btn-home-pause").onclick=function(){location.href="' + HOME + '";};');

  /* ②-c 结算页：「返回标题」→「回主页」（重玩本章已覆盖回退需求，保持 3 按钮不撑爆布局） */
  rep('  var b3=el("button","btn ghost","🏠 返回标题");\n  b3.onclick=function(){refreshTitle();show("scr-title");};',
      '  var b3=el("button","btn ghost","🏟 回主页");\n  b3.onclick=function(){location.href="' + HOME + '";};');

  fs.writeFileSync(p, s, "utf8");
  console.log("✅ " + f + " · 补丁 " + n + " 处");
});

if (miss.length) {
  console.log("⚠ 未命中 " + miss.length + " 处：");
  miss.forEach(function (m) { console.log("   - " + m); });
} else {
  console.log("✅ 全部命中，无遗漏");
}
