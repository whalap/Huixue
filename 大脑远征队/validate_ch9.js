/* Ch9 静态校验（终章） */
var fs = require("fs");
var s = fs.readFileSync("D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch9-大脑王座.html", "utf8");

var skillsSrc = s.slice(s.indexOf("var SKILLS={"), s.indexOf("var COMBOS=["));
var SKILLS = {}, m;
var reK = /(\w+)\s*:\{name:"([^"]+)"/g;
while ((m = reK.exec(skillsSrc))) SKILLS[m[1]] = m[2];
console.log("技能(" + Object.keys(SKILLS).length + "): " + JSON.stringify(SKILLS));

var scenesSrc = s.slice(s.indexOf("var SCENES={"), s.indexOf("/* ---------- 战斗 ---------- */"));
var branchSkill = {};
["a2", "b2", "c2", "d2"].forEach(function (sc) {
  var rx = new RegExp(sc + ':\\{kind:"skill",skill:"(\\w+)"');
  var mm = rx.exec(scenesSrc); if (mm) branchSkill[sc] = mm[1];
});
console.log("分支技能(a2/b2/c2/d2): " + JSON.stringify(branchSkill));
var badBranch = Object.keys(branchSkill).filter(function (k) { return !SKILLS[branchSkill[k]]; });
console.log("分支技能缺失: " + (badBranch.length ? badBranch.join(",") : "无"));

/* REPLAY 覆盖检查：每个回合的 rk 必须为 valid 池里每个技能提供台词 */
var roundsSrc = s.slice(s.indexOf("var ROUNDS=["), s.indexOf("var REPLAY={"));
var ROUNDS = [];
var reR = /rk:"(\w+)"[\s\S]*?valid:(\[[^\]]*\]|"COMBO")/g;
while ((m = reR.exec(roundsSrc))) {
  var v = m[2] === '"COMBO"' ? "COMBO" : m[2].replace(/[\[\]" ]/g, "").split(",").filter(Boolean);
  ROUNDS.push({ rk: m[1], valid: v });
}
console.log("回合: " + ROUNDS.map(function (r) { return r.rk + "=" + (Array.isArray(r.valid) ? r.valid.length : r.valid); }).join(", "));

var replaySrc = s.slice(s.indexOf("var REPLAY={"), s.indexOf("var COMBO_LINES={"));
ROUNDS.forEach(function (r) {
  var start = replaySrc.indexOf(r.rk + ":{");
  var end = replaySrc.indexOf("\n }", start);
  var block = replaySrc.slice(start, end >= 0 ? end + 3 : replaySrc.length);
  if (!Array.isArray(r.valid)) {
    console.log("  " + r.rk + " = COMBO 回合（需 single/same）: " + (block.indexOf("single:") >= 0 && block.indexOf("same:") >= 0 ? "✓" : "✗ 缺 single/same"));
    return;
  }
  var noLine = r.valid.filter(function (sk) { return block.indexOf(sk + ":[") < 0; });
  var hasMiss = block.indexOf("miss:[") >= 0;
  console.log("  " + r.rk + " 台词缺失: " + (noLine.length ? noLine.join(",") : "无") + (hasMiss ? "" : "｜✗ 缺 miss"));
});

/* 反卡死：R1/R2 valid 必含 micro + 全部分支技能 */
var need = ["micro"].concat(Object.keys(branchSkill).map(function (k) { return branchSkill[k]; }));
ROUNDS.forEach(function (r) {
  if (Array.isArray(r.valid)) {
    var miss = need.filter(function (sk) { return r.valid.indexOf(sk) < 0; });
    console.log("  " + r.rk + " 反卡死缺: " + (miss.length ? miss.join(",") : "无(含micro+全分支)"));
  }
});

/* COMBO_LINES 覆盖：5 技能 C(5,2)=10 */
var keys = Object.keys(SKILLS);
var expected = [];
for (var i = 0; i < keys.length; i++) for (var j = i + 1; j < keys.length; j++) expected.push(keys[i] < keys[j] ? keys[i] + "+" + keys[j] : keys[j] + "+" + keys[i]);
var present = expected.filter(function (k) { return s.indexOf('"' + k + '"') >= 0; });
console.log("COMBO_LINES 期望 " + expected.length + " / 命中 " + present.length + (present.length < expected.length ? " 缺:" + expected.filter(function (k) { return present.indexOf(k) < 0; }).join(",") : " 全"));

var forbid = ["作业", "考试", "成绩", "补习", "刷题"];
var hit = forbid.filter(function (w) { return s.indexOf(w) >= 0; });
console.log("高压学业词: " + (hit.length ? "⚠ " + hit.join(",") : "无"));

["浑浑 · 混沌主", "大脑王座 · 前庭", "终极合成", "单线程", "情绪重评", "四招合一", "王座勋章", "事情再多，也一件一件来", "brainexp_ch9_save_v1", "求助口袋卡", "王 座", "已继承第八章"].forEach(function (t) {
  console.log((s.indexOf(t) >= 0 ? "✓ " : "✗ 缺失 ") + t);
});
