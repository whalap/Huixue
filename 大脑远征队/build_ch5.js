/* Ch5 构建：从 Ch4 静态源码(_ch5_base.html)换数据 → Ch5-否定斗技场.html
 * 章节主题：竞技世界 · 自我篇（否定斗技场 / 斗技场+观众席+擂台）
 * 新技能：成长型思维(growth) / 自我效能(selfeff) / 替代经验(vicarious) —— 闪闪主场「我不行」→「我还不行」
 * 社交困境：闪闪被脑子里的「我不行」困住、不敢上场；章末公约「「我不行」可以改成「我还不行」」「看见别人做到，我也能」
 * 学业铁律：后段章节(Ch5-8)才正式引入学习场景，但本期仍以生活例子为主（跳绳/骑车/爬树），不突兀
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch5_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch5-否定斗技场.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 第四章「理解冰山」</title>',
    '<title>大脑远征队 · 第五章「否定斗技场」</title>');
rep('<div class="sub">第四章 · 理解冰山 —— 「懂了」和「真懂」，隔着一座冰山</div>',
    '<div class="sub">第五章 · 否定斗技场 —— 脑子里的「我不行」，是个会变大变小的小怪</div>');
rep('<div class="boss-name">蒙蒙 · 理解冰山主</div>',
    '<div class="boss-name">否否 · 否定斗技场主</div>');
rep('card.appendChild(el("div","page-sub","第四章 · 理解冰山 —— 完"));',
    'card.appendChild(el("div","page-sub","第五章 · 否定斗技场 —— 完"));');
rep('if(r==="A")return "过关了。冰上不只有脚印，还有没讲清楚的话。";',
    'if(r==="A")return "过关了。斗技场里不只有掌声，还有你没说出口的「我还不行」。";');
rep('return "也走过了冰湖。下次，试着先把「懂了」讲一遍。";',
    'return "也走出了斗技场。下次，心里冒出「我不行」，先改成「我还不行」。";');
rep('cc.appendChild(el("div","note-sec","第四章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","第五章诞生。公约会随章节累积，章末统一收录。"));');

/* ============ 2. CSS 主题：冰湖 → 竞技斗技场（暗夜 + 暖金 + 红聚光） ============ */
s = s.replace(/--bg:#[0-9a-f]+; --bg2:#[0-9a-f]+; --panel:#[0-9a-f]+; --panel2:#[0-9a-f]+; --line:#[0-9a-f]+;/,
  "--bg:#16110f; --bg2:#221813; --panel:#2a1f18; --panel2:#352819; --line:#4a3727;");
