/* 从 _dump_chN.txt 解析各章：标题/世界/Boss/技能/公约/连招 */
var fs = require("fs");
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var ks = ["Ch1", "Ch2", "Ch3", "Ch4", "Ch5", "Ch6", "Ch7", "Ch8", "Ch9", "Ch10", "Ch11", "Ch12"];
var all = {};
ks.forEach(function (k) {
  var s = fs.readFileSync(DIR + "_dump_" + k + ".txt", "utf8");
  var o = {};
  o.title = (s.match(/<title>([^<]*)<\/title>/) || [])[1];
  o.sub = (s.match(/<div class="sub">([^<]*)<\/div>/) || [])[1];
  o.boss = (s.match(/<div class="boss-name">([^<]*)<\/div>/) || [])[1];
  var mantras = [], m;
  var re = /"mantra","([^"]*)"\)/g;
  while ((m = re.exec(s))) { mantras.push(m[1]); }
  o.mantras = mantras;
  var skills = [];
  var re2 = /^\s*(\w+)\s*:\{name:"([^"]*)",owner:"(\w+)"/gm;
  while ((m = re2.exec(s))) { skills.push(m[1] + "|" + m[2] + "|" + m[3]); }
  o.skills = skills;
  var combos = [];
  var re3 = /\{name:"([^"]*)",members:\[([^\]]*)\]/g;
  while ((m = re3.exec(s))) { combos.push(m[1] + " = " + m[2]); }
  o.combos = combos;
  all[k] = o;
  console.log("===== " + k);
  console.log(JSON.stringify(o, null, 1));
});
fs.writeFileSync(DIR + "_chapters.json", JSON.stringify(all, null, 1), "utf8");
console.log("\nwritten _chapters.json");
