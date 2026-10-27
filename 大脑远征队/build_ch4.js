/* Ch4 构建：从 Ch3 静态源码(_ch4_base.html)换数据 → Ch4-理解冰山.html
 * 章节主题：方块世界 · 理解篇（冰湖 / 冰山）
 * 新技能：复利叠加(song) / 生成效应(mian) / 自我解释(jiu) / 费曼讲解(shan)
 * 社交困境：松松「懂了懂了」抢跑、不肯讲一遍；章末公约「讲不清楚的地方，就是还没懂的地方」
 * 学业铁律：中段章节(Ch2-4)，只允许「看故事书」级中性提及
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch4_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch4-理解冰山.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep("<title>大脑远征队 · 第三章「遗忘迷宫」</title>",
    "<title>大脑远征队 · 第四章「理解冰山」</title>");
rep('<div class="sub">第三章 · 遗忘迷宫 —— 合上书，才真的记住</div>',
    '<div class="sub">第四章 · 理解冰山 —— 「懂了」和「真懂」，隔着一座冰山</div>');
rep('<div class="boss-name">忘忘 · 遗忘迷宫主</div>',
    '<div class="boss-name">蒙蒙 · 理解冰山主</div>');
rep('card.appendChild(el("div","page-sub","第三章 · 遗忘迷宫 —— 完"));',
    'card.appendChild(el("div","page-sub","第四章 · 理解冰山 —— 完"));');
rep('if(r==="A")return "过关了。迷宫里不只有路，还有没想起来的事。";',
    'if(r==="A")return "过关了。冰上不只有脚印，还有没讲清楚的话。";');
rep('return "也走出了迷宫。下次，试着先把想不起来的说出来。";',
    'return "也走过了冰湖。下次，试着先把「懂了」讲一遍。";');
rep('cc.appendChild(el("div","note-sec","第三章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","第四章诞生。公约会随章节累积，章末统一收录。"));');

/* ============ 2. CSS 主题：迷宫 → 冰湖（冷蓝 + 冰面反光） ============ */
s = s.replace(/--bg:#[0-9a-f]+; --bg2:#[0-9a-f]+; --panel:#[0-9a-f]+; --panel2:#[0-9a-f]+; --line:#[0-9a-f]+;/,
  "--bg:#0a1018; --bg2:#111c28; --panel:#16232f; --panel2:#1d2c3b; --line:#2a3d50;");
s = s.replace(/--text:#[0-9a-f]+; --dim:#[0-9a-f]+;/, "--text:#eaf2f8; --dim:#a3b8ca;");
/* 粒子：方块碎片 → 冰晶 */
rep('.blockp{position:absolute;border-radius:3px;pointer-events:none;opacity:.9}',
    '.blockp{position:absolute;border-radius:3px;pointer-events:none;opacity:.9}\n.icep{position:absolute;border-radius:2px;pointer-events:none;opacity:.92;box-shadow:0 0 6px rgba(160,215,240,.5)}');
rep('el("i","blockp")', 'el("i","icep")');

/* ============ 3. 角色技能绑定 ============ */
rep('skills:["micro","interleave"]', 'skills:["micro","compound"]');
rep('skills:["retrieve","monitor"]', 'skills:["selfexplain","monitor"]');
rep('skills:["sleep","monitor"]', 'skills:["generate","sleep"]');
rep('skills:["spacing","mark"]', 'skills:["mark","feynman"]');
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","忘忘":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","蒙蒙":"boss","四人":"all"};');

