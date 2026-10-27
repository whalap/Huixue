var path = require("path");
var fs = require("fs");
var NODE_MODULES = "C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules";
var pw = require(path.join(NODE_MODULES, "playwright-core"));
var EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].filter(fs.existsSync)[0];
var FILE_URL = "file:///" + "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch12-数字篇.html".replace(/\\/g, "/");
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3 });
  var page = await ctx.newPage();
  await page.goto(FILE_URL, { waitUntil: "load" });
  await sleep(600);
  await page.click("#btn-new");
  await page.waitForSelector("#diffGrid .card");
  await page.click("#diffGrid .card:nth-child(2)");
  await page.waitForSelector("#scr-char .char-card");
  await page.click("#scr-char .char-card:nth-child(4)");
  for (var i = 0; i < 60; i++) {
    await sleep(150);
    var st = await page.evaluate(function () {
      var tray = document.querySelector(".choice-tray");
      var sm = document.querySelector("#modal-skill");
      var battle = document.querySelector("#scr-battle");
      var game = document.querySelector("#scr-game");
      return {
        tray: !!(tray && !tray.classList.contains("hidden")),
        skill: !!(sm && !sm.classList.contains("hidden")),
        game: !!(game && game.classList.contains("active")),
        battle: !!(battle && battle.classList.contains("active"))
      };
    });
    if (st.battle) break;
    if (st.skill) { await page.click("#skillBox .btn.primary"); continue; }
    if (st.tray) { await page.click(".choice-tray .opt >> nth=2"); continue; }
    if (st.game) { await page.click("#gameBody"); continue; }
  }
  await sleep(1000);
  var info = await page.evaluate(function () {
    var bw = document.querySelector("#bossWrap").getBoundingClientRect();
    var svg = document.querySelector("#bossWrap svg");
    /* 气泡 = 战斗区里的对话气泡，找含 bossLine 的容器 */
    var bub = null;
    var all = document.querySelectorAll("#scr-battle *");
    Array.prototype.forEach.call(all, function (e) {
      var cs = getComputedStyle(e);
      if (cs.position === "absolute" && e.getBoundingClientRect().height > 30 && e.getBoundingClientRect().width > 100 && e.textContent && e.textContent.indexOf("你看人家的生活") >= 0) {
        if (!bub || e.getBoundingClientRect().width < bub.width) bub = e.getBoundingClientRect();
      }
    });
    return { boss: { x: bw.x, y: bw.y, w: bw.width, h: bw.height }, bubble: bub ? { x: bub.x, y: bub.y, w: bub.width, h: bub.height } : null };
  });
  console.log(JSON.stringify(info));
  var r = info.boss;
  var top = { x: r.x - 6, y: r.y - 6, width: r.w + 12, height: Math.max(60, (info.bubble ? info.bubble.y - r.y + 20 : r.h)) };
  await page.screenshot({ path: "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch12_shots/boss-zoom.png", clip: top });
  await browser.close();
  console.log("done");
})()
