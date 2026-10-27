/* Ch3 构建：从 Ch2 静态源码(_ch3_base.html)换数据 → 大脑远征队-Ch3-遗忘迷宫.html
 * 章节主题：方块世界 · 记忆篇
 * 新技能：交错练习(song) / 主动提取(jiu) / 睡眠存档(mian) / 间隔重复(shan)
 * 社交困境：究究怕想错、不肯合上图鉴；章末公约「记不住，不丢人！说出来，才记得住！」
 * 学业铁律：中段章节，只允许「看书/看故事」级中性提及
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch3_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch3-遗忘迷宫.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 60)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep("<title>大脑远征队 · 第二章「分心花田」</title>",
    "<title>大脑远征队 · 第三章「遗忘迷宫」</title>");
rep('<div class="sub">第二章 · 分心花田 —— 一次，只做一件事</div>',
    '<div class="sub">第三章 · 遗忘迷宫 —— 合上书，才真的记住</div>');
rep('<div class="boss-name">多多 · 分心花田主</div>',
    '<div class="boss-name">忘忘 · 遗忘迷宫主</div>');
rep('card.appendChild(el("div","page-sub","第二章 · 分心花田 —— 完"));',
    'card.appendChild(el("div","page-sub","第三章 · 遗忘迷宫 —— 完"));');
rep('if(r==="A")return "过关了。花田里不只有花，还有没说出口的话。";',
    'if(r==="A")return "过关了。迷宫里不只有路，还有没想起来的事。";');
rep('return "也走出了花田。下次，试着先把队友的话听完。";',
    'return "也走出了迷宫。下次，试着先把想不起来的说出来。";');
rep('cc.appendChild(el("div","note-sec","第二章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","第三章诞生。公约会随章节累积，章末统一收录。"));');

/* ============ 2. CSS 主题：花园 → 方块世界（深蓝灰 + 石砖） ============ */
s = s.replace(/--bg:#[0-9a-f]+; --bg2:#[0-9a-f]+; --panel:#[0-9a-f]+; --panel2:#[0-9a-f]+; --line:#[0-9a-f]+;/,
  "--bg:#0b1118; --bg2:#111a24; --panel:#17222e; --panel2:#1e2c3a; --line:#2c3d4e;");
s = s.replace(/--text:#[0-9a-f]+; --dim:#[0-9a-f]+;/, "--text:#e8f0f6; --dim:#9fb3c4;");
/* 粒子：花瓣 → 方块碎片 */
rep('.petalp{position:absolute;border-radius:50% 0 50% 50%;pointer-events:none;opacity:.9}',
    '.petalp{position:absolute;border-radius:50% 0 50% 50%;pointer-events:none;opacity:.9}\n.blockp{position:absolute;border-radius:3px;pointer-events:none;opacity:.9}');
rep('el("i","petalp")', 'el("i","blockp")');

/* ============ 3. 角色技能绑定 ============ */
rep('skills:["micro","single","recode"]', 'skills:["micro","interleave"]');
rep('skills:["anchor","monitor","trigger"]', 'skills:["retrieve","monitor"]');
rep('skills:["tomato","monitor","micro"]', 'skills:["sleep","monitor"]');
rep('skills:["mark","tomato","recode"]', 'skills:["spacing","mark"]');
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","多多":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","忘忘":"boss","四人":"all"};');