s = s.replace(/--text:#[0-9a-f]+; --dim:#[0-9a-f]+;/, "--text:#f7efe6; --dim:#c4ad9a;");
/* 粒子：冰晶 → 余烬（暖色火星） */
rep('.icep{position:absolute;border-radius:2px;pointer-events:none;opacity:.92;box-shadow:0 0 6px rgba(160,215,240,.5)}',
    '.icep{position:absolute;border-radius:2px;pointer-events:none;opacity:.92;box-shadow:0 0 6px rgba(160,215,240,.5)}\n.ember{position:absolute;border-radius:50% 50% 50% 0;pointer-events:none;opacity:.9;box-shadow:0 0 7px rgba(240,178,74,.6);transform:rotate(45deg)}');
rep('el("i","icep")', 'el("i","ember")');

/* ============ 3. 角色技能绑定（NAME2KEY：boss 改名否否） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","蒙蒙":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","否否":"boss","四人":"all"};');

/* ============ 4. SKILLS（8 个：micro/monitor/sleep/selfexplain/mark 5 项沿用 + growth/selfeff/vicarious 3 项新） ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  growth :{name:"成长型思维",owner:"shan",',
'           one:"把「我不行」改成「我还不行」——不是不会，是还没会。",',
'           mantra:"「我不行 → 我还不行。」",',
'           why:"大脑相信「能力能长大」的时候，才敢伸手试。说「不行」像关了门，说「还不行」像留了窗。",',
'           cross:"跳绳一开始跳不过三个？那不是「不会跳」，是「还没跳会」。"},',
'  selfeff:{name:"自我效能",owner:"shan",',
'           one:"想起一件你曾经做到的事——那股劲，还在你身上。",',
'           mantra:"「我做到过，所以我还能。」",',
'           why:"相信自己最好的证据，是「自己以前真的做到过」。把那次翻出来，底气就回来了。",',
'           cross:"上次学骑车摔了七次也没松手——那股劲，这次也在你腿上。"},',
'  vicarious:{name:"替代经验",owner:"shan",',
'           one:"看一个和你差不多的人做到了——那不是别人的事，是你的路标。",',
'           mantra:"「别人能，我也能——我们差不多。」",',
'           why:"大脑会偷偷把别人的成功当成自己的预演。看见「同类」做到，比听一百句鼓励都管用。",',
'           cross:"看同伴第一次爬上那棵树，你也敢伸手了——你们手臂差不多长。"},',
'  selfexplain:{name:"自我解释",owner:"jiu",',
'           one:"一边做一边问自己「为什么这一步要这样」。",',
'           mantra:"「问一句为什么，再走下一步。」",',
'           why:"只照着样子做，换个花样就不会了；说出「为什么」，学到的是法子，不是样子。",',
'           cross:"搭积木时念一句「为什么这块要放下面」——下次换个形状，也搭得起来。"},',
'  sleep  :{name:"睡眠存档",owner:"mian",',
'           one:"今天记的，睡一觉再存档。困了就睡，别硬撑。",',
'           mantra:"「睡一觉，路还在。」",',
'           why:"白天记的东西，要在睡着的时候才搬进「长期的抽屉」。不睡，等于没存档就关机。",',
'           cross:"白天练熟的招式，睡一觉起来反而更顺手——那就是存档完成了。"},',
'  monitor:{name:"状态监控",owner:"mian",',
'           one:"随时看一眼自己的「体力条」，累了就补给，不硬撑。",',
'           mantra:"「先看电量，再决定冲不冲。」",',
'           why:"手机没电会提醒你，人累了却不会。学会自己看电量，才不会在关键时刻突然关机。",',
'           cross:"跳绳跳着开始大喘气？那是身体在亮黄灯：该歇会儿啦。"},',
'  mark   :{name:"弱点标记",owner:"shan",',
'           one:"把最安静的人看见的东西说出来，敌人就有了破绽。",',
'           mantra:"「先标记，再出招。」",',
'           why:"打游戏要瞄准弱点才好赢。做事也是：先标出「到底卡在哪一步」，再出手。",',
'           cross:"积木塔总塌？先看清是哪一块歪了，比推倒重来管用。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 5. COMBOS ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"我还不行",members:["growth","micro"],',
'   desc:"成长型思维（闪）＋微步骤启动（松）——先改一句「我还不行」，再迈出一小步。否否胀大的壳，被这句顶开一道缝。"},',
'  {name:"不放弃",members:["micro","sleep","monitor"],locked:true,',
'   desc:"微步骤启动（松）＋睡眠存档（眠）＋状态监控（眠）——后续章节解锁。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 6. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"闪闪",text:"（小声）这里……好多人看。"},',
'  {who:"松松",text:"斗技场！谁先上？"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松按住闪闪的肩：「先做第一步——到哪儿都管用。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {anim:"march"},',
'  {who:"闪闪",text:"（低头）……我不行。"},',
'  {who:"究究",text:"你还没试呢。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"脑子里的「我不行」冒了出来。你先接住哪一句？",options:[',
'  {t:"「我不行」→先改成「我还不行」",next:"a1",branch:"A",',
'   after:[{act:"那句话，被你改短了一截。"},{who:"闪闪",text:"我还不行……"}]},',
'  {t:"想起一件你曾经做到的事",next:"b1",branch:"B",',
'   after:[{act:"你翻出一次做到的记忆。"},{who:"闪闪",text:"我做到过。"}]},',
'  {t:"看一个和你差不多的人做到了",next:"c1",branch:"C",',
'   after:[{act:"看台上有个和你差不多的人站了起来。"},{who:"闪闪",text:"别人能……"}]},',
'  {t:"队友们齐声喊「我们信你」",next:"d1",branch:"D",',
'   after:[{act:"四个人的声音叠在一起。"},{who:"眠眠",text:"先看一眼电量——你不是没电。"}]}',
' ]},',
'',
' /* ---- A 线 · 成长型思维 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"闪闪",text:"我还不行……真的吗？"},',
'  {who:"松松",text:"对，还不行，不是不行。"}',
' ]},',
' a2:{kind:"skill",skill:"growth",lead:"闪闪在掌心写下一个「还」字：「把『我不行』改成『我还不行』——门没关，只是留了窗。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"闪闪还是发抖：「可我就是不行啊。」你说：",options:[',
'  {t:"「还不行，不是不行。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（深呼吸）……还不行。"}]},',
'  {t:"「那你就再等等。」",next:"conv",trust:2,',
'   after:[{act:"闪闪站在原地，没动。"}]},',
'  {t:"「不行就别上了。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪把「还」字擦掉了。"}]}',
' ]},',
'',
' /* ---- B 线 · 自我效能 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"闪闪",text:"我做到过……哪次？"},',
'  {who:"眠眠",text:"你上次做到的，还记得吗？"}',
' ]},',
' b2:{kind:"skill",skill:"selfeff",lead:"闪闪闭上眼，翻出一个画面：「我做到过——那股劲，还在身上。」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"闪闪摇头：「那都是以前了。」你说：",options:[',
'  {t:"「那股劲，这次也在。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（攥拳）……还在。"}]},',
'  {t:"「以前是以前。」",next:"conv",trust:2,',
'   after:[{act:"闪闪松开了手。"}]},',
'  {t:"「以前行现在不行。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪把那次记忆按了回去。"}]}',
' ]},',
'',
' /* ---- C 线 · 替代经验 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"闪闪",text:"别人能……和我有什么关系。"},',
'  {who:"究究",text:"看，那个和你差不多的人。"}',
' ]},',
' c2:{kind:"skill",skill:"vicarious",lead:"闪闪顺着究究的手指看过去：「看一个和我差不多的人做到——那不是别人的事，是我的路标。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"闪闪喃喃：「可那不是我。」你说：",options:[',
'  {t:"「你们手臂差不多长。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（盯着那人）……确实差不多。"}]},',
'  {t:"「那是别人，你比不了。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把视线挪开了。"}]},',
'  {t:"「人家天生就强。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪低下头，不再看。"}]}',
' ]},',
'',
' /* ---- D 线 · 团队相信（眠眠·状态监控） ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"眠眠",text:"先看一眼电量——你不是没电。"},',
'  {who:"松松",text:"我们信你，上！"}',
' ]},',
' d2:{kind:"skill",skill:"monitor",lead:"眠眠把记录本举到闪闪面前：「状态监控——你不是不行，是没看自己的电量。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"闪闪愣住：「可我心里就是没底。」你说：",options:[',
'  {t:"「没底，就先看电量。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（看了眼自己）……还有电。"}]},',
'  {t:"「没底就别硬上。」",next:"conv",trust:2,',
'   after:[{act:"闪闪又缩了回去。"}]},',
'  {t:"「没底就是不行。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪把记录本推开了。"}]}',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"否否",text:"我不行！我不行！"},',
'  {who:"闪闪",text:"（退半步）……"},',
'  {who:"松松",text:"别退，接住那句话！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"否否",text:"你们……居然顶回来了……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"闪闪",text:"我不行……可以改成我还不行。"},',
'  {who:"四人",text:"「我不行」可以改成「我还不行」！"},',
'  {who:"四人",text:"看见别人做到，我也能——那不是别人的事！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 7. ROUNDS（R1/R2 必含 micro，保证任何分支都不卡死；R3=COMBO 任意两不同角色） ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 回声",rk:"echo",',
'  bossLine:"「我不行！我不行！」回声在斗技场里撞来撞去，越撞越大。",',
'  valid:["micro","growth","selfeff","vicarious","mark","monitor"],',
'  ease:"闪闪：这一下，先改一句——或者先迈一小步。"},',
' {name:"第 2 回合 · 看台",rk:"crowd",',
'  bossLine:"「就你？算了吧。」看台上的影子全开口了，黑压压一片。",',
'  valid:["growth","selfeff","vicarious","mark","micro","monitor","sleep","selfexplain"],',
'  ease:"闪闪：这一下，用什么都行——讲不通的那句，先顶回去。"},',
' {name:"第 3 回合 · 否否之核",rk:"core",',
'  bossLine:"「你就是不行！认了吧！」否否胀到最大，遮住了整片场。",',
'  valid:"COMBO",',
'  ease:"闪闪：一个人顶不住。找一位不同角色的队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 8. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' echo:{',
'  micro:["把「认输」切成五秒一步——先，抬一下头。回声撞了个空。"],',
'  growth:["「我不行」改成「我还不行」。回声被这句顶回去一半。"],',
'  selfeff:["想起上次做到的事，底气一撑，回声短了一截。"],',
'  vicarious:["想起一个和你差不多的人做到了——回声里混进了别人的掌声。"],',
'  mark:["闪闪标出回声最响的那句——破绽一亮，回声散了。"],',
'  monitor:["眠眠先看了一眼电量：你不是没电，是没看。回声没了底气。"],',
'  miss:["闪闪：「再想一招。先迈一小步，或者改一句『还不行』。」"]',
' },',
' crowd:{',
'  growth:["「我不行」改成「我还不行」。黑压压的影子，退了一层。"],',
'  selfeff:["「我做到过。」这一句，把最前排的影子按回了座位。"],',
'  vicarious:["看台上有个和你差不多的人站起来了——影子们愣了。"],',
'  mark:["闪闪标出最黑的那块阴影——破绽亮起，影子裂了缝。"],',
'  micro:["先迈一小步，影子跟着你动，反而没那么可怕了。"],',
'  monitor:["眠眠报了电量：撑得住。影子看准了你的稳。"],',
'  sleep:["眠眠合上眼：「先睡一觉。」醒来，影子小了一圈。"],',
'  selfexplain:["「问一句为什么。」越问越明白，影子被问出了形状。"],',
'  miss:["闪闪：「用什么都行。讲不通的那句，先顶回去——再想一招。」"]',
' },',
' core:{',
'  single:["否否抖了抖黑影：「一个人……顶不住我……」身后伸过来一只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两个法子——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 9. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 按字母序排序后用 "+" 连接（与引擎 b.sel.sort().join("+") 一致）
 * 共 21 条跨角色对（排除同角色：闪4/眠2 内部对） */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "growth+micro"    :["闪闪把「我不行」改成「我还不行」，松松接一句「先迈一步」。","一句改口，一步落地，否否的壳裂了道缝。"],',
' "growth+monitor"  :["闪闪改口「还不行」，眠眠报上电量：「还有电。」","不信自己的时候，先看一眼真实的电量。"],',
' "growth+selfexplain":["先改口「还不行」，再问一句「为什么还不行」。","改了口，才问得清。"],',
' "growth+sleep"    :["「我还不行」说出口，眠眠：「先睡一觉，醒来还是还不行——但更稳。」","睡一觉，那句「还不行」没消失，只是不吓人了。"],',
' "mark+micro"      :["闪闪标出「我不行」这个破绽，松松一步跨过去。","会卡住的地方，被一脚踩过去了。"],',
' "mark+monitor"    :["闪闪点出破绽，眠眠看条。","破绽照到了，力气也省下了。"],',
' "mark+selfexplain":["闪闪标出最黑的那句，究究问一句为什么。","卡住的那一句，被问开了。"],',
' "mark+sleep"      :["闪闪标出要信的地方，眠眠负责存档。","标记过的那句，睡着也不会丢。"],',
' "micro+monitor"   :["眠眠报电量，松松只迈一步。","一步，一电，走得不慌。"],',
' "micro+selfeff"   :["松松迈一小步，闪闪想起「我做到过」。","最小的步子，踩在最实的底气上。"],',
' "micro+selfexplain":["先迈五秒一步，再问一句「为什么不行」。","最小的一步，也踩得清清楚楚。"],',
' "micro+sleep"     :["迈一小步，睡一觉存档。","这一步，睡醒还在。"],',
' "micro+vicarious" :["松松迈一步，闪闪看向那个差不多的人。","别人动了，自己也敢动。"],',
' "monitor+selfeff" :["眠眠报电量，闪闪翻出「我做到过」。","不是没电，是没看——看一眼，底气就回来。"],',
' "monitor+selfexplain":["先看电量，再问一句为什么。","不硬撑着问，才问得明白。"],',
' "monitor+vicarious":["眠眠看条，闪闪盯着那个差不多的人。","稳住自己，再看别人怎么做到的。"],',
' "selfeff+selfexplain":["想起「我做到过」，再问「为什么那次能做到」。","那次做到的底气，被问清楚了。"],',
' "selfeff+sleep"   :["「我做到过」记在心里，睡一觉存进抽屉。","醒来，那股劲还在。"],',
' "selfexplain+sleep":["问清楚为什么，睡一觉存进抽屉。","醒来，那个「为什么」还在。"],',
' "selfexplain+vicarious":["看别人做到，再问「为什么他能」。","别人的成功，被你问成了自己的路标。"],',
' "sleep+vicarious" :["睡一觉，梦里那个差不多的人还在做。","醒来，路标更清楚了。"]',
'};',
'var COMBO_NAMES={',
' "growth+micro":"还行一步","growth+monitor":"还行一看","growth+selfexplain":"还行一问","growth+sleep":"还行一档",',
' "mark+micro":"点破一迈","mark+monitor":"点破一看","mark+selfexplain":"点破一问","mark+sleep":"点破一档",',
' "micro+monitor":"一步一电","micro+selfeff":"一步还行","micro+selfexplain":"一步一问","micro+sleep":"一步一档","micro+vicarious":"一步一学",',
' "monitor+selfeff":"看电还行","monitor+selfexplain":"看电一问","monitor+vicarious":"看电一学",',
' "selfeff+selfexplain":"效问一明","selfeff+sleep":"效档一存","selfexplain+sleep":"一问一档","selfexplain+vicarious":"一问一学","sleep+vicarious":"一档一学"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力量，在斗技场上咬合成一个齿轮。","否否的「不行」，被正式顶了回去。"];',
'var BORROW_ORDER=["monitor","mark","sleep"];',
'var BORROW_LINE={',
' mian:"眠眠：「记录本和钟都借你们——看一眼电量，困了就睡。」",',
' shan:"闪闪：「我帮你把『我不行』这个破绽标出来。剩下的，你来讲。」",',
' jiu :"究究：「一边走一边问一句为什么——否否最怕这个。」",',
' song:"松松：「微步骤启动借你们！先迈一小步！」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 10. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"arena",t:"斗技场",e:"🥊"},{k:"boss",t:"Boss",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 11. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch4_save_v1";', 'var SAVE_KEY="brainexp_ch5_save_v1";');
rep('var BEST_KEY="brainexp_ch4_best_v1";', 'var BEST_KEY="brainexp_ch5_best_v1";');
/* 标题页继承前四章记录（追加 Ch4 继承） */
rep('  var p2=null;\n  try{p2=JSON.parse(localStorage.getItem("brainexp_ch2_best_v1"));}catch(e){}\n  if(p2)html+=(html?"<br>":"")+"🏅 已继承第二章：「分心花田」最佳 <b>"+p2.rating+"</b> · "+p2.diff;\n  var p3=null;\n  try{p3=JSON.parse(localStorage.getItem("brainexp_ch3_best_v1"));}catch(e){}\n  if(p3)html+=(html?"<br>":"")+"🏅 已继承第三章：「遗忘迷宫」最佳 <b>"+p3.rating+"</b> · "+p3.diff;',
    '  var p2=null;\n  try{p2=JSON.parse(localStorage.getItem("brainexp_ch2_best_v1"));}catch(e){}\n  if(p2)html+=(html?"<br>":"")+"🏅 已继承第二章：「分心花田」最佳 <b>"+p2.rating+"</b> · "+p2.diff;\n  var p3=null;\n  try{p3=JSON.parse(localStorage.getItem("brainexp_ch3_best_v1"));}catch(e){}\n  if(p3)html+=(html?"<br>":"")+"🏅 已继承第三章：「遗忘迷宫」最佳 <b>"+p3.rating+"</b> · "+p3.diff;\n  var p4=null;\n  try{p4=JSON.parse(localStorage.getItem("brainexp_ch4_best_v1"));}catch(e){}\n  if(p4)html+=(html?"<br>":"")+"🏅 已继承第四章：「理解冰山」最佳 <b>"+p4.rating+"</b> · "+p4.diff;');

