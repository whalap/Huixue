/* 修正 Ch3–Ch7：图鉴「小队公约」卡仍贴着 Ch2 的公约（构建脚本从未替换该行）
 * 幂等：新公约第一行已存在则跳过 */
var fs = require("fs");
var DIR = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/";
var OLD = '自己的事情自己拿主意；使唤别人之前，先问一句。';
var FIX = [
  { f: "Ch3-遗忘迷宫.html", lines: ["记不住，不丢人！", "说出来，才记得住！"] },
  { f: "Ch4-理解冰山.html", lines: ["讲不清楚的地方，就是还没懂的地方！", "不懂装懂，才是真的慢！"] },
  { f: "Ch5-否定斗技场.html", lines: ["「我不行」可以改成「我还不行」！", "看见别人做到，我也能——那不是别人的事！"] },
  { f: "Ch6-语言风暴.html", lines: ["贴在我身上的标签，我可以选择不认领！", "把「我不行」说成「我正在学」——一句话就能换天气！"] },
  { f: "Ch7-关系回声.html", lines: ["他做的事让我不舒服，不等于他是坏人！", "不舒服，我可以说出来，不硬撑！"] }
];
FIX.forEach(function (t) {
  var p = DIR + t.f;
  var s = fs.readFileSync(p, "utf8");
  if (s.indexOf('"mantra","' + t.lines[0] + '"') >= 0) { console.log("⏭ 已修过，跳过 " + t.f); return; }
  var lines = s.split("\n");
  var hit = -1;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('"mantra","' + OLD + '"') >= 0) { hit = i; break; }
  }
  if (hit < 0) { console.log("❌ 未找到公约行: " + t.f); return; }
  var indent = lines[hit].match(/^\s*/)[0];
  var out = [indent + 'cc.appendChild(el("div","mantra","' + t.lines[0] + '"));'];
  for (var j = 1; j < t.lines.length; j++) {
    out.push(indent + 'cc.appendChild(el("div","mantra","' + t.lines[j] + '"));');
  }
  lines.splice(hit, 1, out.join("\n"));
  fs.writeFileSync(p, lines.join("\n"), "utf8");
  console.log("✅ 修正 " + t.f + " → " + t.lines.join(" "));
});
