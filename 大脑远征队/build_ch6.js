/* Ch6 构建：从 Ch5 静态源码(_ch6_base.html)换数据 → Ch6-语言风暴.html
 * 章节主题：竞技世界 · 语言篇（语言风暴 / 回声谷 + 擂台）
 * 新技能：情绪重评(reappraise) 核心第20项 + 语言力量(lang) 扩展系统首次落地 —— 闪闪主场
 * 社交困境：签签往身上贴标签「慢/笨/不行」，闪闪学会撕标签、换个说法；章末公约「贴在我身上的标签，我可以不认领」「把『我不行』说成『我正在学』」
 * 学业铁律：后段章节(Ch5-8)才正式引入学习场景，但本期仍以生活例子为主（骑车/搭积木/跳绳），不突兀
 * 反卡死：R1/R2 有效池必含 micro（引擎开局人手一张）+ 各分支技能；R3=COMBO 任意两不同角色。分支 owner = 松/究/闪/眠 四个不同角色，COMBO 极稳
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch6_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch6-语言风暴.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 第五章「否定斗技场」</title>',
    '<title>大脑远征队 · 第六章「语言风暴」</title>');
rep('<div class="sub">第五章 · 否定斗技场 —— 脑子里的「我不行」，是个会变大变小的小怪</div>',
    '<div class="sub">第六章 · 语言风暴 —— 脑子里的声音会贴标签，也能改写台词</div>');
rep('<div class="boss-name">否否 · 否定斗技场主</div>',
    '<div class="boss-name">签签 · 贴标签主</div>');
rep('card.appendChild(el("div","page-sub","第五章 · 否定斗技场 —— 完"));',
    'card.appendChild(el("div","page-sub","第六章 · 语言风暴 —— 完"));');
rep('if(r==="A")return "过关了。斗技场里不只有掌声，还有你没说出口的「我还不行」。";',
    'if(r==="A")return "过关了。回声谷里不只有回声，还有你撕下来的那张标签。";');
rep('return "也走出了斗技场。下次，心里冒出「我不行」，先改成「我还不行」。";',
    'return "也走出了回声谷。下次，贴在身上的话，先问问：这是我的吗？";');
rep('cc.appendChild(el("div","note-sec","第五章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","第六章诞生。公约会随章节累积，章末统一收录。"));');

/* ============ 2. CSS 主题：沿用 Ch5 竞技暗夜（竞技世界 Ch5-7 同皮），仅改场景文案 ============ */
/* 场景横幅：斗技场 → 回声谷；擂台 → 回声 */
rep('否定斗技场 · 准备区', '语言风暴 · 回声谷');
rep('擂 台', '回 声');

