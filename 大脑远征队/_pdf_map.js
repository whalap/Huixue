/* 生成打印版 PDF（空白战绩单，A4 纵向） */
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
  var ctx = await browser.newContext({ viewport: { width: 900, height: 1200 } });
  var page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await sleep(500);
  await page.emulateMedia({ media: "print" });
  await sleep(200);
  await page.pdf({ path: DIR + "_map_shots/远征战绩单-打印版.pdf", format: "A4", printBackground: true, margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" } });
  await browser.close();
  var buf = fs.readFileSync(DIR + "_map_shots/远征战绩单-打印版.pdf");
  var n = (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log("✅ PDF 已生成：" + (buf.length / 1024).toFixed(0) + "KB，页数≈" + n);
})();
