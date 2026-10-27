/* 社交特别篇 构建：从 Ch6 静态源码(_social_base.html)换数据 → 社交特别篇-关系回声.html
 * 主题：关系回声 · 朋友篇（语言力量扩展系统的真落地 + 外部伙伴 NPC）
 * 新技能：我句式(express,闪)=表达感受 / 行为透镜(lens,眠)=区分行为·本人 —— 用户点名的两个目标
 * 社交困境：外部伙伴 小满（暖但上头），孩子不敢说、差点把朋友贴成「坏人」标签
 * 反卡死：R1/R2 有效池必含 micro(开局人手一张)+各分支技能；R3=COMBO 任意两不同角色。分支 owner=松/究/眠/闪 四角色，COMBO 极稳
 * 学业铁律：生活例子为主（拍球/骑车/搭积木/同学抢话），不引入高压学业词
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_social_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch7-关系回声.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 第六章「语言风暴」</title>',
    '<title>大脑远征队 · 社交特别篇「关系回声」</title>');
rep('<div class="sub">第六章 · 语言风暴 —— 脑子里的声音会贴标签，也能改写台词</div>',
    '<div class="sub">社交特别篇 · 关系回声 —— 朋友的话会回弹，也能重新说一遍</div>');
rep('<div class="boss-name">签签 · 贴标签主</div>',
    '<div class="boss-name">一刀 · 一刀切主</div>');
rep('card.appendChild(el("div","page-sub","第六章 · 语言风暴 —— 完"));',
    'card.appendChild(el("div","page-sub","社交特别篇 · 关系回声 —— 完"));');
rep('if(r==="A")return "过关了。回声谷里不只有回声，还有你撕下来的那张标签。";',
    'if(r==="A")return "过关了。朋友篇里不只有回声，还有你分清的那条线——行为，和本人。";');
rep('return "也走出了回声谷。下次，贴在身上的话，先问问：这是我的吗？";',
    'return "也走出了朋友篇。下次，和朋友相处，先把事情和人分开——不舒服，也能说出来。";');
rep('cc.appendChild(el("div","note-sec","第六章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","社交特别篇诞生。公约会随章节累积，章末统一收录。"));');

/* ============ 2. CSS 主题：沿用竞技暗夜（竞技世界 Ch5-7 同皮），改场景文案 ============ */
rep('语言风暴 · 回声谷', '关系回声 · 朋友篇');
rep('回 声', '朋 友');

