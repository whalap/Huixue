/* Ch2 构建脚本：从 Ch1 复制改造出《大脑远征队-Ch2-分心花田.html》
 * 用法：node build_ch2.js
 * 策略：精确锚点替换（数据块整块换、函数整块换、文案点替换），保留 Ch1 全部 CSS/引擎/修复
 */
var fs = require("fs");
var SRC = "大脑远征队-Ch1-拖延沼泽.html";
var DST = "大脑远征队-Ch2-分心花田.html";
var src = fs.readFileSync(SRC, "utf8");

function swap(from, to, block) {
  var a = src.indexOf(from);
  if (a < 0) throw new Error("起始锚点未找到: " + from.slice(0, 50));
  var b = src.indexOf(to, a);
  if (b < 0) throw new Error("结束锚点未找到: " + to.slice(0, 50));
  src = src.slice(0, a) + block + src.slice(b);
}
function rep(anchor, to) {
  if (src.indexOf(anchor) < 0) throw new Error("锚点未找到: " + anchor.slice(0, 50));
  src = src.split(anchor).join(to);
}

/* ============ 1. HTML 文案 ============ */
rep("<title>大脑远征队 · 第一章「拖延沼泽」</title>",
    "<title>大脑远征队 · 第二章「分心花田」</title>");
rep('<div class="sub">第一章 · 拖延沼泽 —— 四个人，才是完整的外挂</div>',
    '<div class="sub">第二章 · 分心花田 —— 一次，只做一件事</div>');
rep("HTML 原型版 · Ch1 全流程可玩 · 四档难度 + 随时暂停存档",
    "HTML 原型版 · Ch2 全流程可玩 · 四档难度 + 随时暂停存档");
rep('<div class="boss-name">拖拖 · 拖延沼泽主</div>',
    '<div class="boss-name">多多 · 分心花田主</div>');
rep('<div class="bar-label"><span>拖延值</span><span id="bossHpNum">100</span></div>',
    '<div class="bar-label"><span>分心值</span><span id="bossHpNum">100</span></div>');

/* ============ 2. CSS：花粉飘动 + 花瓣粒子（插在演员站位注释前） ============ */
swap("/* 演员站位 */", "/* 演员站位 */",
  ".pollen{animation:pollen 5.5s ease-in-out infinite}\n" +
  "@keyframes pollen{0%,100%{transform:translate(0,0);opacity:.2}50%{transform:translate(12px,-16px);opacity:.85}}\n" +
  ".petalp{position:absolute;border-radius:50% 0 50% 50%;pointer-events:none;opacity:.9}\n" +
  "/* 演员站位 */");

/* ============ 3. CHARS 展示技能 ============ */
rep('       skills:["recode","micro","trigger"]},', '       skills:["micro","single","recode"]},');
rep('       skills:["trigger","monitor","mark"]},',   '       skills:["anchor","monitor","trigger"]},');
rep('       skills:["monitor","trigger","mark"]},',   '       skills:["tomato","monitor","micro"]},');
rep('       skills:["mark","trigger","micro"]}',      '       skills:["mark","tomato","recode"]}');
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","拖拖":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","多多":"boss","四人":"all"};');

/* ============ 4. SKILLS（7 个：micro 继承 + 3 新技能 + mark + 2 个 Ch1 灰锁） ============ */
swap("var SKILLS={", "var COMBOS=[",
'var SKILLS={\n' +
'  micro  :{name:"微步骤启动",owner:"song",\n' +
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",\n' +
'           mantra:"「先做第一步，第一步只花五秒。」",\n' +
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",\n' +
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},\n' +
'  single :{name:"单线程",owner:"song",\n' +
'           one:"一次只做一件事。这一件不做完，不碰下一件。",\n' +
'           mantra:"「一次，只做一件事。」",\n' +
'           why:"大脑一次只照看得了一桩事。同时追三只蝴蝶，一只也抓不到；盯住一只，反而追得到。",\n' +
'           cross:"搭积木的时候就搭积木，别一边听故事一边搭——塌了，还不知道是哪块歪的。"},\n' +
'  anchor :{name:"环境锚定",owner:"jiu",\n' +
'           one:"给事情找一个固定的窝：固定的角落，固定的开场。",\n' +
'           mantra:"「一到老地方，人就安静下来。」",\n' +
'           why:"大脑认位置，比认时间更灵。固定的角落加固定的开场，会替大脑记住「现在该干什么」。",\n' +
'           cross:"书桌的灯一亮，就知道要看书了；走到起跑线，身体自己就知道要跑了。"},\n' +
'  tomato :{name:"番茄钟",owner:"mian",\n' +
'           one:"定一个短短的钟。铃响之前，只对付眼前这一件。",\n' +
'           mantra:"「定个短短的钟，铃响就歇。」",\n' +
'           why:"「很长的时间」让人想逃，「短短一程」让人想试试。钟声把大事切成一程一程，每程都到得了。",\n' +
'           cross:"跳绳跳一百下，就歇口气；看故事看一章，就起来倒杯水。"},\n' +
'  mark   :{name:"弱点标记",owner:"shan",\n' +
'           one:"把最安静的人看见的东西说出来，敌人就有了破绽。",\n' +
'           mantra:"「先标记，再出招。」",\n' +
'           why:"打游戏要瞄准弱点才好赢。做事也是：先标出「到底卡在哪一步」，再出手。",\n' +
'           cross:"积木塔总塌？先看清是哪一块歪了，比推倒重来管用。"},\n' +
'  recode :{name:"认知重编程",owner:"song",\n' +
'           one:"换一句说法，同一件事就从「可怕」变成「有办法」。",\n' +
'           mantra:"「一句话能杀死你，一句话也能救你。」",\n' +
'           why:"困住你的不是事，是你对事说的那句话。把「我们死定了」换成「他踩过的坑就是我的地图」，大脑就开始找办法。",\n' +
'           cross:"「我肯定学不会骑车」换成「我只是还没找到平衡」；「这关好难」换成「这关我还没找到窍门」。"},\n' +
'  monitor:{name:"状态监控",owner:"mian",\n' +
'           one:"随时看一眼自己的「体力条」，累了就补给，不硬撑。",\n' +
'           mantra:"「先看电量，再决定冲不冲。」",\n' +
'           why:"手机没电会提醒你，人累了却不会。学会自己看电量，才不会在关键时刻突然关机。",\n' +
'           cross:"跳绳跳着开始大喘气？那是身体在亮黄灯：该歇会儿啦。"}\n' +
'};\n\n');

