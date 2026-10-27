var path = require("path");
var fs = require("fs");
var NODE_MODULES = "C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules";
var pw = require(path.join(NODE_MODULES, "playwright-core"));
var EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
            "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].filter(fs.existsSync)[0];
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var URL = "file:///" + (DIR + "Ch0-通关地图.html").replace(/\\/g, "/");
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  var page = await ctx.newPage();
  await page.addInitScript(function () {
    localStorage.setItem("brainexp_ch1_best_v3", JSON.stringify({ rating: "SSS", diff: "入门", date: "2026-10-25" }));
    localStorage.setItem("brainexp_ch9_best_v1", JSON.stringify({ rating: "SSS", diff: "困难", date: "2026-10-26" }));
  });
  await page.goto(URL, { waitUntil: "load" });
  await sleep(400);
  var r = await page.evaluate(function () {
    var w = document.getElementById("wall").getBoundingClientRect();
    var p = document.getElementById("pactlist").getBoundingClientRect();
    window.scrollTo(0, 0);
    return { wall: { x: w.x, y: w.y, w: w.width, h: w.height }, pact: { x: p.x, y: p.y, w: p.width, h: p.height } };
  });
  await page.evaluate(function () { document.getElementById("wall").scrollIntoView(); });
  await sleep(300);
  var wr = await page.evaluate(function () {
    var b = document.getElementById("wall").getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  await page.screenshot({ path: DIR + "_map_shots/wall-clip.png", clip: { x: Math.max(0, wr.x - 8), y: Math.max(0, wr.y - 8), width: wr.w + 16, height: wr.h + 16 } });
  await page.evaluate(function () { document.getElementById("pactlist").scrollIntoView(); });
  await sleep(300);
  var pr = await page.evaluate(function () {
    var b = document.getElementById("pactlist").getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  await page.screenshot({ path: DIR + "_map_shots/pact-clip.png", clip: { x: Math.max(0, pr.x - 8), y: Math.max(0, pr.y - 8), width: pr.w + 16, height: pr.h + 16 } });
  await browser.close();
  console.log("done");
})();
