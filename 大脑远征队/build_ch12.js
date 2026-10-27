/* Ch12 构建：从 Ch11 静态源码(_ch12_base.html)换数据 → Ch12-数字篇.html
 * 章节主题：数字篇 · 屏中潮（元宝游戏包「网络痕迹棋 + 人设滤镜」落地，最后一个特别篇）
 * 新技能：睡前落闸(screendown,眠)、点赞秤(likes,究)
 * 分支=微步骤启动(松)/自我解释(究)/我句式(闪)/睡前落闸(眠) 四角色；技能池 5 个（selfexplain+likes 同究究，COMBO 排除）
 * Boss：滤滤（人设滤镜主 · 「你看人家的生活」的声音）——拿滤镜看自己、拿点赞秤自己的那股声音
 * 外部伙伴：阿嗨（截聊天记录发群）+「群里的精修生活」，借队员台词间接出场
 * 章末公约：「屏幕里的生活，是修过图的；我的价值，不靠点赞数！」「转发之前先问一句：他同意吗？这是全貌吗？」
 * 反卡死：R1/R2 有效池必含 micro+全分支技能；R3=COMBO 任意两不同角色
 * 红线：危机内容不 gamify——落闸兜底动作含「找大人一起看」；不逼公开、不出现自伤暗示
 * 教训（Ch11）：所有 body+= 行必须以 ; 结尾，禁止 + 续行接同变量 +=（会解析成非法赋值）
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch12_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch12-数字篇.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 旁观篇「看台边」</title>',
    '<title>大脑远征队 · 数字篇「屏中潮」</title>');
rep('<div class="sub">旁观篇 · 看台边 —— 为别人出手</div>',
    '<div class="sub">数字篇 · 屏中潮 —— 屏幕里的，不全是真的</div>');
rep('<div class="boss-name">看看 · 看看主</div>',
    '<div class="boss-name">滤滤 · 人设滤镜主</div>');
rep('card.appendChild(el("div","page-sub","旁观篇 · 看台边 —— 完"));',
    'card.appendChild(el("div","page-sub","数字篇 · 屏中潮 —— 完"));');
rep('if(r==="A")return "过关了。站在别人旁边的那一步，你自己迈出去的。";',
    'if(r==="A")return "过关了。深夜最亮的那块屏，是你自己关掉的。";');
rep('return "也站上了看台边。最小的一步，也是出手——你选了边。";',
    'return "也走过了屏中潮。屏幕里的潮水很响，你听见了自己。";');
rep('cc.appendChild(el("div","note-sec","旁观篇诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","数字篇诞生。公约会随章节累积，章末统一收录。"));');
/* 图鉴·公约卡文案 → 本章公约 */
rep('cc.appendChild(el("div","mantra","看见别人被堵住，我可以出手——最小的一步，也算数！"));',
    'cc.appendChild(el("div","mantra","屏幕里的生活，是修过图的；我的价值，不靠点赞数！"));');