/* ============ 5. COMBOS ============ */
swap("var COMBOS=[", "/* ---------- 剧情场景 ---------- */",
'var COMBOS=[\n' +
'  {name:"一页一心",members:["single","tomato"],\n' +
'   desc:"单线程（松）＋番茄钟（眠）——一次只做一件事，再给这件事定个短短的钟。跨角色组合技，两人以上才发得动。"},\n' +
'  {name:"不放弃",members:["recode","micro","monitor"],locked:true,\n' +
'   desc:"认知重编程（松）＋微步骤启动（松）＋状态监控（眠）——后续章节解锁。"}\n' +
'];\n\n');

/* ============ 6. SCENES（Ch2 剧情：眠眠不会说「不」） ============ */
swap("var SCENES={", "/* ---------- 战斗 ---------- */",
'var SCENES={\n' +
' i1:{kind:"story",next:"i2",lines:[\n' +
'  {anim:"lights"},\n' +
'  {who:"眠眠",text:"四杯水。人齐了。"},\n' +
'  {who:"松松",text:"花田的蝴蝶，归我！"},\n' +
'  {anim:"campfire"}\n' +
' ]},\n' +
' i2:{kind:"skill",skill:"micro",lead:"松松掏出第一章那张折得四四方方的笔记。「先做第一步——到哪儿都管用。」",next:"i3"},\n' +
' i3:{kind:"story",next:"choice1",lines:[\n' +
'  {anim:"march"},\n' +
'  {who:"究究",text:"花田里，石头排成一条线。"},\n' +
'  {who:"眠眠",text:"香。……谁又在叫我。"},\n' +
'  {anim:"focus-stone"},\n' +
'  {anim:"boss-eye"}\n' +
' ]},\n' +
'\n' +
' choice1:{kind:"choice",letters:true,prompt:"此起彼伏的呼唤声里，你先走向谁？",options:[\n' +
'  {t:"走向松松——他同时追着蝴蝶、皮球和地图",next:"a1",branch:"A",\n' +
'   after:[{act:"三只手，一件都没做完。"},{who:"松松",text:"我……我全都要！"}]},\n' +
'  {t:"走向眠眠——她一个人拎着四只水杯",next:"b1",branch:"B",\n' +
'   after:[{act:"她的包越来越满，脚步越来越慢。"},{who:"眠眠",text:"我……我不累。"}]},\n' +
'  {t:"走向究究——他抱着图鉴，原地打转",next:"c1",branch:"C",\n' +
'   after:[{act:"每朵花，他都想研究一半。"},{who:"究究",text:"都好看。……看不过来。"}]},\n' +
'  {t:"走向闪闪——他盯着某朵花，一动不动",next:"d1",branch:"D",\n' +
'   after:[{act:"那么吵，他居然看得见一朵花。"},{who:"你",text:"闪闪，你看见什么了？"}]}\n' +
' ]},\n' +
'\n' +
' /* ---- A 线 · 松松：单线程 ---- */\n' +
' a1:{kind:"story",next:"a2",lines:[\n' +
'  {who:"松松",text:"蝴蝶！花瓣！地图！全要！"},\n' +
'  {who:"眠眠",text:"全都要，就是全都要不到。"}\n' +
' ]},\n' +
' a2:{kind:"skill",skill:"single",lead:"松松的三只手，终于决定只伸出一只。",next:"a3"},\n' +
' a3:{kind:"choice",letters:false,prompt:"松松嘟囔：「热闹一点，才好玩嘛……」你说：",options:[\n' +
'  {t:"「一次一件事，才做得完。」",next:"conv",trust:8,flag:"kind",\n' +
'   after:[{who:"松松",text:"（把皮球收进包里）……先追这一只。"}]},\n' +
'  {t:"「随便你，开心就好。」",next:"conv",trust:2,\n' +
'   after:[{act:"松松耸耸肩，又去追第三只蝴蝶。"}]},\n' +
'  {t:"「三心二意，什么都得不到。」",next:"conv",trust:-5,flag:"toxic",\n' +
'   after:[{act:"松松的手垂了下去，蝴蝶飞走了。"}]}\n' +
' ]},\n' +
'\n' +
' /* ---- B 线 · 眠眠：番茄钟（本章社交困境核心） ---- */\n' +
' b1:{kind:"story",next:"b2",lines:[\n' +
'  {who:"眠眠",text:"「帮我拿水！」"},\n' +
'  {who:"眠眠",text:"「拉我一把！」……好。"},\n' +
'  {who:"眠眠",text:"都应下来。……都该应。"}\n' +
' ]},\n' +
' b2:{kind:"skill",skill:"tomato",lead:"眠眠给秒表上了新发条：「这一次，我也给自己定个钟。」",next:"b3"},\n' +
' b3:{kind:"choice",letters:false,prompt:"眠眠小声说：「拒绝的话……我说不出口。」你说：",options:[\n' +
'  {t:"「说不出口，就先说『等等』。」",next:"conv",trust:8,flag:"kind",\n' +
'   after:[{who:"眠眠",text:"……等等。好，我记住了。"}]},\n' +
'  {t:"「我帮你说！」",next:"conv",trust:3,\n' +
'   after:[{act:"眠眠点点头，把水杯抱得更紧了。"}]},\n' +
'  {t:"「谁让你答应那么快。」",next:"conv",trust:-5,flag:"toxic",\n' +
'   after:[{act:"眠眠低下头，拎起了第五只水杯。"}]}\n' +
' ]},\n' +
'\n' +
' /* ---- C 线 · 究究：环境锚定 ---- */\n' +
' c1:{kind:"story",next:"c2",lines:[\n' +
'  {who:"究究",text:"这朵，没研究过。"},\n' +
'  {who:"究究",text:"那朵，也没有。"},\n' +
'  {who:"闪闪",text:"（小声）……一直在打转。"}\n' +
' ]},\n' +
' c2:{kind:"skill",skill:"anchor",lead:"究究把图鉴铺在一块固定的石头上：「以后，就在这儿看。」",next:"c3"},\n' +
' c3:{kind:"choice",letters:false,prompt:"究究推推眼镜：「每个角落，我都想去看看……」你说：",options:[\n' +
'  {t:"「先选一个角落，看完再换。」",next:"conv",trust:8,flag:"kind",\n' +
'   after:[{who:"究究",text:"（在地图上画了一个圈）……就这儿。"}]},\n' +
'  {t:"「都想看，就都看一会儿。」",next:"conv",trust:2,\n' +
'   after:[{act:"究究点点头，又转回了原地。"}]},\n' +
'  {t:"「你这样，哪儿都去不了。」",next:"conv",trust:-5,flag:"toxic",\n' +
'   after:[{act:"究究的地图，悄悄合上了一半。"}]}\n' +
' ]},\n' +
'\n' +
' /* ---- D 线 · 闪闪：弱点标记 ---- */\n' +
' d1:{kind:"story",next:"d2",lines:[\n' +
'  {who:"闪闪",text:"这朵花上……停着一只虫。"},\n' +
'  {who:"闪闪",text:"它装成花瓣。别碰。"}\n' +
' ]},\n' +
' d2:{kind:"skill",skill:"mark",lead:"闪闪摊开手心——那朵花上，停着一只纸片似的虫。",next:"d3"},\n' +
' d3:{kind:"choice",letters:false,prompt:"松松还在催：「闪闪，到底看见什么啦？」你说：",options:[\n' +
'  {t:"「想说的时候，我们都在听。」",next:"conv",trust:8,flag:"kind",\n' +
'   after:[{who:"闪闪",text:"（很轻地点了点头）……嗯。"}]},\n' +
'  {t:"「对！大声说出来！」",next:"conv",trust:2,\n' +
'   after:[{act:"闪闪张了张嘴，又把半个字咽了回去。"}]},\n' +
'  {t:"（沉默）",next:"conv",trust:-2,flag:"hush",\n' +
'   after:[{act:"闪闪松开衣角，低下了头。"}]}\n' +
' ]},\n' +
'\n' +
' /* ---- 汇合 → Boss ---- */\n' +
' conv:{kind:"story",next:"BATTLE",lines:[\n' +
'  {anim:"boss-rise"},\n' +
'  {who:"多多",text:"看我……多好看……"},\n' +
'  {who:"眠眠",text:"它靠「再看一眼」活着。"},\n' +
'  {who:"松松",text:"那就不看。出招！"}\n' +
' ]},\n' +
'\n' +
' /* ---- 战后 ---- */\n' +
' w1:{kind:"story",next:"w2",lines:[\n' +
'  {anim:"boss-burst"},\n' +
'  {who:"多多",text:"你们……只看了一眼……"}\n' +
' ]},\n' +
' w2:{kind:"story",next:"w3",onEnter:function(){\n' +
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}\n' +
' },lines:[\n' +
'  {anim:"swamp-clear"},\n' +
'  {who:"眠眠",text:"约法三章？"},\n' +
'  {who:"四人",text:"自己的事情自己拿主意！"},\n' +
'  {who:"四人",text:"使唤别人之前，先问一句！"}\n' +
' ]},\n' +
' w3:{kind:"combo",next:"END"}\n' +
'};\n\n');

