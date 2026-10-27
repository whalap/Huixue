/* Ch2 语法检查 + jsdom 逻辑测试（闭包内数据通过注入 __T 调试导出访问） */
var fs = require("fs");
var path = require("path");
var { JSDOM } = require(path.join("C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules", "jsdom"));

var FILE = "大脑远征队-Ch2-分心花田.html";
var html = fs.readFileSync(FILE, "utf8");

/* ---- 提取 <script> 做语法检查 ---- */
var m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) throw new Error("未找到 script 块");
fs.writeFileSync("_ch2_script.js", m[1]);
console.log("脚本已提取: " + m[1].length + " 字符");

/* ---- 注入调试导出（仅内存副本，不写回文件） ---- */
var INJECT = "boot();\nwindow.__T={SCENES:SCENES,ROUNDS:ROUNDS,REPLAY:REPLAY,COMBO_LINES:COMBO_LINES,COMBO_NAMES:COMBO_NAMES,SKILLS:SKILLS,CHARS:CHARS,TOTEM_ART:TOTEM_ART,COMBOS:COMBOS,NODE_OF_SCENE:NODE_OF_SCENE,MAP_NODES:MAP_NODES,BORROW_ORDER:BORROW_ORDER,NAME2KEY:NAME2KEY,getState:function(){return state;},availSkills:availSkills};\n})();";
if (html.indexOf("boot();\n})();") < 0) throw new Error("注入锚点未找到");
var testHtml = html.replace("boot();\n})();", INJECT);

/* ---- jsdom 环境 ---- */
var errors = [];
function makeDom() {
  var dom = new JSDOM(testHtml, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "https://localhost/ch2"   /* file:// 是不透明源，localStorage 不可用；虚拟 https 源即可 */
  });
  dom.window.addEventListener("error", function (e) { errors.push("window.onerror: " + e.message); });
  var _err = dom.window.console.error;
  dom.window.console.error = function () {
    errors.push("console.error: " + Array.prototype.join.call(arguments, " "));
    _err.apply(null, arguments);
  };
  return dom;
}
function $(doc, s) { return doc.querySelector(s); }
function $$(doc, s) { return Array.prototype.slice.call(doc.querySelectorAll(s)); }
/* jsdom 不跑布局，rect 全为 0——可见性守卫仅 playwright 真浏览器启用 */
var CHECK_LAYOUT = false;
function click(el) {
  if (!el) throw new Error("click: 元素不存在");
  if (el.disabled) throw new Error("click: 按钮被禁用 " + (el.id || el.className));
  if (CHECK_LAYOUT) {
    var r = el.getBoundingClientRect();
    if (r.height === 0 && r.width === 0) throw new Error("click: 元素不可见 " + (el.className || el.id));
  }
  el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent("click", { bubbles: true, cancelable: true }));
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

