/* Ch9 构建：从 Ch8 静态源码(_ch9_base.html)换数据 → Ch9-大脑王座.html
 * 章节主题：终章 · 大脑王座（八章所学，合成你的一招）
 * 新技能：终极合成(synthesis,究,核心第21项)；分支=单线程(松)/终极合成(究)/身体地图(眠)/情绪重评(闪) 四角色
 * Boss：浑浑（混沌主 · 「想这么多干嘛……都一样」的声音）——把八章问题搅成一团雾
 * 章末公约：「事情再多，也一件一件来；没有万能招，看情况选招！」
 * 反卡死：R1/R2 有效池必含 micro+全分支技能；R3=COMBO 任意两不同角色
 * 学业铁律：生活例子为主，终章可轻提学习但不施压
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch9_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch9-大脑王座.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 第八章「能量峡谷」</title>',
    '<title>大脑远征队 · 终章「大脑王座」</title>');
rep('<div class="sub">第八章 · 能量峡谷 —— 身体先知道，累了就说出口</div>',
    '<div class="sub">终章 · 大脑王座 —— 八章所学，合成你的一招</div>');
rep('<div class="boss-name">山山 · 压力火山主</div>',
    '<div class="boss-name">浑浑 · 混沌主</div>');
rep('card.appendChild(el("div","page-sub","第八章 · 能量峡谷 —— 完"));',
    'card.appendChild(el("div","page-sub","终章 · 大脑王座 —— 完"));');
rep('if(r==="A")return "过关了。峡谷里不只有岩浆，还有你亲手降下来的那座山。";',
    'if(r==="A")return "过关了。王座上没有别人——这一路，是你自己走过来的。";');
rep('return "也走出了能量峡谷。下次，累了就说出来——不是一个人扛。";',
    'return "也走上了大脑王座。远征没有终点——下一站，是你的每一天。";');
rep('cc.appendChild(el("div","note-sec","第八章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","终章诞生。公约会随章节累积，章末统一收录。"));');
/* 图鉴·公约卡文案 → 本章公约 */
rep('cc.appendChild(el("div","mantra","累了就说出来，不丢人；求助不是软弱，是精准调用资源。"));',
    'cc.appendChild(el("div","mantra","事情再多，也一件一件来；没有万能的一招，只有合适的一招。"));');