/* ============ 7. ROUNDS / REPLAY ============ */
swap("var ROUNDS=[", "var REPLAY={",
'var ROUNDS=[\n' +
' {name:"第 1 回合 · 花粉迷眼",rk:"pollen",\n' +
'  bossLine:"「看一眼……就一眼……」花粉糊住眼睛，石头路开始打转。",\n' +
'  valid:["micro","single"],\n' +
'  ease:"眠眠：花粉要用「小」解——小到不可能失败，或者一次只做一件事。"},\n' +
' {name:"第 2 回合 · 四面开花",rk:"bloom",\n' +
'  bossLine:"「这边！那边！都好看！」花开满四面，每一朵都在喊。",\n' +
'  valid:["micro","anchor","tomato"],\n' +
'  ease:"眠眠：太吵要用「静」解——固定一个角落，或者定个短短的钟。"},\n' +
' {name:"第 3 回合 · 多多狂欢",rk:"curse",\n' +
'  bossLine:"「别走！再看一眼！你们刚才明明笑了！」",\n' +
'  valid:"COMBO",\n' +
'  ease:"眠眠：这一下，一个人拦不住。找一位队友，各出一招。"}\n' +
'];\n');
swap("var REPLAY={", "var COMBO_LINES={",
'var REPLAY={\n' +
' pollen:{\n' +
'  micro:["把「穿过花田」切成五秒一步——先，盯住下一块石头。花粉扑了个空。"],\n' +
'  single:["「一次，只走这一条。」蝴蝶、花香、喊声，统统退后一格。"],\n' +
'  miss:["眠眠：「换一招。小到不可能失败，或者一次只做一件事。」"]\n' +
' },\n' +
' bloom:{\n' +
'  micro:["花开到哪儿，脚就走到哪儿——一级一级，不看不该看的。"],\n' +
'  anchor:["究究：「到老地方，人就安静。」花田里定下一格，噪音消失了。"],\n' +
'  tomato:["眠眠的钟「叮」了一声——短短一程，只对付眼前这一片。"],\n' +
'  miss:["眠眠：「太吵要用「静」解——再想一招。」"]\n' +
' },\n' +
' curse:{\n' +
'  single:["多多抖落一地花瓣：「一个人……拦不住我……」岸上伸过来一只手。"],\n' +
'  same:["两股相同的力气撞在一起，互相抵消。眠眠：「两个人，两个法子——再来！」"]\n' +
' }\n' +
'};\n');