/* ============ 3. 角色技能绑定（boss 改名一刀） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","签签":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","一刀":"boss","四人":"all"};');

/* ============ 4. SKILLS（5 个：micro/reprog/selfexplain 沿用 + lens/express 新） ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  reprog :{name:"认知重编程",owner:"song",',
'           one:"把脑子里的旧脚本改写——「都是我的错」写成「是我还没说清楚」。",',
'           mantra:"「把旧台词，改成新台词。」",',
'           why:"朋友让你难受，你容易把错都揽自己身上。改写脚本：不是你的错，是话还没说清。",',
'           cross:"被误会了，旧脚本喊『都是我不好』；改写：『是我还没讲明白。』"},',
'  selfexplain:{name:"自我解释",owner:"jiu",',
'           one:"一边看一边问自己「他为什么这样做」。",',
'           mantra:"「问一句为什么，再下判断。」",',
'           why:"一刀把人分成好人和坏人。自我解释帮你看到行为背后的动机光谱——他不是坏，是上头。",',
'           cross:"同学抢了话，旧镜头觉得『他坏』；解释：『他只是急着表现。』"},',
'  lens   :{name:"行为透镜",owner:"mian",',
'           one:"把「这个人坏」拆成「这件事让我不舒服」——行为和本人分开看。",',
'           mantra:"「行为不舒服，不等于人是坏人。」",',
'           why:"12岁正在学给人大标签。行为透镜加一层：一个人可以既记得你，又让你不舒服，两件事不矛盾。",',
'           cross:"朋友玩游戏压着你，旧镜头『他是坏人』；透镜：『他这行为让我不舒服，但他不是坏人。』"},',
'  express:{name:"我句式",owner:"shan",',
'           one:"把感受说清楚——「当你___时，我觉得___，我希望___」。",',
'           mantra:"「说清楚感受，不是指责。」",',
'           why:"语言力量不只是对自己说，也对朋友说。我句式把「你总是」换成「我感到」，朋友听得进，关系留得住。",',
'           cross:"想说不玩了，别说「你烦」，说「你太急，我有点累，想缓缓」。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 5. COMBOS ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"说清楚也留得住",members:["express","lens"],',
'   desc:"我句式（闪）＋行为透镜（眠）——既把不舒服说出来，又不把人一杆子打死。一刀最怕你既分清行为本人，又把话说明白。"},',
'  {name:"先看清再开口",members:["selfexplain","reprog"],locked:true,',
'   desc:"自我解释（究）＋认知重编程（松）——后续章节解锁。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 6. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"闪闪",text:"（小声）小满今天……又来了。"},',
'  {who:"松松",text:"朋友篇！谁先开口？"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松按住闪闪的肩：「先把想说的那句话，拆成一小句——到哪儿都管用。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {who:"闪闪",text:"小满平时可好了，记得给我带糖……可一玩起来，就压着我，我都不敢说。"},',
'  {who:"究究",text:"你先别憋着。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"一刀开始在你脑子里分边：「小满是好朋，还是坏朋？」你先接住哪一边？",options:[',
'  {t:"先把自己这边的感受说清楚",next:"a1",branch:"A",',
'   after:[{act:"松松：先把那句大话，切小。"},{who:"松松",text:"先把那句大话，切小。"}]},',
'  {t:"先问一句：他是故意的吗？",next:"b1",branch:"B",',
'   after:[{act:"究究：先别急着贴标签。"},{who:"究究",text:"先别急着贴标签。"}]},',
'  {t:"先看清：是他做的事，不是他",next:"c1",branch:"C",',
'   after:[{act:"眠眠举起记录本。"},{who:"眠眠",text:"事是事，人是人。"}]},',
'  {t:"先说出来：当你___时，我觉得___",next:"d1",branch:"D",',
'   after:[{act:"闪闪鼓起勇气。"},{who:"闪闪",text:"（深呼吸）我想说。"}]}',
' ]},',
'',
' /* ---- A 线 · 认知重编程 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"先把那句大话，切小。"},',
'  {who:"闪闪",text:"我先说清楚……"}',
' ]},',
' a2:{kind:"skill",skill:"reprog",lead:"松松在掌心写下一行新台词：「把『都是我的错』改写成『是我还没说清楚』。」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"闪闪还是低头：「可我不敢说，说了他会不会不理我。」你说：",options:[',
'  {t:"「你说了，才是真朋友。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（抬头）……我是真朋友。"}]},',
'  {t:"「那就忍着吧。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把话咽了回去。"}]},',
'  {t:"「说了就少了个朋友。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪叹了口气，没再开口。"}]}',
' ]},',
'',
' /* ---- B 线 · 自我解释 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"究究",text:"他是故意的吗？"},',
'  {who:"闪闪",text:"他好像……就是玩起来顾不上。"}',
' ]},',
' b2:{kind:"skill",skill:"selfexplain",lead:"究究：「自我解释——把情况和他想的讲明白。他不是坏，是上头。」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"闪闪摇头：「可他让我不舒服是真的。」你说：",options:[',
'  {t:"「不舒服是真的，但他不是故意的。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（点头）……他不是故意的。"}]},',
'  {t:"「那就离远点。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把话咽了回去。"}]},',
'  {t:"「他就是坏。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪低下头，不再说话。"}]}',
' ]},',
'',
' /* ---- C 线 · 行为透镜 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"闪闪",text:"（看小满）他做的事让我不舒服……"},',
'  {who:"松松",text:"对，是那件事，不是他。"}',
' ]},',
' c2:{kind:"skill",skill:"lens",lead:"眠眠举起透镜：「行为透镜——他做的事让你不舒服，但小满不是坏人。两件事不矛盾。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"闪闪还是皱眉：「可我心里还是把他当坏人了。」你说：",options:[',
'  {t:"「行为不舒服，人不一定是坏人。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（深呼吸）……人和事，是两件事。"}]},',
'  {t:"「就算了。」",next:"conv",trust:2,',
'   after:[{act:"闪闪又把话咽了回去。"}]},',
'  {t:"「他就是坏人。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪把小满想成了坏人。"}]}',
' ]},',
'',
' /* ---- D 线 · 我句式（闪闪） ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"闪闪",text:"（鼓起勇气）我……我想说。"},',
'  {who:"眠眠",text:"先看电量，你不是没底。"}',
' ]},',
' d2:{kind:"skill",skill:"express",lead:"闪闪举起话筒：「我句式——当你___时，我觉得___，我希望___。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"闪闪还是怕：「可我怕说错。」你说：",options:[',
'  {t:"「说清楚感受，不是指责。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（点头）……说感受，不指责。"}]},',
'  {t:"「那就别说了。」",next:"conv",trust:2,',
'   after:[{act:"闪闪又把话咽了回去。"}]},',
'  {t:"「说错就说是他的错。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪把责任推了出去。"}]}',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"一刀",text:"好人！坏人！一刀切开！"},',
'  {who:"闪闪",text:"（退半步）小满他……"},',
'  {who:"松松",text:"别慌，先说清楚，也留得住！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"一刀",text:"你们……居然没被我切开……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"闪闪",text:"小满做的事让我不舒服，可小满不是坏人。"},',
'  {who:"四人",text:"「他做的事让我不舒服，不等于他是坏人！」"},',
'  {who:"四人",text:"不舒服，我可以说出来，不硬撑！"}',
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
'  bossLine:"「好人！坏人！一刀切开！」回声在谷里分成两个半边，越分越大。",',
'  valid:["micro","reprog","selfexplain","lens","express"],',
'  ease:"闪闪：这一下，先说清楚，或先看清——用什么都行。"},',
' {name:"第 2 回合 · 一刀切",rk:"split",',
'  bossLine:"「要么朋友要么敌人，选一个！」一刀把人划成两半，黑压压一片。",',
'  valid:["micro","reprog","selfexplain","lens","express"],',
'  ease:"闪闪：这一下，说感受，或分清楚——顶回去就行。"},',
' {name:"第 3 回合 · 一刀之核",rk:"core",',
'  bossLine:"「不站队的就是坏人！」一刀胀到最大，遮住了整片谷。",',
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
'  micro:["把「忍着」切成五秒一句——先，说一个小感受。回声撞了个空。"],',
'  reprog:["把旧脚本改写：「都是我的错」写成「是我还没说清」。回声被这句顶回去一半。"],',
'  selfexplain:["「问一句为什么。」越问越明白，回声被问出了形状。"],',
'  lens:["眠眠举起透镜：他做的事，不是他的人。回声裂了条缝。"],',
'  express:["闪闪把「你烦」换成「我觉得」——回声变成了别的话。"],',
'  miss:["闪闪：「再想一招。先说一个小感受，或先看清一件小事。」"]',
' },',
' split:{',
'  micro:["先迈一小步说出来，一刀的缝里透进了光。"],',
'  reprog:["旧脚本被改写，一刀劈下来的标签，字变了。"],',
'  selfexplain:["「问一句为什么。」越问越明白，一刀的裂缝被问宽了。"],',
'  lens:["眠眠看透镜：好和坏之间，还有一大片「就是这个人」。一刀的手抖了。"],',
'  express:["把「你总是」说成「我感到」。一刀劈歪了。"],',
'  miss:["闪闪：「用刀劈，不如用话分。再想一招。」"]',
' },',
' core:{',
'  single:["一刀抖了抖黑影：「一个人……顶不住我……」身后伸过来一只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两个法子——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 9. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 按字母序排序后用 "+" 连接（与引擎 b.sel.sort().join("+") 一致）
 * 共 10 条跨角色对（5 技能 C(5,2)） */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "express+lens"     :["闪闪用我句式说清感受，眠眠举起行为透镜：事是事，人是人。","一句话分清两件事，一刀的裂缝合不上了。"],',