/* ============ 2. 角色技能绑定（boss 改名滤滤） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","看看":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","滤滤":"boss","四人":"all"};');

/* ============ 3. SKILLS（5 个：micro/selfexplain/express 复用 + screendown/likes 新） ============ */
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
'  screendown:{name:"睡前落闸",owner:"mian",',
'           one:"眼睛酸、脖子僵、心里空——信号亮着，就落闸：屏幕朝下，说一句「明天见」。",',
'           mantra:"「信号亮了，就落闸。」",',
'           why:"深夜的屏幕越刷越精神，因为它在喂你的好奇心。落闸不是认输，是给大脑一个「今天到此为止」的句号。",',
'           cross:"搭积木搭到眼睛发酸还想搭完？先落闸——「明天继续」，积木不会跑。"},',
'  likes :{name:"点赞秤",owner:"jiu",',
'           one:"点赞数是杆秤，可它秤的不是你的价值。称一称：今天开心的事，有几件？",',
'           mantra:"「秤是我的，刻度也是我的。」",',
'           why:"把价值挂在别人的计数上，心跳就归别人管。自己的秤，称自己的好——那天才是自己的。",',
'           cross:"拍球连拍了十个没人看见？秤一秤：刚才那一下，你自己爽不爽？爽，就作数。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 4. COMBOS（两个跨角色连招） ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"先落闸，再称重",members:["screendown","likes"],',
'   desc:"睡前落闸（眠）＋点赞秤（究）——屏幕朝下，再称一称：今天开心的事有几件？称完，安心睡。"},',
'  {name:"停一秒，再转发",members:["express","micro"],',
'   desc:"我句式（闪）＋微步骤启动（松）——想转发的那一秒，先停：他同意吗？这是全貌吗？想不清，就先锁屏。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 5. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"眠眠",text:"夜深了……屏幕还亮着。"},',
'  {who:"闪闪",text:"（小声）群里，又在刷精修的生活。"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松放下背包：「老规矩——先迈五秒一步。『放下手机』太大，就切成『锁屏，就一下』。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {who:"究究",text:"屏里的潮水，一直在涨。"},',
'  {who:"眠眠",text:"（小声）……阿嗨把聊天记录截图，发群里了。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"深夜，群里的精修生活刷不完；闪闪的自发拍没人点赞，阿嗨却把聊天记录截图发了群。你心里一沉——先出哪一招？",options:[',
'  {t:"先锁屏：就一下",next:"a1",branch:"A",',
'   after:[{act:"松松伸手。"},{who:"松松",text:"先锁屏，就一下。"}]},',
'  {t:"先想清：我在跟谁比",next:"b1",branch:"B",',
'   after:[{act:"究究抬眼。"},{who:"究究",text:"先问一句：比什么？"}]},',
'  {t:"先问一句：他同意吗",next:"c1",branch:"C",',
'   after:[{act:"闪闪攥拳。"},{who:"闪闪",text:"转发之前，先问。"}]},',
'  {t:"先认信号：我身体累了",next:"d1",branch:"D",',
'   after:[{act:"眠眠揉眼睛。"},{who:"眠眠",text:"眼睛……酸了。"}]}',
' ]},',
'',
' /* ---- A 线 · 微步骤启动 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"放下手机……这四个字，太重。"},',
'  {who:"眠眠",text:"切成五秒：锁屏，就一下。"}',
' ]},',
' a2:{kind:"skill",skill:"micro",lead:"松松屈膝：「微步骤启动——『别再刷了』做不到，就切成『屏幕朝下，扣一下』。第一步小到不可能失败，手就回来了。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"松松手抖：「万一错过大事呢？」你说：",options:[',
'  {t:"「真的大事，明早也在。先睡。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"松松",text:"（呼气）……扣一下。"}]},',
'  {t:"「那再刷五分钟吧。」",next:"conv",trust:2,',
'   after:[{act:"松松的手又缩回去了。"}]},',
'  {t:"「就是自制力差，别赖手机。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"松松把手机攥更紧了。"}]},',
' ]},',
'',
' /* ---- B 线 · 自我解释 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"究究",text:"先问一句——我在跟谁比？"},',
'  {who:"闪闪",text:"比……谁的生活更亮。"}',
' ]},',
' b2:{kind:"skill",skill:"selfexplain",lead:"究究摊开纸：「自我解释——屏里的生活是修过图的。先说出你在比什么：比的是精修的照片，还是真的日子？」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"究究卡壳：「可人家真的过得比我好……」你说：",options:[',
'  {t:"「你看见的，是他想让你看见的那一页。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"究究",text:"（写）……只是一页。"}]},',
'  {t:"「那没办法，人家就是比你强。」",next:"conv",trust:2,',
'   after:[{act:"究究把纸揉掉了。"}]},',
'  {t:"「你就是酸，别找理由。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"究究别过脸去。"}]},',
' ]},',
'',
' /* ---- C 线 · 我句式 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"闪闪",text:"阿嗨截图的时候……没问过我们。"},',
'  {who:"眠眠",text:"转发之前，先问一句。"}',
' ]},',
' c2:{kind:"skill",skill:"express",lead:"闪闪抽出一张话卡：「我句式——『当你___时，我觉得___，我希望___。』想转发别人的照片、聊天记录？先递一句：你同意吗？这是全貌吗？」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"闪闪声音发虚：「可大家都在转……」你说：",options:[',
'  {t:"「大家都在转，也不代表该转。问一句，不丢人。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（握拳）……那我问了。"}]},',
'  {t:"「算了，随大流吧。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把话卡收回兜里。"}]},',
'  {t:"「就你事多，别扫兴。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪往后退了半步。"}]},',
' ]},',
'',
' /* ---- D 线 · 睡前落闸 ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"眠眠",text:"（揉眼）这里……酸了。"},',
'  {who:"松松",text:"身体先知道——该睡了。"}',
' ]},',
' d2:{kind:"skill",skill:"screendown",lead:"眠眠看一眼时间：「睡前落闸——眼睛酸、脖子僵、心里空，信号亮着就落闸。屏幕朝下，说一句『明天见』。句号，是自己给的。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"眠眠犹豫：「群里还在@我……」你说：",options:[',
'  {t:"「明早回，天塌不下来。真有事，大人会找你。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（打哈欠）……明天见。"}]},',
'  {t:"「回完这一条再睡。」",next:"conv",trust:2,',
'   after:[{act:"眠眠又把屏幕点亮了。"}]},',
'  {t:"「你就是手机瘾，别矫情。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠把脸埋进手里。"}]},',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"滤滤",text:"你看人家的生活——再看看你的。"},',
'  {who:"闪闪",text:"（腿软）潮水……一直涨。"},',
'  {who:"四人",text:"屏里的潮水很响——我们听见自己了！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"滤滤",text:"你们……把「别人家的生活」，换成了自己的秤……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"眠眠",text:"屏幕朝下——明天见。"},',
'  {who:"四人",text:"屏幕里的生活，是修过图的；我的价值，不靠点赞数！"},',
'  {who:"四人",text:"转发之前先问一句：他同意吗？这是全貌吗？问不清，就先落闸！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 6. ROUNDS ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 对比帖",rk:"feed",',
'  bossLine:"「你看人家的生活。」滤滤刷出满屏精修：别人的旅行、别人的奖状墙、别人的笑脸。",',
'  valid:["micro","selfexplain","express","screendown","likes"],',
'  ease:"眠眠：锁屏、想清比什么、先问一句、认信号、称一称——用哪招都行。"},',
' {name:"第 2 回合 · 深夜",rk:"night",',
'  bossLine:"「再刷一条就睡。」滤滤把夜熬得更深，屏幕的光映在每张脸上。",',
'  valid:["micro","selfexplain","express","screendown","likes"],',
'  ease:"眠眠：稳住——眼睛酸了就该落闸，别让屏幕替你数时间。"},',
' {name:"第 3 回合 · 出手",rk:"core",',
'  bossLine:"「赞这么少，删了吧。」滤滤胀到最大，满屏的点赞图标哗啦啦响。",',
'  valid:"COMBO",',
'  ease:"眠眠：一个人扛不住潮水。找一位不同角色的队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 7. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' feed:{',
'  micro:["五秒一步——松松把屏幕朝下扣了一下。满屏的精修，暗了一块。"],',
'  selfexplain:["究究问一句「我在比什么」——比的是修过的图，不是日子。潮水，退了一寸。"],',
'  express:["闪闪递一句「这是全貌吗」——一句话，把精修的生活问出了缝。"],',
'  screendown:["眠眠把屏幕朝下：信号亮着，先落闸。今晚的潮水，到此为止。"],',
'  likes:["眠眠称一称：今天开心的事有三件——自己的秤，称自己的好。"],',
'  miss:["眠眠：「再想一招。锁屏、想清、先问、认信号、称一称——都行。」"]',
' },',
' night:{',
'  micro:["五秒一步：屏幕朝下，扣一下。深夜的手，就这样回来了。"],',
'  selfexplain:["究究问「我在等什么」——等的是别人的下一个更新，还是自己的觉？"],',
'  express:["闪闪问「他同意吗」——想转手的截图，停在了半路。"],',
'  screendown:["眠眠落闸：「明天见。」屏幕暗了，眼睛得救了。"],',
'  likes:["称一称：今天有几件开心事？有三件——屏里的精修，秤不动它们。"],',
'  miss:["眠眠：「再想一招。锁屏、想清、先问、认信号、称一称——都行。」"]',
' },',
' core:{',
'  screendown:["滤滤退了一步：「你们……把屏幕……朝下了……」深夜，伸过来四只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两招——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 8. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 字母序排序后 "+" 连接；5 技能 C(5,2)=10，排除 selfexplain+likes 同 owner（究）→ 9 条 */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "express+likes"     :["闪闪问「这是全貌吗」，眠眠称一称：修过的图，秤不动我的今天。","问一句，称一称。"],',
' "express+micro"     :["闪闪停一秒问「他同意吗」，松松把屏幕朝下扣一下。","停一秒，锁一下。"],',
' "express+screendown":["闪闪递一句「我不转了」，眠眠把屏幕朝下：问清了，就落闸。","问清，落闸。"],',
' "express+selfexplain":["闪闪问「我为什么在乎这个赞」，究究把理由说清楚。","问到底。"],',
' "likes+micro"       :["眠眠称完今天的开心事，松松把屏幕朝下扣一下。","称完，锁屏。"],',
' "likes+screendown"  :["眠眠的秤称完，屏幕也落了闸：我的刻度，我今晚带回家。","称完，落闸。"],',
' "micro+screendown"  :["松松锁屏，眠眠落闸：五秒一步，加一句「明天见」。","锁屏，说晚安。"],',
' "micro+selfexplain" :["松松先扣一下屏幕，究究问：这一下，为什么值得扣？","扣了，再想。"],',
' "screendown+selfexplain":["眠眠落闸前问一句：我到底在等什么？等自己的觉。","落闸，想清。"],',
'};',
'var COMBO_NAMES={',
' "express+likes":"问句称心","express+micro":"停秒锁屏","express+screendown":"问清落闸",',
' "express+selfexplain":"问到底","likes+micro":"称完锁屏","likes+screendown":"称完结觉",',
' "micro+screendown":"锁屏晚安","micro+selfexplain":"扣了再想","screendown+selfexplain":"落闸想清"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力气，在屏幕前凝成一枚「自己的秤」徽章。","滤滤的「你看人家的生活」，被正式挡在了屏外。"];',
'var BORROW_ORDER=["screendown","express","micro","selfexplain"];',
'var BORROW_LINE={',
' mian:"眠眠：「睡前落闸借你们——屏幕朝下，说一句『明天见』！」",',
' shan:"闪闪：「我句式借你们——『当你___时，我觉得___，我希望___。』」",',
' song:"松松：「微步骤借你们！大事切成五秒一步——先锁屏，就一下！」",',
' jiu :"究究：「自我解释借你们——先说为什么，再决定动不动。」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 9. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"tide",t:"屏中潮",e:"📱"},{k:"boss",t:"滤滤",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 10. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch11_save_v1";', 'var SAVE_KEY="brainexp_ch12_save_v1";');
rep('var BEST_KEY="brainexp_ch11_best_v1";', 'var BEST_KEY="brainexp_ch12_best_v1";');
/* 标题页继承前十一章记录（追加 Ch11 继承） */
rep('  if(p10)html+=(html?"<br>":"")+"🏅 已继承边界篇：「界线平原」最佳 <b>"+p10.rating+"</b> · "+p10.diff;',
    '  if(p10)html+=(html?"<br>":"")+"🏅 已继承边界篇：「界线平原」最佳 <b>"+p10.rating+"</b> · "+p10.diff;\n  var p11=null;\n  try{p11=JSON.parse(localStorage.getItem("brainexp_ch11_best_v1"));}catch(e){}\n  if(p11)html+=(html?"<br>":"")+"🏅 已继承旁观篇：「看台边」最佳 <b>"+p11.rating+"</b> · "+p11.diff;');