/* ============ 8. COMBO_LINES / NAMES / FALLBACK / BORROW ============ */
swap("var COMBO_LINES={", "var COMBO_NAMES={",
'var COMBO_LINES={\n' +
' "anchor+mark" :["究究定下方寸，闪闪标出伪装的花。","哪朵花有问题，一眼就认了出来。"],\n' +
' "anchor+micro":["老地方，一小步，又一小步。","花田再吵，也吵不进这一格。"],\n' +
' "anchor+tomato":["固定的角落，短短的钟。","一程，一格——多多拉不住你们了。"],\n' +
' "anchor+monitor":["究究定下角落，眠眠看条省电。","一格安静，一格不硬撑。"],\n' +
' "mark+micro" :["闪闪标出虫子，松松一步跨过去。","伪装的弱点，被一脚踩中。"],\n' +
' "mark+single":["一次只看一个目标：先标，再走。","多多第一次露了怯。"],\n' +
' "mark+monitor":["闪闪点灯，眠眠看条。","弱点照到了，电量也省下了。"],\n' +
' "micro+tomato":["五秒一步，配上一程短短的钟。","碎步连成了一条线。"],\n' +
' "micro+monitor":["眠眠报电量，松松只迈一步。","一步，一电，咬合成同一个齿轮。"],\n' +
' "anchor+single":["单线程，扎进固定的角落。","世界只剩一件事，和一格安静。"],\n' +
' "single+tomato":["一次一件事，再给这件事一个短短的钟。","一页之内，一心只对一页——组合技「一页一心」！"],\n' +
' "monitor+single":["眠眠看条，松松只做一件。","电量，不浪费在第二件事上。"],\n' +
' "monitor+tomato":["先看电量，再定一程短短的钟。","一程刚好，一到就歇。"],\n' +
' "mark+tomato" :["眠眠的钟，闪闪的点。","一程一盏灯，花田亮了起来。"]\n' +
'};\n');
swap("var COMBO_NAMES={", "var COMBO_FALLBACK=",
'var COMBO_NAMES={\n' +
' "anchor+mark":"定框捉虫","anchor+micro":"方寸一步","anchor+tomato":"一格一程","anchor+monitor":"格中省电",\n' +
' "mark+micro":"踩点破绽","mark+single":"标记出发","mark+monitor":"点灯看条",\n' +
' "micro+tomato":"小步一程","micro+monitor":"一步一电",\n' +
' "anchor+single":"一心一隅","single+tomato":"一页一心",\n' +
' "monitor+single":"一电一件","monitor+tomato":"电量定程","mark+tomato":"点灯照花"\n' +
'};\n');
swap("var COMBO_FALLBACK=", "/* ---------- 章节地图 ---------- */",
'var COMBO_FALLBACK=["两股不同颜色的力量，在半空咬合成一个齿轮。","多多的花瓣，被正式吹散。"];\n' +
'var BORROW_ORDER=["monitor","mark","anchor","tomato","single"];\n' +
'var BORROW_LINE={\n' +
' mian:"眠眠：「我的秒表和钟都借你们——先看电量，再定短短一程。」",\n' +
' shan:"闪闪：「我把看见的弱点标出来。你们，尽管出手。」",\n' +
' jiu :"究究：「固定角落，固定开场——到了地方，人就安静。」",\n' +
' song:"松松：「「单线程」借你们！一次，只做一件事！」"\n' +
'};\n\n');

/* ============ 9. 地图 / 存档 key ============ */
swap("var MAP_NODES=", "/* ================= 状态 ================= */",
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"field",t:"花田",e:"🌸"},{k:"boss",t:"Boss",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];\n' +
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};\n\n');
swap('var SAVE_KEY="brainexp_ch1_save_v3";', 'var RANK=',
'var SAVE_KEY="brainexp_ch2_save_v1";\nvar BEST_KEY="brainexp_ch2_best_v1";\n');

/* ============ 10. TOTEM_ART（+3 新图腾） ============ */
swap("var TOTEM_ART={", "function totem(",
'var TOTEM_ART={\n' +
' micro:\'<path d="M7 41h9v-8h9v-8h9V16h9" fill="none" stroke="TOT" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="40" cy="8" r="3" fill="TOT"/>\',\n' +
' single:\'<path d="M8 24h30" stroke="TOT" stroke-width="4" stroke-linecap="round"/><path d="M30 16l9 8-9 8" fill="none" stroke="TOT" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="24" r="3.4" fill="TOT"/><path d="M8 36h30M8 12h30" stroke="TOT" stroke-width="2" stroke-linecap="round" opacity=".38"/>\',\n' +
' anchor:\'<circle cx="24" cy="9" r="4" fill="none" stroke="TOT" stroke-width="3.5"/><path d="M24 13v24" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/><path d="M11 19l13-6 13 6" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 33c5 7 13 9 17 9s12-2 17-9" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/>\',\n' +
' tomato:\'<circle cx="24" cy="27" r="13" fill="none" stroke="TOT" stroke-width="3.5"/><path d="M24 27v-7M24 27l4.5 2.5" stroke="TOT" stroke-width="3" stroke-linecap="round"/><path d="M18 12l3-5h6l3 5" fill="none" stroke="TOT" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="9" r="2" fill="TOT"/>\',\n' +
' trigger:\'<rect x="6" y="16" width="36" height="16" rx="8" fill="none" stroke="TOT" stroke-width="3.5"/><circle cx="33" cy="24" r="5.5" fill="TOT"/>\',\n' +
' recode:\'<path d="M8 17h26" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/><path d="M27 10l8 7-8 7" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 31H14" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/><path d="M21 24l-8 7 8 7" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>\',\n' +
' monitor:\'<rect x="5" y="14" width="32" height="20" rx="5" fill="none" stroke="TOT" stroke-width="3.5"/><rect x="40" y="20" width="4" height="8" rx="2" fill="TOT"/><path d="M11 24h5l3-6 4 10 3-4h6" fill="none" stroke="TOT" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>\',\n' +
' mark:\'<circle cx="24" cy="24" r="15" fill="none" stroke="TOT" stroke-width="3.5"/><circle cx="24" cy="24" r="7" fill="none" stroke="TOT" stroke-width="3.5"/><circle cx="24" cy="24" r="2.4" fill="TOT"/><path d="M24 2v7M24 39v7M2 24h7M39 24h7" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/>\'\n' +
'};\n');

