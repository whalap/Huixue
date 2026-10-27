/* 确认各章结局里真正写着的公约原文 */
var fs = require("fs");
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var CHECKS = {
  Ch3: ["记不住", "说出来"],
  Ch4: ["讲不清楚", "不懂装懂"],
  Ch5: ["我还不行", "替代经验"],
  Ch6: ["标签", "正在学"],
  Ch7: ["不等于他是坏人", "不硬撑"]
};
Object.keys(CHECKS).forEach(function (k) {
  var s = fs.readFileSync(DIR + "_dump_" + k + ".txt", "utf8");
  var lines = s.split("\n");
  console.log("===== " + k);
  var N = CHECKS[k];
  lines.forEach(function (ln, i) {
    if (N.every(function (n) { return ln.indexOf(n) >= 0; })) {
      console.log("  L" + (i + 1) + ": " + ln.trim().slice(0, 220));
    }
  });
});