/* ================= 场景数据静态校验 ================= */
function staticCheck(T) {
  var problems = [];
  var SCENES = T.SCENES, ROUNDS = T.ROUNDS, REPLAY = T.REPLAY,
      COMBO_LINES = T.COMBO_LINES, SKILLS = T.SKILLS,
      TOTEM_ART = T.TOTEM_ART, COMBOS = T.COMBOS, NODE = T.NODE_OF_SCENE;
  Object.keys(SCENES).forEach(function (id) {
    var sc = SCENES[id];
    if (sc.next && sc.next !== "BATTLE" && sc.next !== "END" && !SCENES[sc.next]) problems.push("scene " + id + " next 指向不存在: " + sc.next);
    if (sc.kind === "choice") {
      sc.options.forEach(function (o) {
        if (o.next !== "BATTLE" && o.next !== "END" && !SCENES[o.next]) problems.push("scene " + id + " 选项 next 不存在: " + o.next);
      });
    }
    (sc.lines || []).forEach(function (ln, i) {
      if (ln.who && ln.who !== "旁白" && ln.who !== "四人" && ln.who !== "你" && !T.NAME2KEY[ln.who]) {
        problems.push("scene " + id + " 第" + (i + 1) + "行 who 未登记: " + ln.who);
      }
      if (!ln.anim && !ln.act && !ln.who) problems.push("scene " + id + " 第" + (i + 1) + "行无内容字段");
      if (ln.who && ln.text == null) problems.push("scene " + id + " 第" + (i + 1) + "行 text 为空");
      if (ln.who && ln.text && ln.text.length > 14 && ln.who !== "四人") problems.push("scene " + id + " 第" + (i + 1) + "行对白超14字: " + ln.text);
    });
  });
  ROUNDS.forEach(function (r, i) {
    if (r.valid !== "COMBO") r.valid.forEach(function (v) {
      if (!SKILLS[v]) problems.push("ROUNDS[" + i + "].valid 含未知技能: " + v);
    });
    if (!r.ease) problems.push("ROUNDS[" + i + "] 缺 ease");
  });
  var rks = ["pollen", "bloom", "curse"];
  rks.forEach(function (rk) {
    if (!REPLAY[rk]) { problems.push("REPLAY 缺 " + rk); return; }
    if (rk !== "curse") {
      if (!REPLAY[rk].miss || !REPLAY[rk].miss.length) problems.push("REPLAY." + rk + " 缺 miss");
      ROUNDS[rks.indexOf(rk)].valid.forEach(function (v) {
        if (!REPLAY[rk][v]) problems.push("REPLAY." + rk + " 缺 " + v);
      });
    } else {
      if (!REPLAY.curse.single || !REPLAY.curse.same) problems.push("REPLAY.curse 缺 single/same");
    }
  });
  var ids = Object.keys(SKILLS);
  /* 只校验可达技能对：起始 micro + 场景授予 + 借招池（recode 本章不可获得，不要求） */
  var reachable = {micro:1};
  Object.keys(SCENES).forEach(function (id) { var sc = SCENES[id]; if (sc.kind === "skill") reachable[sc.skill] = 1; });
  T.BORROW_ORDER.forEach(function (id) { reachable[id] = 1; });
  var rids = Object.keys(reachable);
  for (var i = 0; i < rids.length; i++) for (var j = i + 1; j < rids.length; j++) {
    var a = rids[i], b = rids[j];
    if (SKILLS[a].owner !== SKILLS[b].owner) {
      var key = [a, b].sort().join("+");
      if (!COMBO_LINES[key]) problems.push("COMBO_LINES 缺可达跨角色对: " + key);
    }
  }
  COMBOS.forEach(function (c) {
    c.members.forEach(function (mm) { if (!SKILLS[mm]) problems.push("COMBOS " + c.name + " 含未知技能 " + mm); });
    if (!c.locked && c.members.length === 2 && SKILLS[c.members[0]].owner === SKILLS[c.members[1]].owner) {
      problems.push("COMBOS " + c.name + " 是同角色组合，战斗里发不动");
    }
  });
  Object.keys(SKILLS).forEach(function (id) { if (!TOTEM_ART[id]) problems.push("TOTEM_ART 缺 " + id); });
  Object.keys(SCENES).forEach(function (id) { if (NODE[id] == null) problems.push("NODE_OF_SCENE 缺 " + id); });
  return problems;
}

