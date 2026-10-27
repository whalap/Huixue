/* 社交特别篇 静态校验 */
var fs = require("fs");
var s = fs.readFileSync("D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch7-关系回声.html", "utf8");

/* SKILLS 键 */
var skillsSrc = s.slice(s.indexOf("var SKILLS={"), s.indexOf("var COMBOS=["));
var SKILLS = {}, m;
var reK = /(\w+)\s*:\{name:"([^"]+)"/g;
while ((m = reK.exec(skillsSrc))) SKILLS[m[1]] = m[2];
console.log("技能(" + Object.keys(SKILLS).length + "): " + JSON.stringify(SKILLS));

/* SCENES */
var scenesSrc = s.slice(s.indexOf("var SCENES={"), s.indexOf("/* ---------- 战斗"));
var sceneIds = {}, nextRefs = [], branchSkill = {};
var reId = /(\w+):\{kind:"(\w+)"/g;
while ((m = reId.exec(scenesSrc))) sceneIds[m[1]] = m[2];
var reN = /next:"(\w+)"/g;
while ((m = reN.exec(scenesSrc))) nextRefs.push(m[1]);
var reB = /branch:"(\w)"[^}]*?next:"(\w+)"/g;
while ((m = reB.exec(scenesSrc))) { /* 找该 next 场景的 skill */ }
/* 从 skill 场景取分支技能：a2/b2/c2/d2 的 skill 字段 */
["a2", "b2", "c2", "d2"].forEach(function (sc) {
  var rx = new RegExp(sc + ':\\{kind:"skill",skill:"(\\w+)"');
  var mm = rx.exec(scenesSrc); if (mm) branchSkill[sc] = mm[1];
});
console.log("场景数: " + Object.keys(sceneIds).length);
var badNext = nextRefs.filter(function (n) { return !sceneIds[n]; });
console.log("next 悬空: " + (badNext.length ? badNext.join(",") : "无"));
console.log("分支技能(a2/b2/c2/d2): " + JSON.stringify(branchSkill));
var badBranch = Object.keys(branchSkill).filter(function (k) { return !SKILLS[branchSkill[k]]; });
console.log("分支技能缺失: " + (badBranch.length ? badBranch.join(",") : "无"));

/* ROUNDS 反卡死 */
var roundsSrc = s.slice(s.indexOf("var ROUNDS=["), s.indexOf("var REPLAY={"));
var ROUNDS = [];
var reR = /rk:"(\w+)"[\s\S]*?valid:(\[[^\]]*\]|"COMBO")/g;
while ((m = reR.exec(roundsSrc))) {
  var v = m[2] === '"COMBO"' ? "COMBO" : m[2].replace(/[\[\]" ]/g, "").split(",").filter(Boolean);
  ROUNDS.push({ rk: m[1], valid: v });
}
console.log("回合: " + ROUNDS.map(function (r) { return r.rk + "=" + (Array.isArray(r.valid) ? r.valid.length : r.valid); }).join(", "));
var need = ["micro"].concat(Object.keys(branchSkill).map(function (k) { return branchSkill[k]; }));
ROUNDS.forEach(function (r) {
  if (Array.isArray(r.valid)) {
    var miss = need.filter(function (sk) { return r.valid.indexOf(sk) < 0; });
    console.log("  " + r.rk + " 缺: " + (miss.length ? miss.join(",") : "无(含micro+全分支)"));
  }
});

/* COMBO_LINES 覆盖 C(5,2) */
var keys = Object.keys(SKILLS);
var expected = [];
for (var i = 0; i < keys.length; i++) for (var j = i + 1; j < keys.length; j++) expected.push(keys[i] < keys[j] ? keys[i] + "+" + keys[j] : keys[j] + "+" + keys[i]);
var present = expected.filter(function (k) { return s.indexOf('"' + k + '"') >= 0; });
console.log("COMBO_LINES 期望 " + expected.length + " / 命中 " + present.length + (present.length < expected.length ? " 缺:" + expected.filter(function (k) { return present.indexOf(k) < 0; }).join(",") : " 全"));

/* 高压学业词 */
var forbid = ["作业", "考试", "成绩", "补习", "刷题", "满分", "排名"];
var hit = forbid.filter(function (w) { return s.indexOf(w) >= 0; });
console.log("高压学业词: " + (hit.length ? "⚠ " + hit.join(",") : "无"));

/* 关键文案核对 */
["一刀 · 一刀切主", "关系回声 · 朋友篇", "我句式", "行为透镜", "说清楚也留得住", "他做的事让我不舒服，不等于他是坏人", "brainexp_social_save_v1"].forEach(function (t) {
  console.log((s.indexOf(t) >= 0 ? "✓ " : "✗ 缺失 ") + t);
});
