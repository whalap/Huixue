var fs = require("fs");
var s = fs.readFileSync("D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch11-旁观篇.html", "utf8");
var m = s.match(/<script>([\s\S]*?)<\/script>/);
fs.writeFileSync("D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_chk0.js", m[1], "utf8");
console.log("extracted " + m[1].length + " chars");