' "express+micro"    :["闪闪说清感受，松松接一句「先迈一小步」。","一句落地，一步说清，一刀被顶退半步。"],',
' "express+reprog"   :["「我感到」说出口，松松把旧脚本划掉重写。","新台词盖住了旧自责。"],',
' "express+selfexplain":["把感受说出来，究究问一句为什么。","说了感受，才问得清动机。"],',
' "lens+micro"       :["眠眠举透镜，松松只迈一步。","看清事与人，再迈一小步。"],',
' "lens+reprog"      :["眠眠分事与人，松松改写旧脚本。","不揽错，也分得清。"],',
' "lens+selfexplain" :["行为透镜照出动机，究究问一句为什么。","看清了行为，才问得清原因。"],',
' "micro+reprog"     :["松松改写旧脚本，先迈五秒一步。","不揽错，先行动。"],',
' "micro+selfexplain":["先迈五秒一步，再问一句「他为什么」。","最小的一步，也踩得清清楚楚。"],',
' "reprog+selfexplain":["旧脚本改写一遍，再问一句为什么。","不揽错，也看得清动机。"]',
'};',
'var COMBO_NAMES={',
' "express+lens":"说清也留","express+micro":"一语一步","express+reprog":"一语一写","express+selfexplain":"一语一问",',
' "lens+micro":"一镜一步","lens+reprog":"一镜一写","lens+selfexplain":"一镜一问",',
' "micro+reprog":"一步一写","micro+selfexplain":"一步一问","reprog+selfexplain":"一写一问"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力量，在朋友篇里咬合成一个齿轮。","一刀的「好人坏人」，被正式分了家。"];',
'var BORROW_ORDER=["selfexplain","reprog","lens","express"];',
'var BORROW_LINE={',
' mian:"眠眠：「透镜借你们——事是事，人是人。」",',
' shan:"闪闪：「我帮你把那句话说明白。剩下的，你来讲。」",',
' jiu :"究究：「一边走一边问一句为什么——一刀最怕这个。」",',
' song:"松松：「微步骤启动借你们！先迈一小步！」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 10. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"friend",t:"朋友篇",e:"🤝"},{k:"boss",t:"一刀",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 11. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch6_save_v1";', 'var SAVE_KEY="brainexp_social_save_v1";');
rep('var BEST_KEY="brainexp_ch6_best_v1";', 'var BEST_KEY="brainexp_social_best_v1";');
/* 标题页继承前六章记录（追加 Ch6 继承） */
rep('  var p5=null;\n  try{p5=JSON.parse(localStorage.getItem("brainexp_ch5_best_v1"));}catch(e){}\n  if(p5)html+=(html?"<br>":"")+"🏅 已继承第五章：「否定斗技场」最佳 <b>"+p5.rating+"</b> · "+p5.diff;',
    '  var p5=null;\n  try{p5=JSON.parse(localStorage.getItem("brainexp_ch5_best_v1"));}catch(e){}\n  if(p5)html+=(html?"<br>":"")+"🏅 已继承第五章：「否定斗技场」最佳 <b>"+p5.rating+"</b> · "+p5.diff;\n  var p6=null;\n  try{p6=JSON.parse(localStorage.getItem("brainexp_ch6_best_v1"));}catch(e){}\n  if(p6)html+=(html?"<br>":"")+"🏅 已继承第六章：「语言风暴」最佳 <b>"+p6.rating+"</b> · "+p6.diff;');

