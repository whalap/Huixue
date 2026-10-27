/* Ch2 真浏览器 E2E：playwright-core + 系统 Edge
 * 双视口（桌面 1280×800 / 手机 390×844）：
 *  - 全流程可点（标题→难度→角色→漫画→选择→战斗→借招/连招→结算→图鉴）
 *  - 战斗页/结算页"一屏化"：滚动余量 0px、关键元素完整在视口内
 *  - 选择托盘滚动引导生效（选项全部可见）
 *  - 0 运行时错误；违禁学业词为 0
 *  - 截图核对
 */
var path = require("path");
var fs = require("fs");
var NODE_MODULES = "C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules";
var pw = require(path.join(NODE_MODULES, "playwright-core"));

var EDGE_CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe"
];
var EDGE = EDGE_CANDIDATES.filter(fs.existsSync)[0];
if (!EDGE) { console.log("❌ 未找到系统 Edge"); process.exit(1); }

var FILE_URL = "file:///" + "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch4-理解冰山.html".replace(/\\/g, "/");
var SHOT_DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch4_shots";
if (!fs.existsSync(SHOT_DIR)) fs.mkdirSync(SHOT_DIR);

var FORBIDDEN = ["作业", "数学", "错题", "课文", "考试", "卷子", "做题", "背书", "写作业", "考试成绩"];

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

