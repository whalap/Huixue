/* Ch8 静态校验 */
var fs = require("fs");
var s = fs.readFileSync("D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch8-能量峡谷.html", "utf8");

var skillsSrc = s.slice(s.indexOf("var SKILLS={"), s.indexOf("var COMBOS=["));
var SKILLS = {}, m;
var reK = /(\w+)\s*:\{name:"([^"]+)"/g;
while ((m = reK.exec(skillsSrc))) SKILLS[m[1]] = m[2];
console.log("技能(" + Object.keys(SKILLS).length + "): " + JSON.stringify(SKILLS));

var scenesSrc = s.slice(s.indexOf("var SCENES={"), s.indexOf("/* ---------- 战斗"));
var branchSkill = {};
["a2", "b2", "c2", "d2"].forEach(function (sc) {
  var rx = new RegExp(sc + ':\\{kind:"skill",skill:"(\\w+)"');
  var mm = rx.exec(scenesSrc); if (mm) branchSkill[sc] = mm[1];
});
console.log("分支技能(a2/b2/c2/d2): " + JSON.stringify(branchSkill));
var badBranch = Object.keys(branchSkill).filter(function (k) { return !SKILLS[branchSkill[k]]; });
console.log("分支技能缺失: " + (badBranch.length ? badBranch.join(",") : "无"));

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

var keys = Object.keys(SKILLS);
var expected = [];
for (var i = 0; i < keys.length; i++) for (var j = i + 1; j < keys.length; j++) expected.push(keys[i] < keys[j] ? keys[i] + "+" + keys[j] : keys[j] + "+" + keys[i]);
var present = expected.filter(function (k) { return s.indexOf('"' + k + '"') >= 0; });
console.log("COMBO_LINES 期望 " + expected.length + " / 命中 " + present.length + (present.length < expected.length ? " 缺:" + expected.filter(function (k) { return present.indexOf(k) < 0; }).join(",") : " 全"));

var forbid = ["作业", "考试", "成绩", "补习", "刷题"];
var hit = forbid.filter(function (w) { return s.indexOf(w) >= 0; });
console.log("高压学业词: " + (hit.length ? "⚠ " + hit.join(",") : "无"));

["山山 · 压力火山主", "能量峡谷 · 补给站", "身体地图", "降温阀", "组队Buff", "先降温再一起扛", "求助不是软弱，是精准调用资源", "brainexp_ch8_save_v1", "求助口袋卡"].forEach(function (t) {
  console.log((s.indexOf(t) >= 0 ? "✓ " : "✗ 缺失 ") + t);
});
