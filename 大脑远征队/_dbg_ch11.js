var path = require("path");
var fs = require("fs");
var NODE_MODULES = "C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules";
var pw = require(path.join(NODE_MODULES, "playwright-core"));
var EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].filter(fs.existsSync)[0];
var FILE_URL = "file:///" + "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch11-旁观篇.html".replace(/\\/g, "/");
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var page = await browser.newPage();
  var errs = [];
  page.on("pageerror", function (e) { errs.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error") errs.push("console.error: " + m.text()); });
  await page.goto(FILE_URL, { waitUntil: "load" });
  await sleep(1500);
  console.log("ERRORS(" + errs.length + "): " + errs.slice(0, 3).join(" | "));
  await page.click("#btn-new");
  await sleep(800);
  var st = await page.evaluate(function () {
    return {
      diffCards: document.querySelectorAll("#diffGrid .card").length,
      hasDiffGrid: !!document.querySelector("#diffGrid"),
      activeScreen: (document.querySelector(".screen.active") || {}).id,
      bodyMid: document.body.innerText.slice(0, 300)
    };
  });
  console.log(JSON.stringify(st, null, 2));
  await browser.close();
})();
