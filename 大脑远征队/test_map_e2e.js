/* 通关地图 E2E：双视口渲染 + 种子记录 + 打印视图 + 0 错误 */
var path = require("path");
var fs = require("fs");
var NODE_MODULES = "C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules";
var pw = require(path.join(NODE_MODULES, "playwright-core"));
var EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
            "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].filter(fs.existsSync)[0];
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var URL = "file:///" + (DIR + "Ch0-通关地图.html").replace(/\\/g, "/");
var SHOT = DIR + "_map_shots";
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT);

var FILES = ["大脑远征队-Ch1-拖延沼泽.html", "大脑远征队-Ch2-分心花田.html", "Ch3-遗忘迷宫.html",
  "Ch4-理解冰山.html", "Ch5-否定斗技场.html", "Ch6-语言风暴.html", "Ch7-关系回声.html",
  "Ch8-能量峡谷.html", "Ch9-大脑王座.html", "Ch10-边界篇.html", "Ch11-旁观篇.html", "Ch12-数字篇.html"];

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var fails = [];
  function check(c, m) { if (!c) fails.push(m); }

  /* ① 桌面 · 无记录 */
  var ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  var page = await ctx.newPage();
  var errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error") errors.push("console.error: " + m.text()); });
  await page.goto(URL, { waitUntil: "load" });
  await sleep(400);

  var info = await page.evaluate(function () {
    return {
      cards: Array.prototype.slice.call(document.querySelectorAll("#grid .lv")).map(function (a) {
        return { href: a.getAttribute("href"), name: a.querySelector(".lv-name").textContent, boss: a.querySelector(".lv-boss").textContent };
      }),
      prog: Array.prototype.slice.call(document.querySelectorAll(".pstat")).map(function (d) { return d.textContent; }).join(" | "),
      noneN: document.querySelectorAll(".lv-best.none").length,
      squad: document.querySelectorAll("#squad .sq svg").length,
      groups: document.querySelectorAll("#wall .wgrp").length,
      skills: document.querySelectorAll("#wall .skchip").length,
      locked: document.querySelectorAll("#wall .skchip.lock").length,
      pacts: document.querySelectorAll("#pactlist .pactrow").length,
      pactOff: document.querySelectorAll("#pactlist .pactrow.off").length,
      combos: document.querySelectorAll("#grid .lv .lv-row").length,
      overflowX: document.documentElement.scrollWidth - window.innerWidth
    };
  });
  check(info.cards.length === 12, "关卡卡数=" + info.cards.length + "（应 12）");
  FILES.forEach(function (f, i) {
    check(info.cards[i] && info.cards[i].href === f, "第 " + (i + 1) + " 卡链接=" + (info.cards[i] && info.cards[i].href) + "（应 " + f + "）");
  });
  check(info.prog.indexOf("已通关 0 / 12") >= 0, "无记录进度异常: " + info.prog);
  check(info.prog.indexOf("SSS 满评 0 / 12") >= 0, "无记录 SSS 异常: " + info.prog);
  check(info.prog.indexOf("已背回技能 0 / 32") >= 0, "无记录技能解锁数异常: " + info.prog);
  check(info.noneN === 12, "尚未通关数=" + info.noneN + "（应 12）");
  check(info.squad === 4, "队员头像=" + info.squad + "（应 4）");
  check(info.groups === 4, "技能墙分组=" + info.groups + "（应 4）");
  check(info.skills === 32, "技能卡=" + info.skills + "（应 32）");
  check(info.locked === 32, "无记录时应全部置灰，实际=" + info.locked);
  check(info.pacts === 12, "公约行=" + info.pacts + "（应 12）");
  check(info.pactOff === 12, "无记录时公约应全灰，实际=" + info.pactOff);
  check(info.combos >= 12, "连招行过少: " + info.combos);
  var backHome = await page.evaluate(function () {
    var a = document.querySelector('a[href="Ch0-大脑营地.html"]');
    return a ? a.textContent.trim() : "";
  });
  check(backHome.length > 0, "地图页缺少回主页链接");
  check(info.overflowX <= 1, "桌面横向溢出 " + info.overflowX + "px");
  /* 公约正确性抽查 */
  var pactCheck = await page.evaluate(function () {
    var rows = Array.prototype.slice.call(document.querySelectorAll("#pactlist .pactrow"));
    return rows.map(function (r) { return r.querySelector(".pt").textContent; });
  });
  check(pactCheck[2].indexOf("记不住，不丢人") >= 0, "Ch3 公约异常: " + pactCheck[2]);
  check(pactCheck[5].indexOf("不认领") >= 0, "Ch6 公约异常: " + pactCheck[5]);
  check(pactCheck[6].indexOf("不等于他是坏人") >= 0, "Ch7 公约异常: " + pactCheck[6]);
  check(pactCheck[11].indexOf("点赞数") >= 0, "Ch12 公约异常: " + pactCheck[11]);
  check(errors.length === 0, "地图页有运行时错误: " + errors.join(" ; "));
  await page.screenshot({ path: SHOT + "/map-desk.png" });
  await page.screenshot({ path: SHOT + "/map-desk-full.png", fullPage: true });
  await ctx.close();
  console.log("① 桌面（无记录）检查完成");

  /* ② 种子记录：Ch1 SSS / Ch3 A / Ch12 S → 3 通关 1 SSS，技能解锁数应 > 0 */
  ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  page = await ctx.newPage();
  await page.addInitScript(function () {
    localStorage.setItem("brainexp_ch1_best_v3", JSON.stringify({ rating: "SSS", diff: "入门", date: "2026-10-25" }));
    localStorage.setItem("brainexp_ch3_best_v1", JSON.stringify({ rating: "A", diff: "简单", date: "2026-10-25" }));
    localStorage.setItem("brainexp_ch12_best_v1", JSON.stringify({ rating: "S", diff: "困难", date: "2026-10-26" }));
  });
  errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  await page.goto(URL, { waitUntil: "load" });
  await sleep(400);
  var seed = await page.evaluate(function () {
    var prog = Array.prototype.slice.call(document.querySelectorAll(".pstat")).map(function (d) { return d.textContent; }).join(" | ");
    return {
      prog: prog,
      locked: document.querySelectorAll("#wall .skchip.lock").length,
      chips: Array.prototype.slice.call(document.querySelectorAll(".lv-best")).map(function (d) { return d.textContent; }),
      pactOff: document.querySelectorAll("#pactlist .pactrow.off").length
    };
  });
  check(seed.prog.indexOf("已通关 3 / 12") >= 0, "种子进度异常: " + seed.prog);
  check(seed.prog.indexOf("SSS 满评 1 / 12") >= 0, "种子 SSS 异常: " + seed.prog);
  check(/已背回技能 (\d|[12]\d) \/ 32/.test(seed.prog) && parseInt(seed.prog.match(/已背回技能 (\d+) \/ 32/)[1], 10) > 0,
        "种子技能解锁异常: " + seed.prog);
  check(seed.chips[0].indexOf("SSS") >= 0, "Ch1 种子未显示: " + seed.chips[0]);
  check(seed.chips[2].indexOf("A") >= 0, "Ch3 种子未显示: " + seed.chips[2]);
  check(seed.chips[11].indexOf("S") >= 0 && seed.chips[11].indexOf("困难") >= 0, "Ch12 种子未显示: " + seed.chips[11]);
  check(seed.pactOff === 9, "种子后公约灰行=" + seed.pactOff + "（应 9）");
  check(seed.locked < 32, "种子后技能应部分点亮，灰=" + seed.locked);
  check(errors.length === 0, "种子场有运行时错误: " + errors.join(" ; "));
  await page.screenshot({ path: SHOT + "/map-seeded.png" });
  await ctx.close();
  console.log("② 种子记录检查完成");

  /* ③ 打印视图（纸版式） */
  ctx = await browser.newContext({ viewport: { width: 900, height: 1200 } });
  page = await ctx.newPage();
  await page.addInitScript(function () {
    localStorage.setItem("brainexp_ch9_best_v1", JSON.stringify({ rating: "SSS", diff: "困难", date: "2026-10-26" }));
  });
  errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  await page.goto(URL, { waitUntil: "load" });
  await sleep(300);
  await page.emulateMedia({ media: "print" });
  await sleep(300);
  var pr = await page.evaluate(function () {
    return {
      topbar: getComputedStyle(document.getElementById("topbar")).display,
      cardBg: getComputedStyle(document.querySelector(".lv")).backgroundColor,
      cardColor: getComputedStyle(document.querySelector(".lv-name")).color,
      bodyBg: getComputedStyle(document.body).backgroundColor
    };
  });
  check(pr.topbar === "none", "打印时顶栏未隐藏: " + pr.topbar);
  check(pr.cardBg.indexOf("255, 255, 255") >= 0 || pr.cardBg === "rgb(255, 255, 255)", "打印卡片背景非白: " + pr.cardBg);
  check(pr.cardColor.indexOf("28, 28, 28") >= 0, "打印文字非深色: " + pr.cardColor);
  await page.screenshot({ path: SHOT + "/map-print-top.png", clip: { x: 0, y: 0, width: 900, height: 1200 } });
  await page.pdf ? await page.pdf({ path: SHOT + "/战绩单.pdf", format: "A4", printBackground: true }) : null;
  await page.emulateMedia({ media: "screen" });
  await ctx.close();
  console.log("③ 打印视图检查完成");

  /* ④ 手机端 */
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  errors = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  await page.goto(URL, { waitUntil: "load" });
  await sleep(400);
  var mob = await page.evaluate(function () {
    var c = document.querySelector(".lv");
    return {
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      cardW: c.getBoundingClientRect().width,
      mainW: document.querySelector("main").clientWidth,
      btn: !!document.getElementById("btn-print")
    };
  });
  check(mob.overflowX <= 1, "手机横向溢出 " + mob.overflowX + "px");
  check(mob.cardW > mob.mainW - 40, "手机卡片未通栏: " + Math.round(mob.cardW) + " / " + mob.mainW);
  check(mob.btn, "手机端缺少打印按钮");
  check(errors.length === 0, "手机端有运行时错误: " + errors.join(" ; "));
  await page.screenshot({ path: SHOT + "/map-mob.png" });
  await page.screenshot({ path: SHOT + "/map-mob-full.png", fullPage: true });
  await ctx.close();
  console.log("④ 手机端检查完成");

  await browser.close();
  if (fails.length) {
    console.log("\n❌ 失败 " + fails.length + " 项：");
    fails.forEach(function (m) { console.log("   - " + m); });
    process.exit(1);
  }
  console.log("\n✅ 通关地图 · 战绩单 全部通过（截图在 _map_shots/）");
})().catch(function (e) { console.log("❌ 框架错误: " + e.stack); process.exit(1); });
