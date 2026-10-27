/* Ch11 构建：从 Ch10 静态源码(_ch11_base.html)换数据 → Ch11-旁观篇.html
 * 章节主题：旁观篇 · 看台边（元宝游戏包「旁观者行动牌」落地）
 * 新技能：旁观出手(standby,眠)——最小可行动作：站过去、递句话、找大人；不能选无视
 * 分支=微步骤启动(松)/自我解释(究)/我句式(闪,Ch7复用)/旁观出手(眠) 四角色
 * Boss：看看（看看主 · 「不关你的事，看看就行」的声音）——让旁观者沉默的那股声音
 * 外部伙伴：暖暖（被建群嘲的新朋友）+阿嗨（起外号的人），借队员台词间接出场
 * 章末公约：「看见别人被堵住，我可以出手——最小的一步，也算数！」「不能选无视——无视，也是选了边。」
 * 反卡死：R1/R2 有效池必含 micro+全分支技能；R3=COMBO 任意两不同角色
 * 红线：找大人是兜底动作（standby 第三档），不逼孩子独自扛
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch11_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch11-旁观篇.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 边界篇「界线平原」</title>',
    '<title>大脑远征队 · 旁观篇「看台边」</title>');
rep('<div class="sub">边界篇 · 界线平原 —— 说不行，也给理由</div>',
    '<div class="sub">旁观篇 · 看台边 —— 为别人出手</div>');
rep('<div class="boss-name">逼逼 · 逼你同意主</div>',
    '<div class="boss-name">看看 · 看看主</div>');
rep('card.appendChild(el("div","page-sub","边界篇 · 界线平原 —— 完"));',
    'card.appendChild(el("div","page-sub","旁观篇 · 看台边 —— 完"));');
rep('if(r==="A")return "过关了。三条线都在你手里——红的、黄的、绿的，你自己选。";',
    'if(r==="A")return "过关了。站在别人旁边的那一步，你自己迈出去的。";');
rep('return "也守住了三条线。说「不行」的那一次，你把自己立住了。";',
    'return "也站上了看台边。最小的一步，也是出手——你选了边。";');
rep('cc.appendChild(el("div","note-sec","边界篇诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","旁观篇诞生。公约会随章节累积，章末统一收录。"));');
/* 图鉴·公约卡文案 → 本章公约 */
rep('cc.appendChild(el("div","mantra","我不接受___，因为___——这句话，我可以练。"));',
    'cc.appendChild(el("div","mantra","看见别人被堵住，我可以出手——最小的一步，也算数！"));');