/* ============ 4. SKILLS ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  interleave:{name:"交错练习",owner:"song",',
'           one:"同一段时间里，换着练几种。别一种练到底。",',
'           mantra:"「换着来，脑子才醒着。」",',
'           why:"大脑要先认出「这是哪一种」，才会真的记住。一直练同一种，它只靠惯性；换着来，它得动脑分辨。",',
'           cross:"练拍球，练一会儿换跳绳，再回来拍——比一口气拍一小时记得牢。"},',
'  retrieve:{name:"主动提取",owner:"jiu",',
'           one:"合上书，先自己想一遍。想不起来，再翻。",',
'           mantra:"「先想一遍，再翻书。」",',
'           why:"看十遍，不如合上书想一遍。想不起来的那一下，才是在真的记住。",',
'           cross:"看完一本故事书，合上，讲给同伴听——讲不出的那段，就是下次要看的那段。"},',
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
'  spacing:{name:"间隔重复",owner:"shan",',
'           one:"在要记住的地方留个记号，隔一会儿再回来看一眼。",',
'           mantra:"「隔一段，再见一面。」",',
'           why:"刚记住就丢开，忘得最快。隔一段时间再认一次，每认一次，就记得久一点。",',
'           cross:"路边的树，天天见就认得；隔几天再去看一眼，才真的记住是哪一棵。"},',
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
'  {name:"闭眼回想",members:["sleep","retrieve"],',
'   desc:"睡眠存档（眠）＋主动提取（究）——睡一觉存档，醒来合上书想一遍。跨角色组合技，两人以上才发得动。"},',
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
'  {who:"眠眠",text:"这块砖……我见过。"},',
'  {who:"松松",text:"门在哪儿！我要出去！"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松掏出那张折得四四方方的笔记。「先做第一步——到哪儿都管用。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {anim:"march"},',
'  {who:"究究",text:"砖墙上……有门。"},',
'  {who:"眠眠",text:"走进去，路就没了。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"迷宫里，四条岔路。你先走向谁？",options:[',
'  {t:"走向松松——他在三条岔路上来回跑",next:"a1",branch:"A",',
'   after:[{act:"三趟跑完，一条也没走通。"},{who:"松松",text:"这条！不对，那条！"}]},',
'  {t:"走向眠眠——她靠着砖墙打瞌睡",next:"b1",branch:"B",',
'   after:[{act:"她的记录本越写越乱。"},{who:"眠眠",text:"我再记一个路口……"}]},',
'  {t:"走向究究——他抱着图鉴，不肯合上",next:"c1",branch:"C",',
'   after:[{act:"图鉴翻了一页，又翻回去。"},{who:"究究",text:"明明写着……"}]},',
'  {t:"走向闪闪——她在路口蹲下，画了个记号",next:"d1",branch:"D",',
'   after:[{act:"那么暗，她居然看得见砖缝。"},{who:"你",text:"闪闪，你画什么？"}]}',
' ]},',
'',
' /* ---- A 线 · 松松：交错练习 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"这条！不对，那条！"},',
'  {who:"眠眠",text:"跑了三趟，一条也没走完。"}',
' ]},',
' a2:{kind:"skill",skill:"interleave",lead:"松松把三条岔路在掌心排开：「一、二、三——换着走。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"松松挠头：「换着走……不就乱了吗？」你说：",options:[',
'  {t:"「换着走，脑子才醒着。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"松松",text:"（写下一二三）……换着来！"}]},',
'  {t:"「一条走到底，才记得住。」",next:"conv",trust:2,',
'   after:[{act:"松松点点头，又跑回了第一条。"}]},',
'  {t:"「你这样哪条都记不住。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"松松停在岔口，三条路全模糊了。"}]}',
' ]},',
'',
' /* ---- B 线 · 眠眠：睡眠存档 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"眠眠",text:"再记一个路口……"},',
'  {who:"眠眠",text:"……眼皮好重。"},',
'  {who:"松松",text:"你已经记错三次啦！"}',
' ]},',
' b2:{kind:"skill",skill:"sleep",lead:"眠眠把记录本合上，抱在怀里：「先睡一觉。醒来，路还在。」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"眠眠小声说：「睡着了……会不会全忘了？」你说：",options:[',
'  {t:"「睡着了，脑子才在存档。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（抱紧本子）……那我睡了。"}]},',
'  {t:"「我替你记着！」",next:"conv",trust:3,',
'   after:[{act:"眠眠点点头，又把本子翻开一页。"}]},',
'  {t:"「忘了就白记了。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠揉揉眼睛，继续硬撑着记。"}]}',
' ]},',
'',
' /* ---- C 线 · 究究：主动提取（本章社交困境核心） ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"究究",text:"图鉴上写着……第三条。"},',
'  {who:"究究",text:"（翻页）……写着什么来着。"},',
'  {who:"闪闪",text:"（小声）……他一直没抬头。"}',
' ]},',
' c2:{kind:"skill",skill:"retrieve",lead:"究究把图鉴扣在腿上：「合上，自己想一遍。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"究究推推眼镜：「合上了……我怕想错。」你说：",options:[',
'  {t:"「想错了，也记得更牢。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"究究",text:"（闭上眼）……第三条。记住了。"}]},',
'  {t:"「那你就再看一眼。」",next:"conv",trust:2,',
'   after:[{act:"究究又翻开一页，图鉴更厚了。"}]},',
'  {t:"「这都记不住？」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"究究的图鉴，悄悄合上了。"}]}',
' ]},',
'',
' /* ---- D 线 · 闪闪：间隔重复 ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"闪闪",text:"这个路口……我画了。"},',
'  {who:"闪闪",text:"画过吗？……记不清。"}',
' ]},',
' d2:{kind:"skill",skill:"spacing",lead:"闪闪在砖上画了个圈：「隔一会儿，再回来看一眼。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"松松催：「闪闪，记号有啥用？走啊！」你说：",options:[',
'  {t:"「隔一段，再见一面。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（画完最后一笔）……好。"}]},',
'  {t:"「多画几个记号！」",next:"conv",trust:2,',
'   after:[{act:"闪闪画满一墙，自己也认不出了。"}]},',
'  {t:"「别画了，来不及。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪停笔，把粉笔收进口袋。"}]}',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"忘忘",text:"走过的路……都不算数。"},',
'  {who:"究究",text:"它靠「记不住」活着。"},',
'  {who:"松松",text:"那就想起来！出招！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"忘忘",text:"你们……居然记得……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"究究",text:"合上书……就忘了。"},',
'  {who:"四人",text:"记不住，不丢人！"},',
'  {who:"四人",text:"说出来，才记得住！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 7. ROUNDS ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 雾锁回廊",rk:"fog",',
'  bossLine:"「哪条路来着？……忘了吧。」雾从砖缝里渗出来，回廊开始变形。",',
'  valid:["micro","retrieve"],',
'  ease:"眠眠：雾里要靠「想」——先迈一小步，或者合上书自己想一遍。"},',
' {name:"第 2 回合 · 方块塌落",rk:"fall",',
'  bossLine:"「这块，你没记住。」脚下的砖，一块块塌下去。",',
'  valid:["interleave","spacing","sleep","monitor","retrieve"],',
'  ease:"眠眠：路在塌，要用「换」和「隔」——换着走、留记号，撑不住就先睡一觉。"},',
' {name:"第 3 回合 · 忘忘之核",rk:"core",',
'  bossLine:"「记住又怎样？明天你们还是会忘！」",',
'  valid:"COMBO",',
'  ease:"眠眠：这一下，一个人拦不住。找一位队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 8. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' fog:{',
'  micro:["把「走出回廊」切成五秒一步——先，踩稳下一块砖。雾扑了个空。"],',
'  retrieve:["「合上书，自己想一遍。」闭眼——第三条路，左转。雾散了一格。"],',
'  miss:["眠眠：「再想一招。小到不可能失败，或者合上书先想一遍。」"]',
' },',
' fall:{',
'  interleave:["三条岔路换着走：一、二、三——砖块认出了脚下的节奏。"],',
'  spacing:["闪闪留下的记号亮了一下——隔一段再见一面，路就还在。"],',
'  sleep:["眠眠合上记录本：「先睡一觉。」醒来，塌掉的砖回来了。"],',
'  monitor:["眠眠先看了一眼电量：撑不住的地方，绕开就好。"],',
'  retrieve:["「合上书，想一遍。」想不起来的那块砖反而回来了——那才是真记住的地方。"],',
'  miss:["眠眠：「路在塌，要用「换」和「隔」——再想一招。」"]',
' },',
' core:{',
'  single:["忘忘抖落一地砖块：「一个人……记不住我……」身后伸过来一只手。"],',
'  same:["两股相同的力气撞在一起，互相抵消。眠眠：「两个人，两个法子——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 9. COMBO_LINES / NAMES / FALLBACK / BORROW ============ */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "micro+retrieve"    :["松松先迈五秒一步，究究合上书想了一遍。","脚下的砖，和脑子里的路，对上了。"],',
' "micro+sleep"       :["先迈一步，再睡一觉存档。","小小的一步，被好好收进了抽屉。"],',
' "micro+monitor"     :["眠眠报电量，松松只迈一步。","一步，一电，咬合成同一个齿轮。"],',
' "micro+spacing"     :["松松迈步，闪闪在路上留了个记号。","走过的路，隔一段还会再见一面。"],',
' "mark+micro"        :["闪闪标出松动的砖，松松一步跨过去。","会塌的地方，被一脚踩过去了。"],',
' "interleave+retrieve":["三条路换着走，走完再合上眼想一遍。","换着来，再想一遍——忘忘抓不住了。"],',
' "interleave+sleep"  :["换着走三条路，然后睡一觉存档。","醒来的第一件事：路还记得。"],',
' "interleave+monitor":["眠眠看条，松松换着走。","电量够走到哪儿，就走到哪儿。"],',
' "interleave+spacing":["换着走，每个岔口都留一个记号。","三条路，三种记号——全认得。"],',
' "interleave+mark"   :["闪闪标出哪块砖松，松松换着踩。","换着来的脚步，正好绕开了破绽。"],',
' "retrieve+sleep"    :["究究合上书想了一遍，眠眠说：睡一觉再存档。","闭上眼，路被收进长期的抽屉——组合技「闭眼回想」！"],',
' "monitor+retrieve"  :["先看电量，再合上书想一遍。","不硬撑的那一遍，记得最牢。"],',
' "retrieve+spacing"  :["合上书想一遍，再在路口留个记号。","想过的，和留下的，对上同一个岔口。"],',
' "mark+retrieve"     :["闪闪标出哪块砖空，究究合眼一想。","空掉的那块，被想了回来。"],',
' "sleep+spacing"     :["睡一觉存档，醒来回头再看一眼记号。","隔一段再见一面——这次真的记住了。"],',
' "mark+sleep"        :["闪闪标出要记的，眠眠负责存档。","标记过的地方，睡着也不会丢。"],',
' "monitor+spacing"   :["眠眠看条，闪闪留记号。","不硬撑，也不丢路。"],',
' "mark+monitor"      :["闪闪点出破绽，眠眠看条。","破绽照到了，电量也省下了。"]',
'};',
'var COMBO_NAMES={',
' "micro+retrieve":"一步一想","micro+sleep":"一步一档","micro+monitor":"一步一电","micro+spacing":"一步一记",',
' "mark+micro":"踩点破绽","interleave+retrieve":"换路回想","interleave+sleep":"换路存档",',
' "interleave+monitor":"换路看条","interleave+spacing":"换路留记","interleave+mark":"换路点灯",',
' "retrieve+sleep":"闭眼回想","monitor+retrieve":"看条回想","retrieve+spacing":"回想留记",',
' "mark+retrieve":"点亮回想","sleep+spacing":"存档留记","mark+sleep":"点亮存档",',
' "monitor+spacing":"看条留记","mark+monitor":"点灯看条"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力量，在半空咬合成一个齿轮。","忘忘的砖块，被正式吹散。"];',
'var BORROW_ORDER=["monitor","mark","sleep","spacing","interleave"];',
'var BORROW_LINE={',
' mian:"眠眠：「我的记录本和钟都借你们——先看电量，困了就睡一觉存档。」",',
' shan:"闪闪：「我把要记住的地方留个记号。你们，尽管出手。」",',
' jiu :"究究：「合上书，自己想一遍——想不起来的那段，就是关键。」",',
' song:"松松：「「交错练习」借你们！换着来，脑子才醒着！」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 10. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"maze",t:"迷宫",e:"🧱"},{k:"boss",t:"Boss",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 11. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch2_save_v1";', 'var SAVE_KEY="brainexp_ch3_save_v1";');
rep('var BEST_KEY="brainexp_ch2_best_v1";', 'var BEST_KEY="brainexp_ch3_best_v1";');
/* 标题页继承前两章记录 */
rep('  var prev=null;\n  try{prev=JSON.parse(localStorage.getItem("brainexp_ch1_best_v3"));}catch(e){}\n  if(prev)html+=(html?"<br>":"")+"🏅 已继承第一章：「拖延沼泽」最佳 <b>"+prev.rating+"</b> · "+prev.diff;',
    '  var p1=null;\n  try{p1=JSON.parse(localStorage.getItem("brainexp_ch1_best_v3"));}catch(e){}\n  if(p1)html+=(html?"<br>":"")+"🏅 已继承第一章：「拖延沼泽」最佳 <b>"+p1.rating+"</b> · "+p1.diff;\n  var p2=null;\n  try{p2=JSON.parse(localStorage.getItem("brainexp_ch2_best_v1"));}catch(e){}\n  if(p2)html+=(html?"<br>":"")+"🏅 已继承第二章：「分心花田」最佳 <b>"+p2.rating+"</b> · "+p2.diff;');

