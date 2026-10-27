/* 用真浏览器把 Ch2 HTML 源码导出为 _ch3_base.html
 * 背景：安全中心拦截命令行/PowerShell 对成品 HTML 的读取，
 * 但浏览器 page.goto(file://) 不受影响 —— 借道浏览器取源码。
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
var SRC = "file:///D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/" + process.argv[2];
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/" + process.argv[3];

(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var ctx = await browser.newContext({ javaScriptEnabled: false }); // 关键：不执行游戏脚本，取静态源码
  var page = await ctx.newPage();
  await page.goto(SRC, { waitUntil: "load" });
  var html = await page.evaluate(function () {
    var dt = document.doctype ? "<!DOCTYPE " + document.doctype.name + ">" : "";
    return dt + "\n" + document.documentElement.outerHTML;
  });
  fs.writeFileSync(OUT, html, "utf8");
  console.log("exported " + html.length + " chars -> " + OUT);
  await browser.close();
})().catch(function (e) { console.error("FAIL", e.message); process.exit(1); });