/* ============ 2. 角色技能绑定（boss 改名看看） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","逼逼":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","看看":"boss","四人":"all"};');

/* ============ 3. SKILLS（5 个：micro/selfexplain/express/monitor 复用 + standby 新） ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  selfexplain:{name:"自我解释",owner:"jiu",',
'           one:"先说为什么，再决定动不动——理由是自己的，选择才是自己的。",',
'           mantra:"「先问一句：为什么？」",',
'           why:"说得清理由的人，才不会被人一句话推着走。知其然，更知其所以然。",',
'           cross:"朋友约你玩，你不想去——说得出「我在等一个电话」，就不怕被说小气。"},',
'  express:{name:"我句式",owner:"shan",',
'           one:"把感受说清楚：「当你___时，我觉得___，我希望___。」不指责，不硬撑。",',
'           mantra:"「当你___时，我觉得___，我希望___。」",',
'           why:"话里有「我」，别人才听得进去；话里有「你」，天就聊成了架。说感受，不说审判。",',
'           cross:"同桌借你笔不还？说「我等下要用，先还我吧」——比憋一节课舒服多了。"},',
'  standby:{name:"旁观出手",owner:"mian",',
'           one:"最小可行动作：站过去、递句话、找个大人。三档都不费电——无视，才最耗电。",',
'           mantra:"「最小的一步，也算数。」",',
'           why:"旁观者最省电的选择是「看看」，可「看看」最耗电——心里过不去。站过去、递句话、找大人，都是在出手。",',
'           cross:"排队时有人被插队堵着？往他旁边站一步、问一句「你排这儿吧」——最小的一步，也是站队。"},',
'  monitor:{name:"状态监控",owner:"mian",',
'           one:"身体先知道：肩膀发紧、胃在打结、手心出汗——信号亮起，先认下来。",',
'           mantra:"「信号亮了，就降一档。」",',
'           why:"情绪还没开口，身体先报了信。认得信号的人，不会在撑不住的时候还硬撑。",',
'           cross:"一看手机里有十几条未读就心慌？那是身体在报信——认下来，再决定先回哪一条。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 4. COMBOS（两个跨角色连招） ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"站过去，就是出手",members:["standby","micro"],',
'   desc:"旁观出手（眠）＋微步骤启动（松）——不用想周全，先走过去一步。最小的一步，也是站在了别人旁边。"},',
'  {name:"递一句给他",members:["express","standby"],',
'   desc:"我句式（闪）＋旁观出手（眠）——把话递过去：「你没事吧？我陪你站这儿。」一句话，就是一堵人墙。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 5. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"眠眠",text:"看台边……好热闹。"},',
'  {who:"闪闪",text:"（小声）可那边，好像有人被挡住了。"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松放下背包：「老规矩——先迈五秒一步。想帮忙，也是这么帮的。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {who:"究究",text:"看台下面，围了一圈人。"},',
'  {who:"眠眠",text:"（小声）……是暖暖。她被围在中间。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"看台下，阿嗨正带着一群人起外号，暖暖被围在中间，脸涨得通红。你心里一紧——先出哪一招？",options:[',
'  {t:"先过去：一步，就一步",next:"a1",branch:"A",',
'   after:[{act:"松松抬脚。"},{who:"松松",text:"先走过去，就一步。"}]},',
'  {t:"先看懂：这是怎么回事",next:"b1",branch:"B",',
'   after:[{act:"究究眯起眼。"},{who:"究究",text:"先看清楚，再动。"}]},',
'  {t:"先递话：有人该说句话了",next:"c1",branch:"C",',
'   after:[{act:"闪闪攥了攥拳。"},{who:"闪闪",text:"这句话，总得有人说。"}]},',
'  {t:"先认信号：我心里发紧",next:"d1",branch:"D",',
'   after:[{act:"眠眠把手放上心口。"},{who:"眠眠",text:"这里……发紧。"}]}',
' ]},',
'',
' /* ---- A 线 · 微步骤启动 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"走过去……好多人。"},',
'  {who:"眠眠",text:"不用想周全。一步，就一步。"}',
' ]},',
' a2:{kind:"skill",skill:"micro",lead:"松松屈膝：「微步骤启动——『过去』太大，就切成『走到台阶口』。第一步小到不可能失败，剩下的路自己会出现。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"松松腿软：「万一他们笑我多管闲事呢？」你说：",options:[',
'  {t:"「笑了就笑了。你走到，就已经是出手。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"松松",text:"（吸气）……那我走到。"}]},',
'  {t:"「那还是等等看吧。」",next:"conv",trust:2,',
'   after:[{act:"松松把抬起的脚放下了。"}]},',
'  {t:"「就是多管闲事，别去了。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"松松退回了看台。"}]}',
' ]},',
'',
' /* ---- B 线 · 自我解释 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"究究",text:"先问一句——这是在干什么？"},',
'  {who:"闪闪",text:"起外号。一群人，围着一个。"}',
' ]},',
' b2:{kind:"skill",skill:"selfexplain",lead:"究究摊开纸：「自我解释——先说出发生了什么，再决定动不动：『这不是玩，是在堵人。』看得清，手才稳。」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"究究卡壳：「这……算玩闹吗？」你说：",options:[',
'  {t:"「看他表情——那不是在笑，是在难堪。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"究究",text:"（看）……不是玩。"}]},',
'  {t:"「小孩子打闹，正常的。」",next:"conv",trust:2,',
'   after:[{act:"究究把纸收起来了。"}]},',
'  {t:"「你想太多，别瞎分析。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"究究别过脸去。"}]}',
' ]},',
'',
' /* ---- C 线 · 我句式 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"闪闪",text:"总得有人说句话……"},',
'  {who:"眠眠",text:"递一句，就好。"}',
' ]},',
' c2:{kind:"skill",skill:"express",lead:"闪闪抽出一张话卡：「我句式——『当你___时，我觉得___，我希望___。』不指责，不硬撑。递一句给暖暖，也递一句给起外号的人。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"闪闪声音发虚：「万一没人接我的话呢？」你说：",options:[',
'  {t:"「话递出去，就是出手。接不接，是他的事。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（握拳）……那我递了。"}]},',
'  {t:"「没人接，多尴尬。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把话卡收回兜里。"}]},',
'  {t:"「别出头，枪打出头鸟。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪往后退了半步。"}]},',
' ]},',
'',
' /* ---- D 线 · 旁观出手 ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"眠眠",text:"（按心口）这里发紧。"},',
'  {who:"究究",text:"身体先知道——这不对。"}',
' ]},',
' d2:{kind:"skill",skill:"standby",lead:"眠眠看一眼心率：「旁观出手——最小可行动作：站过去、递句话、找个大人。三档都不费电。无视，才最耗电——你心里过不去。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"眠眠犹豫：「我一个人……能行吗？」你说：",options:[',
'  {t:"「不用一个人。最小的一步，再叫上一个大人。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（点头）……先站一步。"}]},',
'  {t:"「不行就算了，看看就好。」",next:"conv",trust:2,',
'   after:[{act:"眠眠把手放下了。"}]},',
'  {t:"「就你看不惯，事真多。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠把心率图合上了。"}]},',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"看看",text:"不关你的事——看看就行。"},',
'  {who:"闪闪",text:"（腿软）好多眼睛……都在看着。"},',
'  {who:"四人",text:"看够了——这一回，我们不当看的！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"看看",text:"你们……把「看看」换成了「站过去」……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"眠眠",text:"最小的一步，也算数。"},',
'  {who:"四人",text:"看见别人被堵住，我可以出手——最小的一步，也算数！"},',
'  {who:"四人",text:"站过去、递句话、找大人——不能选无视，无视也是选了边！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 6. ROUNDS ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 群嘲",rk:"mute",',
'  bossLine:"「不关你的事，看看就行。」看看把看台变成了观众席，起外号的笑声响成一片。",',
'  valid:["micro","selfexplain","express","standby","monitor"],',
'  ease:"眠眠：走过去、先看懂、递句话、认信号——用哪招都行。"},',
' {name:"第 2 回合 · 孤立",rk:"watch",',
'  bossLine:"「看看而已，又不少块肉。」看看一圈圈划出来，暖暖被隔在了外面。",',
'  valid:["micro","selfexplain","express","standby","monitor"],',
'  ease:"眠眠：稳住——最小的一步先迈出去，圈子就开口子了。"},',
' {name:"第 3 回合 · 出手",rk:"core",',
'  bossLine:"「你管什么闲事！」看看胀到最大，无数双眼睛齐刷刷看过来。",',
'  valid:"COMBO",',
'  ease:"眠眠：一个人撑不住场。找一位不同角色的队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 7. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' mute:{',
'  micro:["五秒一步——松松只走到台阶口。就这一步，人群安静了半拍。"],',
'  selfexplain:["究究说出那句「这不是玩，是在堵人」——看清了，手就稳了。"],',
'  express:["闪闪递一句「你们这样，他挺难堪的」——话一出口，笑声缺了角。"],',
'  standby:["眠眠往暖暖旁边站了一步：最小的一步，也是站在了她这边。"],',
'  monitor:["眠眠按住发紧的心口：这信号是在说「不对」——认下来，才动得了。"],',
'  miss:["眠眠：「再想一招。走过去、先看懂、递句话、认信号——都行。」"]',
' },',
' watch:{',
'  micro:["五秒一步：松松挤到圈边，就一站。圈子，裂了条缝。"],',
'  selfexplain:["究究问一句「他被隔在外面，是什么滋味」——理由一出口，脚就迈了。"],',
'  express:["闪闪递一句「你没事吧？我陪你站这儿」——一句话，一堵人墙。"],',
'  standby:["眠眠站稳：「最小的一步，也算数。」圈子外，多了一个人。"],',
'  monitor:["心里发紧，就是在报信——信号亮着，这一步就必须迈。"],',
'  miss:["眠眠：「再想一招。走过去、先看懂、递句话、认信号——都行。」"]',
' },',
' core:{',
'  standby:["看看退了一步：「你们……真的走过来了……」看台边，伸过来四只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两招——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 8. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 字母序排序后 "+" 连接；5 技能 C(5,2)=10，排除 standby+monitor 同 owner（眠）→ 9 条 */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "express+micro"     :["闪闪递一句「他不想被围观」，松松数五秒：先走过去一步。","递句话，走一步。"],',
' "express+selfexplain":["闪闪问「你们这是在干什么」，究究补一句「这不是玩，是在堵人」。","问一句，看清它。"],',
' "express+standby"   :["闪闪把话递过去，眠眠往旁边一站：一句话，加一堵人墙。","话到，人到。"],',
' "micro+selfexplain" :["松松先走到圈边，究究问：这一步，为什么值得走？","走到了，也想一想。"],',
' "micro+standby"     :["松松只走一步，眠眠接上：这一步，我陪你走。","一步，有人陪。"],',
' "express+monitor"   :["闪闪说「我看得心里发紧」，眠眠认下这信号——两个人一起动。","信号一亮，就递话。"],',
' "micro+monitor"     :["松松走到台阶口，眠眠按住心口：发紧，是因为这一步该走。","走，是因为该走。"],',
' "selfexplain+standby":["究究说清「这不是玩」，眠眠站过去：看清了，就站过去。","看清，就站。"],',
' "monitor+selfexplain":["究究问「他被隔着，什么滋味」，眠眠的心口早给了答案。","心里知道，就说出来。"],',
'};',
'var COMBO_NAMES={',
' "express+micro":"递话走一步","express+selfexplain":"问一句看清","express+standby":"话到人到",',
' "micro+selfexplain":"走到想一想","micro+standby":"一步有人陪","express+monitor":"亮就递话","micro+monitor":"该走就走","selfexplain+standby":"看清就站","monitor+selfexplain":"心里知道"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力气，在看台边立成一根「有人陪」的桩子。","看看的「看看就行」，被正式堵在了人群外。"];',
'var BORROW_ORDER=["standby","express","micro","selfexplain"];',
'var BORROW_LINE={',
' mian:"眠眠：「旁观出手借你们——站过去、递句话、找大人，三档都行！」",',
' shan:"闪闪：「我句式借你们——『当你___时，我觉得___，我希望___。』」",',
' song:"松松：「微步骤借你们！大事切成五秒一步——先走过去！」",',
' jiu :"究究：「自我解释借你们——先说为什么，再决定动不动。」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 9. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"stand",t:"看台边",e:"🏟"},{k:"boss",t:"看看",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 10. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch10_save_v1";', 'var SAVE_KEY="brainexp_ch11_save_v1";');
rep('var BEST_KEY="brainexp_ch10_best_v1";', 'var BEST_KEY="brainexp_ch11_best_v1";');
/* 标题页继承前十章记录（追加 Ch10 继承） */
rep('  if(p9)html+=(html?"<br>":"")+"🏅 已继承终章：「大脑王座」最佳 <b>"+p9.rating+"</b> · "+p9.diff;',
    '  if(p9)html+=(html?"<br>":"")+"🏅 已继承终章：「大脑王座」最佳 <b>"+p9.rating+"</b> · "+p9.diff;\n  var p10=null;\n  try{p10=JSON.parse(localStorage.getItem("brainexp_ch10_best_v1"));}catch(e){}\n  if(p10)html+=(html?"<br>":"")+"🏅 已继承边界篇：「界线平原」最佳 <b>"+p10.rating+"</b> · "+p10.diff;');

