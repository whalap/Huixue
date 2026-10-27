/* 检查各章「公约 / mantra」出现处 */
var fs = require("fs");
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var ks = ["Ch1", "Ch2", "Ch3", "Ch4", "Ch5", "Ch6", "Ch7", "Ch8", "Ch9", "Ch10", "Ch11", "Ch12"];
ks.forEach(function (k) {
  var s = fs.readFileSync(DIR + "_dump_" + k + ".txt", "utf8");
  console.log("===== " + k);
  var lines = s.split("\n");
  lines.forEach(function (ln, i) {
    if (ln.indexOf("mantra") >= 0 || ln.indexOf("公约") >= 0) {
      console.log("  L" + (i + 1) + ": " + ln.trim().slice(0, 200));
    }
  });
});