async function runFlow(page, plan, shotPrefix) {
  var errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error") errors.push("console.error: " + m.text()); });

  await page.goto(FILE_URL, { waitUntil: "load" });
  await sleep(400);

  /* 标题页 */
  await page.waitForSelector("#btn-new", { state: "visible" });
  await page.click("#btn-new");
  await page.waitForSelector("#diffGrid .card", { state: "visible" });
  await page.click("#diffGrid .card:nth-child(" + (plan.diffIdx + 1) + ")");
  await page.waitForSelector("#scr-char .char-card", { state: "visible" });
  await page.click("#scr-char .char-card:nth-child(" + (plan.meIdx + 1) + ")");
  await sleep(300);
  await page.screenshot({ path: SHOT_DIR + "/" + shotPrefix + "-1-camp.png" });

  /* 剧情推进：处理技能弹窗，点画面，直到选择托盘出现 */
  async function advance(maxSteps) {
    for (var i = 0; i < (maxSteps || 70); i++) {
      await sleep(120);
      var st = await page.evaluate(function () {
        var tray = document.querySelector(".choice-tray");
        var sm = document.querySelector("#modal-skill");
        var game = document.querySelector("#scr-game");
        var battle = document.querySelector("#scr-battle");
        var end = document.querySelector("#scr-end");
        return {
          tray: !!(tray && !tray.classList.contains("hidden")),
          skill: !!(sm && !sm.classList.contains("hidden")),
          game: !!(game && game.classList.contains("active")),
          battle: !!(battle && battle.classList.contains("active")),
          end: !!(end && end.classList.contains("active"))
        };
      });
      if (st.end) return "end";
      if (st.battle) return "battle";
      if (st.skill) {
        var hasFlip = await page.$(".flip-inner");
        if (hasFlip) { await page.click(".flip-inner"); await sleep(250); } // 翻面
        await page.click("#skillBox .btn.primary");
        continue;
      }
      if (st.tray) return "choice";
      if (st.game) { await page.click("#gameBody"); continue; }
      await sleep(80);
    }
    throw new Error("advance 超步数");
  }

  var st = await advance();
  if (st !== "choice") throw new Error("choice1 未出现: " + st);
  /* 选择引导断言：选项完整在视口内（手机视口重点） */
  await sleep(900); // 等平滑滚动停稳
  var trayInfo = await page.evaluate(function () {
    var tray = document.querySelector(".choice-tray");
    var r = tray.getBoundingClientRect();
    var opts = Array.prototype.map.call(tray.querySelectorAll(".opt"), function (o) {
      var b = o.getBoundingClientRect(); return { top: b.top, bottom: b.bottom };
    });
    return { top: r.top, bottom: r.bottom, opts: opts, vh: window.innerHeight, hint: (document.querySelector("#nextHint") || {}).textContent };
  });
  var allIn = trayInfo.opts.every(function (o) { return o.top >= 0 && o.bottom <= trayInfo.vh + 1; });
  if (!allIn) throw new Error("选项未全部在视口内: " + JSON.stringify(trayInfo));
  if (!trayInfo.hint || trayInfo.hint.indexOf("选择") < 0) throw new Error("缺少选择提示: " + trayInfo.hint);
  await page.screenshot({ path: SHOT_DIR + "/" + shotPrefix + "-2-choice.png" });

  /* 选分支 → 分支内技能 + 二选 */
  await page.click(".choice-tray .opt >> nth=" + plan.branch1);
  st = await advance();
  if (st !== "choice") throw new Error("分支二选未出现: " + st);
  await page.click(".choice-tray .opt >> nth=" + plan.branch2);
  st = await advance();
  if (st !== "battle") throw new Error("未进入战斗: " + st);

  /* 战斗页一屏化断言 */
  await sleep(900);
  var battleInfo = await page.evaluate(function () {
    function box(sel) { var e = document.querySelector(sel); if (!e) return null; var r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, w: r.width, h: r.height }; }
    return {
      scrollRemain: document.documentElement.scrollHeight - window.innerHeight - window.scrollY,
      boss: box("#bossWrap"), hand: box("#hand"), confirm: box("#btn-confirm"),
      feed: box("#battleFeed"), round: (document.querySelector("#roundName") || {}).textContent,
      bossName: (document.querySelector(".boss-name") || {}).textContent,
      chips: document.querySelectorAll("#hand .chip").length,
      vh: window.innerHeight
    };
  });
  if (battleInfo.scrollRemain > 2) throw new Error("战斗页可滚动 " + battleInfo.scrollRemain + "px（应一屏）");
  ["boss", "hand", "confirm"].forEach(function (k) {
    var b = battleInfo[k];
    if (!b || b.h < 4 || b.top < -1 || b.bottom > battleInfo.vh + 1) throw new Error("战斗元素越界: " + k + " " + JSON.stringify(b));
  });
  if (!battleInfo.chips) throw new Error("战斗无卡牌");
  if (battleInfo.bossName.indexOf("蒙蒙") < 0) throw new Error("Boss 名异常: " + battleInfo.bossName);
  await page.screenshot({ path: SHOT_DIR + "/" + shotPrefix + "-3-battle.png" });

  /* R1 */
  await page.click('#hand .chip[data-id="' + plan.r1 + '"]');
  await page.click("#btn-confirm");
  await sleep(1200);
  /* R2 */
  await page.click('#hand .chip[data-id="' + plan.r2 + '"]');
  await page.click("#btn-confirm");
  await sleep(1200);
  /* R3 */
  await page.click('#hand .chip[data-id="' + plan.r3[0] + '"]');
  await sleep(150);
  await page.click('#hand .chip[data-id="' + plan.r3[1] + '"]');
  await page.click("#btn-confirm");

  /* 借招弹窗（若同角色组合） */
  await sleep(600);
  var borrowOpen = await page.evaluate(function () {
    var m = document.querySelector("#modal-borrow");
    return !!(m && !m.classList.contains("hidden"));
  });
  if (borrowOpen) {
    await page.screenshot({ path: SHOT_DIR + "/" + shotPrefix + "-4-borrow.png" });
    await page.click("#btn-borrow-yes");
    await sleep(300);
    /* 用借来的招 + 一张现有招组合 */
    var pair = await page.evaluate(function () {
      var chips = Array.prototype.slice.call(document.querySelectorAll("#hand .chip"));
      var own = {};
      chips.forEach(function (c) { own[c.dataset.id] = c.querySelector(".own").textContent; });
      for (var i = 0; i < chips.length; i++) for (var j = i + 1; j < chips.length; j++) {
        if (own[chips[i].dataset.id] !== own[chips[j].dataset.id]) return [chips[i].dataset.id, chips[j].dataset.id];
      }
      return null;
    });
    if (!pair) throw new Error("借招后无跨角色对");
    await page.click('#hand .chip[data-id="' + pair[0] + '"]');
    await sleep(120);
    await page.click('#hand .chip[data-id="' + pair[1] + '"]');
    await page.click("#btn-confirm");
  }

  /* 等胜利过渡 → 战后剧情 → 连招卡 → 结算 */
  for (var s = 0; s < 40; s++) {
    await sleep(200);
    var cur = await page.evaluate(function () {
      var sm = document.querySelector("#modal-skill");
      var end = document.querySelector("#scr-end");
      var game = document.querySelector("#scr-game");
      return {
        skill: !!(sm && !sm.classList.contains("hidden")),
        skillBtn: !!(document.querySelector("#skillBox .btn.primary")),
        end: !!(end && end.classList.contains("active")),
        game: !!(game && game.classList.contains("active"))
      };
    });
    if (cur.end) break;
    if (cur.skill && cur.skillBtn) {
      await page.screenshot({ path: SHOT_DIR + "/" + shotPrefix + "-5-combo.png" });
      await page.click("#skillBox .btn.primary");
      continue;
    }
    if (cur.game) { await page.click("#gameBody"); continue; }
  }
  if (!(await page.evaluate(function () { return document.querySelector("#scr-end").classList.contains("active"); }))) {
    throw new Error("未到达结算页");
  }

  /* 结算页一屏化断言 */
  await sleep(700);
  var endInfo = await page.evaluate(function () {
    function box(sel) { var e = document.querySelector(sel); if (!e) return null; var r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, h: r.height }; }
    return {
      scrollRemain: document.documentElement.scrollHeight - window.innerHeight - window.scrollY,
      rating: box("#endBody .rating-big"), wall: box("#endBody .totem-wall"),
      row: box("#endBody .center-row"), sub: (document.querySelector("#endBody .page-sub") || {}).textContent,
      vh: window.innerHeight
    };
  });
  if (endInfo.scrollRemain > 2) throw new Error("结算页可滚动 " + endInfo.scrollRemain + "px（应一屏）");
  ["rating", "wall", "row"].forEach(function (k) {
    var b = endInfo[k];
    if (!b || b.h < 4 || b.top < -1 || b.bottom > endInfo.vh + 1) throw new Error("结算元素越界: " + k + " " + JSON.stringify(b));
  });
  if (endInfo.sub.indexOf("第四章") < 0) throw new Error("结算页标题异常: " + endInfo.sub);
  await page.screenshot({ path: SHOT_DIR + "/" + shotPrefix + "-6-end.png" });

  /* 图鉴 */
  await page.click("#endBody .center-row .btn");
  await sleep(400);
  var codexN = await page.evaluate(function () { return document.querySelectorAll("#codexGrid .cdx-card").length; });
  if (!codexN) throw new Error("图鉴为空");
  await page.screenshot({ path: SHOT_DIR + "/" + shotPrefix + "-7-codex.png" });

  /* 违禁词扫描 */
  var text = await page.evaluate(function () { return document.body.innerText; });
  var hits = FORBIDDEN.filter(function (w) { return text.indexOf(w) >= 0; });
  if (hits.length) throw new Error("违禁学业词: " + hits.join(","));

  if (errors.length) throw new Error("运行时错误 " + errors.length + " 条: " + errors.slice(0, 3).join(" | "));
  return { codexN: codexN };
}

