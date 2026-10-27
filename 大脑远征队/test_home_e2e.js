/* 主页 Ch0-大脑营地 E2E + 全章节冒烟：playwright-core + 系统 Edge
 * ① 主页桌面/手机双视口：8 关卡卡、链接文件名、进度汇总、求助卡、0 错误
 * ② 种子记录：localStorage 预置两条最佳记录 →  chips 与汇总正确显示
 * ③ 12 章冒烟：goto 每章 → 0 pageerror + boot 已跑（diffGrid 有卡）+ 回主页按钮在位 + 求助卡代码在位
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

var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var HOME_URL = "file:///" + (DIR + "Ch0-大脑营地.html").replace(/\\/g, "/");
var SHOT_DIR = DIR + "_home_shots";
if (!fs.existsSync(SHOT_DIR)) fs.mkdirSync(SHOT_DIR);

var EXPECT = [
  { file: "大脑远征队-Ch1-拖延沼泽.html", key: "brainexp_ch1_best_v3" },
  { file: "大脑远征队-Ch2-分心花田.html", key: "brainexp_ch2_best_v1" },
  { file: "Ch3-遗忘迷宫.html", key: "brainexp_ch3_best_v1" },
  { file: "Ch4-理解冰山.html", key: "brainexp_ch4_best_v1" },
  { file: "Ch5-否定斗技场.html", key: "brainexp_ch5_best_v1" },
  { file: "Ch6-语言风暴.html", key: "brainexp_ch6_best_v1" },
  { file: "Ch7-关系回声.html", key: "brainexp_social_best_v1" },
  { file: "Ch8-能量峡谷.html", key: "brainexp_ch8_best_v1" },
  { file: "Ch9-大脑王座.html", key: "brainexp_ch9_best_v1" },
  { file: "Ch10-边界篇.html", key: "brainexp_ch10_best_v1" },
  { file: "Ch11-旁观篇.html", key: "brainexp_ch11_best_v1" },
  { file: "Ch12-数字篇.html", key: "brainexp_ch12_best_v1" }
];

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function fileUrl(f) { return "file:///" + (DIR + f).replace(/\\/g, "/"); }

(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var failures = [];
  function check(cond, msg) { if (!cond) failures.push(msg); }

  /* ============ ① 主页 · 桌面（无记录） ============ */
  var ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  var page = await ctx.newPage();
  var errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error") errors.push("console.error: " + m.text()); });

  await page.goto(HOME_URL, { waitUntil: "load" });
  await sleep(400);

  var cards = await page.evaluate(function () {
    return Array.prototype.slice.call(document.querySelectorAll(".lv")).map(function (a) {
      return { href: a.getAttribute("href"), name: a.querySelector(".lv-name").textContent };
    });
  });
  check(cards.length === 12, "主页关卡卡数量=" + cards.length + "（应 12）");
  EXPECT.forEach(function (e, i) {
    check(cards[i] && cards[i].href === e.file, "第 " + (i + 1) + " 卡链接=" + (cards[i] && cards[i].href) + "（应 " + e.file + "）");
  });
  var prog = await page.evaluate(function () {
    return Array.prototype.slice.call(document.querySelectorAll(".pstat")).map(function (d) { return d.textContent; }).join(" | ");
  });
  check(prog.indexOf("已通关 0 / 12") >= 0, "无记录时进度汇总异常: " + prog);
  check(prog.indexOf("SSS 满评 0 / 12") >= 0, "无记录时 SSS 汇总异常: " + prog);
  var noneN = await page.evaluate(function () { return document.querySelectorAll(".lv-best.none").length; });
  check(noneN === 12, "「尚未通关」芯片数=" + noneN + "（应 12）");
  var squadN = await page.evaluate(function () { return document.querySelectorAll("#squad .sq").length; });
  check(squadN === 4, "小队人数=" + squadN + "（应 4）");
  var helpTxt = await page.evaluate(function () { return document.body.textContent; });
  check(helpTxt.indexOf("求助口袋卡") >= 0 && helpTxt.indexOf("54321") >= 0, "主页缺少求助口袋卡块");
  var mapLinks = await page.evaluate(function () {
    return Array.prototype.slice.call(document.querySelectorAll('a[href="Ch0-通关地图.html"]')).map(function (a) { return a.textContent.trim(); });
  });
  check(mapLinks.length >= 2, "主页「通关地图」入口数=" + mapLinks.length + "（应 ≥2：顶栏 + 说明块）");
  check(errors.length === 0, "主页桌面有运行时错误: " + errors.join(" ; "));
  await page.screenshot({ path: SHOT_DIR + "/home-desk.png" });
  await page.screenshot({ path: SHOT_DIR + "/home-desk-full.png", fullPage: true });
  await ctx.close();
  console.log("① 主页桌面（无记录）检查完成");

  /* ============ ② 主页 · 种子记录 ============ */
  ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  page = await ctx.newPage();
  await page.addInitScript(function () {
    localStorage.setItem("brainexp_ch1_best_v3", JSON.stringify({ rating: "SSS", diff: "入门", date: "2026-10-25" }));
    localStorage.setItem("brainexp_ch8_best_v1", JSON.stringify({ rating: "S", diff: "困难", date: "2026-10-24" }));
  });
  errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  await page.goto(HOME_URL, { waitUntil: "load" });
  await sleep(400);
  var seed = await page.evaluate(function () {
    var chips = Array.prototype.slice.call(document.querySelectorAll(".lv-best")).map(function (d) { return d.textContent; });
    var prog = Array.prototype.slice.call(document.querySelectorAll(".pstat")).map(function (d) { return d.textContent; }).join(" | ");
    return { chips: chips, prog: prog };
  });
  check(seed.chips[0].indexOf("SSS") >= 0 && seed.chips[0].indexOf("入门") >= 0, "Ch1 种子记录未显示: " + seed.chips[0]);
  check(seed.chips[7].indexOf("S") >= 0 && seed.chips[7].indexOf("困难") >= 0, "Ch8 种子记录未显示: " + seed.chips[7]);
  check(seed.prog.indexOf("已通关 2 / 12") >= 0, "种子进度汇总异常: " + seed.prog);
  check(seed.prog.indexOf("SSS 满评 1 / 12") >= 0, "种子 SSS 汇总异常: " + seed.prog);
  check(errors.length === 0, "主页种子场有运行时错误: " + errors.join(" ; "));
  await page.screenshot({ path: SHOT_DIR + "/home-seeded.png" });
  await ctx.close();
  console.log("② 主页种子记录检查完成");

  /* ============ ③ 主页 · 手机 ============ */
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  await page.goto(HOME_URL, { waitUntil: "load" });
  await sleep(400);
  var mob = await page.evaluate(function () {
    var c = document.querySelector(".lv");
    return {
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      cardW: c.getBoundingClientRect().width,
      mainW: document.querySelector("main").clientWidth
    };
  });
  check(mob.overflowX <= 1, "主页手机端横向溢出 " + mob.overflowX + "px");
  check(mob.cardW > mob.mainW - 40, "手机端卡片未通栏: card=" + Math.round(mob.cardW) + " main=" + mob.mainW);
  check(errors.length === 0, "主页手机端有运行时错误: " + errors.join(" ; "));
  await page.screenshot({ path: SHOT_DIR + "/home-mob.png" });
  await page.screenshot({ path: SHOT_DIR + "/home-mob-full.png", fullPage: true });
  await ctx.close();
  console.log("③ 主页手机端检查完成");

  /* ============ ④ 十二章冒烟 ============ */
  for (var i = 0; i < EXPECT.length; i++) {
    var f = EXPECT[i].file;
    ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    page = await ctx.newPage();
    errors = [];
    page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
    page.on("console", function (m) { if (m.type() === "error") errors.push("console.error: " + m.text()); });
    await page.goto(fileUrl(f), { waitUntil: "load" });
    await sleep(500);
    var smoke = await page.evaluate(function () {
      return {
        diffKids: document.querySelectorAll("#diffGrid .card, #diffGrid > *").length,
        btnHome: document.querySelectorAll("#btn-home").length,
        btnHomePause: document.querySelectorAll("#btn-home-pause").length,
        titleActive: document.querySelector("#scr-title").classList.contains("active"),
        hasHelp: document.documentElement.innerHTML.indexOf("求助口袋卡") >= 0,
        hasHomeLink: document.documentElement.innerHTML.indexOf("Ch0-大脑营地.html") >= 0
      };
    });
    check(errors.length === 0, f + " 有运行时错误: " + errors.join(" ; "));
    check(smoke.diffKids >= 4, f + " boot 似乎未跑（diffGrid 子元素 " + smoke.diffKids + "）");
    check(smoke.btnHome === 1, f + " 标题页缺少回主页按钮");
    check(smoke.btnHomePause === 1, f + " 暂停菜单缺少回主页按钮");
    check(smoke.titleActive, f + " 标题页未激活");
    check(smoke.hasHelp, f + " 图鉴缺少求助口袋卡代码");
    check(smoke.hasHomeLink, f + " 缺少回主页链接代码");
    await ctx.close();
    console.log("④ 冒烟 " + f + " → " + (smoke.diffKids >= 4 && smoke.btnHome === 1 && smoke.btnHomePause === 1 && smoke.hasHelp ? "OK" : "见失败清单"));
  }

  await browser.close();

  if (failures.length) {
    console.log("\n❌ 失败 " + failures.length + " 项：");
    failures.forEach(function (m) { console.log("   - " + m); });
    process.exit(1);
  }
  console.log("\n✅ 主页 + 十二章冒烟全部通过");
})();
