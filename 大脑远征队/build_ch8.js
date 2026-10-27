/* Ch8 构建：从 Ch7 静态源码(_ch8_base.html)换数据 → Ch8-能量峡谷.html
 * 章节主题：竞技世界 · 能量篇（能量峡谷 / 压力火山 + 补给站）
 * 设计来源：元宝「中学心理游戏包」——情绪身体地图 + 压力火山/降温阀 + 组队Buff（核心第21项）+ 求助导航
 * 新技能：身体地图(bodymap,眠)/降温阀(cooldown,松)/组队Buff(team,闪,核心第21项)/健康管理(health,眠,扩展)
 * 社交困境：眠眠电量见底还在硬撑，不会开口求助；章末公约「累了就说出来，不丢人！」「求助不是软弱，是精准调用资源！」
 * 反卡死：R1/R2 有效池必含 micro+各分支技能；R3=COMBO 任意两不同角色。分支 owner=眠/究/松/闪 四角色
 * 学业铁律：生活例子为主（跳绳心慌/搬书/上台前肚子疼），不引入高压学业词
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch8_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch8-能量峡谷.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 社交特别篇「关系回声」</title>',
    '<title>大脑远征队 · 第八章「能量峡谷」</title>');
rep('<div class="sub">社交特别篇 · 关系回声 —— 朋友的话会回弹，也能重新说一遍</div>',
    '<div class="sub">第八章 · 能量峡谷 —— 身体先知道，累了就说出口</div>');
rep('<div class="boss-name">一刀 · 一刀切主</div>',
    '<div class="boss-name">山山 · 压力火山主</div>');
rep('card.appendChild(el("div","page-sub","社交特别篇 · 关系回声 —— 完"));',
    'card.appendChild(el("div","page-sub","第八章 · 能量峡谷 —— 完"));');
rep('if(r==="A")return "过关了。朋友篇里不只有回声，还有你分清的那条线——行为，和本人。";',
    'if(r==="A")return "过关了。峡谷里不只有岩浆，还有你亲手降下来的那座山。";');
rep('return "也走出了朋友篇。下次，和朋友相处，先把事情和人分开——不舒服，也能说出来。";',
    'return "也走出了能量峡谷。下次，累了就说出来——不是一个人扛。";');
rep('cc.appendChild(el("div","note-sec","社交特别篇诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","第八章诞生。公约会随章节累积，章末统一收录。"));');
/* 图鉴·公约卡文案 → 本章公约 */
rep('cc.appendChild(el("div","mantra","自己的事情自己拿主意；使唤别人之前，先问一句。"));',
    'cc.appendChild(el("div","mantra","累了就说出来，不丢人；求助不是软弱，是精准调用资源。"));');

/* ============ 2. CSS 主题：沿用竞技暗夜，改场景文案 ============ */
rep('关系回声 · 朋友篇', '能量峡谷 · 补给站');
rep('朋 友', '补 给');

