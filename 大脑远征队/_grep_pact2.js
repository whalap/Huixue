/* 宽松搜索各章可能的公约原文关键词 */
var fs = require("fs");
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var KEY = {
  Ch3: ["丢人", "才记得住", "记得住", "说出来"],
  Ch4: ["还没懂", "才真的慢", "不懂装懂", "讲一遍"],
  Ch5: ["我还不行", "我可以学", "那不是别人的事", "不是别人的"],
  Ch6: ["认领", "换天气", "换一片天", " deriving"],
  Ch7: ["他是坏人", "不等于", "不硬撑", "不舒服，我可以"]
};
Object.keys(KEY).forEach(function (k) {
  var s = fs.readFileSync(DIR + "_dump_" + k + ".txt", "utf8");
  var lines = s.split("\n");
  console.log("===== " + k);
  lines.forEach(function (ln, i) {
    if (KEY[k].some(function (w) { return ln.indexOf(w) >= 0; })) {
      console.log("  L" + (i + 1) + ": " + ln.trim().slice(0, 200));
    }
  });
});