/* ============ 12. 新技能图腾（关系回声风，TOT 占位色） ============ */
var TOTEM_ADD = [
'TOTEM_ART.lens=\'<circle cx="24" cy="22" r="11" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M24 11 v22 M13 22 h22" stroke="TOT" stroke-width="1.5"/><path d="M14 31 q10 5 20 0" stroke="TOT" stroke-width="2.4" fill="none" stroke-linecap="round"/>\';',
'TOTEM_ART.express=\'<path d="M10 12 h22 a3 3 0 0 1 3 3 v12 a3 3 0 0 1 -3 3 h-12 l-7 6 v-6 h-3 a3 3 0 0 1 -3 -3 v-12 a3 3 0 0 1 3 -3 Z" fill="none" stroke="TOT" stroke-width="2.4"/><circle cx="21" cy="20" r="4" fill="none" stroke="TOT" stroke-width="2"/><path d="M14 32 q7 5 14 0" fill="none" stroke="TOT" stroke-width="2"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 13. Boss 一刀（一刀切主 · 把人劈成好人/坏人的声音） ============
 * 铁律：五官画在上部(y≈30-40)避开对话气泡；金裂/光晕伸出遮挡区；纯色+明暗面，不用 url(#gradient) */
var BOSS_BLOCK = [
'/* ---- Boss 一刀（一刀切主 · 把人劈成好人/坏人的声音） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+50*Math.cos(a)).toFixed(1), py=(52+42*Math.sin(a)).toFixed(1);',
'    chips+=\'<path d="M\'+px+\' \'+py+\' l6 6 l-6 6 l-6 -6 Z" fill="\'+(i%2?"#f0b24a":"#9aa6ad")+\'"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="60" cy="56" rx="56" ry="52" fill="rgba(18,26,32,.55)"/>\'+',
'  /* 金色裂刺（向上伸出气泡遮挡区） */',
'  \'<path d="M40 26 L34 4 L48 22 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M60 22 L60 2 L68 22 Z" fill="#f0b24a"/>\'+',
'  \'<path d="M80 26 L86 4 L72 22 Z" fill="#f0b24a"/>\'+',
'  /* 身体（灰蓝） */',
'  \'<path d="M20 62 Q8 34 40 30 Q60 16 84 32 Q114 36 98 66 Q108 94 70 98 Q38 106 24 88 Q6 82 20 62 Z" fill="#6a7682" stroke="#2e3a42" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M40 64 Q60 56 82 66 Q86 86 60 90 Q36 88 40 64 Z" fill="#839099" opacity=".7"/>\'+',
'  /* 正中金裂（好/坏分界线） */',
'  \'<path d="M60 30 L60 92" stroke="#f0b24a" stroke-width="3" stroke-dasharray="4 3"/>\'+',
'  /* 高举的刀（劈线） */',
'  \'<path d="M78 40 L96 30 L98 38 L80 48 Z" fill="#c9ced2" stroke="#2e3a42" stroke-width="1.6"/>\'+',
'  \'<path d="M74 44 L82 40" stroke="#7a5a3a" stroke-width="4" stroke-linecap="round"/>\'+',
'  /* 红色 ✕ 眼（画在上部，避开气泡） */',
'  \'<path d="M31 32 l8 8 M39 32 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  \'<path d="M73 32 l8 8 M81 32 l-8 8" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  /* 皱眉 + 张嘴（劈人的脸） */',
'  \'<path d="M34 26 q10 -4 18 0 M68 26 q10 -4 18 0" stroke="#2e3a42" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M44 48 q16 -8 32 0" stroke="#e05a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><rect x="12" y="14" width="7" height="7" rx="2" fill="#f0b24a"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><path d="M104 30 l4 4 l-4 4 l-4 -4 Z" fill="#9aa6ad"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 签签（贴标签主 · 往身上贴「慢/笨/不行」标签的怪） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 14. 结算页分支名（Ch6 分支）→ 社交分支 ============ */
rep('var m={A:"A线 · 改写脚本",B:"B线 · 说清为什么",C:"C线 · 撕下标签",D:"D线 · 队友信你"};',
    'var m={A:"A线 · 改写脚本",B:"B线 · 问清动机",C:"C线 · 行为透镜",D:"D线 · 我句式"};');
/* 观察 → 本章主题（分清行为本人 + 表达感受收束） */
rep('return "「以后贴在身上的话，我先问一句：这是我的吗？不是，我就撕下来——换成我自己的台词。」";',
    'return "「以后和朋友相处，我先把感受和事情分开：他做的事让我不舒服，不等于他是坏人；不舒服，我也能说出来。」";');
/* 隐藏台词 → 朋友篇主题（Ch1 遗留"看懂陷阱"改为分清事与人） */
rep('sec.textContent="✨ 隐藏台词：最安静的人，往往是第一个看懂陷阱的人。——这颗星，是你自己点亮的。";',
    'sec.textContent="✨ 隐藏台词：最安静的人，往往第一个分清事情和人。——这句话，是你自己说出口的。";');

/* ============ 15. 战斗场景背景：arena（沿用竞技场景，仅文案已改） ============ */
/* bg.insertAdjacentHTML("afterbegin",sceneSVG("arena")); 无需变动 */

/* ============ 16. 求助口袋卡（元宝游戏包·求助导航洞洞板落地：全章图鉴通用安全卡） ============ */
var HELP_BADGE = [
'function helpBadge(size){',
'  return \'<svg viewBox="0 0 48 48" width="\'+size+\'" height="\'+size+\'" style="display:block">\'+',
'  \'<rect x="10" y="8" width="28" height="34" rx="5" fill="rgba(216,180,90,.1)" stroke="#f0d68a" stroke-width="2.5"/>\'+',
'  \'<path d="M24 16 v10 M18 21 h12" stroke="#f0d68a" stroke-width="3" stroke-linecap="round"/>\'+',
'  \'<path d="M15 32 q9 6 18 0" stroke="#f0d68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
rep("function comboBadge(locked,size){", HELP_BADGE + "function comboBadge(locked,size){");

var HELP_CARD = [
'  var hc=el("div","cdx-card");',
'  var ht=el("div","cdx-t"); ht.innerHTML=helpBadge(60);',
'  hc.appendChild(ht);',
'  hc.appendChild(el("div","cdx-name","求助口袋卡"));',
'  hc.appendChild(el("div","mantra","求助不是软弱，是精准调用资源。"));',
'  var hnote=el("div","note-sec");',
'  hnote.appendChild(el("div",null,"正面：写下 3 个你信得过的大人 —— ①＿＿＿ ②＿＿＿ ③＿＿＿"));',
'  hnote.appendChild(el("div",null,"背面：54321 着陆 —— 看 5 样 · 摸 4 样 · 听 3 声 · 闻 2 样 · 尝 1 味"));',
'  hnote.appendChild(el("div",null,"心里乱的时候：先着陆，再找人说。"));',
'  hc.appendChild(hnote);',
'  g.appendChild(hc);'
].join("\n");
rep('    c.appendChild(el("div","note-sec",cn.desc));\n    g.appendChild(c);\n  });\n  show("scr-codex");',
    '    c.appendChild(el("div","note-sec",cn.desc));\n    g.appendChild(c);\n  });\n' + HELP_CARD + '\n  show("scr-codex");');

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