/* ============ 3. 角色技能绑定（boss 改名山山） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","一刀":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","山山":"boss","四人":"all"};');

/* ============ 4. SKILLS（6 个：micro/selfexplain 沿用 + bodymap/cooldown/health/team 新） ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  cooldown:{name:"降温阀",owner:"song",',
'           one:"54321 着陆：看 5 样 · 摸 4 样 · 听 3 声 · 闻 2 样 · 尝 1 味。",',
'           mantra:"「先着陆，再说话。」",',
'           why:"岩浆要喷的时候，讲道理没用。先让身体冷下来，脑子才回来——这不是逃，是给发动机降温。",',
'           cross:"跳绳跳得心慌？先数出身边五样看得见的东西，呼吸就慢了。"},',
'  selfexplain:{name:"自我解释",owner:"jiu",',
'           one:"一边慌一边问自己：这座山里，到底是什么在压我？",',
'           mantra:"「问一句，山就有了名字。」",',
'           why:"压力是一团雾。说出「到底是家里的事、要练的琴，还是别人怎么看我」，雾就散成一筐能捡的小事。",',
'           cross:"觉得「事事不顺」？说说是哪几件——往往只有两件真的大。"},',
'  bodymap:{name:"身体地图",owner:"mian",',
'           one:"情绪住在身体里：焦虑在胃里打结，愤怒在肩发紧，麻木在手脚。",',
'           mantra:"「身体先知道，脑子后明白。」",',
'           why:"情绪不是性格缺陷，是身体在报警。先认信号，才能在喷发之前降温。",',
'           cross:"上台前肚子疼？那是身体在说「我在乎」——不是「我不行」。"},',
'  health :{name:"健康管理",owner:"mian",exp:"扩展",',
'           one:"吃好、睡好、动一动——身体的电，是自己充的。",',
'           mantra:"「先看电量，再充电。」",',
'           why:"饮食、睡眠、运动是三块电池。饿着、熬着、久坐，脑子先关机。",',
'           cross:"中午趴十分钟，下午像换了块电池。"},',
'  team   :{name:"组队Buff",owner:"shan",',
'           one:"说出来，让队友靠过来——压力两个人扛，一人一半。",',
'           mantra:"「不是一个人扛。」",',
'           why:"最难开口的那句「我累了」，恰恰最省力。组队不是拖累别人，是给彼此加 Buff。",',
'           cross:"搬书搬不动？喊一声，路过的同学搭把手——事就成了。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 5. COMBOS ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"先降温再一起扛",members:["cooldown","team"],',
'   desc:"降温阀（松）＋组队Buff（闪）——先让身体冷下来，再把「帮我一下」说出口。山山最怕你既稳得住，又肯开口。"},',
'  {name:"先看身体再问一句",members:["bodymap","selfexplain"],locked:true,',
'   desc:"身体地图（眠）＋自我解释（究）——后续章节解锁。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 6. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"眠眠",text:"（打哈欠）我的电量……快见底了。"},',
'  {who:"松松",text:"能量峡谷！谁先开口？"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松按住眠眠的肩：「先把『休息一下』，拆成五秒能做完的小事——到哪儿都管用。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {who:"眠眠",text:"事情堆着，脑子里有座山……要喷了。"},',
'  {who:"究究",text:"你先别硬撑。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"山山开始冒烟：「再加一点，你就压垮了！」你先做哪一步？",options:[',
'  {t:"先认出来：身体在哪儿报警",next:"a1",branch:"A",',
'   after:[{act:"眠眠把手放在胃上。"},{who:"眠眠",text:"我这里……打结。"}]},',
'  {t:"先问一句：这座山里到底是什么",next:"b1",branch:"B",',
'   after:[{act:"究究掏出纸笔。"},{who:"究究",text:"先给山起个名字。"}]},',
'  {t:"先降温：54321 着陆",next:"c1",branch:"C",',
'   after:[{act:"松松举起五根手指。"},{who:"松松",text:"先别说话，跟我数。"}]},',
'  {t:"先说出口：我累了，帮我一下",next:"d1",branch:"D",',
'   after:[{act:"眠眠深吸一口气。"},{who:"眠眠",text:"（小声）我……我累了。"}]}',
' ]},',
'',
' /* ---- A 线 · 身体地图 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"眠眠",text:"（按住胃）我这里……打结。"},',
'  {who:"松松",text:"身体先知道。"}',
' ]},',
' a2:{kind:"skill",skill:"bodymap",lead:"眠眠摊开一张身体地图：「焦虑在胃里打结，愤怒在肩发紧——先认信号，不是我不行。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"眠眠还是皱眉：「可我不知道自己在气什么。」你说：",options:[',
'  {t:"「先说三样：胃紧、肩硬、手冷——一样一样来。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（点头）……胃紧，肩硬。"}]},',
'  {t:"「不知道就算了。」",next:"conv",trust:2,',
'   after:[{act:"眠眠把手放下了。"}]},',
'  {t:"「你就是矫情。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠把地图合上了。"}]}',
' ]},',
'',
' /* ---- B 线 · 自我解释 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"究究",text:"这座山里，到底是什么在压你？"},',
'  {who:"眠眠",text:"事情堆着……还有别人怎么看我。"}',
' ]},',
' b2:{kind:"skill",skill:"selfexplain",lead:"究究：「自我解释——把山说成一筐小事：到底哪几件，是真的大？」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"眠眠摇头：「好像件件都大。」你说：",options:[',
'  {t:"「挑两件真的大，其余先放下。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（松口气）……就两件。"}]},',
'  {t:"「都大就都扛着。」",next:"conv",trust:2,',
'   after:[{act:"眠眠把纸笔推开了。"}]},',
'  {t:"「件件都大，说明你不行。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠低下了头。"}]}',
' ]},',
'',
' /* ---- C 线 · 降温阀 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"松松",text:"先别说话，跟我数。"},',
'  {who:"眠眠",text:"数……什么？"}',
' ]},',
' c2:{kind:"skill",skill:"cooldown",lead:"松松举起五根手指：「降温阀——54321 着陆：看 5 样 · 摸 4 样 · 听 3 声。岩浆会冷。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"眠眠还是急：「可事情还在啊。」你说：",options:[',
'  {t:"「事情在，人也先站稳——降温不是逃，是充电。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（深呼吸）……站稳了。"}]},',
'  {t:"「那没办法了。」",next:"conv",trust:2,',
'   after:[{act:"眠眠又缩了回去。"}]},',
'  {t:"「扛不住就别扛，认输吧。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠把手垂了下来。"}]}',
' ]},',
'',
' /* ---- D 线 · 组队Buff ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"眠眠",text:"（小声）我……我累了。"},',
'  {who:"闪闪",text:"说出来了，就有人接。"}',
' ]},',
' d2:{kind:"skill",skill:"team",lead:"闪闪举起手：「组队Buff——『帮我一下』说出口，压力一人一半。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"眠眠还是怕：「可我怕添麻烦。」你说：",options:[',
'  {t:"「开口不是添麻烦，是给彼此加 Buff。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（抬头）……那我试一次。"}]},',
'  {t:"「那就别说了。」",next:"conv",trust:2,',
'   after:[{act:"眠眠把话咽了回去。"}]},',
'  {t:"「麻烦别人就是软弱。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠又一个人站了回去。"}]}',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"山山",text:"压垮你！只要再压一下！"},',
'  {who:"眠眠",text:"（腿软）……"},',
'  {who:"松松",text:"别一个人扛——降温，再一起上！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"山山",text:"你们……居然把火山降下来了……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"眠眠",text:"累了就说出来，不丢人。"},',
'  {who:"四人",text:"「求助不是软弱，是精准调用资源！」"},',
'  {who:"四人",text:"不是一个人扛——说出来，就有人接！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 7. ROUNDS ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 漫浆",rk:"lava",',
'  bossLine:"「再加一点，你就压垮了！」山山的岩浆漫过脚边，越漫越高。",',
'  valid:["micro","cooldown","selfexplain","bodymap","health","team"],',
'  ease:"眠眠：这一下，先降温，或先看一眼身体——用什么都行。"},',
' {name:"第 2 回合 · 喷发前",rk:"erupt",',
'  bossLine:"「谁都不准停下来！」火山口嗡嗡响，灰压下来。",',
'  valid:["micro","cooldown","selfexplain","bodymap","health","team"],',
'  ease:"眠眠：这一下，稳住了就开口——说什么都行。"},',
' {name:"第 3 回合 · 山山之核",rk:"core",',
'  bossLine:"「全压上去——这座山，全给你！」山山胀到最大。",',
'  valid:"COMBO",',
'  ease:"眠眠：一个人顶不住。找一位不同角色的队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 8. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' lava:{',
'  micro:["把「压垮」切成五秒一步——先，深呼吸一次。岩浆退了一寸。"],',
'  cooldown:["54321 着陆：数出五样看得见的。岩浆冷了一层。"],',
'  selfexplain:["「问一句：到底是哪件事在压我？」岩浆被问出了形状。"],',
'  bodymap:["眠眠按住发紧的肩：身体在报警，不是我不行。岩浆顿了顿。"],',
'  health:["眠眠吃了口热的、看了眼电量——岩浆底气不足了。"],',
'  team:["闪闪喊「帮我一下」，一只手搭了上来。岩浆被分走一半。"],',
'  miss:["眠眠：「再想一招。先降温，或先看一眼身体——都行。」"]',
' },',
' erupt:{',
'  micro:["先迈一小步：坐直，呼吸一次。火山口嗡嗡声低了。"],',
'  cooldown:["54321 落地，岩浆的火光稳了下来。"],',
'  selfexplain:["「到底是家里的事、要练的琴，还是别人的眼光？」山山被问出了缝。"],',
'  bodymap:["眠眠摊开身体地图：胃紧、肩硬——信号一亮，火山软了。"],',
'  health:["眠眠补了一觉：电回来了，山山小了一圈。"],',
'  team:["「帮我一下」说出口，队友围过来。山山压不动了。"],',
'  miss:["眠眠：「用什么都行。稳住了，再开口——再想一招。」"]',
' },',
' core:{',
'  single:["山山抖了抖岩体：「一个人……顶不住我……」身后伸过来一只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两个法子——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 9. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 字母序排序后 "+" 连接；6 技能 C(6,2)=15 条 */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "bodymap+cooldown"  :["眠眠按住发紧的肩，松松数出五样看得见的东西。","身体一冷，岩浆就退了。"],',
' "bodymap+health"    :["眠眠看了眼电量，吃了口热的——身体先充上电。","认信号，也补电。"],',
' "bodymap+micro"     :["眠眠指出胃在打结，松松只做一小步：先喝口水。","身体报警，先动一小步。"],',
' "bodymap+selfexplain":["身体地图标出肩膀硬，究究问一句：到底哪件事在压你？","先认信号，再问名字。"],',
' "bodymap+team"      :["眠眠说出「我累了」，闪闪喊队友靠过来。","身体说的，也敢说出口。"],',
' "cooldown+health"   :["54321 着陆完，眠眠补了一觉——电回到一半。","先降温，再充电。"],',
' "cooldown+micro"    :["松松数五样，再迈五秒一步。","站稳了，再走一步。"],',
' "cooldown+selfexplain":["54321 落地，究究问：这座山里到底是什么？","冷静了，才问得清。"],',
' "cooldown+team"     :["松松带着大家着陆，闪闪说「帮我一下」。","稳住了，就敢开口。"],',
' "health+micro"      :["眠眠充上电，松松迈一小步。","有电，才迈得动。"],',
' "health+selfexplain":["睡饱了再问：到底哪几件真的大？","电满了，山就小了。"],',
' "health+team"       :["眠眠递过水，闪闪喊人搭把手。","彼此充电，才叫组队。"],',
' "micro+selfexplain" :["先迈五秒一步，再问一句「到底哪件大」。","最小的一步，也踩得清清楚楚。"],',
' "micro+team"        :["松松迈一步，闪闪喊「帮我一下」。","自己先动，也敢开口。"],',
' "selfexplain+team"  :["究究把山说成一筐小事，闪闪找人分着扛。","山有了名字，就有人分担。"]',
'};',
'var COMBO_NAMES={',
' "bodymap+cooldown":"一图一降","bodymap+health":"一图一电","bodymap+micro":"一图一步","bodymap+selfexplain":"一图一问","bodymap+team":"一图一喊",',
' "cooldown+health":"一降一电","cooldown+micro":"一降一步","cooldown+selfexplain":"一降一问","cooldown+team":"一降一喊",',
' "health+micro":"一电一步","health+selfexplain":"一电一问","health+team":"一电一喊",',
' "micro+selfexplain":"一步一问","micro+team":"一步一喊","selfexplain+team":"一问一喊"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力量，在峡谷里咬合成一个齿轮。","山山的「再加一点」，被正式卸了下来。"];',
'var BORROW_ORDER=["selfexplain","bodymap","cooldown","team"];',
'var BORROW_LINE={',
' mian:"眠眠：「身体地图和电池都借你们——先看信号，再充电。」",',
' shan:"闪闪：「我帮你把那句『帮我一下』说出口。剩下的，你来讲。」",',
' jiu :"究究：「一边走一边问一句为什么——山山最怕这个。」",',
' song:"松松：「微步骤启动借你们！先迈一小步！」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 10. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"valley",t:"能量峡谷",e:"⛰"},{k:"boss",t:"山山",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 11. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_social_save_v1";', 'var SAVE_KEY="brainexp_ch8_save_v1";');
rep('var BEST_KEY="brainexp_social_best_v1";', 'var BEST_KEY="brainexp_ch8_best_v1";');
/* 标题页继承前七章记录（追加 Ch7 社交特别篇继承） */
rep('  var p6=null;\n  try{p6=JSON.parse(localStorage.getItem("brainexp_ch6_best_v1"));}catch(e){}\n  if(p6)html+=(html?"<br>":"")+"🏅 已继承第六章：「语言风暴」最佳 <b>"+p6.rating+"</b> · "+p6.diff;',
    '  var p6=null;\n  try{p6=JSON.parse(localStorage.getItem("brainexp_ch6_best_v1"));}catch(e){}\n  if(p6)html+=(html?"<br>":"")+"🏅 已继承第六章：「语言风暴」最佳 <b>"+p6.rating+"</b> · "+p6.diff;\n  var p7=null;\n  try{p7=JSON.parse(localStorage.getItem("brainexp_social_best_v1"));}catch(e){}\n  if(p7)html+=(html?"<br>":"")+"🏅 已继承社交特别篇：「关系回声」最佳 <b>"+p7.rating+"</b> · "+p7.diff;');