/* ============ 12. 新技能图腾（竞技世界 · 斗技场风，TOT 占位色） ============ */
var TOTEM_ADD = [
'TOTEM_ART.growth=\'<path d="M20 36 V20" stroke="TOT" stroke-width="3.4" stroke-linecap="round" fill="none"/><path d="M20 26 q-9 -1 -11 -10 M20 22 q9 -1 11 -10" stroke="TOT" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M13 13 q-4 -3 -2 -7 q5 1 4 6 Z" fill="TOT"/><path d="M27 9 q4 -3 2 -7 q-5 1 -4 6 Z" fill="TOT"/>\';',
'TOTEM_ART.selfeff=\'<path d="M20 7 L33 13 V23 Q33 33 20 37 Q7 33 7 23 V13 Z" fill="none" stroke="TOT" stroke-width="3"/><path d="M14 21 l4 4 9 -10" fill="none" stroke="TOT" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>\';',
'TOTEM_ART.vicarious=\'<circle cx="14" cy="15" r="6.5" fill="none" stroke="TOT" stroke-width="3"/><path d="M14 21 v9" stroke="TOT" stroke-width="3" stroke-linecap="round"/><circle cx="29" cy="24" r="6.5" fill="none" stroke="TOT" stroke-width="3"/><path d="M29 30 v6" stroke="TOT" stroke-width="3" stroke-linecap="round"/><path d="M14 15 h15" stroke="TOT" stroke-width="2.4" stroke-dasharray="3 3"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 13. Boss 否否（否定斗技场主 · 脑子里「我不行」的声音） ============
 * 铁律：五官画在上部(y≈26-40)避开对话气泡；金尖刺/光晕伸出遮挡区；纯色+明暗面，不用 url(#gradient) */
var BOSS_BLOCK = [
'/* ---- Boss 否否（否定斗技场主 · 脑子里「我不行」的声音） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+48*Math.cos(a)).toFixed(1), py=(52+40*Math.sin(a)).toFixed(1);',
'    chips+=\'<rect x="\'+px+\'" y="\'+py+\'" width="11" height="11" rx="2" fill="\'+(i%2?"#2a2030":"#4a2230")+\'" transform="rotate(\'+(i*40)+\' \'+px+\' \'+py+\')"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="60" cy="56" rx="56" ry="52" fill="rgba(20,12,18,.55)"/>\'+',
'  /* 金色怀疑尖刺（向上伸出气泡遮挡区） */',
'  \'<path d="M38 28 L33 6 L47 24 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M60 22 L60 2 L68 22 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M82 28 L87 6 L73 24 Z" fill="#f0b24a"/>\'+',
'  /* 黑影身体（比背景亮，确保可见） */',
'  \'<path d="M20 62 Q8 34 40 30 Q60 16 84 32 Q114 36 98 66 Q108 94 70 98 Q38 106 24 88 Q6 82 20 62 Z" fill="#46375c" stroke="#1c1530" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M40 64 Q60 56 82 66 Q86 86 60 90 Q36 88 40 64 Z" fill="#5a4a6e" opacity=".7"/>\'+',
'  /* 红色 ✕ 眼（画在上部，避开气泡） */',
'  \'<path d="M31 32 l8 8 M39 32 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  \'<path d="M73 32 l8 8 M81 32 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  /* 皱眉 + 张嘴（否定的脸） */',
'  \'<path d="M34 26 q10 -4 18 0 M68 26 q10 -4 18 0" stroke="#1c1530" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M44 46 q16 10 32 0" stroke="#e05a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><rect x="12" y="14" width="7" height="7" rx="2" fill="#f0b24a"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><rect x="104" y="30" width="6" height="6" rx="2" fill="#e05a4a"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 蒙蒙（理解冰山主 · 「我懂啦」，水下却是一整座山） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 14. 场景插画：竞技世界 · 斗技场（暗夜+观众席+聚光灯+擂台） ============ */
var SCENE_BLOCK = [
'/* ---- 场景插画（竞技世界 · 斗技场） ---- */',
'var PAVERS=[[150,318],[228,300],[306,295],[386,281],[464,267],[542,257],[624,247]];',
'function sceneKindOf(id){',
'  if(id==="i1"||id==="i2")return "camp";',
'  if(id==="w1"||id==="w2"||id==="w3")return "clear";',
'  return "arena";',
'}',
'function sceneSVG(kind){',
'  var clear=(kind==="clear"), camp=(kind==="camp"), arena=!clear&&!camp;',
'  var sky1=camp?"#241a14":(clear?"#3a2a1c":"#1a1218"), sky2=camp?"#120c09":(clear?"#241910":"#0d080c");',
'  var ground1=clear?"#33251a":"#211710";',
'  var sid="sk"+kind;',
'  var body="";',
'  if(camp){',
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#1a120c"/><rect x="0" y="250" width="880" height="6" fill="#3a2a1c"/>\';',
'    for(var r=0;r<3;r++){',
'      body+=\'<path d="M0 \'+(266+r*30)+\' h880" stroke="rgba(240,178,74,.10)" stroke-width="2"/>\';',
'      for(var c=0;c<12;c++){ body+=\'<path d="M\'+(c*76+(r%2?38:0))+\' \'+(266+r*30)+\' v30" stroke="rgba(240,178,74,.09)" stroke-width="2"/>\'; }',
'    }',
'    body+=\'<circle cx="440" cy="300" r="104" fill="url(#\'+sid+\'glow)" class="flicker"/>\';',
'    body+=\'<rect x="396" y="300" width="88" height="14" rx="2" fill="#4a3727"/><rect x="412" y="286" width="56" height="14" rx="2" fill="#6a4f33"/>\';',
'    body+=\'<path class="flame" d="M440 288 C424 272 431 254 440 240 C449 254 456 272 440 288 Z" fill="#f0b24a"/>\';',
'    body+=\'<path class="flame f2" d="M440 286 C432 275 436 262 440 254 C444 262 448 275 440 286 Z" fill="#f0d68a"/>\';',
'    body+=\'<path d="M120 252 L170 184 L220 252 Z" fill="#3a2a1c"/><path d="M150 252 L170 206 L190 252 Z" fill="#241a14"/>\';',
'    body+=\'<path d="M660 252 L710 184 L760 252 Z" fill="#3a2a1c"/><path d="M690 252 L710 206 L730 252 Z" fill="#241a14"/>\';',
'    body+=\'<rect x="300" y="168" width="280" height="34" rx="4" fill="#4a2230" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<text x="440" y="191" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">否定斗技场 · 准备区</text>\';',
'    body+=\'<ellipse cx="220" cy="274" rx="100" ry="17" fill="rgba(240,178,74,.08)" class="fogA"/>\';',
'  }else{',
'    /* 观众席（两侧阶梯 + 红金灯点） */',
'    for(var t=0;t<4;t++){',
'      var yy=60+t*26;',
'      body+=\'<rect x="0" y="\'+yy+\'" width="180" height="22" rx="3" fill="#221810"/><rect x="700" y="\'+yy+\'" width="180" height="22" rx="3" fill="#221810"/>\';',
'      for(var s=0;s<9;s++){ body+=\'<circle cx="\'+(20+s*18)+\'" y="\'+(yy+11)+\'" r="4" fill="#\'+(s%2?"f0b24a":"e05a4a")+\'" opacity=".5"/>\'; }',
'      for(var s2=0;s2<9;s2++){ body+=\'<circle cx="\'+(720+s2*18)+\'" y="\'+(yy+11)+\'" r="4" fill="#\'+(s2%2?"f0b24a":"e05a4a")+\'" opacity=".5"/>\'; }',
'    }',
'    /* 聚光灯（红/金光束） */',
'    body+=\'<path d="M300 0 L360 240 L240 240 Z" fill="rgba(240,178,74,.10)"/>\';',
'    body+=\'<path d="M580 0 L640 240 L520 240 Z" fill="rgba(224,90,74,.10)"/>\';',
'    /* 地面 */',
'    body+=\'<rect x="0" y="238" width="880" height="142" fill="\'+ground1+\'"/>\';',
'    body+=\'<rect x="0" y="238" width="880" height="4" fill="rgba(240,178,74,.22)"/>\';',
'    for(var g=0;g<5;g++){ body+=\'<path d="M0 \'+(252+g*28)+\' h880" stroke="rgba(240,178,74,.07)" stroke-width="2"/>\'; }',
'    /* 擂台（八角平台） */',
'    body+=\'<polygon points="300,300 360,272 520,272 580,300 540,348 340,348" fill="#2a1f18" stroke="#4a3727" stroke-width="3"/>\';',
'    body+=\'<polygon points="360,272 520,272 500,286 380,286" fill="#352819"/>\';',
'    body+=\'<text x="440" y="318" font-size="20" fill="#f0d68a" text-anchor="middle" font-family="sans-serif" opacity=".8">擂 台</text>\';',
'    /* 浮空踏石（保留方块世界彩蛋） */',
'    var pv="";',
'    PAVERS.forEach(function(p,i){',
'      var hl=(arena&&i===2), dy=clear?-10:0, pw=52+i*4;',
'      pv+=\'<rect x="\'+(p[0]-pw/2)+\'" y="\'+(p[1]+dy-8)+\'" width="\'+pw+\'" height="20" rx="3" fill="\'+(hl?"#8a6a3a":(clear?"#43321f":"#352819"))+\'" stroke="#1c1530" stroke-width="1.5"\'+(hl?\' class="stone-hl"\':\'\')+\'/>\';',
'      pv+=\'<rect x="\'+(p[0]-pw/2+4)+\'" y="\'+(p[1]+dy-6)+\'" width="\'+(pw-8)+\'" height="4" rx="2" fill="rgba(240,178,74,.13)"/>\';',
'    });',
'    body+=pv;',
'    if(arena){',
'      body+=\'<ellipse cx="440" cy="248" rx="370" ry="46" fill="rgba(240,178,74,.12)" class="fogA"/>\';',
'    }else{',
'      body+=\'<path d="M360 272 L520 272 L500 286 L380 286 Z" fill="rgba(240,214,138,.30)"/>\';',
'      body+=\'<g class="flower"><rect x="298" y="250" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="580" y="226" width="9" height="9" rx="2" fill="#e05a4a"/><rect x="222" y="264" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="662" y="274" width="8" height="8" rx="2" fill="#e05a4a"/></g>\';',
'    }',
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
swapRange("/* ---- 场景插画（方块世界 · 冰湖） ---- */", "/* ---- 营地横幅", SCENE_BLOCK);

/* ============ 15. 结算页分支名（Ch4 分支）→ Ch5 分支 ============ */
rep('var m={A:"A线 · 日积一步",B:"B线 · 先猜一遍",C:"C线 · 问句为什么",D:"D线 · 讲一遍听"};',
    'var m={A:"A线 · 还行一步",B:"B线 · 我做到过",C:"C线 · 别人能我也能",D:"D线 · 队友信你"};');
/* 观察 → 本章主题（闪闪「我不行」→「我还不行」收束） */
rep('return "「以后我说『我懂了』之前，先讲一遍——讲不通，就是还没懂。」";',
    'return "「以后心里冒出『我不行』，我就先改成『我还不行』——再迈出一小步。」";');

/* ============ 16. 战斗场景背景：ice → arena ============ */
rep('bg.insertAdjacentHTML("afterbegin",sceneSVG("ice"));',
    'bg.insertAdjacentHTML("afterbegin",sceneSVG("arena"));');

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
