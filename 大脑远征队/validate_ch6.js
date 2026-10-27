/* Ch6 静态校验：提取数据块，检查场景引用 / 分支技能 / 反卡死 / COMBO_LINES 覆盖 / 高压词 */
var fs = require("fs");
var s = fs.readFileSync("D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch6-语言风暴.html", "utf8");

function between(a, b) {
  var i = s.indexOf(a), j = s.indexOf(b, i);
  if (i < 0 || j < 0) { console.log("✗ 找不到区块: " + a); process.exit(1); }
  return s.slice(i, j);
}

var skillsSrc = between("var SKILLS={", "var COMBOS=[");
var scenesSrc = between("var SCENES={", "/* ---------- 战斗 ---------- */");
var roundsSrc = between("var ROUNDS=[", "var REPLAY={");
var comboSrc  = between("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */");

/* ---- SKILLS: owner 映射 ---- */
var SKILLS = {};
var re = /(\w+)\s*:\{name:"([^"]+)",owner:"(\w+)"/g, m;
while ((m = re.exec(skillsSrc))) SKILLS[m[1]] = { name: m[2], owner: m[3] };
console.log("技能数: " + Object.keys(SKILLS).length + "  → " + Object.keys(SKILLS).join(", "));

/* ---- SCENES: id / next / skill ---- */
var sceneIds = {}, nextRefs = [], skillScenes = [];
var reS = /(\w+):\{kind:"(\w+)"(?:[^}]*?skill:"(\w+)")?/g;
while ((m = reS.exec(scenesSrc))) {
  sceneIds[m[1]] = 1;
  if (m[3]) skillScenes.push(m[3]);
}
var reN = /next:"(\w+)"/g;
while ((m = reN.exec(scenesSrc))) nextRefs.push(m[1]);
console.log("技能场景(含分支): " + skillScenes.join(", "));

/* 检查 next 引用存在（BATTLE/END 是引擎关键字，不算悬空） */
var bad = nextRefs.filter(function (n) { return !sceneIds[n] && n !== "BATTLE" && n !== "END"; });
console.log("next 悬空引用: " + (bad.length ? bad.join(",") : "无"));

/* 分支技能必须在 SKILLS 中 */
var badBranch = skillScenes.filter(function (sk) { return !SKILLS[sk]; });
console.log("分支技能缺失: " + (badBranch.length ? badBranch.join(",") : "无"));

/* ---- ROUNDS: rk / valid ---- */
var ROUNDS = [];
var reR = /rk:"(\w+)"[\s\S]*?valid:(\[[^\]]*\]|"COMBO")/g;
while ((m = reR.exec(roundsSrc))) {
  var v = m[2] === '"COMBO"' ? "COMBO" : JSON.parse(m[2]);
  ROUNDS.push({ rk: m[1], valid: v });
}
console.log("回合: " + ROUNDS.map(function (r) { return r.rk + "=" + (Array.isArray(r.valid) ? r.valid.length : r.valid); }).join(", "));

/* 反卡死：R1/R2 valid 必含 micro + 全部分支技能 */
var need = []; skillScenes.forEach(function (sk) { if (need.indexOf(sk) < 0) need.push(sk); });
ROUNDS.forEach(function (r) {
  if (Array.isArray(r.valid)) {
    var missing = need.filter(function (sk) { return r.valid.indexOf(sk) < 0; });
    console.log("  " + r.rk + " 缺: " + (missing.length ? missing.join(",") : "无（含micro+分支）"));
  }
});

/* ---- COMBO_LINES 覆盖：所有跨角色对（排除同角色） ---- */
var COMBO = {};
var reC = /"([\w+]+)"/g; // 仅用于键提取，单独处理
var ck = /"([a-z\+]+)":\[/g;
while ((m = ck.exec(comboSrc))) COMBO[m[1]] = 1;
var keys = Object.keys(SKILLS);
var expected = [];
for (var i = 0; i < keys.length; i++) for (var j = i + 1; j < keys.length; j++) {
  if (SKILLS[keys[i]].owner === SKILLS[keys[j]].owner) continue; // 同角色排除
  expected.push([keys[i], keys[j]].sort().join("+"));
}
var missC = expected.filter(function (k) { return !COMBO[k]; });
var extraC = Object.keys(COMBO).filter(function (k) { return expected.indexOf(k) < 0; });
console.log("COMBO_LINES 应有 " + expected.length + " 条，实有 " + Object.keys(COMBO).length + " 条");
console.log("  缺失: " + (missC.length ? missC.join(",") : "无"));
console.log("  多余: " + (extraC.length ? extraC.join(",") : "无"));

/* ---- 高压学业词扫描（仅限 cross 说明与生活文案，禁止突兀出现） ---- */
var forbidden = ["作业", "考试", "成绩", "分数", "排名", "不及格", "补课", "错题", "刷题", "月考", "期中", "期末"];
var hits = forbidden.filter(function (w) { return s.indexOf(w) >= 0; });
console.log("高压学业词: " + (hits.length ? "⚠ " + hits.join(",") : "无"));

/* ---- 长对白扫描（>14 字提醒，非阻断） ---- */
var longLines = (s.match(/(who:"[^"]+",text:"[^"]{15,}")/g) || []);
console.log("长对白(>14字): " + longLines.length + " 处（含章末四人合唱属正常）");