/* ============ 12. 新技能图腾 ============ */
var TOTEM_ADD = [
'TOTEM_ART.cooldown=\'<circle cx="24" cy="19" r="10" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M24 25 v13 M19 32 l5 5 l5 -5" stroke="TOT" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\';',
'TOTEM_ART.bodymap=\'<circle cx="24" cy="13" r="5" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M16 36 q0 -13 8 -13 q8 0 8 13" fill="none" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><circle cx="20" cy="27" r="1.8" fill="TOT"/><circle cx="28" cy="23" r="1.8" fill="TOT"/>\';',
'TOTEM_ART.health=\'<rect x="13" y="17" width="21" height="14" rx="3" fill="none" stroke="TOT" stroke-width="2.4"/><rect x="36" y="21" width="3" height="6" fill="TOT"/><rect x="16" y="20" width="12" height="8" rx="1.5" fill="TOT"/>\';',
'TOTEM_ART.team=\'<circle cx="17" cy="17" r="5" fill="none" stroke="TOT" stroke-width="2.2"/><circle cx="31" cy="17" r="5" fill="none" stroke="TOT" stroke-width="2.2"/><path d="M9 36 q0 -10 8 -10 M23 36 q0 -10 8 -10" fill="none" stroke="TOT" stroke-width="2.2" stroke-linecap="round"/><path d="M24 13 v11 M18.5 18.5 h11" stroke="TOT" stroke-width="2" stroke-linecap="round"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 13. Boss 山山（压力火山主 · 「再加一点你就压垮了」的声音） ============
 * 铁律：五官画在上部避开对话气泡；金压裂/火花伸出遮挡区；纯色+明暗面，不用 url(#gradient) */
var BOSS_BLOCK = [
'/* ---- Boss 山山（压力火山主 · 「再加一点你就压垮了」的声音） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+50*Math.cos(a)).toFixed(1), py=(52+42*Math.sin(a)).toFixed(1);',
'    chips+=\'<path d="M\'+px+\' \'+py+\' l5 5 l-5 5 l-5 -5 Z" fill="\'+(i%2?"#c0503a":"#8a3a2a")+\'"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="60" cy="56" rx="56" ry="52" fill="rgba(18,26,32,.55)"/>\'+',
'  /* 金色压裂刺（向上伸出气泡遮挡区） */',
'  \'<path d="M40 26 L34 4 L48 22 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M60 22 L60 2 L68 22 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M80 26 L86 4 L72 22 Z" fill="#f0b24a"/>\'+',
'  /* 火山体（左暗右亮两面） */',
'  \'<path d="M12 96 L34 42 L46 42 L60 20 L74 42 L86 42 L108 96 Z" fill="#5a4a52" stroke="#2e2830" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M60 20 L74 42 L86 42 L108 96 L60 96 Z" fill="#6e5a62"/>\'+',
'  /* 火山口岩浆 */',
'  \'<ellipse cx="60" cy="42" rx="14" ry="6" fill="#e06a3a"/>\'+',
'  \'<ellipse cx="60" cy="41" rx="9" ry="3.6" fill="#f0a04a"/>\'+',
'  /* 红色 ✕ 眼（画在上部，避开气泡） */',
'  \'<path d="M42 50 l8 8 M50 50 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  \'<path d="M70 50 l8 8 M78 50 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  /* 咬牙 + 岩浆流下 */',
'  \'<path d="M48 68 q12 -6 24 0" stroke="#2e2830" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M52 78 q3 8 1 14 M68 78 q-3 8 -1 14" stroke="#e06a3a" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><path d="M14 18 l4 4 l-4 4 l-4 -4 Z" fill="#f0b24a"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><path d="M104 30 l4 4 l-4 4 l-4 -4 Z" fill="#c0503a"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 一刀（一刀切主 · 把人劈成好人/坏人的声音） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 14. 结算页分支名 → 能量分支 ============ */
rep('var m={A:"A线 · 改写脚本",B:"B线 · 问清动机",C:"C线 · 行为透镜",D:"D线 · 我句式"};',
    'var m={A:"A线 · 身体地图",B:"B线 · 问清压力",C:"C线 · 54321降温",D:"D线 · 组队Buff"};');
/* 观察 → 本章主题（身体信号 + 求助收束） */
rep('return "「以后和朋友相处，我先把感受和事情分开：他做的事让我不舒服，不等于他是坏人；不舒服，我也能说出来。」";',
    'return "「以后累了，我先看一眼身体在哪儿报警，再说一句『帮我一下』——不是一个人扛。」";');
/* 隐藏台词 → 能量主题（Ch7 残留改为本章） */
rep('sec.textContent="✨ 隐藏台词：最安静的人，往往第一个分清事情和人。——这句话，是你自己说出口的。";',
    'sec.textContent="✨ 隐藏台词：最累的那一次，你不是一个人扛过去的——这句话，是你自己说出口的。";');

/* ============ 15. 战斗场景背景：arena（沿用竞技场景，仅文案已改） ============ */
/* bg.insertAdjacentHTML("afterbegin",sceneSVG("arena")); 无需变动 */

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