/* ============ 11. bossSVG → 多多（分心树精） ============ */
swap("/* ---- Boss 拖拖", "/* ---- 场景插画 ---- */",
'/* ---- Boss 多多（分心树精 · 花钟面孔） ---- */\n' +
'function bossSVG(size){\n' +
'  var petals="";\n' +
'  for(var i=0;i<8;i++){\n' +
'    var a=i*Math.PI/4, px=(60+20*Math.cos(a)).toFixed(1), py=(30+20*Math.sin(a)).toFixed(1);\n' +
'    petals+=\'<ellipse cx="\'+px+\'" cy="\'+py+\'" rx="7" ry="4.6" fill="\'+(i%2?"#e0a8b8":"#d292b0")+\'" transform="rotate(\'+(i*45)+\' \'+px+\' \'+py+\')"/>\';\n' +
'  }\n' +
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+\n' +
'  \'<ellipse cx="60" cy="101" rx="43" ry="8" fill="rgba(0,0,0,.45)"/>\'+\n' +
'  \'<path d="M40 92 q-9 7 -20 8 M80 92 q9 7 20 8 M50 93 q-2 7 -9 10 M70 93 q2 7 9 10" stroke="#4a3524" stroke-width="6" fill="none" stroke-linecap="round"/>\'+\n' +
'  \'<path d="M37 94 q-5 -32 7 -46 h32 q12 14 7 46 z" fill="#4a3b28"/>\'+\n' +
'  \'<path d="M52 94 q-2 -28 5 -38 M68 94 q2 -26 -3 -36" stroke="#5c4832" stroke-width="3" fill="none" stroke-linecap="round"/>\'+\n' +
'  \'<path d="M39 56 q-15 -5 -20 -19" stroke="#4a3b28" stroke-width="6" fill="none" stroke-linecap="round"/>\'+\n' +
'  \'<path d="M81 56 q15 -5 20 -19" stroke="#4a3b28" stroke-width="6" fill="none" stroke-linecap="round"/>\'+\n' +
'  \'<circle cx="17" cy="35" r="5.4" fill="#e0a8b8"/><circle cx="17" cy="35" r="2" fill="#f0d68a"/>\'+\n' +
'  \'<circle cx="103" cy="35" r="5.4" fill="#c9a2e0"/><circle cx="103" cy="35" r="2" fill="#f0d68a"/>\'+\n' +
'  petals+\n' +
'  \'<circle cx="52" cy="30" r="10.5" fill="#e8e2cf" stroke="#241f16" stroke-width="2.5"/><path d="M52 30 V23.5 M52 30 l5.8 3.2" stroke="#241f16" stroke-width="2.5" stroke-linecap="round"/>\'+\n' +
'  \'<circle cx="70" cy="30" r="10.5" fill="#e8e2cf" stroke="#241f16" stroke-width="2.5"/><path d="M70 30 V23.5 M70 30 l5.8 3.2" stroke="#241f16" stroke-width="2.5" stroke-linecap="round"/>\'+\n' +
'  \'<ellipse cx="61" cy="46" rx="7.5" ry="5.5" fill="#241f16"/><ellipse cx="61" cy="44.5" rx="4" ry="2" fill="#8a4a52"/>\'+\n' +
'  \'<g class="pollen" style="animation-delay:.3s"><circle cx="24" cy="16" r="2.6" fill="#e0a8b8"/></g>\'+\n' +
'  \'<g class="pollen" style="animation-delay:1.6s"><circle cx="98" cy="60" r="2.2" fill="#c9a2e0"/></g>\'+\n' +
'  \'<g class="pollen" style="animation-delay:2.4s"><circle cx="30" cy="72" r="2" fill="#f0d68a"/></g>\'+\n' +
'  \'</svg>\';\n' +
'}\n\n');

