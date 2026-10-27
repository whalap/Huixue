/* 语法检查：提取 <script> 后 node --check 语义等价（用 Function 构造做编译期检查） */
var fs = require("fs");
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var FILES = ["Ch0-大脑营地.html", "Ch3-遗忘迷宫.html", "Ch4-理解冰山.html", "Ch5-否定斗技场.html",
             "Ch6-语言风暴.html", "Ch7-关系回声.html", "Ch8-能量峡谷.html", "Ch9-大脑王座.html",
             "Ch10-边界篇.html", "Ch11-旁观篇.html", "Ch12-数字篇.html"];
FILES.forEach(function (f) {
  var s = fs.readFileSync(DIR + f, "utf8");
  var m = s.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) { console.log("❌ 无 script: " + f); return; }
  try { new Function(m[1]); console.log("✅ " + f + " (" + m[1].length + " chars)"); }
  catch (e) { console.log("❌ " + f + " → " + e.message); }
});