/* ============ 4. SKILLS ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  compound:{name:"复利叠加",owner:"song",',
'           one:"每天只加一点点，攒起来会自己长大。",',
'           mantra:"「今天一点点，明天更多一点。」",',
'           why:"一点点太小，一天看不出变化；可今天的会叠在昨天的上面，久了会长成你想不到的样子。",',
'           cross:"每天多拍一下球，一个月后，能连着拍几十下。"},',
'  selfexplain:{name:"自我解释",owner:"jiu",',
'           one:"一边做一边问自己「为什么这一步要这样」。",',
'           mantra:"「问一句为什么，再走下一步。」",',
'           why:"只照着样子做，换个花样就不会了；说出「为什么」，学到的是法子，不是样子。",',
'           cross:"搭积木时念一句「为什么这块要放下面」——下次换个形状，也搭得起来。"},',
'  generate:{name:"生成效应",owner:"mian",',
'           one:"先自己猜一个答案，再去对答案。猜错了也记得更牢。",',
'           mantra:"「先猜一遍，再看答案。」",',
'           why:"先自己想出一个答案，大脑会给它挂上钩子；后面看到正确答案，钩子正好挂上去。",',
'           cross:"拼图前先猜这块放哪儿，再看图——猜错的那块，之后一眼就认得。"},',
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
'  feynman:{name:"费曼讲解",owner:"shan",',
'           one:"讲给不懂的人听。讲不通的那句，就是还没懂的地方。",',
'           mantra:"「讲一遍，讲给听不懂的人听。」",',
'           why:"讲得清楚，才是真懂。卡住的那句不是嘴笨，是那里本来就还没通。",',
'           cross:"看完一本故事书，讲给没看过的同伴听——讲不下去的那段，就是没懂的那段。"},',
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
'  {name:"讲一遍懂一层",members:["feynman","selfexplain"],',
'   desc:"费曼讲解（闪）＋自我解释（究）——先问自己一句为什么，再讲给听不懂的人听。跨角色组合技，两人以上才发得动。"},',
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
'  {who:"眠眠",text:"过了迷宫……是湖。"},',
'  {who:"松松",text:"我懂了！我全懂了！"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松掏出那张折得四四方方的笔记：「先做第一步——到哪儿都管用。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {anim:"march"},',
'  {who:"究究",text:"湖中间……立着一块冰。"},',
'  {who:"闪闪",text:"（小声）水下……好大。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"冰面映出四个影子。你先看哪一个？",options:[',
'  {t:"看向松松——他在冰上跑得飞快，脚印一个也没留下",next:"a1",branch:"A",',
'   after:[{act:"跑过的冰面，光滑得像新的一样。"},{who:"松松",text:"我跑得最快！"}]},',
'  {t:"看向眠眠——她把本子扣在冰上，手停住了",next:"b1",branch:"B",',
'   after:[{act:"本子摊开着，她却没翻。"},{who:"眠眠",text:"先……自己猜？"}]},',
'  {t:"看向究究——他蹲在冰前，嘴里一直念叨",next:"c1",branch:"C",',
'   after:[{act:"他念了三遍，没人接话。"},{who:"究究",text:"为什么……不沉？"}]},',
'  {t:"看向闪闪——她拉住松松，像是要讲给他听",next:"d1",branch:"D",',
'   after:[{act:"松松甩开手，往前跑了。"},{who:"闪闪",text:"听我说一句嘛。"}]}',
' ]},',
'',
' /* ---- A 线 · 松松：复利叠加 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"我跑过啦！全懂啦！"},',
'  {who:"眠眠",text:"冰上……一个脚印也没有。"}',
' ]},',
' a2:{kind:"skill",skill:"compound",lead:"松松摊开手掌，看着空空的冰面：「今天一点点——脚印，是一天一天留下来的。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"松松挠头：「一点点？那得多慢啊。」你说：",options:[',
'  {t:"「一点点，会自己长大。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"松松",text:"（在冰上按了个印）……明天再加。"}]},',
'  {t:"「那就多跑几趟！」",next:"conv",trust:2,',
'   after:[{act:"松松又跑了一圈，冰面还是光的。"}]},',
'  {t:"「你这样哪天才能会。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"松松停在冰上，不知道该往哪儿踩。"}]}',
' ]},',
'',
' /* ---- B 线 · 眠眠：生成效应 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"眠眠",text:"本子上……写着答案。"},',
'  {who:"眠眠",text:"（手停住）先自己猜？"}',
' ]},',
' b2:{kind:"skill",skill:"generate",lead:"眠眠把本子扣在冰上，闭了闭眼：「先猜一条——再翻本子对。」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"眠眠小声说：「猜错了……不是白猜了吗？」你说：",options:[',
'  {t:"「猜错的那条，记得最牢。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（猜了一条）……错了，记住了。"}]},',
'  {t:"「那你就照本子走。」",next:"conv",trust:2,',
'   after:[{act:"眠眠翻开本子，照着走了一步。"}]},',
'  {t:"「猜错了还猜什么。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠把本子抱紧，一步也没猜。"}]}',
' ]},',
'',
' /* ---- C 线 · 究究：自我解释 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"究究",text:"为什么……这块冰不沉？"},',
'  {who:"松松",text:"懂了就走啊！"},',
'  {who:"究究",text:"（没人回答）……为什么。"}',
' ]},',
' c2:{kind:"skill",skill:"selfexplain",lead:"究究蹲下来，对着冰面念出声：「问一句为什么，再走下一步。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"松松催：「究究！懂了就走啊！」你说：",options:[',
'  {t:"「问一句为什么，再走。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"究究",text:"（抬头）……水下那块，是根。"}]},',
'  {t:"「快走吧，别问了。」",next:"conv",trust:2,',
'   after:[{act:"究究站起来，把那句为什么咽了回去。"}]},',
'  {t:"「问这么多干嘛。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"究究低下头，不再出声。"}]}',
' ]},',
'',
' /* ---- D 线 · 闪闪：费曼讲解（本章社交困境核心） ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"闪闪",text:"松松，你讲一遍给我听。"},',
'  {who:"松松",text:"讲什么！我都会了！"}',
' ]},',
' d2:{kind:"skill",skill:"feynman",lead:"闪闪在冰上画了个小小的人：「讲给听不懂的人听——讲不通的那句，就是还没懂。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"松松嚷：「讲一遍？多浪费时间！」你说：",options:[',
'  {t:"「讲不出的地方，就是没懂。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"松松",text:"（张了张嘴）……第一句就卡了。"}]},',
'  {t:"「那你先自己练练。」",next:"conv",trust:2,',
'   after:[{act:"松松自己跑了一圈，什么也没说。"}]},',
'  {t:"「别讲了，来不及。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪把冰上那个小小的人擦掉了。"}]}',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"蒙蒙",text:"我懂啦！我全懂啦！"},',
'  {who:"究究",text:"说了三遍……也没讲清。"},',
'  {who:"松松",text:"……我好像也一样。"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"蒙蒙",text:"你们……居然讲得出来……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"松松",text:"懂了……不等于会了。"},',
'  {who:"四人",text:"讲不清楚的地方，就是还没懂的地方！"},',
'  {who:"四人",text:"不懂装懂，才是真的慢！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 7. ROUNDS ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 冰面反光",rk:"glare",',
'  bossLine:"「我懂啦！我全懂啦！」冰面反着光，看什么都像懂了。",',
'  valid:["micro","selfexplain"],',
'  ease:"眠眠：反光里要靠「实」——先迈一小步，或者问自己一句为什么。"},',
' {name:"第 2 回合 · 水下冰体",rk:"deep",',
'  bossLine:"「懂了不就够了？」水面下那块巨大的冰，慢慢浮上来。",',
'  valid:["compound","generate","feynman","monitor","mark","sleep","selfexplain"],',
'  ease:"眠眠：水下那块才要紧。讲一遍、猜一遍、每天加一点点——都行。"},',
' {name:"第 3 回合 · 蒙蒙之核",rk:"core",',
'  bossLine:"「懂了就是懂了！你们讲那么多给谁听！」",',
'  valid:"COMBO",',
'  ease:"眠眠：这一下，一个人拦不住。找一位队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 8. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' glare:{',
'  micro:["把「弄懂」切成五秒一步——先，踩实脚底那一块冰。反光晃了个空。"],',
'  selfexplain:["「问一句为什么。」嘴上一念，冰面的反光就淡了一层。"],',
'  miss:["眠眠：「再想一招。先迈一小步，或者问自己一句为什么。」"]',
' },',
' deep:{',
'  compound:["今天加一点点，明天再加一点点——脚印一层压一层，终于留在了冰上。"],',
'  generate:["「先猜一条。」猜完再对答案——猜错的那条，反倒记住了。"],',
'  feynman:["闪闪把这块冰讲给听不懂的人听。讲不通的那句一露，冰体裂了道缝。"],',
'  monitor:["眠眠先看了一眼电量：撑不住的地方，绕开就好。"],',
'  mark:["闪闪标出冰最薄的地方——破绽一亮，水下那块藏不住了。"],',
'  sleep:["眠眠合上本子：「先睡一觉。」醒来，讲不通的那句通了。"],',
'  selfexplain:["「问一句为什么。」越问越深——水下的那块，被问出了形状。"],',
'  miss:["眠眠：「水下那块才要紧。讲一遍、猜一遍、每天加一点点——再想一招。」"]',
' },',
' core:{',
'  single:["蒙蒙抖落一身碎冰：「一个人……讲不清我……」身后伸过来一只手。"],',
'  same:["两股相同的力气撞在一起，互相抵消。眠眠：「两个人，两个法子——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 9. COMBO_LINES / NAMES / FALLBACK / BORROW ============ */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "compound+selfexplain":["松松每天多走一步，究究在每一步上问一句为什么。","小小的步子，每一脚都踩在明白上。"],',
' "micro+selfexplain"   :["先迈五秒一步，再问一句「为什么这样」。","最小的一步，也踩得清清楚楚。"],',
' "compound+generate"   :["眠眠先猜一条路，松松每天往上面加一点。","猜过的路，一天比一天结实。"],',
' "compound+monitor"    :["眠眠看一眼电量，松松今天只加一点点。","一点点，加在不累的那天最稳。"],',
' "compound+sleep"      :["今天加一点点，睡一觉存进抽屉。","明天的那一点点，正好叠在今天上面。"],',
' "generate+micro"      :["先猜一条路，再迈出一小步试试。","猜的那条，被脚验证了。"],',
' "micro+monitor"       :["眠眠报电量，松松只迈一步。","一步，一电，走得不慌。"],',
' "micro+sleep"         :["迈一小步，睡一觉存档。","这一步，睡醒还在。"],',
' "compound+feynman"    :["松松每天加一点，闪闪把那一点讲给人听。","讲出来的那点，长成了冰山。"],',
' "compound+mark"       :["闪闪标出最薄的那层冰，松松每天敲一点。","一点点，正好敲在该敲的地方。"],',
' "feynman+micro"       :["先迈一小步，再把这一步讲给闪闪听。","讲得通的那一小步，才是真会了。"],',
' "mark+micro"          :["闪闪标出裂缝，松松一步跨过去。","会碎的地方，被一脚踩过去了。"],',
' "generate+selfexplain":["先猜一条路，再问「为什么猜这条」。","猜和问撞在一起，冰面亮了一块。"],',
' "monitor+selfexplain" :["先看电量，再问一句为什么。","不硬撑着问，才问得明白。"],',
' "selfexplain+sleep"   :["问清楚为什么，睡一觉存进抽屉。","醒来，那个「为什么」还在。"],',
' "feynman+selfexplain" :["究究先问自己一句为什么，闪闪再把答案讲给听不懂的人听。","讲不清楚的那一句，就是还没懂的那一句——组合技「讲一遍懂一层」！"],',
' "mark+selfexplain"    :["闪闪标出讲不通的那句，究究问一句为什么。","卡住的那一句，被问开了。"],',
' "feynman+generate"    :["先猜一遍，再讲给闪闪听。","猜完再讲——蒙蒙的假懂，露了馅。"],',
' "feynman+monitor"     :["闪闪讲，眠眠看条。","讲累了就歇——歇完再讲一遍。"],',
' "feynman+sleep"       :["讲一遍，睡一觉存档。","醒来还记得的，才是真懂的。"],',
' "generate+mark"       :["先猜哪里最薄，闪闪再上去标个记号。","猜的方向，被点亮了。"],',
' "mark+monitor"        :["闪闪点出破绽，眠眠看条。","破绽照到了，力气也省下了。"],',
' "mark+sleep"          :["闪闪标出要懂的地方，眠眠负责存档。","标记过的那句，睡着也不会丢。"]',
'};',
'var COMBO_NAMES={',
' "compound+selfexplain":"日积一问","micro+selfexplain":"一步一问","compound+generate":"日积一猜",',
' "compound+monitor":"日积一电","compound+sleep":"日积一档","generate+micro":"一猜一步",',
' "micro+monitor":"一步一电","micro+sleep":"一步一档","compound+feynman":"日积一讲",',
' "compound+mark":"日积一记","feynman+micro":"一讲一步","mark+micro":"踩点破绽",',
' "generate+selfexplain":"一猜一问","monitor+selfexplain":"看条一问","selfexplain+sleep":"一问一档",',
' "feynman+selfexplain":"讲一遍懂一层","mark+selfexplain":"点亮一问","feynman+generate":"一讲一猜",',
' "feynman+monitor":"一讲一电","feynman+sleep":"一讲一档","generate+mark":"一猜一记",',
' "mark+monitor":"点灯看条","mark+sleep":"点亮存档"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力量，在冰面上咬合成一个齿轮。","蒙蒙的假懂，被正式戳破了。"];',
'var BORROW_ORDER=["monitor","mark","sleep"];',
'var BORROW_LINE={',
' mian:"眠眠：「记录本和钟都借你们——先自己猜一条，困了就睡一觉。」",',
' shan:"闪闪：「我帮你把讲不通的那句标出来。剩下的，你来讲。」",',
' jiu :"究究：「一边走一边问一句为什么——蒙蒙最怕这个。」",',
' song:"松松：「「复利叠加」借你们！今天一点点，明天更多一点！」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 10. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"lake",t:"冰湖",e:"🧊"},{k:"boss",t:"Boss",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 11. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch3_save_v1";', 'var SAVE_KEY="brainexp_ch4_save_v1";');
rep('var BEST_KEY="brainexp_ch3_best_v1";', 'var BEST_KEY="brainexp_ch4_best_v1";');
/* 标题页继承前三章记录 */
rep('  var p2=null;\n  try{p2=JSON.parse(localStorage.getItem("brainexp_ch2_best_v1"));}catch(e){}\n  if(p2)html+=(html?"<br>":"")+"🏅 已继承第二章：「分心花田」最佳 <b>"+p2.rating+"</b> · "+p2.diff;',
    '  var p2=null;\n  try{p2=JSON.parse(localStorage.getItem("brainexp_ch2_best_v1"));}catch(e){}\n  if(p2)html+=(html?"<br>":"")+"🏅 已继承第二章：「分心花田」最佳 <b>"+p2.rating+"</b> · "+p2.diff;\n  var p3=null;\n  try{p3=JSON.parse(localStorage.getItem("brainexp_ch3_best_v1"));}catch(e){}\n  if(p3)html+=(html?"<br>":"")+"🏅 已继承第三章：「遗忘迷宫」最佳 <b>"+p3.rating+"</b> · "+p3.diff;');