/* ============ 12. sceneKindOf + sceneSVG → 花田 ============ */
swap("function sceneKindOf(id){", "/* ---- 营地横幅",
'function sceneKindOf(id){\n' +
'  if(id==="i1"||id==="i2")return "camp";\n' +
'  if(id==="w1"||id==="w2"||id==="w3")return "clear";\n' +
'  return "field";\n' +
'}\n' +
'function sceneSVG(kind){\n' +
'  var clear=(kind==="clear"), camp=(kind==="camp");\n' +
'  var sky1=camp?"#1c2f26":(clear?"#31405c":"#3a3056"), sky2=camp?"#0d1710":(clear?"#1a2432":"#1c1730");\n' +
'  var sid="sk"+kind;\n' +
'  var body="";\n' +
'  if(camp){\n' +
'    body+=\'<path d="M0 236 L130 176 L250 232 L390 172 L530 236 L670 186 L810 242 L880 206 L880 258 L0 258 Z" fill="#0e1a12" opacity=".9"/>\';\n' +
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#131f16"/><rect x="0" y="250" width="880" height="5" fill="#1b2e20"/>\';\n' +
'    body+=\'<circle cx="440" cy="292" r="86" fill="url(#\'+sid+\'glow)" class="flicker"/>\';\n' +
'    body+=\'<ellipse cx="414" cy="314" rx="8" ry="4" fill="#3a4a3a"/><ellipse cx="466" cy="314" rx="8" ry="4" fill="#3a4a3a"/><ellipse cx="428" cy="308" rx="6" ry="3.4" fill="#3a4a3a"/><ellipse cx="452" cy="308" rx="6" ry="3.4" fill="#3a4a3a"/>\';\n' +
'    body+=\'<path d="M426 306 L454 296 M454 306 L426 296" stroke="#4a3520" stroke-width="6" stroke-linecap="round"/>\';\n' +
'    body+=\'<path class="flame" d="M440 304 C428 292 433 278 440 266 C447 278 452 292 440 304 Z" fill="#e8934a"/>\';\n' +
'    body+=\'<path class="flame f2" d="M440 302 C434 294 437 284 440 277 C443 284 446 294 440 302 Z" fill="#f0d68a"/>\';\n' +
'    body+=\'<path d="M170 300 L128 342 L212 342 Z" fill="#1a2a20" stroke="#22392a" stroke-width="1.5"/><path d="M170 318 L156 342 L184 342 Z" fill="#0a120c"/>\';\n' +
'    body+=\'<path d="M710 300 L672 342 L748 342 Z" fill="#1a2a20" stroke="#22392a" stroke-width="1.5"/><path d="M710 318 L698 342 L722 342 Z" fill="#0a120c"/>\';\n' +
'    body+=\'<rect x="282" y="310" width="18" height="14" rx="3" fill="#7bc96f"/><path d="M288 310 q3 -6 6 0" stroke="#5aa853" fill="none" stroke-width="2.5"/>\';\n' +
'    body+=\'<rect x="585" y="316" width="30" height="10" rx="1" fill="#d8c9a0"/><circle cx="585" cy="321" r="4" fill="#a8863c"/><circle cx="615" cy="321" r="4" fill="#a8863c"/><path d="M590 316 v10 M600 316 v10 M608 316 v10" stroke="#b5a679" stroke-width="1"/>\';\n' +
'    body+=\'<path d="M654 310 h12 l-2 14 h-8 z" fill="#cfd8c5"/><rect x="653" y="307" width="14" height="4" rx="1.5" fill="#9aa88f"/>\';\n' +
'    body+=\'<path d="M240 296 q10 6 20 0 l-4 9 q-6 -5 -12 0 z" fill="#c9a2e0"/>\';\n' +
'    body+=\'<ellipse cx="200" cy="270" rx="90" ry="16" fill="rgba(200,230,200,.05)" class="fogA"/>\';\n' +
'  }else{\n' +
'    var bark=clear?"#3f4a38":"#2b2436", crown=clear?"#4b5a44":"#332a44";\n' +
'    body+=\'<path d="M694 258 L688 156 M694 258 L702 156" stroke="\'+bark+\'" stroke-width="11" fill="none" stroke-linecap="round"/>\';\n' +
'    body+=\'<path d="M691 196 L652 162 M695 180 L738 148 M691 214 L656 194 M696 202 L734 178" stroke="\'+bark+\'" stroke-width="7" fill="none" stroke-linecap="round"/>\';\n' +
'    body+=\'<circle cx="662" cy="132" r="27" fill="\'+crown+\'"/><circle cx="716" cy="122" r="30" fill="\'+crown+\'"/><circle cx="696" cy="150" r="24" fill="\'+crown+\'"/><circle cx="640" cy="156" r="18" fill="\'+crown+\'"/><circle cx="740" cy="150" r="19" fill="\'+crown+\'"/>\';\n' +
'    if(clear){\n' +
'      body+=\'<g class="flower"><circle cx="662" cy="128" r="4" fill="#e0a8b8"/><circle cx="716" cy="118" r="4" fill="#f0d68a"/><circle cx="696" cy="146" r="4" fill="#c9a2e0"/><circle cx="640" cy="152" r="3.4" fill="#e0a8b8"/><circle cx="740" cy="146" r="3.4" fill="#f0d68a"/></g>\';\n' +
'    }else{\n' +
'      body+=\'<g class="pollen"><circle cx="676" cy="126" r="4.6" fill="#f0d68a"/><circle cx="704" cy="120" r="4.6" fill="#f0d68a"/></g>\';\n' +
'    }\n' +
'    body+=\'<rect x="0" y="246" width="880" height="134" fill="\'+(clear?"#20362a":"#182a20")+\'"/>\';\n' +
'    body+=\'<ellipse cx="440" cy="306" rx="420" ry="88" fill="url(#\'+sid+\'meadow)"/>\';\n' +
'    body+=\'<path d="M160 268 q40 -9 80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="rgba(150,200,170,.12)" stroke-width="2" fill="none"/>\';\n' +
'    var stones="";\n' +
'    STONES.forEach(function(p,i){\n' +
'      var hl=(kind==="field"&&i===2);\n' +
'      var dy=clear?-14:0;\n' +
'      stones+=\'<ellipse cx="\'+p[0]+\'" cy="\'+(p[1]+dy)+\'" rx="\'+(hl?26:24)+\'" ry="\'+(hl?11:9)+\'" fill="\'+(hl?"#7a8f68":(clear?"#55684e":"#46583f"))+\'" stroke="#2c3a28" stroke-width="1.5"\'+(hl?\' class="stone-hl"\':\'\')+\'/>\';\n' +
'      stones+=\'<ellipse cx="\'+(p[0]-5)+\'" cy="\'+(p[1]+dy-2)+\'" rx="8" ry="2.5" fill="rgba(255,255,255,.08)"/>\';\n' +
'    });\n' +
'    var flowers=clear\n' +
'      ?\'<g class="flower"><circle cx="306" cy="272" r="4" fill="#e0a8b8"/><circle cx="306" cy="272" r="1.5" fill="#f0d68a"/><circle cx="542" cy="234" r="4" fill="#f0d68a"/><circle cx="542" cy="234" r="1.5" fill="#a8863c"/><circle cx="228" cy="278" r="4" fill="#c9a2e0"/><circle cx="228" cy="278" r="1.5" fill="#f0d68a"/><circle cx="150" cy="290" r="3.4" fill="#e0a8b8"/><circle cx="430" cy="252" r="3.4" fill="#f0d68a"/><circle cx="660" cy="270" r="3.4" fill="#c9a2e0"/></g>\'\n' +
'      :\'<g opacity=".8"><circle cx="306" cy="274" r="3.4" fill="#8a6a78"/><circle cx="542" cy="236" r="3.4" fill="#8a7a58"/><circle cx="228" cy="280" r="3.4" fill="#7a6a8a"/><circle cx="150" cy="292" r="3" fill="#8a6a78"/><circle cx="430" cy="254" r="3" fill="#8a7a58"/><circle cx="660" cy="272" r="3" fill="#7a6a8a"/></g>\';\n' +
'    body+=stones+flowers;\n' +
'    body+=\'<path d="M70 338 q6 -34 4 -52 M84 340 q10 -28 8 -46 M60 342 q2 -22 0 -36 M810 340 q-6 -34 -4 -54 M824 342 q-10 -30 -8 -48" stroke="\'+(clear?"#2a4632":"#1d3025")+\'" stroke-width="4" fill="none" stroke-linecap="round"/>\';\n' +
'    if(clear){\n' +
'      body+=\'<g class="ff"><circle cx="200" cy="140" r="2.6" fill="#f0d68a"/></g><g class="ff f2"><circle cx="520" cy="112" r="2.2" fill="#f0d68a"/></g><g class="ff f3"><circle cx="660" cy="182" r="2.6" fill="#f0d68a"/></g><g class="ff f4"><circle cx="340" cy="92" r="2" fill="#f0d68a"/></g><g class="ff f5"><circle cx="756" cy="160" r="2.2" fill="#f0d68a"/></g>\';\n' +
'    }else{\n' +
'      body+=\'<g class="pollen" style="animation-delay:0s"><circle cx="180" cy="150" r="3" fill="#e0c8e8"/></g>\'\n' +
'          +\'<g class="pollen" style="animation-delay:1.2s"><circle cx="330" cy="110" r="2.4" fill="#e0c8e8"/></g>\'\n' +
'          +\'<g class="pollen" style="animation-delay:2.1s"><circle cx="500" cy="150" r="3.2" fill="#e0c8e8"/></g>\'\n' +
'          +\'<g class="pollen" style="animation-delay:.7s"><circle cx="640" cy="105" r="2.2" fill="#e0c8e8"/></g>\'\n' +
'          +\'<g class="pollen" style="animation-delay:1.7s"><circle cx="770" cy="170" r="2.8" fill="#e0c8e8"/></g>\'\n' +
'          +\'<g class="pollen" style="animation-delay:2.6s"><circle cx="240" cy="190" r="2.2" fill="#e0c8e8"/></g>\';\n' +
'    }\n' +
'  }\n' +
'  var wm="";\n' +
'  (state.skills||[]).forEach(function(id,i){\n' +
'    var art=TOTEM_ART[id]; if(!art)return;\n' +
'    var inner=art.split("TOT").join("#f0d68a");\n' +
'    wm+=\'<g transform="translate(\'+(752+i*44)+\',\'+(306+(i>=3?-44:0))+\')" opacity=".1">\'+inner+\'</g>\';\n' +
'  });\n' +
'  return \'<svg class="scene-svg" viewBox="0 0 880 380" preserveAspectRatio="xMidYMid slice">\'+\n' +
'  \'<defs><linearGradient id="\'+sid+\'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="\'+sky1+\'"/><stop offset="1" stop-color="\'+sky2+\'"/></linearGradient>\'+\n' +
'  (camp?(\'<radialGradient id="\'+sid+\'glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(240,180,90,.18)"/><stop offset="1" stop-color="rgba(240,180,90,0)"/></radialGradient>\')\n' +
'        :(\'<radialGradient id="\'+sid+\'meadow" cx=".5" cy=".35" r=".85"><stop offset="0" stop-color="\'+(clear?"#2c4a38":"#1f3226")+\'"/><stop offset="1" stop-color="#0a120c"/></radialGradient>\'))+\n' +
'  \'</defs>\'+\n' +
'  \'<rect width="880" height="380" fill="url(#\'+sid+\'sky)"/>\'+\n' +
'  \'<circle cx="726" cy="64" r="54" fill="rgba(223,232,207,.09)"/><circle cx="726" cy="64" r="30" fill="#dfe8cf" opacity="\'+(clear?"1":".55")+\'"/><circle cx="714" cy="56" r="5" fill="rgba(120,140,110,.35)"/><circle cx="733" cy="72" r="3.4" fill="rgba(120,140,110,.3)"/>\'+\n' +
'  \'<g fill="#dfe8cf" opacity=".8"><circle cx="90" cy="50" r="1.6"/><circle cx="160" cy="92" r="1.3"/><circle cx="620" cy="40" r="1.6"/><circle cx="770" cy="120" r="1.3"/><circle cx="300" cy="62" r="1.5"/><circle cx="480" cy="36" r="1.2"/><circle cx="840" cy="180" r="1.4"/></g>\'+\n' +
'  body+\n' +
'  \'</svg>\';\n' +
'}\n\n');