/* ================= 全流程跑通 ================= */
async function playthrough(dom, plan) {
  var w = dom.window, doc = w.document, T = w.__T;
  var log = [];
  click($(doc, "#btn-new"));
  click($$(doc, "#diffGrid .card")[plan.diffIdx]);
  click($$(doc, "#scr-char .char-card")[plan.meIdx]);

  async function advanceStory(maxSteps) {
    for (var s = 0; s < (maxSteps || 80); s++) {
      await sleep(30);
      var tray = $(doc, ".choice-tray");
      if (tray && !tray.classList.contains("hidden")) return "choice";
      if (!$(doc, "#scr-game").classList.contains("active")) return "left-game";
      var skillModal = $(doc, "#modal-skill");
      if (skillModal && !skillModal.classList.contains("hidden")) {
        var flip = $(doc, ".flip-inner");
        if (flip) click(flip);
        await sleep(50);
        var btns = $$(doc, "#skillBox .btn.primary");
        if (btns.length) click(btns[btns.length - 1]);
        continue;
      }
      click($(doc, "#gameBody"));
    }
    throw new Error("advanceStory 超步数");
  }
  async function pickOption(idx) {
    var opts = $$(doc, ".choice-tray .opt");
    if (!opts.length) throw new Error("没有选项");
    click(opts[idx]);
    await advanceStory();
  }
  await advanceStory();               // i1
  var st = await advanceStory();      // i2 技能 + i3
  if (st !== "choice") throw new Error("choice1 未出现, st=" + st);
  await pickOption(plan.branch1);     // 分支 → 技能 → 二选
  st = await advanceStory();
  if (st !== "choice") throw new Error("分支二选未出现, st=" + st);
  await pickOption(plan.branch2);
  await advanceStory();               // conv → BATTLE

  if (!$(doc, "#scr-battle").classList.contains("active")) throw new Error("未进入战斗");
  var b0 = T.getState().battle;
  log.push("战斗开始 skills=" + T.getState().skills.join(",") + " borrowed=" + (b0.borrowed || []).join(","));

  async function battleRound(roundIdx, picks) {
    await sleep(100);
    var hand = $$(doc, "#hand .chip");
    if (!hand.length) throw new Error("R" + (roundIdx + 1) + " 无卡牌");
    picks.forEach(function (id) {
      var chip = hand.filter(function (c) { return c.dataset.id === id; })[0];
      if (!chip) throw new Error("R" + (roundIdx + 1) + " 找不到卡 " + id + " 现有: " + hand.map(function (c) { return c.dataset.id; }).join(","));
      click(chip);
    });
    await sleep(30);
    var btn = $(doc, "#btn-confirm");
    if (btn.disabled) throw new Error("R" + (roundIdx + 1) + " 确认键禁用");
    click(btn);
    await sleep(500);
  }
  await battleRound(0, [plan.r1]);
  await battleRound(1, [plan.r2]);

  // R3 组合：有跨角色对就直接组合；只有同角色技能时故意选两张触发借招
  var have = T.availSkills();
  var cross = null;
  for (var i = 0; i < have.length && !cross; i++) for (var j = i + 1; j < have.length; j++) {
    if (T.SKILLS[have[i]].owner !== T.SKILLS[have[j]].owner) { cross = [have[i], have[j]]; break; }
  }
  if (cross) {
    await battleRound(2, cross);
  } else {
    if (have.length < 2) throw new Error("R3 手牌不足: " + have.join(","));
    await battleRound(2, [have[0], have[1]]);
    var borrow = $(doc, "#modal-borrow");
    if (!borrow || borrow.classList.contains("hidden")) throw new Error("同角色组合未触发借招弹窗");
    click($(doc, "#btn-borrow-yes"));
    await sleep(150);
    var have2 = T.availSkills();
    var cross2 = null;
    for (var i2 = 0; i2 < have2.length && !cross2; i2++) for (var j2 = i2 + 1; j2 < have2.length; j2++) {
      if (T.SKILLS[have2[i2]].owner !== T.SKILLS[have2[j2]].owner) { cross2 = [have2[i2], have2[j2]]; break; }
    }
    if (!cross2) throw new Error("借招后仍凑不出跨角色对: " + have2.join(","));
    await battleRound(2, cross2);
  }

  // 胜利过渡 → 战后剧情 → combo 卡 → 结算
  for (var s2 = 0; s2 < 50; s2++) {
    await sleep(150);
    var skillModal2 = $(doc, "#modal-skill");
    if (skillModal2 && !skillModal2.classList.contains("hidden")) {
      var btns2 = $$(doc, "#skillBox .btn.primary");
      if (btns2.length) click(btns2[btns2.length - 1]);
      continue;
    }
    if ($(doc, "#scr-end").classList.contains("active")) break;
    if ($(doc, "#scr-game").classList.contains("active")) click($(doc, "#gameBody"));
  }
  if (!$(doc, "#scr-end").classList.contains("active")) throw new Error("未到达结算页");
  var rating = ($(doc, "#endBody .rating-big") || {}).textContent;
  log.push("评级 " + rating + " trust=" + T.getState().trust + " flags=" + JSON.stringify(T.getState().flags));
  click($$($(doc, "#endBody"), ".center-row .btn")[0]);   // 图鉴
  await sleep(80);
  if (!$(doc, "#scr-codex").classList.contains("active")) throw new Error("图鉴未打开");
  log.push("图鉴卡片 " + $$(doc, "#codexGrid .cdx-card").length);
  click($(doc, "#btn-codex-back"));
  await sleep(50);
  return { rating: rating, log: log };
}

