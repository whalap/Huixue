/* 用真浏览器导出各章源码（绕过命令行读取限制）→ _dump_chN.txt */
var path = require("path");
var fs = require("fs");
var NODE_MODULES = "C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules";
var pw = require(path.join(NODE_MODULES, "playwright-core"));
var EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
            "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].filter(fs.existsSync)[0];
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var FILES = [
  ["Ch1", "大脑远征队-Ch1-拖延沼泽.html"],
  ["Ch2", "大脑远征队-Ch2-分心花田.html"],
  ["Ch3", "Ch3-遗忘迷宫.html"],
  ["Ch4", "Ch4-理解冰山.html"],
  ["Ch5", "Ch5-否定斗技场.html"],
  ["Ch6", "Ch6-语言风暴.html"],
  ["Ch7", "Ch7-关系回声.html"],
  ["Ch8", "Ch8-能量峡谷.html"],
  ["Ch9", "Ch9-大脑王座.html"],
  ["Ch10", "Ch10-边界篇.html"],
  ["Ch11", "Ch11-旁观篇.html"],
  ["Ch12", "Ch12-数字篇.html"]
];
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
(async function () {
  var browser = await pw.chromium.launch({ executablePath: EDGE, headless: true });
  var page = await browser.newPage();
  for (var i = 0; i < FILES.length; i++) {
    var url = "file:///" + (DIR + FILES[i][1]).replace(/\\/g, "/");
    await page.goto(url, { waitUntil: "load" });
    await sleep(200);
    var html = await page.content();
    fs.writeFileSync(DIR + "_dump_" + FILES[i][0] + ".txt", html, "utf8");
    console.log("dumped " + FILES[i][0] + " (" + html.length + " chars)");
  }
  await browser.close();
})();