/* ============ 13. 引擎点改 ============ */
/* 回合 REPLAY key 数据驱动（Ch1 硬编码 whisper/warm/curse，Ch2 为 pollen/bloom/curse） */
rep('var r=ROUNDS[b.round], rk=["whisper","warm","curse"][b.round];',
    'var r=ROUNDS[b.round], rk=r.rk||["whisper","warm","curse"][b.round];');
rep('bg.insertAdjacentHTML("afterbegin",sceneSVG("swamp"));',
    'bg.insertAdjacentHTML("afterbegin",sceneSVG("field"));');
rep('el("i","bubblep")', 'el("i","petalp")'); /* 两处：bubbleRain + bossBurstFx → 花瓣 */
/* 翻转卡布局修复（真浏览器 E2E 抓到）：back 面原为 absolute inset:0，笔记内容比正面高时溢出盖住「记住啦」按钮。
   改为 grid 叠合正反面（grid-area:1/1），容器高度取两面最大值，彻底消除溢出。 */
rep('.flip-inner{position:relative;transition:transform .6s cubic-bezier(.2,.7,.3,1.2);transform-style:preserve-3d;cursor:pointer}',
    '.flip-inner{position:relative;display:grid;transition:transform .6s cubic-bezier(.2,.7,.3,1.2);transform-style:preserve-3d;cursor:pointer}');
