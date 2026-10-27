var path = require("path");
var fs = require("fs");
var NODE_MODULES = "C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules";
var pw = require(path.join(NODE_MODULES, "playwright-core"));
var EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].filter(fs.existsSync)[0];
var FILE_URL = "file:///" + "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch12-数字篇.html".replace(/\\/g, "/");
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(FILE_URL, { waitUntil: "load" });
  await sleep(600);
  await page.click("#btn-new");
  await page.waitForSelector("#diffGrid .card");
  await page.click("#diffGrid .card:nth-child(2)");
  await page.waitForSelector("#scr-char .char-card");
  await page.click("#scr-char .char-card:nth-child(4)");
  /* 快进到战斗 */
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
  var r = await page.evaluate(function () {
    var b = document.querySelector("#bossWrap").getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  console.log("bossWrap rect: " + JSON.stringify(r));
  await page.screenshot({ path: "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch12_shots/boss-clip.png", clip: { x: Math.max(0, r.x - 10), y: Math.max(0, r.y - 10), width: r.w + 20, height: r.h + 20 } });
  await browser.close();
  console.log("done");
})()