/* ============ 11. 新技能图腾：睡前落闸（手机+横闸+月牙）/ 点赞秤（一杆秤） ============ */
var TOTEM_ADD = [
'TOTEM_ART.screendown=\'<path d="M44 8 a4 4 0 1 0 6 6 a5 5 0 1 1 -6 -6 Z" fill="TOT"/><rect x="20" y="14" width="24" height="34" rx="4" fill="none" stroke="TOT" stroke-width="2.4"/><rect x="23.4" y="17.6" width="17.2" height="22" rx="2" fill="TOT" opacity=".25"/><path d="M14 30 h36" stroke="TOT" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="44.4" r="1.6" fill="TOT"/>\';',
'TOTEM_ART.likes=\'<path d="M32 10 v6" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><circle cx="32" cy="9" r="2.2" fill="TOT"/><path d="M14 22 h36" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><path d="M22 22 l-4 8 M42 22 l4 8" stroke="TOT" stroke-width="2" stroke-linecap="round"/><path d="M12 30 h20 v4 H12 Z" fill="TOT" opacity=".8"/><path d="M40 30 h12 v4 H40 Z" fill="TOT" opacity=".8"/><path d="M32 16 v6" stroke="TOT" stroke-width="2"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 12. Boss 滤滤（人设滤镜主 · 「你看人家的生活」的声音） ============
 * 铁律：整张脸（双 ✕ 眼 y26–34）必须落在气泡上方的可见带内（可见带≈y0–40），
 *       装饰（手柄/环绕星/光斑）再向外探；纯色+明暗面，不用 url(#gradient) */
var BOSS_BLOCK = [
'/* ---- Boss 滤滤（人设滤镜主 · 「你看人家的生活」的声音） ---- */',
'function bossSVG(size){',
'  var dots="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(58+46*Math.cos(a)).toFixed(1), py=(42+38*Math.sin(a)).toFixed(1);',
'    dots+=\'<path d="M\'+px+\' \'+(py-3.2)+\' l1 2.3 l2.5 .3 l-1.9 1.7 l.5 2.5 l-2.1 -1.2 l-2.1 1.2 l.5 -2.5 l-1.9 -1.7 l2.5 -.3 Z" fill="\'+(i%2?"#f4f1e6":"#f0b24a")+\'" opacity="\'+(0.5+(i%3)*0.16).toFixed(2)+\'"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="58" cy="54" rx="54" ry="50" fill="rgba(18,26,32,.5)"/>\'+',
'  /* 滤镜手柄（右上斜出，探出气泡遮挡区） */',
'  \'<path d="M84 34 L110 14" stroke="#c98a2e" stroke-width="9" stroke-linecap="round"/>\'+',
'  \'<path d="M84 34 L110 14" stroke="#f0b24a" stroke-width="5" stroke-linecap="round"/>\'+',
'  /* 镜框 + 镜面（左暗右亮两面） */',
'  \'<circle cx="58" cy="42" r="30" fill="#2b333f" stroke="#f0b24a" stroke-width="4"/>\'+',
'  \'<circle cx="58" cy="42" r="23" fill="#5a6472"/>\'+',
'  \'<path d="M58 19 A23 23 0 0 1 58 65 Z" fill="#6e7888"/>\'+',
'  /* 镜面高光 */',
'  \'<path d="M40 33 A23 23 0 0 1 50 21" stroke="#f4f1e6" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".45"/>\'+',
'  /* 红色 ✕ 眼（y26–34，整只落在可见带内） */',
'  \'<path d="M44 26 l9 9 M53 26 l-9 9" stroke="#e05a4a" stroke-width="3.6" stroke-linecap="round"/>\'+',
'  \'<path d="M64 26 l9 9 M73 26 l-9 9" stroke="#e05a4a" stroke-width="3.6" stroke-linecap="round"/>\'+',
'  /* 嘴：撇嘴（「赞这么少，删了吧」） */',
'  \'<path d="M48 54 q10 -5 20 0" stroke="#2e3440" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  dots+',
'  \'<g class="pollen" style="animation-delay:.4s"><path d="M14 18 l4 4 l-4 4 l-4 -4 Z" fill="#f0b24a"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><path d="M104 30 l4 4 l-4 4 l-4 -4 Z" fill="#f4f1e6"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 看看（看看主 · 「不关你的事，看看就行」的声音） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 13. 场景插画整段重写：屏中潮 / 营地 / 破晓 ============
 * 教训（Ch11）：每条 body+= 行以 ; 结尾，禁止 + 续行接下一条 body+=（非法赋值） */
var SCENESVG_BLOCK = [
'function sceneSVG(kind){',
'  var clear=(kind==="clear"), camp=(kind==="camp"), arena=!clear&&!camp;',
'  var sky1=camp?"#1a1428":(clear?"#3a2a1c":"#141020"), sky2=camp?"#0d0a16":(clear?"#241910":"#0a0812");',
'  var sid="sk"+kind;',
'  var body="";',
'  if(camp){',
'    /* 营地（集结地）：帐篷 + 篝火 + 月亮 */',
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#150f20"/><rect x="0" y="250" width="880" height="6" fill="#3a2f52"/>\';',
'    body+=\'<ellipse cx="440" cy="286" rx="330" ry="60" fill="rgba(143,191,106,.07)"/>\';',
'    /* 月亮（今晚的主角） */',
'    body+=\'<circle cx="120" cy="70" r="26" fill="#f0d68a" opacity=".9"/>\';',
'    body+=\'<circle cx="132" cy="62" r="23" fill="#141020"/>\';',
'    /* 帐篷 */',
'    body+=\'<path d="M180 292 L230 232 L280 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<path d="M230 232 L280 292 L262 292 L230 254 L198 292 L180 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<path d="M226 292 L230 258 L234 292 Z" fill="#f0d68a" opacity=".8"/>\';',
'    body+=\'<path d="M640 292 L688 238 L736 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<path d="M688 238 L736 292 L718 292 L688 260 L658 292 L640 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    /* 篝火 */',
'    body+=\'<path d="M426 100 L454 100 M425 96 L455 104 M455 96 L425 104" stroke="#4a3520" stroke-width="5" stroke-linecap="round"/>\';',
'    body+=\'<path class="flame" d="M440 98 C430 88 435 76 440 66 C447 76 452 88 440 98 Z" fill="#e8934a"/>\';',
'    body+=\'<path class="flame f2" d="M440 96 C435 89 437 81 440 75 C443 81 445 89 440 96 Z" fill="#f0d68a"/>\';',
'    body+=\'<rect x="300" y="168" width="280" height="34" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<text x="440" y="191" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">数字篇 · 营地</text>\';',
'    body+=\'<ellipse cx="220" cy="300" rx="100" ry="15" fill="rgba(240,178,74,.08)" class="fogA"/>\';',
'    body+=\'<ellipse cx="660" cy="306" rx="100" ry="15" fill="rgba(201,143,216,.07)" class="fogA"/>\';',
'  }else if(arena){',
'    /* 屏中潮：夜空 + 巨大手机 + 信息流 + 潮水 */',
'    /* 星星 */',
'    body+=\'<g fill="#f0d68a"><circle cx="90" cy="60" r="2" opacity=".7"/><circle cx="220" cy="100" r="1.6" opacity=".5"/><circle cx="700" cy="70" r="2.2" opacity=".8"/><circle cx="800" cy="120" r="1.8" opacity=".6"/><circle cx="560" cy="46" r="1.6" opacity=".5"/></g>\';',
'    /* 巨大手机（立在右侧，屏幕朝左） */',
'    body+=\'<rect x="600" y="60" width="180" height="290" rx="22" fill="#241b36" stroke="#f0b24a" stroke-width="2.6"/>\';',
'    body+=\'<rect x="614" y="78" width="152" height="252" rx="8" fill="#101820"/>\';',
'    /* 屏内信息流：三条精修帖（小图+心形） */',
'    body+=\'<rect x="626" y="92" width="128" height="62" rx="4" fill="#1c2a38" stroke="#2e4458" stroke-width="1.4"/>\';',
'    body+=\'<circle cx="646" cy="112" r="7" fill="#f0b24a" opacity=".8"/><path d="M626 140 h128" stroke="#2e4458" stroke-width="1.2"/><path d="M634 150 h60" stroke="#3a5468" stroke-width="2"/>\';',
'    body+=\'<rect x="626" y="164" width="128" height="62" rx="4" fill="#241b2e" stroke="#3a2f52" stroke-width="1.4"/>\';',
'    body+=\'<circle cx="646" cy="184" r="7" fill="#c98fd8" opacity=".8"/><path d="M626 212 h128" stroke="#3a2f52" stroke-width="1.2"/><path d="M634 222 h60" stroke="#4a3f62" stroke-width="2"/>\';',
'    body+=\'<rect x="626" y="236" width="128" height="62" rx="4" fill="#2a2416" stroke="#4a3f28" stroke-width="1.4"/>\';',
'    body+=\'<circle cx="646" cy="256" r="7" fill="#8fbf6a" opacity=".8"/><path d="M626 284 h128" stroke="#4a3f28" stroke-width="1.2"/><path d="M634 294 h60" stroke="#5f5238" stroke-width="2"/>\';',
'    /* 屏内通知点 */',
'    body+=\'<circle cx="742" cy="102" r="5" fill="#e05a4a"/><circle cx="742" cy="174" r="5" fill="#e05a4a"/><circle cx="742" cy="246" r="5" fill="#e05a4a"/>\';',
'    /* 手机底部 home 横条 */',
'    body+=\'<rect x="660" y="338" width="60" height="5" rx="2.5" fill="#4a3f62"/>\';',
'    /* 左侧：蹲着看手机的队员剪影 + 潮水 */',
'    body+=\'<rect x="0" y="248" width="600" height="132" fill="#181225"/>\';',
'    body+=\'<rect x="0" y="248" width="600" height="5" fill="#2a2140"/>\';',
'    /* 潮水（两条波浪涌向队员） */',
'    body+=\'<path d="M0 300 q60 -14 120 0 t120 0 t120 0 t120 0 t120 0" stroke="rgba(138,148,164,.35)" stroke-width="3" fill="none"/>\';',
'    body+=\'<path d="M0 322 q80 -12 160 0 t160 0 t160 0" stroke="rgba(138,148,164,.22)" stroke-width="2.4" fill="none"/>\';',
'    /* 蹲着看屏的剪影（被潮水围住） */',
'    body+=\'<g fill="#5a6472"><circle cx="300" cy="268" r="11"/><path d="M288 282 q12 -8 24 0 l4 22 h-32 Z"/><rect x="304" y="288" width="22" height="30" rx="4" fill="#101820" stroke="#f0b24a" stroke-width="1.6"/></g>\';',
'    body+=\'<g fill="#6e7888"><circle cx="200" cy="278" r="9"/><path d="M190 290 q10 -7 20 0 l3 20 h-26 Z"/></g>\';',
'    body+=\'<g fill="#6e7888"><circle cx="396" cy="278" r="9"/><path d="M386 290 q10 -7 20 0 l3 20 h-26 Z"/></g>\';',
'    /* 屏幕光照（投在队员脸上） */',
'    body+=\'<ellipse cx="330" cy="286" rx="70" ry="26" fill="rgba(240,178,74,.10)" class="fogA"/>\';',
'    /* 舞台横幅 */',
'    body+=\'<rect x="120" y="140" width="440" height="30" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="1.8"/>\';',
'    body+=\'<text x="340" y="161" font-size="17" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">数字篇 · 屏中潮</text>\';',
'    body+=\'<text x="300" y="352" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif" opacity=".85">屏 中</text>\';',
'    body+=\'<ellipse cx="220" cy="330" rx="160" ry="22" fill="rgba(138,148,164,.08)" class="fogA"/>\';',
'  }else{',
'    /* 破晓：屏幕暗下去，天亮了 */',
'    body+=\'<rect x="0" y="248" width="880" height="132" fill="#2a2018"/>\';',
'    body+=\'<rect x="0" y="248" width="880" height="5" fill="#43321f"/>\';',
'    /* 手机黑了屏（朝下扣着） */',
'    body+=\'<rect x="620" y="150" width="170" height="120" rx="18" fill="#1c1530" stroke="#43321f" stroke-width="2.4"/>\';',
'    body+=\'<rect x="636" y="166" width="138" height="88" rx="6" fill="#241b36"/>\';',
'    body+=\'<path d="M660 210 l30 -26 l30 26" stroke="#4a3f62" stroke-width="3" fill="none" stroke-linecap="round"/>\';',
'    /* 太阳 */',
'    body+=\'<circle cx="180" cy="110" r="30" fill="#f0c86a"/>\';',
'    body+=\'<circle cx="180" cy="110" r="42" fill="none" stroke="#f0c86a" stroke-width="2" opacity=".4"/>\';',
'    /* 睡着的四个人 */',
'    body+=\'<g fill="#6e7888"><circle cx="300" cy="272" r="10"/><path d="M290 284 q10 -7 20 0 l3 18 h-26 Z"/></g>\';',
'    body+=\'<g fill="#6e7888"><circle cx="380" cy="278" r="9"/><path d="M371 289 q9 -6 18 0 l3 17 h-24 Z"/></g>\';',
'    body+=\'<g fill="#f0d68a"><circle cx="470" cy="272" r="10"/><path d="M460 284 q10 -7 20 0 l3 18 h-26 Z"/></g>\';',
'    body+=\'<g fill="#f0d68a"><circle cx="546" cy="278" r="9"/><path d="M537 289 q9 -6 18 0 l3 17 h-24 Z"/></g>\';',
'    /* 潮水退了 */',
'    body+=\'<path d="M0 318 q80 -10 160 0 t160 0 t160 0 t160 0" stroke="rgba(240,214,138,.18)" stroke-width="2.4" fill="none"/>\';',
'    body+=\'<g class="flower"><rect x="240" y="256" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="580" y="252" width="9" height="9" rx="2" fill="#8fbf6a"/><rect x="120" y="270" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="700" y="264" width="8" height="8" rx="2" fill="#8fbf6a"/></g>\';',
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

/* ============ 14. 营地横幅（标题页/结算页）：看台+眼 → 手机剪影 ============ */
rep("'<rect x=\"414\" y=\"86\" width=\"52\" height=\"9\" rx=\"2\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"1.2\"/>'+\n  '<rect x=\"410\" y=\"95\" width=\"60\" height=\"9\" rx=\"2\" fill=\"#1c1530\" stroke=\"#f0b24a\" stroke-width=\"1.2\"/>'+\n  '<rect x=\"406\" y=\"104\" width=\"68\" height=\"9\" rx=\"2\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"1.2\"/>'+\n  '<ellipse cx=\"440\" cy=\"72\" rx=\"14\" ry=\"8.6\" fill=\"#f4f1e6\"/><circle cx=\"440\" cy=\"73\" r=\"4\" fill=\"#2e3440\"/>'+",
    "'<rect x=\"420\" y=\"70\" width=\"40\" height=\"42\" rx=\"7\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"1.8\"/>'+\n  '<rect x=\"424\" y=\"74\" width=\"32\" height=\"30\" rx=\"3\" fill=\"#101820\"/>'+\n  '<path d=\"M430 88 l4.4 5 l4.4 -5 l3.6 3.4 l2 -3.4 l3.4 4\" stroke=\"#f0b24a\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"/>'+\n  '<rect x=\"432\" y=\"106\" width=\"16\" height=\"2.6\" rx=\"1.3\" fill=\"#4a3f62\"/>'+");

/* ============ 15. 结算页分支名 → 数字篇分支 ============ */
rep('var m={A:"A线 · 走过去一步",B:"B线 · 先看清楚",C:"C线 · 递一句话",D:"D线 · 认身上信号"};',
    'var m={A:"A线 · 先锁屏一下",B:"B线 · 先想清比什么",C:"C线 · 先问一句",D:"D线 · 先认累信号"};');
/* 观察 → 本章主题（点赞秤 + 落闸 + 转发三问收束） */
rep('return "「以后看见有人被堵住，我先认一下心里的信号，再迈最小的一步：站过去、递句话、找大人。不能选无视。」";',
    'return "「以后再刷到停不下来，我先认一下身体的信号：眼睛酸、心里空，就落闸。屏幕朝下，说一句『明天见』。」";');
/* 隐藏台词 → 数字篇主题 */
rep('sec.textContent="✨ 隐藏台词：看台上最响的声音，是「跟我来」——走出看台的那一步，是你自己走过来的。";',
    'sec.textContent="✨ 隐藏台词：深夜最亮的那块屏，关掉它的人，是你自己——明天见。";');
/* 连招卡预告语 → 全远征收尾 */
rep('box.appendChild(el("div","locked-note","预告：最后一位新考验——「深夜的手机」，在排队报到。\\n冲突没有解决的章节，连招图标会是灰色的。"));',
    'box.appendChild(el("div","locked-note","十一个关卡，都走过来了。远征没有终点——下一站，是你的每一天。\\n冲突没有解决的章节，连招图标会是灰色的。"));');

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