rep('.face{backface-visibility:hidden;-webkit-backface-visibility:hidden}',
    '.face{grid-area:1/1;backface-visibility:hidden;-webkit-backface-visibility:hidden}');
rep('.face.back{position:absolute;inset:0;transform:rotateY(180deg)}',
    '.face.back{transform:rotateY(180deg)}');
rep('.cardface{background:linear-gradient(160deg,#22342a,#101c14);border:1px solid rgba(216,180,90,.5);border-radius:16px;padding:22px 20px;min-height:240px;display:flex;flex-direction:column}',
    '.cardface{background:linear-gradient(160deg,#22342a,#101c14);border:1px solid rgba(216,180,90,.5);border-radius:16px;padding:22px 20px;min-height:240px;display:flex;flex-direction:column;justify-content:center}');

/* bestLine：继承 Ch1 最佳记录 */
swap("function bestLine(){", "/* ================= HUD ================= */",
'function bestLine(){\n' +
'  var best=null;\n' +
'  try{best=JSON.parse(localStorage.getItem(BEST_KEY));}catch(e){}\n' +
'  var b=$("#bestLine");\n' +
'  var html="";\n' +
'  if(best)html="🏆 本章最佳记录：<b>"+best.rating+"</b> · "+best.diff+" · "+best.date;\n' +
'  var prev=null;\n' +
'  try{prev=JSON.parse(localStorage.getItem("brainexp_ch1_best_v3"));}catch(e){}\n' +
'  if(prev)html+=(html?"<br>":"")+"🏅 已继承第一章：「拖延沼泽」最佳 <b>"+prev.rating+"</b> · "+prev.diff;\n' +
'  b.innerHTML=html;\n' +
'}\n\n');

/* renderComboCard：数据驱动（不再写死 micro+monitor） */
swap("function renderComboCard(){", "/* ---------- 技能卡（图腾翻转） ---------- */",
'function renderComboCard(){\n' +
'  var box=$("#skillBox"); box.innerHTML="";\n' +
'  box.appendChild(el("div","skill-name","🔗 连招解锁"));\n' +
'  var hero=el("div","combo-hero");\n' +
'  hero.innerHTML=comboBadge(false,96);\n' +
'  box.appendChild(hero);\n' +
'  var cn=COMBOS[0];\n' +
'  var mem=cn.members.map(function(m){return SKILLS[m].name+"（"+CHARS[SKILLS[m].owner].name+"）";}).join("＋");\n' +
'  box.appendChild(el("div","mantra","「"+cn.name+"」＝ "+mem));\n' +
'  box.appendChild(el("div","note-sec",cn.desc));\n' +
'  box.appendChild(el("div","locked-note","预告：后续章节，「不放弃」＝ 认知重编程（松）＋微步骤启动（松）＋状态监控（眠）。\\n冲突没有解决的章节，连招图标会是灰色的。"));\n' +
'  beep("win");\n' +
'  var b=el("button","btn primary","前往结算");\n' +
'  b.style.marginTop="18px"; b.style.width="100%";\n' +
'  b.onclick=function(){beep("click");closeModal("#modal-skill");showEnd();};\n' +
'  box.appendChild(b);\n' +
'  openModal("#modal-skill");\n' +
'}\n\n');

/* 结算文案 Ch2 化 */
swap("function diffRatingLine(r){", "function battleText(){",
'function diffRatingLine(r){\n' +
'  if(r==="SSS")return "满分小队——四个人，都长成了彼此的外挂。";\n' +
'  if(r==="S")return "漂亮的配合！再听听那几句没说出口的话，SSS 在等你。";\n' +
'  if(r==="A")return "过关了。花田里不只有花，还有没说出口的话。";\n' +
'  return "也走出了花田。下次，试着先把队友的话听完。";\n' +
'}\n');
swap("function observeLine(){", "/* ================= 图鉴 ================= */",
'function observeLine(){\n' +
'  var f=state.flags;\n' +
'  if((f.toxic||0)>=1)return "「刚才那句话，有点扎人。下次想脱口而出的时候，先喝口水——我给你们续上。」";\n' +
'  if(f.hush)return "（眠眠看了闪闪一眼，什么都没说，只是把水杯放在了闪闪手边。）";\n' +
'  return "「以后谁再使唤我，我就说——『等等，我先问问自己的钟。』」";\n' +
'}\n\n');
rep('card.appendChild(el("div","page-sub","第一章 · 拖延沼泽 —— 完"));',
    'card.appendChild(el("div","page-sub","第二章 · 分心花田 —— 完"));');
rep('cc.appendChild(el("div","mantra","行动之前，每个人必须说一句话。"));',
    'cc.appendChild(el("div","mantra","自己的事情自己拿主意；使唤别人之前，先问一句。"));');
rep('cc.appendChild(el("div","note-sec","第一章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","第二章诞生。公约会随章节累积，章末统一收录。"));');
/* 隐藏台词触发条件：Ch2 闪闪线是 D 分支 */
rep('state.secret=(state.me==="shan"&&state.branch==="C"&&RANK[r.rating]>=RANK.S);',
    'state.secret=(state.me==="shan"&&state.branch==="D"&&RANK[r.rating]>=RANK.S);');

/* ============ 写文件 ============ */
fs.writeFileSync(DST, src, "utf8");
console.log("OK -> " + DST + "  (" + (src.length / 1024).toFixed(1) + " KB, " + src.split("\n").length + " 行)");