/* ============ 11. 新技能图腾：旁观出手（人形+伸出的手+星） ============ */
var TOTEM_ADD = [
'TOTEM_ART.standby=\'<circle cx="24" cy="9" r="4.6" fill="TOT"/><path d="M19.5 15 h9 l3.5 24 h-16 Z" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M28.5 21 q11 -3 15 -10" stroke="TOT" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="44" cy="11" r="2.6" fill="TOT"/><path d="M9 40 l2 4 l4 .6 -3 3 l.7 4.2 -3.7 -2 -3.7 2 .7 -4.2 -3 -3 l4 -.6 Z" fill="TOT" opacity=".7"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 12. Boss 看看（看看主 · 「不关你的事，看看就行」的声音） ============
 * 铁律：五官画在上部避开对话气泡；纯色+明暗面，不用 url(#gradient)；巨大白眼+黑瞳（冷漠的眼） */
var BOSS_BLOCK = [
'/* ---- Boss 看看（看看主 · 「不关你的事，看看就行」的声音） ---- */',
'function bossSVG(size){',
'  var eyes="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+50*Math.cos(a)).toFixed(1), py=(52+42*Math.sin(a)).toFixed(1);',
'    eyes+=\'<circle cx="\'+px+\'" cy="\'+py+\'" r="\'+(5+(i%3))+\'" fill="#f4f1e6" opacity="\'+(0.55+(i%3)*0.13).toFixed(2)+\'"/>\';',
'    eyes+=\'<circle cx="\'+px+\'" cy="\'+py+\'" r="\'+(1.6+(i%2))+\'" fill="#2e3440" opacity="\'+(0.6+(i%3)*0.12).toFixed(2)+\'"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="60" cy="56" rx="56" ry="52" fill="rgba(18,26,32,.55)"/>\'+',
'  /* 顶部伸出的三道金色视线（向上伸出气泡遮挡区） */',
'  \'<path d="M40 26 L26 8" stroke="#f0b24a" stroke-width="3" stroke-linecap="round"/>\'+',
'  \'<path d="M60 22 L60 4" stroke="#f0b24a" stroke-width="3" stroke-linecap="round"/>\'+',
'  \'<path d="M80 26 L94 8" stroke="#f0b24a" stroke-width="3" stroke-linecap="round"/>\'+',
'  /* 团身（左暗右亮两面） */',
'  \'<path d="M18 92 Q10 60 30 44 Q36 20 60 18 Q84 20 90 44 Q110 60 102 92 Z" fill="#5a6472" stroke="#2e3440" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M60 18 Q84 20 90 44 Q110 60 102 92 L60 92 Z" fill="#6e7888"/>\'+',
'  /* 巨大白眼（画在上部，避开气泡） */',
'  \'<ellipse cx="60" cy="44" rx="30" ry="18" fill="#f4f1e6" stroke="#2e3440" stroke-width="2.6"/>\'+',
'  \'<circle cx="60" cy="45" r="8.5" fill="#2e3440"/>\'+',
'  \'<circle cx="57.4" cy="42" r="2.6" fill="#f4f1e6" opacity=".85"/>\'+',
'  /* 下垂的眼角（冷漠） */',
'  \'<path d="M32 56 q10 6 22 4 M88 56 q-10 6 -22 4" stroke="#2e3440" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  /* 嘴：扁平的「看看而已」 */',
'  \'<path d="M52 82 h16" stroke="#2e3440" stroke-width="2.6" stroke-linecap="round"/>\'+',
'  eyes+',
'  \'<g class="pollen" style="animation-delay:.4s"><circle cx="14" cy="18" r="3.4" fill="#f4f1e6"/><circle cx="14" cy="18" r="1.4" fill="#2e3440"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><circle cx="104" cy="30" r="3" fill="#f0b24a"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 逼逼（逼你同意主 · 「就玩一下嘛，别小气」的声音） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 13. 场景插画整段重写：看台边 / 营地 / 破晓 ============ */
var SCENESVG_BLOCK = [
'function sceneSVG(kind){',
'  var clear=(kind==="clear"), camp=(kind==="camp"), arena=!clear&&!camp;',
'  var sky1=camp?"#1a1428":(clear?"#3a2a1c":"#141020"), sky2=camp?"#0d0a16":(clear?"#241910":"#0a0812");',
'  var sid="sk"+kind;',
'  var body="";',
'  if(camp){',
'    /* 营地（集结地）：帐篷 + 看台剪影 */',
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#150f20"/><rect x="0" y="250" width="880" height="6" fill="#3a2f52"/>\';',
'    body+=\'<ellipse cx="440" cy="286" rx="330" ry="60" fill="rgba(143,191,106,.07)"/>\';',
'    /* 帐篷 */',
'    body+=\'<path d="M180 292 L230 232 L280 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<path d="M230 232 L280 292 L262 292 L230 254 L198 292 L180 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<path d="M226 292 L230 258 L234 292 Z" fill="#f0d68a" opacity=".8"/>\';',
'    body+=\'<path d="M640 292 L688 238 L736 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<path d="M688 238 L736 292 L718 292 L688 260 L658 292 L640 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    /* 看台剪影（三级台阶 + 一双眼） */',
'    body+=\'<rect x="410" y="264" width="60" height="10" rx="2" fill="#241b36" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<rect x="404" y="274" width="72" height="10" rx="2" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<rect x="398" y="284" width="84" height="10" rx="2" fill="#241b36" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<ellipse cx="440" cy="246" rx="15" ry="9" fill="#f4f1e6"/><circle cx="440" cy="247" r="4.2" fill="#2e3440"/>\';',
'    body+=\'<rect x="300" y="168" width="280" height="34" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<text x="440" y="191" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">旁观篇 · 营地</text>\';',
'    body+=\'<ellipse cx="220" cy="300" rx="100" ry="15" fill="rgba(240,178,74,.08)" class="fogA"/>\';',
'    body+=\'<ellipse cx="660" cy="306" rx="100" ry="15" fill="rgba(201,143,216,.07)" class="fogA"/>\';',
'  }else if(arena){',
'    /* 看台边：夜空 + 看台 + 跑道 + 被围住的小圈 */',
'    /* 远处看台（阶梯） */',
'    body+=\'<path d="M60 196 h300 l30 52 H30 Z" fill="#1c1530" stroke="#2a2140" stroke-width="2"/>\';',
'    body+=\'<path d="M78 210 h264 M74 226 h272 M70 240 h280" stroke="#2a2140" stroke-width="3"/>\';',
'    body+=\'<path d="M520 196 h300 l30 52 H490 Z" fill="#1c1530" stroke="#2a2140" stroke-width="2"/>\';',
'    body+=\'<path d="M538 210 h264 M534 226 h272 M530 240 h280" stroke="#2a2140" stroke-width="3"/>\';',
'    /* 夜空星点 */',
'    body+=\'<g fill="#f0d68a"><circle cx="120" cy="70" r="2" opacity=".7"/><circle cx="300" cy="110" r="1.6" opacity=".5"/><circle cx="470" cy="60" r="2.2" opacity=".8"/><circle cx="640" cy="96" r="1.8" opacity=".6"/><circle cx="760" cy="130" r="2" opacity=".7"/><circle cx="210" cy="150" r="1.4" opacity=".5"/><circle cx="580" cy="150" r="1.6" opacity=".6"/></g>\';',
'    /* 地面跑道 */',
'    body+=\'<rect x="0" y="248" width="880" height="132" fill="#181225"/>\';',
'    body+=\'<rect x="0" y="248" width="880" height="5" fill="#2a2140"/>\';',
'    body+=\'<path d="M0 262 h880 M0 282 h880 M0 302 h880" stroke="rgba(244,241,230,.10)" stroke-width="3"/>\';',
'    /* 被围住的小圈：虚线圈 + 圈外暖色小人 + 三个灰影 */',
'    body+=\'<ellipse cx="440" cy="308" rx="118" ry="30" fill="none" stroke="rgba(224,90,74,.55)" stroke-width="3" stroke-dasharray="9 7"/>\';',
'    body+=\'<circle cx="440" cy="292" r="9" fill="#f0c86a"/>\';',
'    body+=\'<path d="M431 302 q9 -8 18 0 l3 26 h-24 Z" fill="#f0b24a"/>\';',
'    body+=\'<g fill="#3a4250"><circle cx="356" cy="286" r="8"/><path d="M348 296 q8 -7 16 0 l3 24 h-22 Z"/></g>\';',
'    body+=\'<g fill="#3a4250"><circle cx="524" cy="286" r="8"/><path d="M516 296 q8 -7 16 0 l3 24 h-22 Z"/></g>\';',
'    body+=\'<g fill="#46505e"><circle cx="440" cy="262" r="8"/><path d="M432 272 q8 -7 16 0 l3 22 h-22 Z"/></g>\';',
'    /* 站在圈边的队员剪影（已经有人走过来了） */',
'    body+=\'<g fill="#6e7888"><circle cx="330" cy="296" r="8.6"/><path d="M321.4 306 q8.6 -7 17.2 0 l3.2 26 h-23.6 Z"/></g>\';',
'    /* 舞台横幅 */',
'    body+=\'<rect x="150" y="150" width="580" height="30" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="1.8"/>\';',
'    body+=\'<text x="440" y="171" font-size="17" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">旁观篇 · 看台边</text>\';',
'    body+=\'<text x="440" y="352" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif" opacity=".85">看 台</text>\';',
'    body+=\'<ellipse cx="300" cy="330" rx="180" ry="26" fill="rgba(138,148,164,.08)" class="fogA"/>\';',
'    body+=\'<ellipse cx="620" cy="280" rx="180" ry="24" fill="rgba(138,148,164,.07)" class="fogA"/>\';',
'  }else{',
'    /* 破晓：看台安静了，圈开了 */',
'    body+=\'<rect x="0" y="248" width="880" height="132" fill="#2a2018"/>\';',
'    body+=\'<rect x="0" y="248" width="880" height="5" fill="#43321f"/>\';',
'    body+=\'<path d="M60 196 h300 l30 52 H30 Z" fill="#2e2418" stroke="#43321f" stroke-width="2"/>\';',
'    body+=\'<path d="M520 196 h300 l30 52 H490 Z" fill="#2e2418" stroke="#43321f" stroke-width="2"/>\';',
'    body+=\'<ellipse cx="440" cy="308" rx="118" ry="30" fill="none" stroke="rgba(240,214,138,.5)" stroke-width="3" stroke-dasharray="9 7"/>\';',
'    body+=\'<circle cx="440" cy="292" r="9" fill="#f0c86a"/>\';',
'    body+=\'<path d="M431 302 q9 -8 18 0 l3 26 h-24 Z" fill="#f0b24a"/>\';',
'    /* 四个人形围成一圈陪伴 */',
'    body+=\'<g fill="#6e7888"><circle cx="356" cy="286" r="8"/><path d="M348 296 q8 -7 16 0 l3 24 h-22 Z"/></g>\';',
'    body+=\'<g fill="#6e7888"><circle cx="524" cy="286" r="8"/><path d="M516 296 q8 -7 16 0 l3 24 h-22 Z"/></g>\';',
'    body+=\'<g fill="#f0d68a"><circle cx="330" cy="296" r="8.6"/><path d="M321.4 306 q8.6 -7 17.2 0 l3.2 26 h-23.6 Z"/></g>\';',
'    body+=\'<g fill="#f0d68a"><circle cx="550" cy="296" r="8.6"/><path d="M541.4 306 q8.6 -7 17.2 0 l3.2 26 h-23.6 Z"/></g>\';',
'    body+=\'<path d="M300 0 L380 248 L260 248 Z" fill="rgba(240,214,138,.10)"/>\';',
'    body+=\'<path d="M580 0 L620 248 L500 248 Z" fill="rgba(240,214,138,.07)"/>\';',
'    body+=\'<g class="flower"><rect x="298" y="256" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="580" y="232" width="9" height="9" rx="2" fill="#8fbf6a"/><rect x="222" y="270" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="662" y="280" width="8" height="8" rx="2" fill="#8fbf6a"/></g>\';',
'    body+=\'<ellipse cx="440" cy="280" rx="300" ry="40" fill="rgba(240,214,138,.10)" class="fogA"/>\';',
'  }',
'  var skyBlocks=[[64,58,17],[148,38,11],[262,78,13],[352,34,9],[470,62,16],[566,40,10],[662,92,13],[766,48,15],[846,104,10],[196,116,8],[600,124,9]];',
'  var skyG="";',
'  skyBlocks.forEach(function(b,i){',
'    skyG+=\'<rect x="\'+b[0]+\'" y="\'+b[1]+\'" width="\'+b[2]+\'" height="\'+b[2]+\'" rx="2" fill="\'+(i%3===0?"#3a2a1c":(i%3===1?"#241810":"#4a3422"))+\'" opacity="\'+(0.35+(i%4)*0.14).toFixed(2)+\'"/>\';',
'  });',
'  return \'<svg class="scene-svg" viewBox="0 0 880 380" preserveAspectRatio="xMidYMid slice">\'+',
'  \'<defs><linearGradient id="\'+sid+\'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="\'+sky1+\'"/><stop offset="1" stop-color="\'+sky2+\'"/></linearGradient>\'+',
'  \'</defs>\'+',
'  \'<rect width="880" height="380" fill="url(#\'+sid+\'sky)"/>\'+',
'  skyG+',
'  body+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("function sceneSVG(kind){", "/* ---- 营地横幅（标题页 / 结算页） ---- */", SCENESVG_BLOCK);

/* ============ 14. 营地横幅（标题页/结算页）：三色界碑 → 看台+眼 ============ */
rep("'<rect x=\"428\" y=\"76\" width=\"24\" height=\"34\" rx=\"3\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"1.8\"/>'+\n  '<rect x=\"432\" y=\"78\" width=\"16\" height=\"9\" fill=\"#e05a4a\"/>'+\n  '<rect x=\"432\" y=\"88\" width=\"16\" height=\"9\" fill=\"#f0b24a\"/>'+\n  '<rect x=\"432\" y=\"98\" width=\"16\" height=\"9\" fill=\"#8fbf6a\"/>'+",
    "'<rect x=\"414\" y=\"86\" width=\"52\" height=\"9\" rx=\"2\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"1.2\"/>'+\n  '<rect x=\"410\" y=\"95\" width=\"60\" height=\"9\" rx=\"2\" fill=\"#1c1530\" stroke=\"#f0b24a\" stroke-width=\"1.2\"/>'+\n  '<rect x=\"406\" y=\"104\" width=\"68\" height=\"9\" rx=\"2\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"1.2\"/>'+\n  '<ellipse cx=\"440\" cy=\"72\" rx=\"14\" ry=\"8.6\" fill=\"#f4f1e6\"/><circle cx=\"440\" cy=\"73\" r=\"4\" fill=\"#2e3440\"/>'+");

/* ============ 15. 结算页分支名 → 旁观篇分支 ============ */
rep('var m={A:"A线 · 认知重编程",B:"B线 · 想清为什么",C:"C线 · 边界宣言",D:"D线 · 看身体信号"};',
    'var m={A:"A线 · 走过去一步",B:"B线 · 先看清楚",C:"C线 · 递一句话",D:"D线 · 认身上信号"};');
/* 观察 → 本章主题（旁观出手 + 最小一步收束） */
rep('return "「以后遇到让我不舒服的事，我先停一秒：能接受、看情况，还是不行？不行，就说『我不接受___，因为___』。」";',
    'return "「以后看见有人被堵住，我先认一下心里的信号，再迈最小的一步：站过去、递句话、找大人。不能选无视。」";');
/* 隐藏台词 → 旁观篇主题 */
rep('sec.textContent="✨ 隐藏台词：最软的那句话，往往最有力量——「我不接受，因为___」。这句话，是你自己说出口的。";',
    'sec.textContent="✨ 隐藏台词：看台上最响的声音，是「跟我来」——走出看台的那一步，是你自己走过来的。";');
/* 连招卡预告语 → 最后一个特别篇预告 */
rep('box.appendChild(el("div","locked-note","预告：还有两位新考验——「为别人出手」和「深夜的手机」，在排队报到。\\n冲突没有解决的章节，连招图标会是灰色的。"));',
    'box.appendChild(el("div","locked-note","预告：最后一位新考验——「深夜的手机」，在排队报到。\\n冲突没有解决的章节，连招图标会是灰色的。"));');

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
