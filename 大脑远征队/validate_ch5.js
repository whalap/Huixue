/* 静态校验 Ch5 数据完整性（不跑游戏逻辑，只验证数据图） */
var fs = require("fs");
var html = fs.readFileSync("D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch5-否定斗技场.html", "utf8");

function extract(name) {
  // 定位 "var NAME={" 或 "var NAME=["，平衡括号后取出
  var i = html.indexOf("var " + name + "={");
  var open = "{", close = "}";
  if (i < 0) { i = html.indexOf("var " + name + "=["); open = "["; close = "]"; }
  if (i < 0) { console.log("✗ 找不到 var " + name); return null; }
  var j = html.indexOf(open, i);
  var depth = 0, k = j;
  for (; k < html.length; k++) {
    if (html[k] === open) depth++;
    else if (html[k] === close) { depth--; if (depth === 0) { k++; break; } }
  }
  var code = html.slice(i, k);
  try { return eval("(" + code.slice(code.indexOf(open)) + ")"); }
  catch (e) { console.log("✗ " + name + " 解析失败: " + e.message); return null; }
}

var SKILLS = extract("SKILLS");
var SCENES = extract("SCENES");
var ROUNDS = extract("ROUNDS");
var COMBO_LINES = extract("COMBO_LINES");
var NODE = extract("NODE_OF_SCENE");
var COMBOS = extract("COMBOS");
if (!SKILLS || !SCENES || !ROUNDS || !COMBO_LINES || !NODE || !COMBOS) { process.exit(1); }

var errors = [], warns = [];
var SK = Object.keys(SKILLS);
console.log("技能池(" + SK.length + "): " + SK.join(", "));

// 1. scene next 指向 + skill 引用
var ids = Object.keys(SCENES);
var branchSkills = {};
Object.keys(SCENES).forEach(function (id) {
  var sc = SCENES[id];
  if (sc.next && ["BATTLE","END"].indexOf(sc.next) < 0 && !SCENES[sc.next]) errors.push("scene " + id + " 的 next=" + sc.next + " 不存在");
  if (sc.kind === "skill" && SK.indexOf(sc.skill) < 0) errors.push("scene " + id + " 的 skill=" + sc.skill + " 不在技能池");
  if (sc.kind === "choice") (sc.options || []).forEach(function (o) {
    if (o.next && ["BATTLE","END"].indexOf(o.next) < 0 && !SCENES[o.next]) errors.push("choice " + id + " 选项 next=" + o.next + " 不存在");
    if (o.branch) branchSkills[o.branch] = sc.kind === "skill" ? sc.skill : (SCENES[o.next] && SCENES[o.next].skill);
  });
});
console.log("场景数: " + ids.length);

// 2. ROUNDS
ROUNDS.forEach(function (r, idx) {
  var label = "R" + (idx + 1) + "(" + r.rk + ")";
  if (r.valid === "COMBO") return;
  r.valid.forEach(function (v) { if (SK.indexOf(v) < 0) errors.push(label + " valid 含未知技能 " + v); });
  if (r.valid.indexOf("micro") < 0) errors.push(label + " valid 未含 micro —— 可能卡死");
});

// 3. COMBO_LINES 覆盖所有跨角色对（排除同角色）
var owners = {}; SK.forEach(function (k) { owners[k] = SKILLS[k].owner; });
var missing = [];
for (var a = 0; a < SK.length; a++) for (var b = a + 1; b < SK.length; b++) {
  if (owners[SK[a]] === owners[SK[b]]) continue; // 同角色不会组合
  var key = [SK[a], SK[b]].sort().join("+");
  if (!COMBO_LINES[key]) missing.push(key);
}
if (missing.length) errors.push("COMBO_LINES 缺 " + missing.length + " 条跨角色对: " + missing.join(", "));
else console.log("COMBO_LINES 全覆盖 " + Object.keys(COMBO_LINES).length + " 条跨角色对 ✓");

// 4. NODE_OF_SCENE 覆盖全部场景
ids.forEach(function (id) { if (NODE[id] == null) errors.push("NODE_OF_SCENE 缺场景 " + id); });

// 5. 反卡死：每个分支技能 owner ≠ song（保证与 micro 不同角色 → R3 可赢）
Object.keys(branchSkills).forEach(function (br) {
  var sk = branchSkills[br];
  if (sk && owners[sk] === "song") errors.push("分支 " + br + " 技能 " + sk + " 是 song 所有 —— R3 与 micro 同角色无法赢");
});
console.log("分支→技能: " + JSON.stringify(branchSkills));

// 6. 对白长度（仅 text / 选项 t / prompt）
var longLines = [];
Object.keys(SCENES).forEach(function (id) {
  var sc = SCENES[id];
  (sc.lines || []).forEach(function (ln) { if (ln.text && ln.text.length > 14) longLines.push(id + ":" + ln.text); });
  if (sc.kind === "choice") {
    if (sc.prompt && sc.prompt.length > 22) longLines.push(id + " prompt:" + sc.prompt);
    (sc.options || []).forEach(function (o) { if (o.t && o.t.length > 16) longLines.push(id + " opt:" + o.t); });
  }
});
if (longLines.length) warns.push("对白偏长 " + longLines.length + " 处: " + longLines.slice(0,8).join(" | "));

// 7. 违禁高压学业词
["作业","考试","数学","英语","成绩","排名"].forEach(function (w) {
  if (html.indexOf(w) >= 0) warns.push("出现高压学业词「" + w + "」");
});

console.log("");
if (errors.length) { console.log("❌ 错误 " + errors.length + " 处:"); errors.forEach(function (e) { console.log("   - " + e); }); }
else console.log("✅ 数据完整性校验通过");
if (warns.length) { console.log("⚠ 提示 " + warns.length + " 处:"); warns.forEach(function (w) { console.log("   - " + w); }); }
process.exit(errors.length ? 1 : 0);