/* ============ 2. 角色技能绑定（boss 改名浑浑） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","山山":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","浑浑":"boss","四人":"all"};');

/* ============ 3. SKILLS（5 个：micro/single 沿用 + synthesis 新 + bodymap/reappraise 沿用） ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  single :{name:"单线程",owner:"song",',
'           one:"一次只做一件事——雾再大，也只跨眼前这一阶。",',
'           mantra:"「一次，一件。」",',
'           why:"同时想十件事，脑子就成了一锅粥。单线程不是慢，是让每件事都有做完的一天。",',
'           cross:"一边看电视一边吃饭，饭凉了还不知道味儿——关掉一样，味道就回来了。"},',
'  synthesis:{name:"终极合成",owner:"jiu",',
'           one:"停一秒，看情况选招：这件事，用哪一招？",',
'           mantra:"「没有万能招，只有合适招。」",',
'           why:"八章学的招，没有哪一招通吃。真正的强，是知道什么时候用什么——选招的那一秒，就是王座。",',
'           cross:"出门下雨：小雨快步走，大雨等一等——看情况，不是一条道走到黑。"},',
'  bodymap:{name:"身体地图",owner:"mian",',
'           one:"情绪住在身体里：焦虑在胃里打结，愤怒在肩发紧，麻木在手脚。",',
'           mantra:"「身体先知道，脑子后明白。」",',
'           why:"情绪不是性格缺陷，是身体在报警。先认信号，才能在喷发之前降温。",',
'           cross:"上台前肚子疼？那是身体在说「我在乎」——不是「我不行」。"},',
'  reappraise:{name:"情绪重评",owner:"shan",',
'           one:"把「我不行」换成「我还没选招」——同一件事，换一个说法。",',
'           mantra:"「不是都一样，是我还没挑出那一招。」",',
'           why:"话是滤网：你说出去的那句，决定你看见什么。换个说法，天就换了。",',
'           cross:"「我真笨」换成「这个方法我还没试过」——前者是判刑，后者是路标。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 4. COMBOS（终章两连招均解锁） ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"四招合一",members:["synthesis","micro"],',
'   desc:"终极合成（究）＋微步骤启动（松）——停一秒看情况选招，再迈五秒一步。浑浑最怕你既想得清，又动得了。"},',
'  {name:"王座勋章",members:["synthesis","reappraise"],',
'   desc:"终极合成（究）＋情绪重评（闪）——选招之前，先换个说法：这件事，是「我不行」，还是「我还没选招」。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 5. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"眠眠",text:"第八个世界了……"},',
'  {who:"闪闪",text:"头顶上，就是王座。"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松把八章行李放下：「招还是那一招——先迈五秒一步。八章，都是这么走过来的。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {who:"究究",text:"王座台阶上……缠着雾。"},',
'  {who:"眠眠",text:"那团雾，好像在说话。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"浑浑从雾里浮出来：「想这么多干嘛……都一样。」你先出哪一招？",options:[',
'  {t:"先动起来：一次只做一件事",next:"a1",branch:"A",',
'   after:[{act:"松松跺了跺脚。"},{who:"松松",text:"雾再大，一阶一阶跨。"}]},',
'  {t:"先停一秒：这件事，用哪一招",next:"b1",branch:"B",',
'   after:[{act:"究究抬起手。"},{who:"究究",text:"停一秒，再选。"}]},',
'  {t:"先认信号：身体哪儿在报警",next:"c1",branch:"C",',
'   after:[{act:"眠眠把手放上胃。"},{who:"眠眠",text:"我这里……打结。"}]},',
'  {t:"先换说法：不是不行，是还没选招",next:"d1",branch:"D",',
'   after:[{act:"闪闪清了清嗓。"},{who:"闪闪",text:"「都一样」？不认领。"}]}',
' ]},',
'',
' /* ---- A 线 · 单线程 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"一次，只做一件事。"},',
'  {who:"闪闪",text:"八章里，你先教我的。"}',
' ]},',
' a2:{kind:"skill",skill:"single",lead:"松松摸出一枚旧勋章：「单线程——一次只做一件事。雾再大，也只跨眼前这一阶。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"松松还是急：「可台阶看起来无穷无尽。」你说：",options:[',
'  {t:"「就数眼前这一阶，别的都不看。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"松松",text:"（点头）……就这一阶。"}]},',
'  {t:"「数不清就算了。」",next:"conv",trust:2,',
'   after:[{act:"松松把手放下了。"}]},',
'  {t:"「无穷尽，就是走不到。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"松松的勋章暗了。"}]}',
' ]},',
'',
' /* ---- B 线 · 终极合成 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"究究",text:"停一秒——用哪一招？"},',
'  {who:"眠眠",text:"八章学的……一起用？"}',
' ]},',
' b2:{kind:"skill",skill:"synthesis",lead:"究究翻开远征日志：「终极合成——启动、专注、记忆、理解、相信、语言、关系、能量。看情况，选招。」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"究究犹豫：「招太多，也会挑花眼。」你说：",options:[',
'  {t:"「先看眼前这一件，再挑最像的招。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"究究",text:"（翻页）……就这一招。"}]},',
'  {t:"「挑花眼就随便挑一招。」",next:"conv",trust:2,',
'   after:[{act:"究究把日志合上了。"}]},',
'  {t:"「招越多，越说明你不行。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"究究低下了头。"}]}',
' ]},',
'',
' /* ---- C 线 · 身体地图 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"眠眠",text:"（按住胃）雾里有信号。"},',
'  {who:"松松",text:"身体先知道。"}',
' ]},',
' c2:{kind:"skill",skill:"bodymap",lead:"眠眠摊开地图：「焦虑在胃里打结——先认信号，再上台阶。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"眠眠怕：「万一是我想多了呢。」你说：",options:[',
'  {t:"「信号不分真假，先认下来。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（深呼吸）……认下了。"}]},',
'  {t:"「想多了就别管它。」",next:"conv",trust:2,',
'   after:[{act:"眠眠把手放下了。"}]},',
'  {t:"「就是想太多。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠把地图合上了。"}]}',
' ]},',
'',
' /* ---- D 线 · 情绪重评 ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"闪闪",text:"「都一样」？不认领。"},',
'  {who:"眠眠",text:"（愣）……啊？"}',
' ]},',
' d2:{kind:"skill",skill:"reappraise",lead:"闪闪把雾撕开一条缝：「情绪重评——不是『什么都一样』，是『我还没挑出那一招』。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"闪闪也虚：「可雾会不会又聚回来？」你说：",options:[',
'  {t:"「会。聚回来，就再撕一次。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（握拳）……再撕一次。"}]},',
'  {t:"「会，那就别撕了。」",next:"conv",trust:2,',
'   after:[{act:"闪闪的手垂了下来。"}]},',
'  {t:"「你就是嘴硬。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪别过脸去。"}]}',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"浑浑",text:"混成一团，分不清了吧！"},',
'  {who:"眠眠",text:"（腿软）好多阶……"},',
'  {who:"四人",text:"停一秒——选招，再上！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"浑浑",text:"你们……把雾拆成一件一件事……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"闪闪",text:"想清楚，才选得准。"},',
'  {who:"四人",text:"「事情再多，也一件一件来；没有万能招，看情况选招！」"},',
'  {who:"四人",text:"四招合一——王座，在每一次选招里！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 6. ROUNDS ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 起雾",rk:"mist",',
'  bossLine:"「想这么多干嘛……」台阶缠满雾，八章的问题搅成一团。",',
'  valid:["micro","single","synthesis","bodymap","reappraise"],',
'  ease:"眠眠：先认信号、先动一步、先停一秒——用哪招都行。"},',
' {name:"第 2 回合 · 一锅粥",rk:"blur",',
'  bossLine:"「都一样！都一样！」雾越搅越浑，分不清先做哪件。",',
'  valid:["micro","single","synthesis","bodymap","reappraise"],',
'  ease:"眠眠：稳住——一次只做一件事，或先问一句用哪招。"},',
' {name:"第 3 回合 · 浑浑之核",rk:"core",',
'  bossLine:"「全糊在一起——你永远选不出来！」浑浑胀到最大。",',
'  valid:"COMBO",',
'  ease:"眠眠：一个人选不动。找一位不同角色的队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 7. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' mist:{',
'  micro:["把「一团雾」切成五秒一步——先，踏上第一阶。雾退了一步。"],',
'  single:["一次只做一件事：只看眼前这一阶。雾里露出了路。"],',
'  synthesis:["「停一秒：这件事，用哪一招？」雾被问出了缝。"],',
'  bodymap:["眠眠按住胃：雾里有信号——先认下来。雾淡了一层。"],',
'  reappraise:["「不是『都一样』，是『还没选招』。」雾被撕开一条缝。"],',
'  miss:["眠眠：「再想一招。先认信号、先动一步、先停一秒——都行。」"]',
' },',
' blur:{',
'  micro:["先迈五秒一步：踏上去。粥一样的雾，漏下一格光。"],',
'  single:["一次只做一件事——一阶。搅动的雾，慢了下来。"],',
'  synthesis:["「哪件事最大？先用哪招。」雾被分成了一摞小事。"],',
'  bodymap:["身体先知道：胃在打结。认下信号，雾退到脚边。"],',
'  reappraise:["换个说法：「我还没选招」——不是「我不行」。雾薄了。"],',
'  miss:["眠眠：「用什么都行。稳住了再选——再想一招。」"]',
' },',
' core:{',
'  single:["浑浑抖了抖雾身：「一个人……选不出来……」身后伸过来一只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两招——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 8. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 字母序排序后 "+" 连接；5 技能 C(5,2)=10 条 */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "bodymap+micro"     :["眠眠按住发紧的胃，松松只做一小步：先踏一阶。","先认信号，再动一步。"],',
' "bodymap+reappraise":["身体地图标出胃在打结，闪闪换说法：「我还没选招。」","先认信号，再换台词。"],',
' "bodymap+single"    :["眠眠认下信号，松松一次只做一件事：一阶。","信号亮了，就只走一步。"],',
' "bodymap+synthesis" :["身体先报警，究究停一秒：这件事，用哪一招？","先认信号，再选招。"],',
' "micro+reappraise"  :["松松迈五秒一步，闪闪把「都一样」换成「我还没选」。","一步一换，雾就散了。"],',
' "micro+single"      :["松松只做眼前这一阶——五秒一步。","最小的一步，也走得稳。"],',
' "micro+synthesis"   :["究究选好招，松松迈五秒一步。","选得清，也迈得动。"],',
' "reappraise+single" :["闪闪换个说法，松松一次只做一件事。","换了天，就走一步。"],',
' "reappraise+synthesis":["「我还没选招」——究究停一秒，真的选出了一招。","换个说法，才选得准。"],',
' "single+synthesis"  :["一次只做一件事，究究问：这件，用哪招？","只做一件，也做得对。"]',
'};',
'var COMBO_NAMES={',
' "bodymap+micro":"一图一步","bodymap+reappraise":"一图一换","bodymap+single":"一图一件","bodymap+synthesis":"一图一选",',
' "micro+reappraise":"一步一换","micro+single":"一步一件","micro+synthesis":"一步一选",',
' "reappraise+single":"一换一件","reappraise+synthesis":"一换一选","single+synthesis":"一件一选"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力量，在王座前咬合成一枚勋章。","浑浑的「想这么多干嘛」，被正式拆了开来。"];',
'var BORROW_ORDER=["synthesis","bodymap","reappraise","single"];',
'var BORROW_LINE={',
' mian:"眠眠：「身体地图借你们——先看信号，再选招。」",',
' shan:"闪闪：「情绪重评借你们——把『都一样』换成『我还没选招』。」",',
' jiu :"究究：「终极合成借你们——停一秒，看情况选招。」",',
' song:"松松：「微步骤启动借你们！先迈一小步！」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 9. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"throne",t:"王座大厅",e:"👑"},{k:"boss",t:"浑浑",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 10. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch8_save_v1";', 'var SAVE_KEY="brainexp_ch9_save_v1";');
rep('var BEST_KEY="brainexp_ch8_best_v1";', 'var BEST_KEY="brainexp_ch9_best_v1";');
/* 标题页继承前八章记录（追加 Ch8 继承） */
rep('  if(p7)html+=(html?"<br>":"")+"🏅 已继承社交特别篇：「关系回声」最佳 <b>"+p7.rating+"</b> · "+p7.diff;',
    '  if(p7)html+=(html?"<br>":"")+"🏅 已继承社交特别篇：「关系回声」最佳 <b>"+p7.rating+"</b> · "+p7.diff;\n  var p8=null;\n  try{p8=JSON.parse(localStorage.getItem("brainexp_ch8_best_v1"));}catch(e){}\n  if(p8)html+=(html?"<br>":"")+"🏅 已继承第八章：「能量峡谷」最佳 <b>"+p8.rating+"</b> · "+p8.diff;');