/* ============ 3. 角色技能绑定（NAME2KEY：boss 改名签签） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","否否":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","签签":"boss","四人":"all"};');

/* ============ 4. SKILLS（6 个：micro/reprog/selfexplain/reappraise/monitor 5 项沿用/新 + lang 扩展） ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  reprog :{name:"认知重编程",owner:"song",',
'           one:"把脑子里的旧脚本，改写一遍——「我做不到」写成「我正在学」。",',
'           mantra:"「把旧台词，改成新台词。」",',
'           why:"脑子里的声音是练出来的习惯。你没法让它闭嘴，但可以改写它说的话——一句一句换。",',
'           cross:"骑车摔了，旧脚本喊『我不行』；改写下：『我正在学，多摔几次就会。』"},',
'  selfexplain:{name:"自我解释",owner:"jiu",',
'           one:"一边做一边问自己「为什么这一步要这样」。",',
'           mantra:"「问一句为什么，再走下一步。」",',
'           why:"只照着样子做，换个花样就不会了；说出「为什么」，学到的是法子，不是样子。",',
'           cross:"搭积木时念一句「为什么这块要放下面」——下次换个形状，也搭得起来。"},',
'  reappraise:{name:"情绪重评",owner:"shan",',
'           one:"换个说法看这件事——不是针对我，是我还没准备好。",',
'           mantra:"「不是不行，是还没准备好。」",',
'           why:"同一件事，换个讲法，心里的感觉就变了。情绪重评不是骗自己，是换个更准的镜头。",',
'           cross:"被说「慢」，旧镜头觉得「我差」；重评：『我慢，是因为我认真。』"},',
'  monitor:{name:"状态监控",owner:"mian",',
'           one:"随时看一眼自己的「体力条」，累了就补给，不硬撑。",',
'           mantra:"「先看电量，再决定冲不冲。」",',
'           why:"手机没电会提醒你，人累了却不会。学会自己看电量，才不会在关键时刻突然关机。",',
'           cross:"跳绳跳着开始大喘气？那是身体在亮黄灯：该歇会儿啦。"},',
'  lang   :{name:"语言力量",owner:"shan",exp:"扩展",',
'           one:"你说出口的话，会变成心里的天气——把「我不行」说成「我正在学」。",',
'           mantra:"「一句话，能换一片天。」",',
'           why:"语言不是镜子，是画笔。同样的事，换个说法，心情和结果都跟着变。这一章学的所有招，背后都是语言力量。",',
'           cross:"把『我必须考好』改成『我尽力就行』——肩膀一下子轻了。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 5. COMBOS ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"换个说法",members:["reappraise","selfexplain"],',
'   desc:"情绪重评（闪）＋自我解释（究）——撕下贴在身上的标签，再把那件事说出来问一句为什么。签签最怕你既撕标签又讲清楚。"},',
'  {name:"先说再做",members:["reprog","monitor"],locked:true,',
'   desc:"认知重编程（松）＋状态监控（眠）——后续章节解锁。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 6. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"闪闪",text:"（小声）这里的声音……会弹回来。"},',
'  {who:"松松",text:"回声谷！谁先开口？"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松按住闪闪的肩：「先把想说的话，拆成一小句——到哪儿都管用。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {anim:"march"},',
'  {who:"闪闪",text:"（低头）……他们是不是在说我笨。"},',
'  {who:"究究",text:"你先别接那个词。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"签签开始往你身上贴标签：『慢』『笨』『不行』。你先接住哪一张？",options:[',
'  {t:"把「我不行」拆成「我先试一下」",next:"a1",branch:"A",',
'   after:[{act:"松松：先迈一步，话也能一小句说。"},{who:"松松",text:"先把那句大话，切小。"}]},',
'  {t:"把那句「我笨」说出来，问一句为什么",next:"b1",branch:"B",',
'   after:[{act:"究究：说出口，才看得清。"},{who:"究究",text:"为什么你会这么想？"}]},',
'  {t:"把标签撕下来，换个说法",next:"c1",branch:"C",',
'   after:[{act:"闪闪把一张标签撕了下来。"},{who:"闪闪",text:"（撕下）这不是我的。"}]},',
'  {t:"先看一眼电量——你不是没电",next:"d1",branch:"D",',
'   after:[{act:"眠眠举起记录本。"},{who:"眠眠",text:"标签贴的是心情，不是你。"}]}',
' ]},',
'',
' /* ---- A 线 · 认知重编程 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"先把那句大话，切小。"},',
'  {who:"闪闪",text:"我先试一下……"}',
' ]},',
' a2:{kind:"skill",skill:"reprog",lead:"松松在掌心写下一行新台词：「把脑子里的旧脚本，改写一遍——『我做不到』写成『我正在学』。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"闪闪还是低头：「可我就是笨啊。」你说：",options:[',
'  {t:"「笨，是因为你认真。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（抬头）……我是认真。"}]},',
'  {t:"「那你就认了吧。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把标签又贴回去了。"}]},',
'  {t:"「笨就笨，算了。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪叹了口气，没再撕。"}]}',
' ]},',
'',
' /* ---- B 线 · 自我解释 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"究究",text:"为什么你会这么想？"},',
'  {who:"闪闪",text:"因为……他们都说我慢。"}',
' ]},',
' b2:{kind:"skill",skill:"selfexplain",lead:"究究：「自我解释——把那句说出来，再问一句为什么。慢，不等于差。」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"闪闪摇头：「可慢就是慢啊。」你说：",options:[',
'  {t:"「慢，是因为你每一步都看清楚了。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（点头）……我是看清楚了。"}]},',
'  {t:"「慢就慢吧。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把话咽了回去。"}]},',
'  {t:"「慢就是差。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪低下头，不再说话。"}]}',
' ]},',
'',
' /* ---- C 线 · 情绪重评 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"闪闪",text:"（撕下）这不是我的。"},',
'  {who:"松松",text:"对，标签是你撕下的，不是你。"}',
' ]},',
' c2:{kind:"skill",skill:"reappraise",lead:"闪闪把标签翻过来：「情绪重评——换个说法看这件事。不是我不行，是我还没准备好。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"闪闪还是皱眉：「可这句话太重了。」你说：",options:[',
'  {t:"「重，是因为你当真了——换个轻的镜头。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（深呼吸）……换个镜头。"}]},',
'  {t:"「重就扛着吧。」",next:"conv",trust:2,',
'   after:[{act:"闪闪又把标签贴回胸口。"}]},',
'  {t:"「重说明你确实差。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪把标签按进心里。"}]}',
' ]},',
'',
' /* ---- D 线 · 团队相信（眠眠·状态监控） ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"眠眠",text:"标签贴的是心情，不是你。"},',
'  {who:"松松",text:"先看电量，再决定信不信。"}',
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
'  {who:"签签",text:"慢！笨！不行！"},',
'  {who:"闪闪",text:"（退半步）……"},',
'  {who:"松松",text:"别退，撕下那张标签！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"签签",text:"你们……居然把我撕下来了……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"闪闪",text:"贴在我身上的标签，我可以不认领。"},',
'  {who:"四人",text:"「贴在我身上的标签，我可以选择不认领！」"},',
'  {who:"四人",text:"把「我不行」说成「我正在学」——一句话就能换天气！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 7. ROUNDS（R1/R2 必含 micro+各分支技能，保证任何分支都不卡死；R3=COMBO 任意两不同角色） ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 回声",rk:"echo",',
'  bossLine:"「慢！笨！不行！」回声在谷里撞来撞去，越撞越大。",',
'  valid:["micro","reappraise","monitor","selfexplain","reprog","lang","mark"],',
'  ease:"闪闪：这一下，先改一句——或者先迈一小步。"},',
' {name:"第 2 回合 · 标签雨",rk:"tags",',
'  bossLine:"「就你？算了吧。」签签把一张张标签往你身上贴，黑压压一片。",',
'  valid:["micro","reappraise","monitor","selfexplain","reprog","lang","sleep","mark"],',
'  ease:"闪闪：这一下，用什么都行——撕不下那张，先顶回去。"},',
' {name:"第 3 回合 · 签签之核",rk:"core",',
'  bossLine:"「你就是不行！认了吧！」签签胀到最大，遮住了整片谷。",',
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
'  reprog:["把旧脚本改写：「我做不到」写成「我正在学」。回声被这句顶回去一半。"],',
'  reappraise:["把标签撕下来换个说法。回声里混进了你自己的声音。"],',
'  monitor:["眠眠先看了一眼电量：你不是没电，是没看。回声没了底气。"],',
'  selfexplain:["「问一句为什么。」越问越明白，回声被问出了形状。"],',
'  lang:["把那句「不行」说成「正在学」。回声变成了别的话。"],',
'  mark:["闪闪标出回声最响的那句——破绽一亮，回声散了。"],',
'  miss:["闪闪：「再想一招。先迈一小步，或者改一句台词。」"]',
' },',
' tags:{',
'  micro:["先迈一小步，标签跟着你动，反而没那么可怕了。"],',
'  reprog:["旧脚本被改写，签签贴下来的标签，字变了。"],',
'  reappraise:["把最黑的那张撕下来，换个说法。签签的手顿了顿。"],',
'  monitor:["眠眠报了电量：撑得住。标签看准了你的稳。"],',
'  selfexplain:["「问一句为什么。」越问越明白，标签被问出了缝。"],',
'  lang:["把「我差」说成「我在学」。签签贴歪了。"],',
'  sleep:["眠眠合上眼：「先睡一觉。」醒来，标签小了一圈。"],',
'  mark:["闪闪标出最黑的那块阴影——破绽亮起，标签裂了缝。"],',
'  miss:["闪闪：「用什么都行。撕不下那张，先顶回去——再想一招。」"]',
' },',
' core:{',
'  single:["签签抖了抖黑影：「一个人……顶不住我……」身后伸过来一只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两个法子——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 9. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 按字母序排序后用 "+" 连接（与引擎 b.sel.sort().join("+") 一致）
 * 共 13 条跨角色对（排除同角色：微+重编程 同松 / 情绪重评+语言力量 同闪） */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "lang+micro"      :["闪闪把「我不行」说成「我正在学」，松松接一句「先迈一步」。","一句换天，一步落地，签签的标签松了。"],',