/* ============ 12. 新技能图腾（方块世界 · 冰湖风） ============ */
var TOTEM_ADD = [
'TOTEM_ART.compound=\'<rect x="6" y="34" width="10" height="9" rx="2" fill="TOT" opacity=".45"/><rect x="18" y="26" width="10" height="17" rx="2" fill="TOT" opacity=".72"/><rect x="30" y="14" width="10" height="29" rx="2" fill="TOT"/><path d="M35 4v6M32 8l3-4 3 4" fill="none" stroke="TOT" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>\';',
'TOTEM_ART.generate=\'<rect x="6" y="12" width="20" height="24" rx="3" fill="none" stroke="TOT" stroke-width="3" stroke-dasharray="4 3"/><path d="M28 24h3" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/><rect x="33" y="17" width="11" height="11" rx="2" fill="TOT"/>\';',
'TOTEM_ART.selfexplain=\'<path d="M6 12h30v20H16l-6 7v-7H6z" fill="none" stroke="TOT" stroke-width="3" stroke-linejoin="round"/><path d="M17 19a3 3 0 1 1 3 3v2" fill="none" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/><circle cx="20" cy="29" r="1.5" fill="TOT"/>\';',
'TOTEM_ART.feynman=\'<circle cx="14" cy="24" r="7" fill="none" stroke="TOT" stroke-width="3"/><path d="M25 18a9 9 0 0 1 0 12M32 14a15 15 0 0 1 0 20M39 10a21 21 0 0 1 0 28" fill="none" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 13. Boss 蒙蒙（理解冰山主 · 水上只露一角） ============ */
var BOSS_BLOCK = [
'/* ---- Boss 蒙蒙（理解冰山主 · 「我懂啦」，水下却是一整座山） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+46*Math.cos(a)).toFixed(1), py=(54+37*Math.sin(a)).toFixed(1);',
'    chips+=\'<rect x="\'+px+\'" y="\'+py+\'" width="12" height="12" rx="1.5" fill="\'+(i%2?"#bfe4f5":"#f0d68a")+\'" transform="rotate(\'+(i*35)+\' \'+px+\' \'+py+\')"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<defs><radialGradient id="bgw" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(240,180,90,.42)"/><stop offset="1" stop-color="rgba(240,180,90,0)"/></radialGradient>\'+',
'  \'</defs>\'+',
'  \'<ellipse cx="60" cy="54" rx="58" ry="54" fill="url(#bgw)"/>\'+',
'  /* 水下：看不见的巨大冰体 */',
'  \'<path d="M6 74 L114 74 L98 106 L22 106 Z" fill="#3a6a93"/>\'+',
'  \'<path d="M6 74 L114 74 L110 83 L10 83 Z" fill="#4c7fa8"/>\'+',
'  \'<path d="M12 90 L108 90 M16 98 L104 98" stroke="rgba(196,232,250,.5)" stroke-width="1.6" fill="none"/>\'+',
'  \'<path d="M40 82 L52 100 M74 82 L62 100" stroke="#79b0d6" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  /* 水面线 */',
'  \'<rect x="0" y="70" width="120" height="5" rx="2.5" fill="#bfeaf8"/>\'+',
'  \'<ellipse cx="60" cy="103" rx="47" ry="7" fill="rgba(0,0,0,.5)"/>\'+',
'  /* 冰晶天线（伸出气泡遮挡区） */',
'  \'<rect x="40" y="0" width="12" height="14" rx="1" fill="#bfe4f5"/><rect x="40" y="0" width="12" height="6" rx="1" fill="#f0d68a"/>\'+',
'  \'<rect x="68" y="0" width="12" height="14" rx="1" fill="#bfe4f5"/><rect x="68" y="0" width="12" height="6" rx="1" fill="#f0d68a"/>\'+',
'  /* 水上：只露一角的冰山尖 */',
'  \'<path d="M60 8 L104 74 L16 74 Z" fill="#a8d8ec" stroke="#2b4459" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M60 8 L104 74 L60 74 Z" fill="#6fa4c4" opacity=".72"/>\'+',
'  \'<path d="M60 8 L73 26 L47 26 Z" fill="#f7fdff" opacity=".92"/><path d="M60 8 L64 18 L56 18 Z" fill="#ffffff"/>\'+',
'  \'<path d="M26 74 L40 42 M94 74 L80 46" stroke="#ffffff" stroke-width="1.6" opacity=".28" fill="none"/>\'+',
'  /* 五官：全部画在上部，避开对话气泡 */',
'  \'<rect x="40" y="18" width="16" height="13" rx="2.5" fill="#f6fafd" stroke="#22303c" stroke-width="2.5"/><rect x="45" y="22" width="7" height="6" fill="#d8b45a"/>\'+',
'  \'<rect x="64" y="18" width="16" height="13" rx="2.5" fill="#f6fafd" stroke="#22303c" stroke-width="2.5"/><rect x="69" y="22" width="7" height="6" fill="#d8b45a"/>\'+',
'  \'<path d="M46 38 q14 12 28 0 Z" fill="#16212c"/><path d="M52 42 q8 4 16 0" fill="#8a4a52" opacity=".9"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><rect x="10" y="12" width="7" height="7" rx="1" fill="#bfe4f5"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><rect x="106" y="26" width="6" height="6" rx="1" fill="#bfe4f5"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:2.5s"><rect x="18" y="92" width="6" height="6" rx="1" fill="#f0d68a"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 忘忘（遗忘方块魔 · 身上全是记忆缺口） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 14. 场景插画：冰湖 / 冰山 ============ */
var SCENE_BLOCK = [
'/* ---- 场景插画（方块世界 · 冰湖） ---- */',
'var PAVERS=[[150,318],[228,300],[306,295],[386,281],[464,267],[542,257],[624,247]];',
'function sceneKindOf(id){',
'  if(id==="i1"||id==="i2")return "camp";',
'  if(id==="w1"||id==="w2"||id==="w3")return "clear";',
'  return "ice";',
'}',
'function sceneSVG(kind){',
'  var clear=(kind==="clear"), camp=(kind==="camp"), ice=!clear&&!camp;',
'  var sky1=camp?"#1a2c3c":(clear?"#3d5f7d":"#26394d"), sky2=camp?"#09121a":(clear?"#1a2b3a":"#0c1720");',
'  var ground1=clear?"#37586f":"#1d3141";',
'  var sid="sk"+kind;',
'  var body="";',
'  if(camp){',
'    body+=\'<g opacity=".92"><path d="M0 252 L0 196 L64 196 L64 170 L140 170 L140 204 L216 204 L216 180 L296 180 L296 252 Z" fill="#0d1a24"/><path d="M584 252 L584 186 L658 186 L658 166 L742 166 L742 198 L824 198 L824 252 Z" fill="#0d1a24"/></g>\';',
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#152430"/><rect x="0" y="250" width="880" height="6" fill="#2c4356"/>\';',
'    for(var r=0;r<3;r++){',
'      body+=\'<path d="M0 \'+(266+r*30)+\' h880" stroke="rgba(190,225,245,.10)" stroke-width="2"/>\';',
'      for(var c=0;c<12;c++){',
'        body+=\'<path d="M\'+(c*76+(r%2?38:0))+\' \'+(266+r*30)+\' v30" stroke="rgba(190,225,245,.09)" stroke-width="2"/>\';',
'      }',
'    }',
'    body+=\'<circle cx="440" cy="300" r="104" fill="url(#\'+sid+\'glow)" class="flicker"/>\';',
'    body+=\'<rect x="396" y="300" width="88" height="14" rx="2" fill="#3f5163"/><rect x="412" y="286" width="56" height="14" rx="2" fill="#54708a"/>\';',
'    body+=\'<path class="flame" d="M440 288 C424 272 431 254 440 240 C449 254 456 272 440 288 Z" fill="#e8934a"/>\';',
'    body+=\'<path class="flame f2" d="M440 286 C432 275 436 262 440 254 C444 262 448 275 440 286 Z" fill="#f0d68a"/>\';',
'    body+=\'<rect x="112" y="192" width="28" height="64" fill="#33465a"/><rect x="140" y="176" width="28" height="80" fill="#3b5064"/><rect x="212" y="196" width="28" height="60" fill="#33465a"/>\';',
'    body+=\'<rect x="146" y="192" width="58" height="64" fill="none" stroke="#6fa8dc" stroke-width="2"/>\';',
'    body+=\'<rect x="154" y="200" width="42" height="56" fill="url(#\'+sid+\'portal)" class="flicker"/>\';',
'    body+=\'<rect x="672" y="288" width="38" height="28" rx="3" fill="#7a5a3a"/><rect x="672" y="288" width="38" height="7" rx="2" fill="#9a7549"/>\';',
'    body+=\'<path d="M682 288 v28 M700 288 v28" stroke="#5c432c" stroke-width="2"/>\';',
'    body+=\'<rect x="742" y="266" width="10" height="32" rx="2" fill="#3f5163"/><rect x="733" y="256" width="28" height="13" rx="3" fill="#f0d68a"/>\';',
'    body+=\'<circle cx="747" cy="263" r="3.4" fill="#fff6d0"/>\';',
'    body+=\'<ellipse cx="220" cy="274" rx="100" ry="17" fill="rgba(180,215,238,.08)" class="fogA"/>\';',
'  }else{',
'    /* 远处冰山剪影 */',
'    body+=\'<path d="M-10 240 L70 146 L150 240 Z" fill="#1d3141"/><path d="M120 240 L200 132 L290 240 Z" fill="#21384b"/>\'+',
'           \'<path d="M600 240 L680 150 L760 240 Z" fill="#1d3141"/><path d="M720 240 L810 128 L900 240 Z" fill="#21384b"/>\';',
'    body+=\'<path d="M70 146 L96 190 L70 240 M200 132 L232 186 M810 128 L782 190" stroke="rgba(200,232,248,.16)" stroke-width="2" fill="none"/>\';',
'    /* 冰面 */',
'    body+=\'<rect x="0" y="238" width="880" height="142" fill="\'+ground1+\'"/>\';',
'    body+=\'<rect x="0" y="238" width="880" height="4" fill="rgba(190,232,248,.22)"/>\';',
'    for(var g=0;g<5;g++){',
'      body+=\'<path d="M0 \'+(252+g*28)+\' h880" stroke="rgba(190,232,248,.07)" stroke-width="2"/>\';',
'    }',
'    /* 水下：整座冰山的影子（跟随左侧冰山，中央留给 Boss） */',
'    body+=\'<path d="M52 244 L252 244 L232 380 L84 380 Z" fill="rgba(14,38,58,.62)"/>\'+',
'           \'<path d="M92 250 L212 250 L198 380 L108 380 Z" fill="rgba(10,28,44,.55)"/>\';',
'    /* 水上：只露一角的冰山（靠左，避免与 Boss 重叠） */',
'    body+=\'<path d="M150 136 L266 240 L34 240 Z" fill="#476f8b"/>\'+',
'           \'<path d="M150 136 L188 240 L150 240 Z" fill="#5f8fad" opacity=".85"/>\'+',
'           \'<path d="M150 136 L266 240 L34 240 Z" fill="none" stroke="rgba(232,248,255,.28)" stroke-width="2"/>\'+',
'           \'<path d="M62 240 L104 186 M240 240 L196 194" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none"/>\';',
'    /* 右侧远景冰尖 */',
'    body+=\'<path d="M760 150 L812 240 L708 240 Z" fill="#33556d"/>\'+',
'           \'<path d="M760 150 L784 240 L760 240 Z" fill="#40647e" opacity=".8"/>\';',
'    /* 冰面上的裂纹 */',
'    body+=\'<path d="M120 300 L200 288 L268 306 M700 292 L772 306 L840 296" stroke="rgba(200,232,248,.14)" stroke-width="2" fill="none"/>\';',
'    /* 方块石柱（方块世界标识） */',
'    body+=\'<rect x="52" y="104" width="34" height="146" fill="#2c3e50"/><rect x="52" y="104" width="34" height="11" fill="#3c5366"/>\'+',
'           \'<rect x="794" y="104" width="34" height="146" fill="#2c3e50"/><rect x="794" y="104" width="34" height="11" fill="#3c5366"/>\';',
'    /* 浮冰踏石 */',
'    var pv="";',
'    PAVERS.forEach(function(p,i){',
'      var hl=(ice&&i===2), dy=clear?-10:0, pw=52+i*4;',
'      pv+=\'<rect x="\'+(p[0]-pw/2)+\'" y="\'+(p[1]+dy-8)+\'" width="\'+pw+\'" height="20" rx="3" fill="\'+(hl?"#86b6cf":(clear?"#43657d":"#37566d"))+\'" stroke="#16212c" stroke-width="1.5"\'+(hl?\' class="stone-hl"\':\'\')+\'/>\';',
'      pv+=\'<rect x="\'+(p[0]-pw/2+4)+\'" y="\'+(p[1]+dy-6)+\'" width="\'+(pw-8)+\'" height="4" rx="2" fill="rgba(255,255,255,.13)"/>\';',
'    });',
'    body+=pv;',
'    if(ice){',
'      body+=\'<ellipse cx="440" cy="248" rx="370" ry="46" fill="rgba(190,225,245,.14)" class="fogA"/>\'+',
'             \'<ellipse cx="230" cy="278" rx="160" ry="30" fill="rgba(190,225,245,.10)" class="fogB"/>\';',
'    }else{',
'      /* clear：冰山碎了，金光从裂缝里出来 */',
'      body+=\'<path d="M150 152 L188 240 L150 240 Z" fill="rgba(240,214,138,.30)"/>\'+',
'             \'<path d="M150 136 L266 240 L34 240 Z" fill="none" stroke="rgba(240,214,138,.45)" stroke-width="8"/>\'+',
'             \'<g class="flower"><rect x="298" y="250" width="9" height="9" rx="2" fill="#f0d68a"/><rect x="580" y="226" width="9" height="9" rx="2" fill="#cfeaf8"/><rect x="222" y="264" width="9" height="9" rx="2" fill="#f0d68a"/><rect x="662" y="274" width="8" height="8" rx="2" fill="#cfeaf8"/></g>\';',
'    }',
'  }',
'  var skyBlocks=[[64,58,17],[148,38,11],[262,78,13],[352,34,9],[470,62,16],[566,40,10],[662,92,13],[766,48,15],[846,104,10],[196,116,8],[600,124,9]];',
'  var skyG="";',
'  skyBlocks.forEach(function(b,i){',
'    skyG+=\'<rect x="\'+b[0]+\'" y="\'+b[1]+\'" width="\'+b[2]+\'" height="\'+b[2]+\'" rx="2" fill="\'+(i%3===0?"#3a5266":(i%3===1?"#263647":"#48627a"))+\'" opacity="\'+(0.35+(i%4)*0.14).toFixed(2)+\'"/>\';',
'  });',
'  return \'<svg class="scene-svg" viewBox="0 0 880 380" preserveAspectRatio="xMidYMid slice">\'+',
'  \'<defs><linearGradient id="\'+sid+\'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="\'+sky1+\'"/><stop offset="1" stop-color="\'+sky2+\'"/></linearGradient>\'+',
'  \'<radialGradient id="\'+sid+\'glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(240,214,138,.30)"/><stop offset="1" stop-color="rgba(240,214,138,0)"/></radialGradient>\'+',
'  \'<linearGradient id="\'+sid+\'portal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="\'+(clear?"#f0d68a":"#6fa8dc")+\'"/><stop offset="1" stop-color="\'+(clear?"#a8863c":"#24405e")+\'"/></linearGradient>\'+',
'  \'</defs>\'+',
'  \'<rect width="880" height="380" fill="url(#\'+sid+\'sky)"/>\'+',
'  skyG+',
'  body+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- 场景插画（方块世界 · 迷宫） ---- */", "/* ---- 营地横幅", SCENE_BLOCK);

/* 结算页分支名（Ch3 分支）→ Ch4 分支 */
rep('var m={A:"A线 · 换着走",B:"B线 · 先睡一觉",C:"C线 · 合上书想",D:"D线 · 留个记号"};',
    'var m={A:"A线 · 日积一步",B:"B线 · 先猜一遍",C:"C线 · 问句为什么",D:"D线 · 讲一遍听"};');
/* 观察 → 本章主题（松松抢跑的困境收束） */
rep('return "「以后谁问我『记不记得』，我就先合上书，自己说一遍。」";',
    'return "「以后我说『我懂了』之前，先讲一遍——讲不通，就是还没懂。」";');

/* ============ 14.5 手机端结算页压缩（Ch4 公约两行更长，390×844 超出 62px） ============
 * 注意：必须放在 .footer-note 基础规则之后，否则同特异性被覆盖（Ch1 踩过的坑） */
var MOBILE_OLD = [
'/* ---------- 手机端结算压缩（置于末尾确保覆盖基础规则） ---------- */',
'@media (max-width:720px){',
'  .end-main{grid-template-columns:1fr}',
'  .end-card{padding:14px 14px}',
'  .end-hero{height:44px}',
'  .rating-big{width:80px;height:80px;font-size:30px;border-radius:20px}',
'  .tw{width:72px}',
'  .observe{font-size:12px;padding:8px 10px}',
'  .center-row{margin-top:12px}',
'}',
'.footer-note{text-align:center;font-size:11px;color:#5c7263;margin-top:34px;line-height:1.8}'
].join("\n");
var MOBILE_NEW = [
'.footer-note{text-align:center;font-size:11px;color:#5c7263;margin-top:34px;line-height:1.8}',
'/* ---------- 手机端结算压缩（置于 .footer-note 之后才能覆盖基础规则） ---------- */',
'@media (max-width:720px){',
'  .end-main{grid-template-columns:1fr;gap:6px}',
'  .end-card{padding:10px 12px}',
'  .end-hero{height:34px;margin-bottom:7px}',
'  .rating-wrap{margin:2px 0 2px}',
'  .rating-big{width:68px;height:68px;font-size:25px;border-radius:18px}',
'  .end-line{font-size:12px;margin:3px 0 1px}',
'  .end-stats{grid-template-columns:repeat(3,1fr);gap:6px;margin:6px 0 0}',
'  .stat{padding:6px 3px;border-radius:10px}',
'  .stat .v{font-size:13px}',
'  .stat .k{font-size:10px}',
'  .totem-wall{gap:6px}',
'  .tw{width:62px;padding:5px 3px;gap:2px;font-size:10.5px}',
'  .tw .twi{width:34px;height:34px}',
'  .observe{font-size:11.5px;padding:7px 9px;margin:6px 0 0;line-height:1.5}',
'  .footer-note{margin-top:5px;font-size:10.5px}',
'  .secret{margin-top:6px;font-size:11.5px;padding:6px 10px}',
'  .center-row{margin-top:8px;gap:8px}',
'}'
].join("\n");
rep(MOBILE_OLD, MOBILE_NEW);

/* ============ 15. 战斗场景背景：maze → ice ============ */
rep('bg.insertAdjacentHTML("afterbegin",sceneSVG("maze"));',
    'bg.insertAdjacentHTML("afterbegin",sceneSVG("ice"));');

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