/* ================= 主流程 ================= */
(async function () {
  var dom0 = makeDom();
  await sleep(120);
  var problems = staticCheck(dom0.window.__T);
  if (problems.length) {
    console.log("❌ 静态校验失败:\n - " + problems.join("\n - "));
    process.exit(1);
  }
  console.log("✅ 场景/战斗/连招数据静态校验通过（含对白≤14字、COMBO_LINES 全覆盖）");
  dom0.window.close();

  var plans = [
    { name: "S 路线 · 眠眠·入门·B线(番茄钟)", diffIdx: 1, meIdx: 2, branch1: 1, branch2: 0, r1: "micro", r2: "tomato", r3: ["micro", "tomato"] },
    { name: "SSS 路线 · 闪闪·简单·D线(mark)", diffIdx: 0, meIdx: 3, branch1: 3, branch2: 0, r1: "micro", r2: "micro", r3: ["micro", "mark"] },
    { name: "SSS 路线 · 松松·半标注·A线(single)", diffIdx: 2, meIdx: 0, branch1: 0, branch2: 0, r1: "single", r2: "micro", r3: ["micro", "single"] },
    { name: "A 路线 · 究究·困难·C线(anchor)", diffIdx: 3, meIdx: 1, branch1: 2, branch2: 1, r1: "micro", r2: "anchor", r3: ["micro", "anchor"] }
  ];
  for (var p = 0; p < plans.length; p++) {
    errors.length = 0;
    var dom = makeDom();
    await sleep(120);
    try {
      var res = await playthrough(dom, plans[p]);
      if (errors.length) throw new Error("运行时错误: " + errors.join(" | "));
      console.log("✅ " + plans[p].name + " → " + res.rating + "  | " + res.log.join(" | "));
    } catch (e) {
      console.log("❌ " + plans[p].name + " 失败: " + e.message);
      if (errors.length) console.log("   运行时错误: " + errors.join(" | "));
      dom.window.close();
      process.exit(1);
    }
    dom.window.close();
  }

  /* 续档测试：战斗中段存档 → 新页面续打 */
  errors.length = 0;
  var domA = makeDom();
  await sleep(120);
  click($(domA.window.document, "#btn-new"));
  click($$(domA.window.document, "#diffGrid .card")[1]);
  click($$(domA.window.document, "#scr-char .char-card")[2]);
  for (var s3 = 0; s3 < 60; s3++) {
    await sleep(60);
    var d = domA.window.document;
    if ($(d, "#scr-battle").classList.contains("active")) break;
    var tray2 = $(d, ".choice-tray");
    if (tray2 && !tray2.classList.contains("hidden")) { click($$(d, ".choice-tray .opt")[1]); continue; }
    var sm = $(d, "#modal-skill");
    if (sm && !sm.classList.contains("hidden")) {
      var bb = $$(d, "#skillBox .btn.primary");
      if (bb.length) click(bb[bb.length - 1]);
      continue;
    }
    if ($(d, "#scr-game").classList.contains("active")) click($(d, "#gameBody"));
  }
  var handA = $$(domA.window.document, "#hand .chip");
  click(handA.filter(function (c) { return c.dataset.id === "micro"; })[0]);
  click($(domA.window.document, "#btn-confirm"));
  await sleep(400);
  var saved = domA.window.localStorage.getItem("brainexp_ch2_save_v1");
  if (!saved) throw new Error("自动存档未写入");
  var sv = JSON.parse(saved);
  if (!sv.battle || sv.battle.round !== 1) throw new Error("存档战斗回合异常");
  domA.window.close();

  /* jsdom 每个实例 localStorage 独立——把存档种子搬进新实例再模拟"打开页面继续" */
  var domB = makeDom();
  await sleep(120);
  domB.window.localStorage.setItem("brainexp_ch2_save_v1", saved);
  click($(domB.window.document, "#btn-continue"));
  await sleep(250);
  var dB = domB.window.document;
  if (!$(dB, "#scr-battle").classList.contains("active")) throw new Error("续档未回到战斗");
  if (domB.window.__T.getState().battle.round !== 1) throw new Error("续档回合丢失");
  console.log("✅ 续档测试通过（R1 出招后存档 → 新页面回到 R2, hp=" + domB.window.__T.getState().battle.hp + "）");
  domB.window.close();

  if (errors.length) { console.log("❌ 运行时错误: " + errors.join(" | ")); process.exit(1); }
  console.log("\n🎉 全部测试通过，0 运行时错误");
})().catch(function (e) { console.log("❌ 测试框架错误: " + e.stack); process.exit(1); });