' "lang+monitor"    :["闪闪改写台词，眠眠报上电量：「还有电。」","不信自己的时候，先看一眼真实的电量。"],',
' "lang+reprog"     :["「我正在学」说出口，松松把旧脚本划掉重写。","新台词盖住了旧台词。"],',
' "lang+selfexplain":["把「我差」说成「我在学」，究究问一句为什么。","换了说法，才问得清。"],',
' "micro+monitor"   :["眠眠报电量，松松只迈一步。","一步，一电，走得不慌。"],',
' "micro+reappraise":["松松迈一小步，闪闪把标签撕下来换个说法。","最小的步子，撕最轻的标签。"],',
' "micro+selfexplain":["先迈五秒一步，再问一句「为什么不行」。","最小的一步，也踩得清清楚楚。"],',
' "monitor+reappraise":["眠眠看条，闪闪撕标签换个说法。","稳住自己，再改写心情。"],',
' "monitor+reprog"  :["眠眠报电量，松松改写旧脚本。","不是没电，是没看——改写先从看一眼开始。"],',
' "monitor+selfexplain":["先看电量，再问一句为什么。","不硬撑着问，才问得明白。"],',
' "reappraise+reprog":["闪闪撕标签换说法，松松把旧脚本改写。","标签撕了，剧本也重写了。"],',
' "reappraise+selfexplain":["撕下标签换个说法，再问一句为什么。","换镜头，才问得清。"],',
' "reprog+selfexplain":["旧脚本改写一遍，再问一句为什么。","新剧本，问得更明白。"]',
'};',
'var COMBO_NAMES={',
' "lang+micro":"一语一步","lang+monitor":"一语一看","lang+reprog":"一语一写","lang+selfexplain":"一语一问",',
' "micro+monitor":"一步一电","micro+reappraise":"一步一撕","micro+selfexplain":"一步一问",',
' "monitor+reappraise":"看电一撕","monitor+reprog":"看电一写","monitor+selfexplain":"看电一问",',
' "reappraise+reprog":"一撕一写","reappraise+selfexplain":"一撕一问","reprog+selfexplain":"一写一问"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力量，在回声谷里咬合成一个齿轮。","签签的「不行」，被正式撕了下来。"];',
'var BORROW_ORDER=["monitor","mark","sleep"];',
'var BORROW_LINE={',
' mian:"眠眠：「记录本和钟都借你们——看一眼电量，困了就睡。」",',
' shan:"闪闪：「我帮你把那张标签撕下来。剩下的，你来讲。」",',
' jiu :"究究：「一边走一边问一句为什么——签签最怕这个。」",',
' song:"松松：「微步骤启动借你们！先迈一小步！」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 10. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"arena",t:"回声谷",e:"🗣"},{k:"boss",t:"签签",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 11. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch5_save_v1";', 'var SAVE_KEY="brainexp_ch6_save_v1";');
rep('var BEST_KEY="brainexp_ch5_best_v1";', 'var BEST_KEY="brainexp_ch6_best_v1";');
/* 标题页继承前四章记录（追加 Ch5 继承） */
rep('  var p4=null;\n  try{p4=JSON.parse(localStorage.getItem("brainexp_ch4_best_v1"));}catch(e){}\n  if(p4)html+=(html?"<br>":"")+"🏅 已继承第四章：「理解冰山」最佳 <b>"+p4.rating+"</b> · "+p4.diff;',
    '  var p4=null;\n  try{p4=JSON.parse(localStorage.getItem("brainexp_ch4_best_v1"));}catch(e){}\n  if(p4)html+=(html?"<br>":"")+"🏅 已继承第四章：「理解冰山」最佳 <b>"+p4.rating+"</b> · "+p4.diff;\n  var p5=null;\n  try{p5=JSON.parse(localStorage.getItem("brainexp_ch5_best_v1"));}catch(e){}\n  if(p5)html+=(html?"<br>":"")+"🏅 已继承第五章：「否定斗技场」最佳 <b>"+p5.rating+"</b> · "+p5.diff;');