(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var plans = [
    { name: "桌面 · 松松·入门·A线(复利叠加,触发借招)", vw: 1280, vh: 800, diffIdx: 1, meIdx: 0, branch1: 0, branch2: 0, r1: "micro", r2: "compound", r3: ["micro", "compound"], prefix: "desk" },
    { name: "手机 · 闪闪·简单·D线(费曼讲解)", vw: 390, vh: 844, diffIdx: 0, meIdx: 3, branch1: 3, branch2: 0, r1: "micro", r2: "feynman", r3: ["micro", "feynman"], prefix: "mob" }

  ];
  for (var i = 0; i < plans.length; i++) {
    var p = plans[i];
    var ctx = await browser.newContext({ viewport: { width: p.vw, height: p.vh } });
    var page = await ctx.newPage();
    try {
      var r = await runFlow(page, p, p.prefix);
      console.log("✅ " + p.name + " → 图鉴 " + r.codexN + " 卡，0 错误");
    } catch (e) {
      console.log("❌ " + p.name + " 失败: " + e.message);
      try { await page.screenshot({ path: SHOT_DIR + "/" + p.prefix + "-FAIL.png" }); } catch (e2) {}
      await ctx.close();
      await browser.close();
      process.exit(1);
    }
    await ctx.close();
  }
  await browser.close();
  console.log("\n🎉 E2E 双视口全部通过（截图在 _ch4_shots/）");
})().catch(function (e) { console.log("❌ E2E 框架错误: " + e.stack); process.exit(1); });