/* ============ 11. 新技能图腾 ============ */
var TOTEM_ADD = [
'TOTEM_ART.synthesis=\'<circle cx="24" cy="24" r="8" fill="none" stroke="TOT" stroke-width="2.6"/><path d="M24 4v9M24 35v9M4 24h9M35 24h9" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/><path d="M12 12l5 5M36 12l-5 5M12 36l5-5M36 36l-5-5" stroke="TOT" stroke-width="2" stroke-linecap="round" opacity=".55"/><circle cx="24" cy="24" r="2.4" fill="TOT"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 12. Boss 浑浑（混沌主 · 「想这么多干嘛……都一样」的声音） ============
 * 铁律：五官画在上部避开对话气泡；金乱线伸出遮挡区；纯色+明暗面，不用 url(#gradient) */
var BOSS_BLOCK = [
'/* ---- Boss 浑浑（混沌主 · 「想这么多干嘛……都一样」的声音） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+50*Math.cos(a)).toFixed(1), py=(52+42*Math.sin(a)).toFixed(1);',
'    chips+=\'<circle cx="\'+px+\'" cy="\'+py+\'" r="\'+(5+(i%3))+\'" fill="\'+(i%2?"#5a6472":"#46505e")+\'" opacity="\'+(0.5+(i%3)*0.16).toFixed(2)+\'"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="60" cy="56" rx="56" ry="52" fill="rgba(18,26,32,.55)"/>\'+',
'  /* 金色乱线（向上伸出气泡遮挡区） */',
'  \'<path d="M34 30 Q22 12 38 5" stroke="#f0b24a" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M60 24 Q60 4 74 7" stroke="#f0b24a" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M86 30 Q98 12 82 5" stroke="#f0b24a" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  /* 混沌身（左暗右亮两面） */',
'  \'<path d="M18 92 Q10 60 30 44 Q36 20 60 18 Q84 20 90 44 Q110 60 102 92 Z" fill="#5a6472" stroke="#2e3440" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M60 18 Q84 20 90 44 Q110 60 102 92 L60 92 Z" fill="#6e7888"/>\'+',
'  /* 漩涡纹 */',
'  \'<path d="M38 66 Q52 55 64 66 Q74 74 64 82" stroke="#46505e" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M76 58 Q86 50 94 56" stroke="#46505e" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  /* 红色 ✕ 眼（画在上部，避开气泡） */',
'  \'<path d="M44 42 l9 9 M53 42 l-9 9" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  \'<path d="M67 42 l9 9 M76 42 l-9 9" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  /* 嘴：一团糊线 */',
'  \'<path d="M50 72 q10 -5 20 0" stroke="#2e3440" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  /* 雾丝 */',
'  \'<path d="M28 96 q8 -6 16 0 M76 96 q8 -6 16 0" stroke="#8a94a4" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><path d="M14 18 l4 4 l-4 4 l-4 -4 Z" fill="#f0b24a"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><path d="M104 30 l4 4 l-4 4 l-4 -4 Z" fill="#8a94a4"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 山山（压力火山主 · 「再加一点你就压垮了」的声音） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 13. 场景插画整段重写：王座前庭 / 王座大厅 / 破晓 ============ */
var SCENESVG_BLOCK = [
'function sceneSVG(kind){',
'  var clear=(kind==="clear"), camp=(kind==="camp"), arena=!clear&&!camp;',
'  var sky1=camp?"#1a1428":(clear?"#3a2a1c":"#141020"), sky2=camp?"#0d0a16":(clear?"#241910":"#0a0812");',
'  var ground1=clear?"#3a2c1e":"#1c1428";',
'  var sid="sk"+kind;',
'  var body="";',
'  if(camp){',
'    /* 王座前庭：地面网格 + 四色光带 + 远处王座 */',
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#150f20"/><rect x="0" y="250" width="880" height="6" fill="#3a2f52"/>\';',
'    for(var r=0;r<3;r++){',
'      body+=\'<path d="M0 \'+(266+r*30)+\' h880" stroke="rgba(240,178,74,.10)" stroke-width="2"/>\';',
'      for(var c=0;c<12;c++){ body+=\'<path d="M\'+(c*76+(r%2?38:0))+\' \'+(266+r*30)+\' v30" stroke="rgba(240,178,74,.09)" stroke-width="2"/>\'; }',
'    }',
'    /* 四色光带（四队员）涌向王座 */',
'    var beams=[["#e8934a",120],["#6aa8d8",300],["#8fbf6a",580],["#c98fd8",760]];',
'    beams.forEach(function(b){',
'      body+=\'<path d="M\'+b[1]+\' 252 C\'+(b[1]-40)+\' 210 \'+(b[1]-20)+\' 160 \'+(440+(b[1]-440)*0.16)+\' 128" stroke="\'+b[0]+\'" stroke-width="6" fill="none" opacity=".34" stroke-linecap="round"/>\';',
'    });',
'    body+=\'<circle cx="440" cy="120" r="86" fill="url(#\'+sid+\'glow)" class="flicker"/>\';',
'    body+=\'<path d="M404 126 L404 92 Q440 74 476 92 L476 126 Z" fill="#2a2140" stroke="#f0b24a" stroke-width="2.4"/>\';',
'    body+=\'<path d="M396 126 L484 126 L492 146 L388 146 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<circle cx="440" cy="100" r="7" fill="#f0d68a" class="flicker"/>\';',
'    body+=\'<rect x="300" y="168" width="280" height="34" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<text x="440" y="191" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">大脑王座 · 前庭</text>\';',
'    body+=\'<ellipse cx="220" cy="274" rx="100" ry="17" fill="rgba(240,178,74,.08)" class="fogA"/>\';',
'    body+=\'<ellipse cx="660" cy="282" rx="100" ry="17" fill="rgba(201,143,216,.07)" class="fogA"/>\';',
'  }else if(arena){',
'    /* 王座大厅：星空 + 双柱 + 王座台 + 满地雾丝 */',
'    for(var t=0;t<4;t++){',
'      var yy=60+t*26;',
'      body+=\'<rect x="0" y="\'+yy+\'" width="180" height="22" rx="3" fill="#1e1830"/><rect x="700" y="\'+yy+\'" width="180" height="22" rx="3" fill="#1e1830"/>\';',
'      for(var s=0;s<9;s++){ body+=\'<circle cx="\'+(20+s*18)+\'" y="\'+(yy+11)+\'" r="4" fill="#\'+(s%2?"f0b24a":"c98fd8")+\'" opacity=".5"/>\'; }',
'      for(var s2=0;s2<9;s2++){ body+=\'<circle cx="\'+(720+s2*18)+\'" y="\'+(yy+11)+\'" r="4" fill="#\'+(s2%2?"f0b24a":"c98fd8")+\'" opacity=".5"/>\'; }',
'    }',
'    body+=\'<rect x="150" y="70" width="26" height="190" fill="#241b36" stroke="#f0b24a" stroke-width="1.6"/>\';',
'    body+=\'<rect x="704" y="70" width="26" height="190" fill="#241b36" stroke="#f0b24a" stroke-width="1.6"/>\';',
'    body+=\'<rect x="144" y="62" width="38" height="10" rx="2" fill="#3a2f52" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<rect x="698" y="62" width="38" height="10" rx="2" fill="#3a2f52" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<path d="M340 0 L400 240 L280 240 Z" fill="rgba(240,178,74,.10)"/>\';',
'    body+=\'<path d="M540 0 L600 240 L480 240 Z" fill="rgba(201,143,216,.08)"/>\';',
'    body+=\'<rect x="0" y="238" width="880" height="142" fill="\'+ground1+\'"/>\';',
'    body+=\'<rect x="0" y="238" width="880" height="4" fill="rgba(240,178,74,.22)"/>\';',
'    for(var g=0;g<5;g++){ body+=\'<path d="M0 \'+(252+g*28)+\' h880" stroke="rgba(240,178,74,.07)" stroke-width="2"/>\'; }',
'    /* 王座台 */',
'    body+=\'<polygon points="320,300 380,272 500,272 560,300 520,348 360,348" fill="#241b36" stroke="#f0b24a" stroke-width="2.4"/>\';',
'    body+=\'<polygon points="380,272 500,272 484,286 396,286" fill="#322648"/>\';',
'    body+=\'<path d="M404 272 L404 240 Q440 224 476 240 L476 272 Z" fill="#2a2140" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<circle cx="440" cy="248" r="5" fill="#f0d68a" class="flicker"/>\';',
'    body+=\'<text x="440" y="318" font-size="20" fill="#f0d68a" text-anchor="middle" font-family="sans-serif" opacity=".8">王 座</text>\';',
'    /* 浮空踏石（远征足迹彩蛋） */',
'    var pv="";',
'    PAVERS.forEach(function(p,i){',
'      var hl=(i===2), pw=52+i*4;',
'      pv+=\'<rect x="\'+(p[0]-pw/2)+\'" y="\'+(p[1]-8)+\'" width="\'+pw+\'" height="20" rx="3" fill="\'+(hl?"#8a6a3a":"#241b36")+\'" stroke="#1c1530" stroke-width="1.5"\'+(hl?\' class="stone-hl"\':\'\')+\'/>\';',
'      pv+=\'<rect x="\'+(p[0]-pw/2+4)+\'" y="\'+(p[1]-6)+\'" width="\'+(pw-8)+\'" height="4" rx="2" fill="rgba(240,178,74,.13)"/>\';',
'    });',
'    body+=pv;',
'    /* 满地雾丝 */',
'    body+=\'<ellipse cx="440" cy="248" rx="370" ry="46" fill="rgba(201,143,216,.10)" class="fogA"/>\';',
'    body+=\'<ellipse cx="300" cy="300" rx="180" ry="30" fill="rgba(138,148,164,.08)" class="fogA"/>\';',
'    body+=\'<ellipse cx="600" cy="310" rx="200" ry="32" fill="rgba(138,148,164,.07)" class="fogA"/>\';',
'  }else{',
'    /* 破晓：雾散，王座镀金 */',
'    body+=\'<rect x="0" y="238" width="880" height="142" fill="\'+ground1+\'"/>\';',
'    body+=\'<rect x="0" y="238" width="880" height="4" fill="rgba(240,214,138,.3)"/>\';',
'    body+=\'<path d="M300 0 L380 238 L260 238 Z" fill="rgba(240,214,138,.10)"/>\';',
'    body+=\'<path d="M580 0 L620 238 L500 238 Z" fill="rgba(240,214,138,.07)"/>\';',
'    body+=\'<polygon points="320,300 380,272 500,272 560,300 520,348 360,348" fill="#2e2418" stroke="#f0d68a" stroke-width="2.4"/>\';',
'    body+=\'<path d="M404 272 L404 240 Q440 224 476 240 L476 272 Z" fill="#3a2c1c" stroke="#f0d68a" stroke-width="2"/>\';',
'    body+=\'<circle cx="440" cy="248" r="6" fill="#f0d68a" class="flicker"/>\';',
'    var pv2="";',
'    PAVERS.forEach(function(p,i){',
'      var pw=52+i*4;',
'      pv2+=\'<rect x="\'+(p[0]-pw/2)+\'" y="\'+(p[1]-8)+\'" width="\'+pw+\'" height="20" rx="3" fill="#43321f" stroke="#1c1530" stroke-width="1.5"/>\';',
'    });',
'    body+=pv2;',
'    body+=\'<g class="flower"><rect x="298" y="250" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="580" y="226" width="9" height="9" rx="2" fill="#e05a4a"/><rect x="222" y="264" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="662" y="274" width="8" height="8" rx="2" fill="#e05a4a"/></g>\';',
'    body+=\'<ellipse cx="440" cy="270" rx="300" ry="40" fill="rgba(240,214,138,.10)" class="fogA"/>\';',
'  }',
'  var skyBlocks=[[64,58,17],[148,38,11],[262,78,13],[352,34,9],[470,62,16],[566,40,10],[662,92,13],[766,48,15],[846,104,10],[196,116,8],[600,124,9]];',
'  var skyG="";',
'  skyBlocks.forEach(function(b,i){',
'    skyG+=\'<rect x="\'+b[0]+\'" y="\'+b[1]+\'" width="\'+b[2]+\'" height="\'+b[2]+\'" rx="2" fill="\'+(i%3===0?"#3a2a1c":(i%3===1?"#241810":"#4a3422"))+\'" opacity="\'+(0.35+(i%4)*0.14).toFixed(2)+\'"/>\';',
'  });',
'  return \'<svg class="scene-svg" viewBox="0 0 880 380" preserveAspectRatio="xMidYMid slice">\'+',
'  \'<defs><linearGradient id="\'+sid+\'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="\'+sky1+\'"/><stop offset="1" stop-color="\'+sky2+\'"/></linearGradient>\'+',
'  \'<radialGradient id="\'+sid+\'glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(240,178,74,.30)"/><stop offset="1" stop-color="rgba(240,178,74,0)"/></radialGradient>\'+',
'  \'</defs>\'+',
'  \'<rect width="880" height="380" fill="url(#\'+sid+\'sky)"/>\'+',
'  skyG+',
'  body+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("function sceneSVG(kind){", "/* ---- 营地横幅（标题页 / 结算页） ---- */", SCENESVG_BLOCK);

/* ============ 14. 营地横幅（标题页/结算页）：营火 → 王座剪影 ============ */
rep("'<rect width=\"880\" height=\"130\" fill=\"#0d1710\"/>'",
    "'<rect width=\"880\" height=\"130\" fill=\"#141020\"/>'");
rep("'<path d=\"M0 106 L140 96 L300 104 L460 96 L620 106 L780 98 L880 104 L880 130 L0 130 Z\" fill=\"#131f16\"/>'",
    "'<path d=\"M0 106 L140 96 L300 104 L460 96 L620 106 L780 98 L880 104 L880 130 L0 130 Z\" fill=\"#1c1630\"/>'");
rep("'<path d=\"M426 100 L454 100 M425 96 L455 104 M455 96 L425 104\" stroke=\"#4a3520\" stroke-width=\"5\" stroke-linecap=\"round\"/>'+\n  '<path class=\"flame\" d=\"M440 98 C430 88 435 76 440 66 C447 76 452 88 440 98 Z\" fill=\"#e8934a\"/>'+\n  '<path class=\"flame f2\" d=\"M440 96 C435 89 437 81 440 75 C443 81 445 89 440 96 Z\" fill=\"#f0d68a\"/>'+",
    "'<path d=\"M424 102 L456 102 L462 112 L418 112 Z\" fill=\"#2a2140\" stroke=\"#f0b24a\" stroke-width=\"2\"/>'+\n  '<path d=\"M428 102 L428 78 Q440 70 452 78 L452 102 Z\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"2\"/>'+\n  '<circle cx=\"440\" cy=\"86\" r=\"4.6\" fill=\"#f0d68a\" class=\"flicker\"/>'+");

/* ============ 15. 结算页分支名 → 终章分支 ============ */
rep('var m={A:"A线 · 身体地图",B:"B线 · 问清压力",C:"C线 · 54321降温",D:"D线 · 组队Buff"};',
    'var m={A:"A线 · 单线程",B:"B线 · 终极合成",C:"C线 · 身体地图",D:"D线 · 情绪重评"};');
/* 观察 → 本章主题（选招收束） */
rep('return "「以后累了，我先看一眼身体在哪儿报警，再说一句『帮我一下』——不是一个人扛。」";',
    'return "「以后不管遇到什么，我先停一秒：这件事，用哪一招？选定了，就迈五秒一步。」";');
/* 隐藏台词 → 终章主题 */
rep('sec.textContent="✨ 隐藏台词：最累的那一次，你不是一个人扛过去的——这句话，是你自己说出口的。";',
    'sec.textContent="✨ 隐藏台词：王座上没有别人——这一路，是你自己走过来的。这句话，是你自己说出口的。";');
/* 连招卡预告语 → 终章没有预告 */
rep('box.appendChild(el("div","locked-note","预告：后续章节，「不放弃」＝ 认知重编程（松）＋微步骤启动（松）＋状态监控（眠）。\\n冲突没有解决的章节，连招图标会是灰色的。"));',
    'box.appendChild(el("div","locked-note","终章没有预告——远征队的下一站，是你的每一天。\\n冲突没有解决的章节，连招图标会是灰色的。"));');

/* ============ 16. 战斗场景背景：sceneSVG 已整段重写（王座大厅） ============ */

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