/* ============ 12. 新技能图腾（语言风暴风，TOT 占位色） ============ */
var TOTEM_ADD = [
'TOTEM_ART.reappraise=\'<rect x="10" y="13" width="20" height="13" rx="2" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M14 20 l12 -9" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><path d="M11 28 q9 6 18 0" stroke="TOT" stroke-width="2.6" fill="none" stroke-linecap="round"/>\';',
'TOTEM_ART.lang=\'<path d="M12 13 h16 a3 3 0 0 1 3 3 v9 a3 3 0 0 1 -3 3 h-9 l-6 5 v-5 h-1 a3 3 0 0 1 -3 -3 v-9 a3 3 0 0 1 3 -3 Z" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M16 20 h11 M16 25 h8" stroke="TOT" stroke-width="2.2" stroke-linecap="round"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 13. Boss 签签（贴标签主 · 往身上贴「慢/笨/不行」标签的怪） ============
 * 铁律：五官画在上部(y≈30-40)避开对话气泡；金撕角/光晕伸出遮挡区；纯色+明暗面，不用 url(#gradient) */
var BOSS_BLOCK = [
'/* ---- Boss 签签（贴标签主 · 往身上贴「慢/笨/不行」标签的怪） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+50*Math.cos(a)).toFixed(1), py=(52+42*Math.sin(a)).toFixed(1);',
'    chips+=\'<rect x="\'+px+\'" y="\'+py+\'" width="12" height="12" rx="2" fill="\'+(i%2?"#e8e2d6":"#cfc8ba")+\'" transform="rotate(\'+(i*40)+\' \'+px+\' \'+py+\')"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="60" cy="56" rx="56" ry="52" fill="rgba(18,26,32,.55)"/>\'+',
'  /* 金色撕角（向上伸出气泡遮挡区） */',
'  \'<path d="M40 26 L34 4 L48 22 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M60 22 L60 2 L68 22 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M80 26 L86 4 L72 22 Z" fill="#f0b24a"/>\'+',
'  /* 灰蓝身体（比背景亮，确保可见） */',
'  \'<path d="M20 62 Q8 34 40 30 Q60 16 84 32 Q114 36 98 66 Q108 94 70 98 Q38 106 24 88 Q6 82 20 62 Z" fill="#5a6e7a" stroke="#2e3a42" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M40 64 Q60 56 82 66 Q86 86 60 90 Q36 88 40 64 Z" fill="#738a98" opacity=".7"/>\'+',
'  /* 红色 ✕ 眼（画在上部，避开气泡） */',
'  \'<path d="M31 32 l8 8 M39 32 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  \'<path d="M73 32 l8 8 M81 32 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  /* 皱眉 + 张嘴（贴标签的脸） */',
'  \'<path d="M34 26 q10 -4 18 0 M68 26 q10 -4 18 0" stroke="#2e3a42" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M44 46 q16 10 32 0" stroke="#e05a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><rect x="12" y="14" width="7" height="7" rx="2" fill="#f0b24a"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><rect x="104" y="30" width="6" height="6" rx="2" fill="#e8e2d6"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 否否（否定斗技场主 · 脑子里「我不行」的声音） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 14. 结算页分支名（Ch5 分支）→ Ch6 分支 ============ */
rep('var m={A:"A线 · 还行一步",B:"B线 · 我做到过",C:"C线 · 别人能我也能",D:"D线 · 队友信你"};',
    'var m={A:"A线 · 改写脚本",B:"B线 · 说清为什么",C:"C线 · 撕下标签",D:"D线 · 队友信你"};');
/* 观察 → 本章主题（闪闪撕标签·换台词收束） */
rep('return "「以后心里冒出『我不行』，我就先改成『我还不行』——再迈出一小步。」";',
    'return "「以后贴在身上的话，我先问一句：这是我的吗？不是，我就撕下来——换成我自己的台词。」";');

/* ============ 15. 战斗场景背景：arena（沿用 Ch5 竞技场景，仅文案已改） ============ */
/* bg.insertAdjacentHTML("afterbegin",sceneSVG("arena")); 无需变动 */

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