/* ============ 12. 新技能图腾（方块世界风） ============ */
var TOTEM_ADD = [
'TOTEM_ART.interleave=\'<rect x="6" y="10" width="15" height="6" rx="2" fill="TOT"/><rect x="15" y="21" width="27" height="6" rx="2" fill="TOT" opacity=".72"/><rect x="6" y="32" width="21" height="6" rx="2" fill="TOT" opacity=".45"/>\';',
'TOTEM_ART.retrieve=\'<path d="M9 12h13v24H9z" fill="none" stroke="TOT" stroke-width="3.5"/><path d="M22 12v24" stroke="TOT" stroke-width="3.5"/><path d="M28 20l8 4-8 4" fill="none" stroke="TOT" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>\';',
'TOTEM_ART.sleep=\'<path d="M16 9a12 12 0 1 0 9 20A14 14 0 0 1 16 9z" fill="none" stroke="TOT" stroke-width="3.5" stroke-linejoin="round"/><path d="M30 24h11M30 31h8M30 38h11" stroke="TOT" stroke-width="3" stroke-linecap="round"/>\';',
'TOTEM_ART.spacing=\'<circle cx="9" cy="27" r="4.6" fill="TOT"/><circle cx="24" cy="27" r="4.6" fill="TOT" opacity=".72"/><circle cx="39" cy="27" r="4.6" fill="TOT" opacity=".45"/><path d="M9 17v-7M24 17v-7M39 17v-7" stroke="TOT" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 13. Boss 忘忘（遗忘方块魔） ============ */
var BOSS_BLOCK = [
'/* ---- Boss 忘忘（遗忘方块魔 · 身上全是记忆缺口） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+46*Math.cos(a)).toFixed(1), py=(54+37*Math.sin(a)).toFixed(1);',
'    chips+=\'<rect x="\'+px+\'" y="\'+py+\'" width="12" height="12" rx="1.5" fill="\'+(i%2?"#d6e4f0":"#f0d68a")+\'" transform="rotate(\'+(i*35)+\' \'+px+\' \'+py+\')"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<defs><radialGradient id="bgw" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(240,180,90,.40)"/><stop offset="1" stop-color="rgba(240,180,90,0)"/></radialGradient></defs>\'+',
'  \'<ellipse cx="60" cy="56" rx="58" ry="54" fill="url(#bgw)"/>\'+',
'  \'<ellipse cx="60" cy="103" rx="47" ry="7" fill="rgba(0,0,0,.5)"/>\'+',
'  \'<path d="M32 98 q-9 5 -20 5 M88 98 q9 5 20 5" stroke="#46596b" stroke-width="7" fill="none" stroke-linecap="round"/>\'+',
'  \'<rect x="0" y="48" width="24" height="19" rx="3" fill="#58708a" transform="rotate(-14 12 57)"/>\'+',
'  \'<rect x="96" y="48" width="24" height="19" rx="3" fill="#58708a" transform="rotate(14 108 57)"/>\'+',
'  \'<rect x="33" y="0" width="11" height="17" rx="1" fill="#93aec4"/><rect x="76" y="0" width="11" height="17" rx="1" fill="#93aec4"/>\'+',
'  \'<rect x="33" y="0" width="11" height="5" rx="1" fill="#f0d68a"/><rect x="76" y="0" width="11" height="5" rx="1" fill="#f0d68a"/>\'+',
'  \'<rect x="14" y="14" width="92" height="86" rx="8" fill="#7d97ae" stroke="#2b3644" stroke-width="3"/>\'+',
'  \'<rect x="14" y="14" width="92" height="86" rx="8" fill="none" stroke="rgba(240,214,138,.5)" stroke-width="2"/>\'+',
'  \'<rect x="17" y="17" width="86" height="9" rx="4" fill="#93aec4"/>\'+',
'  \'<rect x="20" y="74" width="15" height="15" rx="2" fill="#0e161f"/><rect x="20" y="74" width="15" height="15" rx="2" fill="none" stroke="rgba(240,214,138,.55)" stroke-width="1.6"/>\'+',
'  \'<rect x="85" y="74" width="15" height="15" rx="2" fill="#0e161f"/><rect x="85" y="74" width="15" height="15" rx="2" fill="none" stroke="rgba(240,214,138,.55)" stroke-width="1.6"/>\'+',
'  \'<rect x="48" y="86" width="12" height="12" rx="2" fill="#0e161f"/><rect x="48" y="86" width="12" height="12" rx="2" fill="none" stroke="rgba(240,214,138,.55)" stroke-width="1.6"/>\'+',
'  \'<rect x="30" y="30" width="26" height="18" rx="2" fill="#f6fafd" stroke="#22303c" stroke-width="2.5"/><rect x="39" y="36" width="9" height="8" fill="#d8b45a"/>\'+',
'  \'<rect x="64" y="30" width="26" height="18" rx="2" fill="#f6fafd" stroke="#22303c" stroke-width="2.5"/><rect x="73" y="36" width="9" height="8" fill="#d8b45a"/>\'+',
'  \'<rect x="44" y="56" width="32" height="9" rx="4" fill="#0e161f"/><rect x="51" y="59" width="18" height="3" rx="1.5" fill="#8a4a52"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><rect x="12" y="10" width="7" height="7" rx="1" fill="#9fb6c9"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><rect x="104" y="24" width="6" height="6" rx="1" fill="#9fb6c9"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:2.5s"><rect x="24" y="92" width="6" height="6" rx="1" fill="#f0d68a"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 多多（分心树精 · 花钟面孔） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 14. 场景插画：方块迷宫 ============ */
var SCENE_BLOCK = [
'/* ---- 场景插画（方块世界 · 迷宫） ---- */',
'var PAVERS=[[150,318],[228,300],[306,295],[386,281],[464,267],[542,257],[624,247]];',
'function sceneKindOf(id){',
'  if(id==="i1"||id==="i2")return "camp";',
'  if(id==="w1"||id==="w2"||id==="w3")return "clear";',
'  return "maze";',
'}',
'function sceneSVG(kind){',
'  var clear=(kind==="clear"), camp=(kind==="camp"), maze=!clear&&!camp;',
'  var sky1=camp?"#1b2a38":(clear?"#334b62":"#253546"), sky2=camp?"#0a1118":(clear?"#17242f":"#0d151d");',
'  var ground1=clear?"#31465a":"#1f2d3b";',
'  var sid="sk"+kind;',
'  var body="";',
'  if(camp){',
'    body+=\'<g opacity=".92"><path d="M0 252 L0 196 L64 196 L64 170 L140 170 L140 204 L216 204 L216 180 L296 180 L296 252 Z" fill="#0e1a24"/><path d="M584 252 L584 186 L658 186 L658 166 L742 166 L742 198 L824 198 L824 252 Z" fill="#0e1a24"/></g>\';',
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#16222f"/><rect x="0" y="250" width="880" height="6" fill="#2b3f52"/>\';',
'    for(var r=0;r<3;r++){',
'      body+=\'<path d="M0 \'+(266+r*30)+\' h880" stroke="rgba(255,255,255,.09)" stroke-width="2"/>\';',
'      for(var c=0;c<12;c++){',
'        body+=\'<path d="M\'+(c*76+(r%2?38:0))+\' \'+(266+r*30)+\' v30" stroke="rgba(255,255,255,.09)" stroke-width="2"/>\';',
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
'    body+=\'<ellipse cx="220" cy="274" rx="100" ry="17" fill="rgba(180,210,235,.07)" class="fogA"/>\';',
'  }else{',
'    body+=\'<rect x="0" y="238" width="880" height="142" fill="\'+ground1+\'"/>\';',
'    for(var w=0;w<21;w++){',
'      for(var h=0;h<4;h++){',
'        var bx=w*44+(h%2?22:0), by=92+h*30;',
'        if(bx>880)continue;',
'        var tone=(w+h)%4===0?"#33465a":((w+h)%4===1?"#2b3c4c":((w+h)%4===2?"#243442":"#1e2c39"));',
'        body+=\'<rect x="\'+bx+\'" y="\'+by+\'" width="41" height="27" rx="2" fill="\'+tone+\'"/>\';',
'      }',
'    }',
'    body+=\'<rect x="0" y="212" width="880" height="30" fill="rgba(10,17,24,.45)"/>\';',
'    body+=\'<rect x="384" y="146" width="112" height="106" fill="#0c141c" stroke="\'+(clear?"#f0d68a":"#4a6076")+\'" stroke-width="5"/>\';',
'    body+=\'<rect x="398" y="160" width="84" height="92" fill="url(#\'+sid+\'portal)" opacity="\'+(clear?"1":".75")+\'"/>\';',
'    if(clear)body+=\'<rect x="398" y="160" width="84" height="92" fill="rgba(240,214,138,.18)"/><rect x="384" y="146" width="112" height="106" fill="none" stroke="rgba(240,214,138,.35)" stroke-width="12"/>\';',
'    body+=\'<rect x="52" y="104" width="34" height="146" fill="#2b3a4a"/><rect x="52" y="104" width="34" height="11" fill="#3a4d5f"/>\';',
'    body+=\'<rect x="794" y="104" width="34" height="146" fill="#2b3a4a"/><rect x="794" y="104" width="34" height="11" fill="#3a4d5f"/>\';',
'    body+=\'<path d="M86 250 L384 250 M496 250 L794 250" stroke="rgba(255,255,255,.06)" stroke-width="3"/>\';',
'    var pv="";',
'    PAVERS.forEach(function(p,i){',
'      var hl=(maze&&i===2), dy=clear?-10:0, pw=52+i*4;',
'      pv+=\'<rect x="\'+(p[0]-pw/2)+\'" y="\'+(p[1]+dy-8)+\'" width="\'+pw+\'" height="20" rx="3" fill="\'+(hl?"#7b93aa":(clear?"#3d5468":"#32465a"))+\'" stroke="#16212c" stroke-width="1.5"\'+(hl?\' class="stone-hl"\':\'\')+\'/>\';',
'      pv+=\'<rect x="\'+(p[0]-pw/2+4)+\'" y="\'+(p[1]+dy-6)+\'" width="\'+(pw-8)+\'" height="4" rx="2" fill="rgba(255,255,255,.09)"/>\';',
'    });',
'    body+=pv;',
'    if(maze){',
'      body+=\'<ellipse cx="440" cy="250" rx="370" ry="52" fill="rgba(170,200,225,.16)" class="fogA"/>\';',
'      body+=\'<ellipse cx="230" cy="276" rx="160" ry="34" fill="rgba(170,200,225,.12)" class="fogB"/>\';',
'      body+=\'<ellipse cx="660" cy="268" rx="130" ry="26" fill="rgba(170,200,225,.09)" class="fogA"/>\';',
'    }else{',
'      body+=\'<g class="flower"><rect x="298" y="250" width="9" height="9" rx="2" fill="#e0a8b8"/><rect x="540" y="226" width="9" height="9" rx="2" fill="#f0d68a"/><rect x="222" y="264" width="9" height="9" rx="2" fill="#c9a2e0"/><rect x="662" y="274" width="8" height="8" rx="2" fill="#e0a8b8"/></g>\';',
'    }',
'  }',
'  var skyBlocks=[[64,58,17],[148,38,11],[262,78,13],[352,34,9],[470,62,16],[566,40,10],[662,92,13],[766,48,15],[846,104,10],[196,116,8],[600,124,9]];',
'  var skyG="";',
'  skyBlocks.forEach(function(b,i){',
'    skyG+=\'<rect x="\'+b[0]+\'" y="\'+b[1]+\'" width="\'+b[2]+\'" height="\'+b[2]+\'" rx="2" fill="\'+(i%3===0?"#33465a":(i%3===1?"#263647":"#3f5468"))+\'" opacity="\'+(0.35+(i%4)*0.14).toFixed(2)+\'"/>\';',
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
swapRange("var STONES=", "/* ---- 营地横幅", SCENE_BLOCK);

/* 结算墙连招名数据驱动（原硬编码「先看再走」） */
rep('[["小队公约","pact"],["连招 · 先看再走","combo"]]', '[["小队公约","pact"],["连招 · "+COMBOS[0].name,"combo"]]');

/* 结算页分支名（Ch2 遗留）→ Ch3 分支 */
rep('var m={A:"A线 · 先听30秒",B:"B线 · 一起冲",C:"C线 · 让闪闪说",D:"D线 · 听眠眠的"};',
    'var m={A:"A线 · 换着走",B:"B线 · 先睡一觉",C:"C线 · 合上书想",D:"D线 · 留个记号"};');
/* 眠眠的观察 → 本章主题 */
rep('return "「以后谁再使唤我，我就说——『等等，我先问问自己的钟。』」";',
    'return "「以后谁问我『记不记得』，我就先合上书，自己说一遍。」";');

/* ============ 15. 战斗场景背景：field → maze ============ */
rep('bg.insertAdjacentHTML("afterbegin",sceneSVG("field"));',
    'bg.insertAdjacentHTML("afterbegin",sceneSVG("maze"));');
/* R3 分支硬编码 REPLAY.curse（Ch2 遗留）→ 改为数据驱动 rk */
rep('REPLAY.curse.single', 'REPLAY[rk].single');
rep('REPLAY.curse.same', 'REPLAY[rk].same');

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
