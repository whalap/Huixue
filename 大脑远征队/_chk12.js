
(function(){
"use strict";

/* ================= 数据 ================= */
var DIFFS={
  easy :{key:"easy", name:"简单",      level:1, hints:true,  card:"full", tags:false,
         desc:"眠眠全程陪练，技能卡全展示，战斗有小抄。"},
  intro:{key:"intro",name:"入门",      level:2, hints:true,  card:"full", tags:true,
         desc:"标准节奏。新技能灰标，眠眠在关键处提醒。"},
  semi :{key:"semi", name:"半标注进阶",level:3, hints:false, card:"fold", tags:true,
         desc:"新技能灰标 NEW。提示减半，卡牌自己翻面。"},
  hard :{key:"hard", name:"困难",      level:4, hints:false, card:"one",  tags:false,
         desc:"无提示无小抄。只给一句咒语，全凭自己悟。"}
};
var DIFF_ORDER=["easy","intro","semi","hard"];

var CHARS={
  song:{name:"松松",role:"行动担当 · 剑士",hex:"#7bc96f",
       voice:"「等会儿再说」",
       desc:"永远第一个冲，也永远第一个想放弃。",
       skills:["micro","compound"]},
  jiu :{name:"究究",role:"认知担当 · 军师",hex:"#6fa8dc",
       voice:"「还不够好」",
       desc:"能背下整本图鉴，但不敢举手回答问题。",
       skills:["selfexplain","monitor"]},
  mian:{name:"眠眠",role:"能量担当 · 守护",hex:"#f2b880",
       voice:"「算了，没人在乎」",
       desc:"记得每个人的生日，默默把事情全做了。",
       skills:["generate","sleep"]},
  shan:{name:"闪闪",role:"情绪语言担当 · 信使",hex:"#c9a2e0",
       voice:"「我不行」",
       desc:"不太说话，却第一个察觉谁今天不开心。",
       skills:["mark","feynman"]}
};
var CHAR_ORDER=["song","jiu","mian","shan"];
var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","滤滤":"boss","四人":"all"};

var SKILLS={
  micro  :{name:"微步骤启动",owner:"song",
           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",
           mantra:"「先做第一步，第一步只花五秒。」",
           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",
           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},
  selfexplain:{name:"自我解释",owner:"jiu",
           one:"先说为什么，再决定动不动——理由是自己的，选择才是自己的。",
           mantra:"「先问一句：为什么？」",
           why:"说得清理由的人，才不会被人一句话推着走。知其然，更知其所以然。",
           cross:"朋友约你玩，你不想去——说得出「我在等一个电话」，就不怕被说小气。"},
  express:{name:"我句式",owner:"shan",
           one:"把感受说清楚：「当你___时，我觉得___，我希望___。」不指责，不硬撑。",
           mantra:"「当你___时，我觉得___，我希望___。」",
           why:"话里有「我」，别人才听得进去；话里有「你」，天就聊成了架。说感受，不说审判。",
           cross:"同桌借你笔不还？说「我等下要用，先还我吧」——比憋一节课舒服多了。"},
  screendown:{name:"睡前落闸",owner:"mian",
           one:"眼睛酸、脖子僵、心里空——信号亮着，就落闸：屏幕朝下，说一句「明天见」。",
           mantra:"「信号亮了，就落闸。」",
           why:"深夜的屏幕越刷越精神，因为它在喂你的好奇心。落闸不是认输，是给大脑一个「今天到此为止」的句号。",
           cross:"搭积木搭到眼睛发酸还想搭完？先落闸——「明天继续」，积木不会跑。"},
  likes :{name:"点赞秤",owner:"jiu",
           one:"点赞数是杆秤，可它秤的不是你的价值。称一称：今天开心的事，有几件？",
           mantra:"「秤是我的，刻度也是我的。」",
           why:"把价值挂在别人的计数上，心跳就归别人管。自己的秤，称自己的好——那天才是自己的。",
           cross:"拍球连拍了十个没人看见？秤一秤：刚才那一下，你自己爽不爽？爽，就作数。"}
};
var COMBOS=[
  {name:"先落闸，再称重",members:["screendown","likes"],
   desc:"睡前落闸（眠）＋点赞秤（究）——屏幕朝下，再称一称：今天开心的事有几件？称完，安心睡。"},
  {name:"停一秒，再转发",members:["express","micro"],
   desc:"我句式（闪）＋微步骤启动（松）——想转发的那一秒，先停：他同意吗？这是全貌吗？想不清，就先锁屏。"}
];
/* ---------- 剧情场景 ---------- */
var SCENES={
 i1:{kind:"story",next:"i2",lines:[
  {anim:"lights"},
  {who:"眠眠",text:"夜深了……屏幕还亮着。"},
  {who:"闪闪",text:"（小声）群里，又在刷精修的生活。"},
  {anim:"campfire"}
 ]},
 i2:{kind:"skill",skill:"micro",lead:"松松放下背包：「老规矩——先迈五秒一步。『放下手机』太大，就切成『锁屏，就一下』。」",next:"i3"},
 i3:{kind:"story",next:"choice1",lines:[
  {who:"究究",text:"屏里的潮水，一直在涨。"},
  {who:"眠眠",text:"（小声）……阿嗨把聊天记录截图，发群里了。"},
  {anim:"focus-stone"},
  {anim:"boss-eye"}
 ]},

 choice1:{kind:"choice",letters:true,prompt:"深夜，群里的精修生活刷不完；闪闪的自发拍没人点赞，阿嗨却把聊天记录截图发了群。你心里一沉——先出哪一招？",options:[
  {t:"先锁屏：就一下",next:"a1",branch:"A",
   after:[{act:"松松伸手。"},{who:"松松",text:"先锁屏，就一下。"}]},
  {t:"先想清：我在跟谁比",next:"b1",branch:"B",
   after:[{act:"究究抬眼。"},{who:"究究",text:"先问一句：比什么？"}]},
  {t:"先问一句：他同意吗",next:"c1",branch:"C",
   after:[{act:"闪闪攥拳。"},{who:"闪闪",text:"转发之前，先问。"}]},
  {t:"先认信号：我身体累了",next:"d1",branch:"D",
   after:[{act:"眠眠揉眼睛。"},{who:"眠眠",text:"眼睛……酸了。"}]}
 ]},

 /* ---- A 线 · 微步骤启动 ---- */
 a1:{kind:"story",next:"a2",lines:[
  {who:"松松",text:"放下手机……这四个字，太重。"},
  {who:"眠眠",text:"切成五秒：锁屏，就一下。"}
 ]},
 a2:{kind:"skill",skill:"micro",lead:"松松屈膝：「微步骤启动——『别再刷了』做不到，就切成『屏幕朝下，扣一下』。第一步小到不可能失败，手就回来了。」",next:"a3"},
 a3:{kind:"choice",letters:false,prompt:"松松手抖：「万一错过大事呢？」你说：",options:[
  {t:"「真的大事，明早也在。先睡。」",next:"conv",trust:8,flag:"kind",
   after:[{who:"松松",text:"（呼气）……扣一下。"}]},
  {t:"「那再刷五分钟吧。」",next:"conv",trust:2,
   after:[{act:"松松的手又缩回去了。"}]},
  {t:"「就是自制力差，别赖手机。」",next:"conv",trust:-5,flag:"toxic",
   after:[{act:"松松把手机攥更紧了。"}]},
 ]},

 /* ---- B 线 · 自我解释 ---- */
 b1:{kind:"story",next:"b2",lines:[
  {who:"究究",text:"先问一句——我在跟谁比？"},
  {who:"闪闪",text:"比……谁的生活更亮。"}
 ]},
 b2:{kind:"skill",skill:"selfexplain",lead:"究究摊开纸：「自我解释——屏里的生活是修过图的。先说出你在比什么：比的是精修的照片，还是真的日子？」",next:"b3"},
 b3:{kind:"choice",letters:false,prompt:"究究卡壳：「可人家真的过得比我好……」你说：",options:[
  {t:"「你看见的，是他想让你看见的那一页。」",next:"conv",trust:8,flag:"kind",
   after:[{who:"究究",text:"（写）……只是一页。"}]},
  {t:"「那没办法，人家就是比你强。」",next:"conv",trust:2,
   after:[{act:"究究把纸揉掉了。"}]},
  {t:"「你就是酸，别找理由。」",next:"conv",trust:-5,flag:"toxic",
   after:[{act:"究究别过脸去。"}]},
 ]},

 /* ---- C 线 · 我句式 ---- */
 c1:{kind:"story",next:"c2",lines:[
  {who:"闪闪",text:"阿嗨截图的时候……没问过我们。"},
  {who:"眠眠",text:"转发之前，先问一句。"}
 ]},
 c2:{kind:"skill",skill:"express",lead:"闪闪抽出一张话卡：「我句式——『当你___时，我觉得___，我希望___。』想转发别人的照片、聊天记录？先递一句：你同意吗？这是全貌吗？」",next:"c3"},
 c3:{kind:"choice",letters:false,prompt:"闪闪声音发虚：「可大家都在转……」你说：",options:[
  {t:"「大家都在转，也不代表该转。问一句，不丢人。」",next:"conv",trust:8,flag:"kind",
   after:[{who:"闪闪",text:"（握拳）……那我问了。"}]},
  {t:"「算了，随大流吧。」",next:"conv",trust:2,
   after:[{act:"闪闪把话卡收回兜里。"}]},
  {t:"「就你事多，别扫兴。」",next:"conv",trust:-5,flag:"toxic",
   after:[{act:"闪闪往后退了半步。"}]},
 ]},

 /* ---- D 线 · 睡前落闸 ---- */
 d1:{kind:"story",next:"d2",lines:[
  {who:"眠眠",text:"（揉眼）这里……酸了。"},
  {who:"松松",text:"身体先知道——该睡了。"}
 ]},
 d2:{kind:"skill",skill:"screendown",lead:"眠眠看一眼时间：「睡前落闸——眼睛酸、脖子僵、心里空，信号亮着就落闸。屏幕朝下，说一句『明天见』。句号，是自己给的。」",next:"d3"},
 d3:{kind:"choice",letters:false,prompt:"眠眠犹豫：「群里还在@我……」你说：",options:[
  {t:"「明早回，天塌不下来。真有事，大人会找你。」",next:"conv",trust:8,flag:"kind",
   after:[{who:"眠眠",text:"（打哈欠）……明天见。"}]},
  {t:"「回完这一条再睡。」",next:"conv",trust:2,
   after:[{act:"眠眠又把屏幕点亮了。"}]},
  {t:"「你就是手机瘾，别矫情。」",next:"conv",trust:-5,flag:"toxic",
   after:[{act:"眠眠把脸埋进手里。"}]},
 ]},

 /* ---- 汇合 → Boss ---- */
 conv:{kind:"story",next:"BATTLE",lines:[
  {anim:"boss-rise"},
  {who:"滤滤",text:"你看人家的生活——再看看你的。"},
  {who:"闪闪",text:"（腿软）潮水……一直涨。"},
  {who:"四人",text:"屏里的潮水很响——我们听见自己了！"}
 ]},

 /* ---- 战后 ---- */
 w1:{kind:"story",next:"w2",lines:[
  {anim:"boss-burst"},
  {who:"滤滤",text:"你们……把「别人家的生活」，换成了自己的秤……"}
 ]},
 w2:{kind:"story",next:"w3",onEnter:function(){
   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}
 },lines:[
  {anim:"swamp-clear"},
  {who:"眠眠",text:"屏幕朝下——明天见。"},
  {who:"四人",text:"屏幕里的生活，是修过图的；我的价值，不靠点赞数！"},
  {who:"四人",text:"转发之前先问一句：他同意吗？这是全貌吗？问不清，就先落闸！"}
 ]},
 w3:{kind:"combo",next:"END"}
};
/* ---------- 战斗 ---------- */
var ROUNDS=[
 {name:"第 1 回合 · 对比帖",rk:"feed",
  bossLine:"「你看人家的生活。」滤滤刷出满屏精修：别人的旅行、别人的奖状墙、别人的笑脸。",
  valid:["micro","selfexplain","express","screendown","likes"],
  ease:"眠眠：锁屏、想清比什么、先问一句、认信号、称一称——用哪招都行。"},
 {name:"第 2 回合 · 深夜",rk:"night",
  bossLine:"「再刷一条就睡。」滤滤把夜熬得更深，屏幕的光映在每张脸上。",
  valid:["micro","selfexplain","express","screendown","likes"],
  ease:"眠眠：稳住——眼睛酸了就该落闸，别让屏幕替你数时间。"},
 {name:"第 3 回合 · 出手",rk:"core",
  bossLine:"「赞这么少，删了吧。」滤滤胀到最大，满屏的点赞图标哗啦啦响。",
  valid:"COMBO",
  ease:"眠眠：一个人扛不住潮水。找一位不同角色的队友，各出一招。"}
];
var REPLAY={
 feed:{
  micro:["五秒一步——松松把屏幕朝下扣了一下。满屏的精修，暗了一块。"],
  selfexplain:["究究问一句「我在比什么」——比的是修过的图，不是日子。潮水，退了一寸。"],
  express:["闪闪递一句「这是全貌吗」——一句话，把精修的生活问出了缝。"],
  screendown:["眠眠把屏幕朝下：信号亮着，先落闸。今晚的潮水，到此为止。"],
  likes:["眠眠称一称：今天开心的事有三件——自己的秤，称自己的好。"],
  miss:["眠眠：「再想一招。锁屏、想清、先问、认信号、称一称——都行。」"]
 },
 night:{
  micro:["五秒一步：屏幕朝下，扣一下。深夜的手，就这样回来了。"],
  selfexplain:["究究问「我在等什么」——等的是别人的下一个更新，还是自己的觉？"],
  express:["闪闪问「他同意吗」——想转手的截图，停在了半路。"],
  screendown:["眠眠落闸：「明天见。」屏幕暗了，眼睛得救了。"],
  likes:["称一称：今天有几件开心事？有三件——屏里的精修，秤不动它们。"],
  miss:["眠眠：「再想一招。锁屏、想清、先问、认信号、称一称——都行。」"]
 },
 core:{
  screendown:["滤滤退了一步：「你们……把屏幕……朝下了……」深夜，伸过来四只手。"],
  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两招——再来！」"]
 }
};
var COMBO_LINES={
 "express+likes"     :["闪闪问「这是全貌吗」，眠眠称一称：修过的图，秤不动我的今天。","问一句，称一称。"],
 "express+micro"     :["闪闪停一秒问「他同意吗」，松松把屏幕朝下扣一下。","停一秒，锁一下。"],
 "express+screendown":["闪闪递一句「我不转了」，眠眠把屏幕朝下：问清了，就落闸。","问清，落闸。"],
 "express+selfexplain":["闪闪问「我为什么在乎这个赞」，究究把理由说清楚。","问到底。"],
 "likes+micro"       :["眠眠称完今天的开心事，松松把屏幕朝下扣一下。","称完，锁屏。"],
 "likes+screendown"  :["眠眠的秤称完，屏幕也落了闸：我的刻度，我今晚带回家。","称完，落闸。"],
 "micro+screendown"  :["松松锁屏，眠眠落闸：五秒一步，加一句「明天见」。","锁屏，说晚安。"],
 "micro+selfexplain" :["松松先扣一下屏幕，究究问：这一下，为什么值得扣？","扣了，再想。"],
 "screendown+selfexplain":["眠眠落闸前问一句：我到底在等什么？等自己的觉。","落闸，想清。"],
};
var COMBO_NAMES={
 "express+likes":"问句称心","express+micro":"停秒锁屏","express+screendown":"问清落闸",
 "express+selfexplain":"问到底","likes+micro":"称完锁屏","likes+screendown":"称完结觉",
 "micro+screendown":"锁屏晚安","micro+selfexplain":"扣了再想","screendown+selfexplain":"落闸想清"
};
var COMBO_FALLBACK=["两股不同颜色的力气，在屏幕前凝成一枚「自己的秤」徽章。","滤滤的「你看人家的生活」，被正式挡在了屏外。"];
var BORROW_ORDER=["screendown","express","micro","selfexplain"];
var BORROW_LINE={
 mian:"眠眠：「睡前落闸借你们——屏幕朝下，说一句『明天见』！」",
 shan:"闪闪：「我句式借你们——『当你___时，我觉得___，我希望___。』」",
 song:"松松：「微步骤借你们！大事切成五秒一步——先锁屏，就一下！」",
 jiu :"究究：「自我解释借你们——先说为什么，再决定动不动。」"
};
/* ---------- 章节地图 ---------- */
var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"tide",t:"屏中潮",e:"📱"},{k:"boss",t:"滤滤",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];
var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};
/* ================= 状态 ================= */
var SAVE_KEY="brainexp_ch12_save_v1";
var BEST_KEY="brainexp_ch12_best_v1";
var RANK={B:0,A:1,S:2,SSS:3};
var diffReturn="new";
var codexReturn="end";
var helpReturn="scr-title";
var state=fresh();

function fresh(){
  return {diff:"intro",me:"song",skills:[],trust:8,flags:{},branch:null,
          sceneId:"i1",battle:null,battleDone:null,secret:false,node:0};
}

/* ================= 工具 ================= */
function $(s){return document.querySelector(s);}
function $$(s){return Array.from(document.querySelectorAll(s));}
function el(tag,cls,text){var d=document.createElement(tag);if(cls)d.className=cls;if(text!=null)d.textContent=text;return d;}
function diff(){return DIFFS[state.diff]||DIFFS.intro;}
function show(id){
  var screens=document.querySelectorAll(".screen");
  for(var i=0;i<screens.length;i++)screens[i].classList.remove("active");
  var t=$("#"+id); if(t)t.classList.add("active");
  try{window.scrollTo({top:0,behavior:"smooth"});}catch(e){}
  var inGame=(id==="scr-game"||id==="scr-battle");
  $("#hud").classList.toggle("hidden",!inGame);
  $("#btn-pause").classList.toggle("hidden",!inGame);
  if(inGame)renderMap(state.node);
}
var toastTimer=null;
function toast(msg){
  var t=$("#toast"); t.textContent=msg; t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){t.classList.add("hidden");},1800);
}
function modalOpen(){
  return ["#modal-skill","#modal-borrow","#overlay-pause"].some(function(s){
    return !$(s).classList.contains("hidden");
  });
}

/* ---------- 音效（WebAudio，失败静默） ---------- */
var AC=null;
function beep(kind){
  try{
    var Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    if(!AC)AC=new Ctx();
    if(AC.state==="suspended"&&AC.resume)AC.resume();
    var seq={click:[[520,.05]],hit:[[170,.14]],combo:[[660,.1],[880,.12]],win:[[523,.1],[659,.1],[784,.16]],unlock:[[440,.08],[660,.1]]}[kind]||[[520,.05]];
    var t=AC.currentTime;
    seq.forEach(function(p){
      var o=AC.createOscillator();
      var gn=AC.createGain();
      o.type=kind==="hit"?"sawtooth":"triangle";
      o.frequency.value=p[0];
      gn.gain.setValueAtTime(.06,t);
      gn.gain.exponentialRampToValueAtTime(.001,t+p[1]);
      o.connect(gn);gn.connect(AC.destination);
      o.start(t);o.stop(t+p[1]+.02);
      t+=p[1];
    });
  }catch(e){}
}

/* ================= SVG 素材库 ================= */
/* ---- 技能图腾（统一 viewBox 0 0 48 48，stroke 风格） ---- */
var TOTEM_ART={
 micro:'<path d="M7 41h9v-8h9v-8h9V16h9" fill="none" stroke="TOT" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="40" cy="8" r="3" fill="TOT"/>',
 single:'<path d="M8 24h30" stroke="TOT" stroke-width="4" stroke-linecap="round"/><path d="M30 16l9 8-9 8" fill="none" stroke="TOT" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="24" r="3.4" fill="TOT"/><path d="M8 36h30M8 12h30" stroke="TOT" stroke-width="2" stroke-linecap="round" opacity=".38"/>',
 anchor:'<circle cx="24" cy="9" r="4" fill="none" stroke="TOT" stroke-width="3.5"/><path d="M24 13v24" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/><path d="M11 19l13-6 13 6" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 33c5 7 13 9 17 9s12-2 17-9" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/>',
 tomato:'<circle cx="24" cy="27" r="13" fill="none" stroke="TOT" stroke-width="3.5"/><path d="M24 27v-7M24 27l4.5 2.5" stroke="TOT" stroke-width="3" stroke-linecap="round"/><path d="M18 12l3-5h6l3 5" fill="none" stroke="TOT" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="9" r="2" fill="TOT"/>',
 trigger:'<rect x="6" y="16" width="36" height="16" rx="8" fill="none" stroke="TOT" stroke-width="3.5"/><circle cx="33" cy="24" r="5.5" fill="TOT"/>',
 recode:'<path d="M8 17h26" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/><path d="M27 10l8 7-8 7" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 31H14" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/><path d="M21 24l-8 7 8 7" fill="none" stroke="TOT" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
 monitor:'<rect x="5" y="14" width="32" height="20" rx="5" fill="none" stroke="TOT" stroke-width="3.5"/><rect x="40" y="20" width="4" height="8" rx="2" fill="TOT"/><path d="M11 24h5l3-6 4 10 3-4h6" fill="none" stroke="TOT" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
 mark:'<circle cx="24" cy="24" r="15" fill="none" stroke="TOT" stroke-width="3.5"/><circle cx="24" cy="24" r="7" fill="none" stroke="TOT" stroke-width="3.5"/><circle cx="24" cy="24" r="2.4" fill="TOT"/><path d="M24 2v7M24 39v7M2 24h7M39 24h7" stroke="TOT" stroke-width="3.5" stroke-linecap="round"/>'
};
TOTEM_ART.interleave='<rect x="6" y="10" width="15" height="6" rx="2" fill="TOT"/><rect x="15" y="21" width="27" height="6" rx="2" fill="TOT" opacity=".72"/><rect x="6" y="32" width="21" height="6" rx="2" fill="TOT" opacity=".45"/>';
TOTEM_ART.retrieve='<path d="M9 12h13v24H9z" fill="none" stroke="TOT" stroke-width="3.5"/><path d="M22 12v24" stroke="TOT" stroke-width="3.5"/><path d="M28 20l8 4-8 4" fill="none" stroke="TOT" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
TOTEM_ART.sleep='<path d="M16 9a12 12 0 1 0 9 20A14 14 0 0 1 16 9z" fill="none" stroke="TOT" stroke-width="3.5" stroke-linejoin="round"/><path d="M30 24h11M30 31h8M30 38h11" stroke="TOT" stroke-width="3" stroke-linecap="round"/>';
TOTEM_ART.spacing='<circle cx="9" cy="27" r="4.6" fill="TOT"/><circle cx="24" cy="27" r="4.6" fill="TOT" opacity=".72"/><circle cx="39" cy="27" r="4.6" fill="TOT" opacity=".45"/><path d="M9 17v-7M24 17v-7M39 17v-7" stroke="TOT" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>';

TOTEM_ART.compound='<rect x="6" y="34" width="10" height="9" rx="2" fill="TOT" opacity=".45"/><rect x="18" y="26" width="10" height="17" rx="2" fill="TOT" opacity=".72"/><rect x="30" y="14" width="10" height="29" rx="2" fill="TOT"/><path d="M35 4v6M32 8l3-4 3 4" fill="none" stroke="TOT" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
TOTEM_ART.generate='<rect x="6" y="12" width="20" height="24" rx="3" fill="none" stroke="TOT" stroke-width="3" stroke-dasharray="4 3"/><path d="M28 24h3" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/><rect x="33" y="17" width="11" height="11" rx="2" fill="TOT"/>';
TOTEM_ART.selfexplain='<path d="M6 12h30v20H16l-6 7v-7H6z" fill="none" stroke="TOT" stroke-width="3" stroke-linejoin="round"/><path d="M17 19a3 3 0 1 1 3 3v2" fill="none" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/><circle cx="20" cy="29" r="1.5" fill="TOT"/>';
TOTEM_ART.feynman='<circle cx="14" cy="24" r="7" fill="none" stroke="TOT" stroke-width="3"/><path d="M25 18a9 9 0 0 1 0 12M32 14a15 15 0 0 1 0 20M39 10a21 21 0 0 1 0 28" fill="none" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/>';

TOTEM_ART.growth='<path d="M20 36 V20" stroke="TOT" stroke-width="3.4" stroke-linecap="round" fill="none"/><path d="M20 26 q-9 -1 -11 -10 M20 22 q9 -1 11 -10" stroke="TOT" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M13 13 q-4 -3 -2 -7 q5 1 4 6 Z" fill="TOT"/><path d="M27 9 q4 -3 2 -7 q-5 1 -4 6 Z" fill="TOT"/>';
TOTEM_ART.selfeff='<path d="M20 7 L33 13 V23 Q33 33 20 37 Q7 33 7 23 V13 Z" fill="none" stroke="TOT" stroke-width="3"/><path d="M14 21 l4 4 9 -10" fill="none" stroke="TOT" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>';
TOTEM_ART.vicarious='<circle cx="14" cy="15" r="6.5" fill="none" stroke="TOT" stroke-width="3"/><path d="M14 21 v9" stroke="TOT" stroke-width="3" stroke-linecap="round"/><circle cx="29" cy="24" r="6.5" fill="none" stroke="TOT" stroke-width="3"/><path d="M29 30 v6" stroke="TOT" stroke-width="3" stroke-linecap="round"/><path d="M14 15 h15" stroke="TOT" stroke-width="2.4" stroke-dasharray="3 3"/>';

TOTEM_ART.reappraise='<rect x="10" y="13" width="20" height="13" rx="2" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M14 20 l12 -9" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><path d="M11 28 q9 6 18 0" stroke="TOT" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
TOTEM_ART.lang='<path d="M12 13 h16 a3 3 0 0 1 3 3 v9 a3 3 0 0 1 -3 3 h-9 l-6 5 v-5 h-1 a3 3 0 0 1 -3 -3 v-9 a3 3 0 0 1 3 -3 Z" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M16 20 h11 M16 25 h8" stroke="TOT" stroke-width="2.2" stroke-linecap="round"/>';

TOTEM_ART.lens='<circle cx="24" cy="22" r="11" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M24 11 v22 M13 22 h22" stroke="TOT" stroke-width="1.5"/><path d="M14 31 q10 5 20 0" stroke="TOT" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
TOTEM_ART.express='<path d="M10 12 h22 a3 3 0 0 1 3 3 v12 a3 3 0 0 1 -3 3 h-12 l-7 6 v-6 h-3 a3 3 0 0 1 -3 -3 v-12 a3 3 0 0 1 3 -3 Z" fill="none" stroke="TOT" stroke-width="2.4"/><circle cx="21" cy="20" r="4" fill="none" stroke="TOT" stroke-width="2"/><path d="M14 32 q7 5 14 0" fill="none" stroke="TOT" stroke-width="2"/>';

TOTEM_ART.cooldown='<circle cx="24" cy="19" r="10" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M24 25 v13 M19 32 l5 5 l5 -5" stroke="TOT" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
TOTEM_ART.bodymap='<circle cx="24" cy="13" r="5" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M16 36 q0 -13 8 -13 q8 0 8 13" fill="none" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><circle cx="20" cy="27" r="1.8" fill="TOT"/><circle cx="28" cy="23" r="1.8" fill="TOT"/>';
TOTEM_ART.health='<rect x="13" y="17" width="21" height="14" rx="3" fill="none" stroke="TOT" stroke-width="2.4"/><rect x="36" y="21" width="3" height="6" fill="TOT"/><rect x="16" y="20" width="12" height="8" rx="1.5" fill="TOT"/>';
TOTEM_ART.team='<circle cx="17" cy="17" r="5" fill="none" stroke="TOT" stroke-width="2.2"/><circle cx="31" cy="17" r="5" fill="none" stroke="TOT" stroke-width="2.2"/><path d="M9 36 q0 -10 8 -10 M23 36 q0 -10 8 -10" fill="none" stroke="TOT" stroke-width="2.2" stroke-linecap="round"/><path d="M24 13 v11 M18.5 18.5 h11" stroke="TOT" stroke-width="2" stroke-linecap="round"/>';

TOTEM_ART.synthesis='<circle cx="24" cy="24" r="8" fill="none" stroke="TOT" stroke-width="2.6"/><path d="M24 4v9M24 35v9M4 24h9M35 24h9" stroke="TOT" stroke-width="2.6" stroke-linecap="round"/><path d="M12 12l5 5M36 12l-5 5M12 36l5-5M36 36l-5-5" stroke="TOT" stroke-width="2" stroke-linecap="round" opacity=".55"/><circle cx="24" cy="24" r="2.4" fill="TOT"/>';

TOTEM_ART.boundary='<path d="M24 5.5 l1.9 3.8 4.2 .6 -3 2.9 .7 4.2 -3.8 -2 -3.8 2 .7 -4.2 -3 -2.9 4.2 -.6 Z" fill="TOT"/><rect x="17" y="14" width="14" height="28" rx="2" fill="none" stroke="TOT" stroke-width="2.4"/><rect x="19.4" y="16" width="9.2" height="6.6" fill="#e05a4a"/><rect x="19.4" y="23.5" width="9.2" height="6.6" fill="#f0b24a"/><rect x="19.4" y="31" width="9.2" height="6.6" fill="#8fbf6a"/><rect x="14" y="42" width="20" height="3.6" rx="1.6" fill="TOT" opacity=".55"/>';

TOTEM_ART.standby='<circle cx="24" cy="9" r="4.6" fill="TOT"/><path d="M19.5 15 h9 l3.5 24 h-16 Z" fill="none" stroke="TOT" stroke-width="2.4"/><path d="M28.5 21 q11 -3 15 -10" stroke="TOT" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="44" cy="11" r="2.6" fill="TOT"/><path d="M9 40 l2 4 l4 .6 -3 3 l.7 4.2 -3.7 -2 -3.7 2 .7 -4.2 -3 -3 l4 -.6 Z" fill="TOT" opacity=".7"/>';

TOTEM_ART.screendown='<path d="M44 8 a4 4 0 1 0 6 6 a5 5 0 1 1 -6 -6 Z" fill="TOT"/><rect x="20" y="14" width="24" height="34" rx="4" fill="none" stroke="TOT" stroke-width="2.4"/><rect x="23.4" y="17.6" width="17.2" height="22" rx="2" fill="TOT" opacity=".25"/><path d="M14 30 h36" stroke="TOT" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="44.4" r="1.6" fill="TOT"/>';
TOTEM_ART.likes='<path d="M32 10 v6" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><circle cx="32" cy="9" r="2.2" fill="TOT"/><path d="M14 22 h36" stroke="TOT" stroke-width="2.4" stroke-linecap="round"/><path d="M22 22 l-4 8 M42 22 l4 8" stroke="TOT" stroke-width="2" stroke-linecap="round"/><path d="M12 30 h20 v4 H12 Z" fill="TOT" opacity=".8"/><path d="M40 30 h12 v4 H40 Z" fill="TOT" opacity=".8"/><path d="M32 16 v6" stroke="TOT" stroke-width="2"/>';

function totem(id,size,color){
  var art=TOTEM_ART[id]; if(!art)return "";
  var inner=art.split("TOT").join(color||"#f0d68a");
  return '<svg viewBox="0 0 48 48" width="'+size+'" height="'+size+'" style="display:block">'+inner+'</svg>';
}
function helpBadge(size){
  return '<svg viewBox="0 0 48 48" width="'+size+'" height="'+size+'" style="display:block">'+
  '<rect x="10" y="8" width="28" height="34" rx="5" fill="rgba(216,180,90,.1)" stroke="#f0d68a" stroke-width="2.5"/>'+
  '<path d="M24 16 v10 M18 21 h12" stroke="#f0d68a" stroke-width="3" stroke-linecap="round"/>'+
  '<path d="M15 32 q9 6 18 0" stroke="#f0d68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
  '</svg>';
}
function comboBadge(locked,size){
  if(locked)return '<svg viewBox="0 0 48 48" width="'+size+'" height="'+size+'" style="display:block"><circle cx="24" cy="24" r="20" fill="none" stroke="#5c7263" stroke-width="2.5"/><path d="M17 22v-3a7 7 0 0 1 14 0v3" fill="none" stroke="#5c7263" stroke-width="3"/><rect x="15" y="22" width="18" height="13" rx="3" fill="#5c7263"/><circle cx="24" cy="28.5" r="2" fill="#0c1310"/></svg>';
  return '<svg viewBox="0 0 48 48" width="'+size+'" height="'+size+'" style="display:block"><circle cx="19" cy="24" r="11" fill="none" stroke="#f0d68a" stroke-width="3"/><circle cx="29" cy="24" r="11" fill="none" stroke="#d8b45a" stroke-width="3"/><circle cx="24" cy="24" r="3.4" fill="#f0d68a"/></svg>';
}
function pactBadge(size){
  var dots=CHAR_ORDER.map(function(k,i){
    var a=i*Math.PI/2-Math.PI/4;
    return '<circle cx="'+(24+13.4*Math.cos(a)).toFixed(1)+'" cy="'+(24+13.4*Math.sin(a)).toFixed(1)+'" r="3" fill="'+CHARS[k].hex+'"/>';
  }).join("");
  return '<svg viewBox="0 0 48 48" width="'+size+'" height="'+size+'" style="display:block"><circle cx="24" cy="24" r="20" fill="rgba(216,180,90,.1)" stroke="#f0d68a" stroke-width="2.5"/>'+dots+
  '<rect x="17" y="17" width="14" height="10" rx="3" fill="none" stroke="#f0d68a" stroke-width="2.5"/><path d="M21 17l-2-4h8l-2 4" fill="#f0d68a"/></svg>';
}

/* ---- 角色 Q 版小人（viewBox 0 0 64 64） ---- */
function charSVG(key,size){
  var hex=CHARS[key].hex, skin="#f2c9a0", ink="#2f2a26", shoe="#22302a";
  var s='<svg viewBox="0 0 64 64" width="'+size+'" height="'+size+'" style="display:block">';
  s+='<ellipse cx="32" cy="60" rx="15" ry="3.4" fill="rgba(0,0,0,.35)"/>';
  if(key==="song"){
    s+='<path d="M27 50 L21 59" stroke="#31413a" stroke-width="6" stroke-linecap="round"/><path d="M35 50 L41 59" stroke="#31413a" stroke-width="6" stroke-linecap="round"/><circle cx="20" cy="59.5" r="3" fill="'+shoe+'"/><circle cx="42" cy="59.5" r="3" fill="'+shoe+'"/>';
    s+='<rect x="21" y="33" width="22" height="19" rx="7" fill="'+hex+'"/>';
    s+='<path d="M43 39 L52 34" stroke="'+skin+'" stroke-width="5.5" stroke-linecap="round"/><circle cx="53" cy="33.5" r="3.2" fill="'+skin+'"/><path d="M21 39 L12 45" stroke="'+skin+'" stroke-width="5.5" stroke-linecap="round"/><circle cx="11" cy="45.5" r="3.2" fill="'+skin+'"/>';
    s+='<circle cx="32" cy="22" r="12.5" fill="'+skin+'"/>';
    s+='<path d="M19.5 21 a12.5 12.5 0 0 1 25 0 l-3.5 -1.5 a9.5 9.5 0 0 0 -18 0 z" fill="#6b4f35"/><path d="M31 7 l-3.5 5 M33 7.5 l3 4.5" stroke="#6b4f35" stroke-width="2.4" stroke-linecap="round"/>';
    s+='<path d="M19.5 17.5 q12.5 -7 25 0 l0 3.6 q-12.5 -6.4 -25 0 z" fill="#e2777a"/><path d="M43 19 l9 -3.5 -2 6.5 z" fill="#e2777a"/>';
    s+='<circle cx="27" cy="24" r="1.9" fill="'+ink+'"/><circle cx="37" cy="24" r="1.9" fill="'+ink+'"/><path d="M28 29.5 q4 3.6 8 0" stroke="'+ink+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
  }else if(key==="jiu"){
    s+='<path d="M28 50 v9 M36 50 v9" stroke="#31413a" stroke-width="6" stroke-linecap="round"/><circle cx="28" cy="59" r="3" fill="'+shoe+'"/><circle cx="36" cy="59" r="3" fill="'+shoe+'"/>';
    s+='<rect x="22" y="33" width="20" height="19" rx="6" fill="'+hex+'"/><path d="M27 33 v19 M37 33 v19" stroke="rgba(255,255,255,.25)" stroke-width="1.6"/>';
    s+='<path d="M22 40 L15 44" stroke="'+skin+'" stroke-width="5.5" stroke-linecap="round"/><circle cx="14" cy="44.5" r="3.2" fill="'+skin+'"/><rect x="6" y="38" width="10" height="8" rx="1.5" fill="#d8b45a" transform="rotate(-12 11 42)"/><path d="M11 38.5 v7" stroke="#a8863c" stroke-width="1.2"/>';
    s+='<path d="M42 40 L47 47" stroke="'+skin+'" stroke-width="5.5" stroke-linecap="round"/><circle cx="47.5" cy="48" r="3.2" fill="'+skin+'"/>';
    s+='<circle cx="32" cy="22" r="12.5" fill="'+skin+'"/><path d="M19.5 22 a12.5 12.5 0 0 1 25 0 v-3 a12.5 12.5 0 0 0 -25 0 z" fill="#33404f"/>';
    s+='<circle cx="27" cy="24" r="4.6" fill="rgba(255,255,255,.14)" stroke="#2b2f36" stroke-width="2"/><circle cx="37" cy="24" r="4.6" fill="rgba(255,255,255,.14)" stroke="#2b2f36" stroke-width="2"/><path d="M31.6 24 h0.8 M22.4 23.5 l-3 -1.5 M41.6 23.5 l3 -1.5" stroke="#2b2f36" stroke-width="2" stroke-linecap="round"/>';
    s+='<circle cx="27" cy="24" r="1.5" fill="'+ink+'"/><circle cx="37" cy="24" r="1.5" fill="'+ink+'"/><path d="M29 30.5 h6" stroke="'+ink+'" stroke-width="2" stroke-linecap="round"/>';
  }else if(key==="mian"){
    s+='<path d="M23 46 l-3 13 h22 l-3 -13 z" fill="'+hex+'"/><path d="M32 46 v13" stroke="rgba(255,255,255,.25)" stroke-width="1.6"/>';
    s+='<rect x="23" y="33" width="18" height="14" rx="6" fill="'+hex+'"/><path d="M26 33 L38 47 M38 33 L26 47" stroke="rgba(255,255,255,.3)" stroke-width="1.6"/>';
    s+='<path d="M41 40 L48 43" stroke="'+skin+'" stroke-width="5.5" stroke-linecap="round"/><circle cx="49" cy="43.5" r="3.2" fill="'+skin+'"/><rect x="46" y="34" width="9" height="12" rx="2.5" fill="#cfd8c5"/><rect x="46" y="34" width="9" height="4" rx="2" fill="#9aa88f"/>';
    s+='<path d="M23 40 L18 46" stroke="'+skin+'" stroke-width="5.5" stroke-linecap="round"/><circle cx="17.5" cy="46.5" r="3.2" fill="'+skin+'"/>';
    s+='<circle cx="32" cy="22" r="12.5" fill="'+skin+'"/><path d="M19.5 22 a12.5 12.5 0 0 1 25 0 z" fill="#8a5a30"/><circle cx="17" cy="21" r="5.5" fill="#8a5a30"/><circle cx="47" cy="21" r="5.5" fill="#8a5a30"/>';
    s+='<path d="M24 24.5 q3 2.8 6 0 M34 24.5 q3 2.8 6 0" stroke="'+ink+'" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28.5 30 q3.5 3.2 7 0" stroke="'+ink+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
    s+='<ellipse cx="23" cy="28.5" rx="2.4" ry="1.5" fill="rgba(226,119,122,.45)"/><ellipse cx="41" cy="28.5" rx="2.4" ry="1.5" fill="rgba(226,119,122,.45)"/>';
  }else{
    s+='<path d="M29 50 v9 M35 50 v9" stroke="#31413a" stroke-width="5.5" stroke-linecap="round"/><circle cx="29" cy="59" r="2.8" fill="'+shoe+'"/><circle cx="35" cy="59" r="2.8" fill="'+shoe+'"/>';
    s+='<rect x="23" y="33" width="18" height="18" rx="7" fill="'+hex+'"/>';
    s+='<path d="M22 31 q10 6 20 0 l0 5 q-10 -6 -20 0 z" fill="'+hex+'"/><path d="M37 34 l11 9 -4.5 2.5 -9 -8 z" fill="'+hex+'"/>';
    s+='<circle cx="30" cy="47" r="3" fill="'+skin+'"/><circle cx="35.5" cy="47.5" r="3" fill="'+skin+'"/>';
    s+='<circle cx="32" cy="22" r="12.5" fill="'+skin+'"/><path d="M19.5 22 a12.5 12.5 0 0 1 25 0 l0 -2 q-12.5 -10 -25 0 z" fill="#3c3a52"/>';
    s+='<path d="M40 6 l1.7 3.6 4 .5 -2.9 2.8 .7 4 -3.5 -1.9 -3.5 1.9 .7 -4 -2.9 -2.8 4 -.5 z" fill="#f0d68a" transform="translate(-1,-1) scale(.92)"/>';
    s+='<path d="M34.5 26 q2.4 2 4.6 0" stroke="'+ink+'" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M27.5 30.5 q4.5 2.8 9 0" stroke="'+ink+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  }
  return s+'</svg>';
}

/* ---- Boss 滤滤（人设滤镜主 · 「你看人家的生活」的声音） ---- */
function bossSVG(size){
  var dots="";
  for(var i=0;i<8;i++){
    var a=i*Math.PI/4, px=(58+46*Math.cos(a)).toFixed(1), py=(42+38*Math.sin(a)).toFixed(1);
    dots+='<path d="M'+px+' '+(py-3.2)+' l1 2.3 l2.5 .3 l-1.9 1.7 l.5 2.5 l-2.1 -1.2 l-2.1 1.2 l.5 -2.5 l-1.9 -1.7 l2.5 -.3 Z" fill="'+(i%2?"#f4f1e6":"#f0b24a")+'" opacity="'+(0.5+(i%3)*0.16).toFixed(2)+'"/>';
  }
  return '<svg viewBox="0 0 120 110" width="'+size+'" height="'+Math.round(size*0.92)+'" style="display:block">'+
  '<ellipse cx="58" cy="54" rx="54" ry="50" fill="rgba(18,26,32,.5)"/>'+
  /* 滤镜手柄（右上斜出，探出气泡遮挡区） */
  '<path d="M84 34 L110 14" stroke="#c98a2e" stroke-width="9" stroke-linecap="round"/>'+
  '<path d="M84 34 L110 14" stroke="#f0b24a" stroke-width="5" stroke-linecap="round"/>'+
  /* 镜框 + 镜面（左暗右亮两面） */
  '<circle cx="58" cy="42" r="30" fill="#2b333f" stroke="#f0b24a" stroke-width="4"/>'+
  '<circle cx="58" cy="42" r="23" fill="#5a6472"/>'+
  '<path d="M58 19 A23 23 0 0 1 58 65 Z" fill="#6e7888"/>'+
  /* 镜面高光 */
  '<path d="M40 33 A23 23 0 0 1 50 21" stroke="#f4f1e6" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".45"/>'+
  /* 红色 ✕ 眼（y26–34，整只落在可见带内） */
  '<path d="M44 26 l9 9 M53 26 l-9 9" stroke="#e05a4a" stroke-width="3.6" stroke-linecap="round"/>'+
  '<path d="M64 26 l9 9 M73 26 l-9 9" stroke="#e05a4a" stroke-width="3.6" stroke-linecap="round"/>'+
  /* 嘴：撇嘴（「赞这么少，删了吧」） */
  '<path d="M48 54 q10 -5 20 0" stroke="#2e3440" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
  dots+
  '<g class="pollen" style="animation-delay:.4s"><path d="M14 18 l4 4 l-4 4 l-4 -4 Z" fill="#f0b24a"/></g>'+
  '<g class="pollen" style="animation-delay:1.7s"><path d="M104 30 l4 4 l-4 4 l-4 -4 Z" fill="#f4f1e6"/></g>'+
  '</svg>';
}
/* ---- 场景插画 ---- */
/* ---- 场景插画（竞技世界 · 斗技场） ---- */
var PAVERS=[[150,318],[228,300],[306,295],[386,281],[464,267],[542,257],[624,247]];
function sceneKindOf(id){
  if(id==="i1"||id==="i2")return "camp";
  if(id==="w1"||id==="w2"||id==="w3")return "clear";
  return "arena";
}
function sceneSVG(kind){
  var clear=(kind==="clear"), camp=(kind==="camp"), arena=!clear&&!camp;
  var sky1=camp?"#1a1428":(clear?"#3a2a1c":"#141020"), sky2=camp?"#0d0a16":(clear?"#241910":"#0a0812");
  var sid="sk"+kind;
  var body="";
  if(camp){
    /* 营地（集结地）：帐篷 + 篝火 + 月亮 */
    body+='<rect x="0" y="250" width="880" height="130" fill="#150f20"/><rect x="0" y="250" width="880" height="6" fill="#3a2f52"/>';
    body+='<ellipse cx="440" cy="286" rx="330" ry="60" fill="rgba(143,191,106,.07)"/>';
    /* 月亮（今晚的主角） */
    body+='<circle cx="120" cy="70" r="26" fill="#f0d68a" opacity=".9"/>';
    body+='<circle cx="132" cy="62" r="23" fill="#141020"/>';
    /* 帐篷 */
    body+='<path d="M180 292 L230 232 L280 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>';
    body+='<path d="M230 232 L280 292 L262 292 L230 254 L198 292 L180 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>';
    body+='<path d="M226 292 L230 258 L234 292 Z" fill="#f0d68a" opacity=".8"/>';
    body+='<path d="M640 292 L688 238 L736 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>';
    body+='<path d="M688 238 L736 292 L718 292 L688 260 L658 292 L640 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>';
    /* 篝火 */
    body+='<path d="M426 100 L454 100 M425 96 L455 104 M455 96 L425 104" stroke="#4a3520" stroke-width="5" stroke-linecap="round"/>';
    body+='<path class="flame" d="M440 98 C430 88 435 76 440 66 C447 76 452 88 440 98 Z" fill="#e8934a"/>';
    body+='<path class="flame f2" d="M440 96 C435 89 437 81 440 75 C443 81 445 89 440 96 Z" fill="#f0d68a"/>';
    body+='<rect x="300" y="168" width="280" height="34" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="2"/>';
    body+='<text x="440" y="191" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">数字篇 · 营地</text>';
    body+='<ellipse cx="220" cy="300" rx="100" ry="15" fill="rgba(240,178,74,.08)" class="fogA"/>';
    body+='<ellipse cx="660" cy="306" rx="100" ry="15" fill="rgba(201,143,216,.07)" class="fogA"/>';
  }else if(arena){
    /* 屏中潮：夜空 + 巨大手机 + 信息流 + 潮水 */
    /* 星星 */
    body+='<g fill="#f0d68a"><circle cx="90" cy="60" r="2" opacity=".7"/><circle cx="220" cy="100" r="1.6" opacity=".5"/><circle cx="700" cy="70" r="2.2" opacity=".8"/><circle cx="800" cy="120" r="1.8" opacity=".6"/><circle cx="560" cy="46" r="1.6" opacity=".5"/></g>';
    /* 巨大手机（立在右侧，屏幕朝左） */
    body+='<rect x="600" y="60" width="180" height="290" rx="22" fill="#241b36" stroke="#f0b24a" stroke-width="2.6"/>';
    body+='<rect x="614" y="78" width="152" height="252" rx="8" fill="#101820"/>';
    /* 屏内信息流：三条精修帖（小图+心形） */
    body+='<rect x="626" y="92" width="128" height="62" rx="4" fill="#1c2a38" stroke="#2e4458" stroke-width="1.4"/>';
    body+='<circle cx="646" cy="112" r="7" fill="#f0b24a" opacity=".8"/><path d="M626 140 h128" stroke="#2e4458" stroke-width="1.2"/><path d="M634 150 h60" stroke="#3a5468" stroke-width="2"/>';
    body+='<rect x="626" y="164" width="128" height="62" rx="4" fill="#241b2e" stroke="#3a2f52" stroke-width="1.4"/>';
    body+='<circle cx="646" cy="184" r="7" fill="#c98fd8" opacity=".8"/><path d="M626 212 h128" stroke="#3a2f52" stroke-width="1.2"/><path d="M634 222 h60" stroke="#4a3f62" stroke-width="2"/>';
    body+='<rect x="626" y="236" width="128" height="62" rx="4" fill="#2a2416" stroke="#4a3f28" stroke-width="1.4"/>';
    body+='<circle cx="646" cy="256" r="7" fill="#8fbf6a" opacity=".8"/><path d="M626 284 h128" stroke="#4a3f28" stroke-width="1.2"/><path d="M634 294 h60" stroke="#5f5238" stroke-width="2"/>';
    /* 屏内通知点 */
    body+='<circle cx="742" cy="102" r="5" fill="#e05a4a"/><circle cx="742" cy="174" r="5" fill="#e05a4a"/><circle cx="742" cy="246" r="5" fill="#e05a4a"/>';
    /* 手机底部 home 横条 */
    body+='<rect x="660" y="338" width="60" height="5" rx="2.5" fill="#4a3f62"/>';
    /* 左侧：蹲着看手机的队员剪影 + 潮水 */
    body+='<rect x="0" y="248" width="600" height="132" fill="#181225"/>';
    body+='<rect x="0" y="248" width="600" height="5" fill="#2a2140"/>';
    /* 潮水（两条波浪涌向队员） */
    body+='<path d="M0 300 q60 -14 120 0 t120 0 t120 0 t120 0 t120 0" stroke="rgba(138,148,164,.35)" stroke-width="3" fill="none"/>';
    body+='<path d="M0 322 q80 -12 160 0 t160 0 t160 0" stroke="rgba(138,148,164,.22)" stroke-width="2.4" fill="none"/>';
    /* 蹲着看屏的剪影（被潮水围住） */
    body+='<g fill="#5a6472"><circle cx="300" cy="268" r="11"/><path d="M288 282 q12 -8 24 0 l4 22 h-32 Z"/><rect x="304" y="288" width="22" height="30" rx="4" fill="#101820" stroke="#f0b24a" stroke-width="1.6"/></g>';
    body+='<g fill="#6e7888"><circle cx="200" cy="278" r="9"/><path d="M190 290 q10 -7 20 0 l3 20 h-26 Z"/></g>';
    body+='<g fill="#6e7888"><circle cx="396" cy="278" r="9"/><path d="M386 290 q10 -7 20 0 l3 20 h-26 Z"/></g>';
    /* 屏幕光照（投在队员脸上） */
    body+='<ellipse cx="330" cy="286" rx="70" ry="26" fill="rgba(240,178,74,.10)" class="fogA"/>';
    /* 舞台横幅 */
    body+='<rect x="120" y="140" width="440" height="30" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="1.8"/>';
    body+='<text x="340" y="161" font-size="17" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">数字篇 · 屏中潮</text>';
    body+='<text x="300" y="352" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif" opacity=".85">屏 中</text>';
    body+='<ellipse cx="220" cy="330" rx="160" ry="22" fill="rgba(138,148,164,.08)" class="fogA"/>';
  }else{
    /* 破晓：屏幕暗下去，天亮了 */
    body+='<rect x="0" y="248" width="880" height="132" fill="#2a2018"/>';
    body+='<rect x="0" y="248" width="880" height="5" fill="#43321f"/>';
    /* 手机黑了屏（朝下扣着） */
    body+='<rect x="620" y="150" width="170" height="120" rx="18" fill="#1c1530" stroke="#43321f" stroke-width="2.4"/>';
    body+='<rect x="636" y="166" width="138" height="88" rx="6" fill="#241b36"/>';
    body+='<path d="M660 210 l30 -26 l30 26" stroke="#4a3f62" stroke-width="3" fill="none" stroke-linecap="round"/>';
    /* 太阳 */
    body+='<circle cx="180" cy="110" r="30" fill="#f0c86a"/>';
    body+='<circle cx="180" cy="110" r="42" fill="none" stroke="#f0c86a" stroke-width="2" opacity=".4"/>';
    /* 睡着的四个人 */
    body+='<g fill="#6e7888"><circle cx="300" cy="272" r="10"/><path d="M290 284 q10 -7 20 0 l3 18 h-26 Z"/></g>';
    body+='<g fill="#6e7888"><circle cx="380" cy="278" r="9"/><path d="M371 289 q9 -6 18 0 l3 17 h-24 Z"/></g>';
    body+='<g fill="#f0d68a"><circle cx="470" cy="272" r="10"/><path d="M460 284 q10 -7 20 0 l3 18 h-26 Z"/></g>';
    body+='<g fill="#f0d68a"><circle cx="546" cy="278" r="9"/><path d="M537 289 q9 -6 18 0 l3 17 h-24 Z"/></g>';
    /* 潮水退了 */
    body+='<path d="M0 318 q80 -10 160 0 t160 0 t160 0 t160 0" stroke="rgba(240,214,138,.18)" stroke-width="2.4" fill="none"/>';
    body+='<g class="flower"><rect x="240" y="256" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="580" y="252" width="9" height="9" rx="2" fill="#8fbf6a"/><rect x="120" y="270" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="700" y="264" width="8" height="8" rx="2" fill="#8fbf6a"/></g>';
    body+='<ellipse cx="440" cy="280" rx="300" ry="40" fill="rgba(240,214,138,.10)" class="fogA"/>';
  }
  var skyBlocks=[[64,58,17],[148,38,11],[262,78,13],[352,34,9],[470,62,16],[566,40,10],[662,92,13],[766,48,15],[846,104,10],[196,116,8],[600,124,9]];
  var skyG="";
  skyBlocks.forEach(function(b,i){
    skyG+='<rect x="'+b[0]+'" y="'+b[1]+'" width="'+b[2]+'" height="'+b[2]+'" rx="2" fill="'+(i%3===0?"#3a2a1c":(i%3===1?"#241810":"#4a3422"))+'" opacity="'+(0.35+(i%4)*0.14).toFixed(2)+'"/>';
  });
  return '<svg class="scene-svg" viewBox="0 0 880 380" preserveAspectRatio="xMidYMid slice">'+
  '<defs><linearGradient id="'+sid+'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sky1+'"/><stop offset="1" stop-color="'+sky2+'"/></linearGradient>'+
  '</defs>'+
  '<rect width="880" height="380" fill="url(#'+sid+'sky)"/>'+
  skyG+
  body+
  '</svg>';
}
/* ---- 营地横幅（标题页 / 结算页） ---- */
function campStrip(uid){
  var pos=[["song",96],["jiu",162],["mian",716],["shan",782]];
  var chars="";
  pos.forEach(function(p){
    chars+='<svg x="'+p[1]+'" y="56" width="46" height="46">'+charSVG(p[0],46)+'</svg>';
  });
  return '<svg class="scene-svg" viewBox="0 0 880 130" preserveAspectRatio="xMidYMid slice">'+
  '<defs><radialGradient id="cs'+uid+'" cx=".5" cy=".95" r=".65"><stop offset="0" stop-color="rgba(240,180,90,.25)"/><stop offset="1" stop-color="rgba(240,180,90,0)"/></radialGradient></defs>'+
  '<rect width="880" height="130" fill="#141020"/>'+
  '<circle cx="790" cy="24" r="15" fill="#dfe8cf" opacity=".85"/><circle cx="784" cy="20" r="2.4" fill="rgba(120,140,110,.35)"/>'+
  '<g fill="#dfe8cf" opacity=".7"><circle cx="120" cy="30" r="1.4"/><circle cx="260" cy="52" r="1.2"/><circle cx="420" cy="34" r="1.3"/><circle cx="560" cy="56" r="1.1"/><circle cx="690" cy="36" r="1.3"/></g>'+
  '<circle cx="440" cy="112" r="112" fill="url(#cs'+uid+')"/>'+
  '<path d="M0 106 L140 96 L300 104 L460 96 L620 106 L780 98 L880 104 L880 130 L0 130 Z" fill="#1c1630"/>'+
  '<rect x="420" y="70" width="40" height="42" rx="7" fill="#241b36" stroke="#f0b24a" stroke-width="1.8"/>'+
  '<rect x="424" y="74" width="32" height="30" rx="3" fill="#101820"/>'+
  '<path d="M430 88 l4.4 5 l4.4 -5 l3.6 3.4 l2 -3.4 l3.4 4" stroke="#f0b24a" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
  '<rect x="432" y="106" width="16" height="2.6" rx="1.3" fill="#4a3f62"/>'+
  chars+
  '</svg>';
}

/* ---------- 特效 ---------- */
function fxAnimate(node,frames,opts){
  if(node&&typeof node.animate==="function")return node.animate(frames,opts);
  return null;
}
function renderSquadZone(ownerOn){
  var z=$("#squadZone"); if(!z)return;
  z.innerHTML="";
  CHAR_ORDER.forEach(function(k){
    var c=CHARS[k];
    var s=el("div","sq"+(ownerOn===k?" owner-on":""));
    var ava=el("div","sq-ava");
    ava.innerHTML=charSVG(k,44);
    if(ownerOn===k)ava.style.borderColor=c.hex;
    s.appendChild(ava);
    s.appendChild(el("div","sq-name",c.name));
    z.appendChild(s);
  });
}
function squadShake(){
  fxAnimate($("#squadZone"),[
    {transform:"translateX(0)"},{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(-4px)"},{transform:"translateX(0)"}
  ],{duration:380,easing:"ease"});
}
function shakeBoss(){
  var b=$("#bossWrap"); if(!b)return;
  b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake");
  setTimeout(function(){b.classList.remove("shake");},460);
}
function tauntBoss(){
  var b=$("#bossWrap"); if(!b)return;
  b.classList.remove("taunt"); void b.offsetWidth; b.classList.add("taunt");
  setTimeout(function(){b.classList.remove("taunt");},520);
}
function dmgFloat(n,cls){
  var host=$("#fxLayer"); if(!host)return;
  var d=el("div","dmg-num"+(cls?" "+cls:""),n);
  d.style.left=(34+Math.random()*26)+"%";
  d.style.top=(24+Math.random()*22)+"%";
  host.appendChild(d);
  var a=fxAnimate(d,[
    {transform:"translateY(0) scale(.5)",opacity:0},
    {transform:"translateY(-16px) scale(1.25)",opacity:1,offset:.25},
    {transform:"translateY(-56px) scale(1)",opacity:0}
  ],{duration:1000,easing:"ease-out"});
  if(a)a.onfinish=function(){d.remove();};
  else setTimeout(function(){d.remove();},1000);
}
function comboBanner(text,comboId){
  var g=$("#battleground"); if(!g)return;
  var b=el("div","combo-banner");
  b.appendChild(el("span",null,"🔗 组合技 · "+text));
  g.appendChild(b);
  setTimeout(function(){b.remove();},1700);
}
function flashGround(){
  var g=$("#battleground"); if(!g)return;
  g.classList.remove("flash"); void g.offsetWidth; g.classList.add("flash");
  setTimeout(function(){g.classList.remove("flash");},380);
}
function flyCards(chipEls,done){
  if(!chipEls||!chipEls.length){done&&done();return;}
  var anims=chipEls.filter(function(c){return c&&typeof c.animate==="function";});
  if(!anims.length){done&&done();return;}
  var left=anims.length;
  anims.forEach(function(c,i){
    var r=c.getBoundingClientRect(),boss=$("#bossWrap").getBoundingClientRect();
    var ghost=c.cloneNode(true);
    ghost.style.cssText+=";position:fixed;left:"+r.left+"px;top:"+r.top+"px;width:"+r.width+"px;margin:0;z-index:60;pointer-events:none;";
    document.body.appendChild(ghost);
    var dx=(boss.left+boss.width/2)-(r.left+r.width/2);
    var dy=(boss.top+boss.height/2)-(r.top+r.height/2);
    var a=fxAnimate(ghost,[
      {transform:"translate(0,0) scale(1) rotate(0)",opacity:1},
      {transform:"translate("+(dx*.5)+"px,"+(dy*.5-40)+"px) scale(1.15) rotate("+(i?12:-12)+"deg)",opacity:1,offset:.55},
      {transform:"translate("+dx+"px,"+dy+"px) scale(.35)",opacity:.15}
    ],{duration:480,easing:"ease-in"});
    if(a)a.onfinish=function(){ghost.remove();if(--left===0)done&&done();};
    else{ghost.remove();if(--left===0)done&&done();}
  });
}
function impactFx(combo){
  flashGround(); shakeBoss();
  dmgFloat(combo?60:30,combo?"gold":"");
  if(combo){beep("combo");}else beep("hit");
}
function stampBoss(skillId){
  var host=$("#bossStamps"); var wrap=$("#bossWrap");
  if(!host||!wrap)return;
  if(host.children.length>=8)return;
  var st=el("div","st");
  st.innerHTML=totem(skillId,26,"#f0d68a");
  st.style.left=(12+Math.random()*62)+"%";
  st.style.top=(14+Math.random()*58)+"%";
  host.appendChild(st);
}
function bossBurstFx(){
  var host=$("#fxLayer"); if(!host)return;
  for(var i=0;i<14;i++){
    var p=el("i","ember");
    var sz=6+Math.random()*14;
    p.style.width=sz+"px"; p.style.height=sz+"px";
    p.style.left=(46+ (Math.random()*26-13))+"%";
    p.style.top=(24+(Math.random()*20-10))+"%";
    host.appendChild(p);
    var a=fxAnimate(p,[
      {transform:"translate(0,0) scale(.4)",opacity:.9},
      {transform:"translate("+(Math.random()*120-60)+"px,"+(-120-Math.random()*90)+"px) scale(1.2)",opacity:0}
    ],{duration:900+Math.random()*500,easing:"ease-out"});
    if(a)a.onfinish=function(){p.remove();};
    else setTimeout(function(){p.remove();},1300);
  }
  var bw=$("#bossWrap");
  if(bw){bw.style.transition="opacity .5s";bw.style.opacity="0";}
}
function confetti(n){
  var host=$("#endBody"); if(!host)return;
  var colors=["#d8b45a","#f0d68a","#7bc96f","#c9a2e0","#f2b880","#6fa8dc"];
  for(var i=0;i<n;i++){
    var c=el("i","confetti");
    c.style.left=(Math.random()*96+2)+"%";
    c.style.background=colors[i%colors.length];
    c.style.animationDelay=(Math.random()*.9)+"s";
    c.style.animationDuration=(1.6+Math.random()*1.3)+"s";
    host.appendChild(c);
    (function(el2){setTimeout(function(){el2.remove();},3400);})(c);
  }
}

/* ================= 存档 ================= */
function save(silent){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));
      if(!silent)toast("💾 已保存");}
  catch(e){if(!silent)toast("保存失败：浏览器禁止了本地存储");}
}
function load(){try{return JSON.parse(localStorage.getItem(SAVE_KEY));}catch(e){return null;}}
function autosave(){save(true);}
function saveBest(rating){
  var best=null;
  try{best=JSON.parse(localStorage.getItem(BEST_KEY));}catch(e){}
  if(!best||RANK[rating]>RANK[best.rating]){
    best={rating:rating,diff:DIFFS[state.diff].name,date:new Date().toISOString().slice(0,10)};
    try{localStorage.setItem(BEST_KEY,JSON.stringify(best));}catch(e){}
  }
  return best;
}
function bestLine(){
  var best=null;
  try{best=JSON.parse(localStorage.getItem(BEST_KEY));}catch(e){}
  var b=$("#bestLine");
  var html="";
  if(best)html="🏆 本章最佳记录：<b>"+best.rating+"</b> · "+best.diff+" · "+best.date;
  var p1=null;
  try{p1=JSON.parse(localStorage.getItem("brainexp_ch1_best_v3"));}catch(e){}
  if(p1)html+=(html?"<br>":"")+"🏅 已继承第一章：「拖延沼泽」最佳 <b>"+p1.rating+"</b> · "+p1.diff;
  var p2=null;
  try{p2=JSON.parse(localStorage.getItem("brainexp_ch2_best_v1"));}catch(e){}
  if(p2)html+=(html?"<br>":"")+"🏅 已继承第二章：「分心花田」最佳 <b>"+p2.rating+"</b> · "+p2.diff;
  var p3=null;
  try{p3=JSON.parse(localStorage.getItem("brainexp_ch3_best_v1"));}catch(e){}
  if(p3)html+=(html?"<br>":"")+"🏅 已继承第三章：「遗忘迷宫」最佳 <b>"+p3.rating+"</b> · "+p3.diff;
  var p4=null;
  try{p4=JSON.parse(localStorage.getItem("brainexp_ch4_best_v1"));}catch(e){}
  if(p4)html+=(html?"<br>":"")+"🏅 已继承第四章：「理解冰山」最佳 <b>"+p4.rating+"</b> · "+p4.diff;
  var p5=null;
  try{p5=JSON.parse(localStorage.getItem("brainexp_ch5_best_v1"));}catch(e){}
  if(p5)html+=(html?"<br>":"")+"🏅 已继承第五章：「否定斗技场」最佳 <b>"+p5.rating+"</b> · "+p5.diff;
  var p6=null;
  try{p6=JSON.parse(localStorage.getItem("brainexp_ch6_best_v1"));}catch(e){}
  if(p6)html+=(html?"<br>":"")+"🏅 已继承第六章：「语言风暴」最佳 <b>"+p6.rating+"</b> · "+p6.diff;
  var p7=null;
  try{p7=JSON.parse(localStorage.getItem("brainexp_social_best_v1"));}catch(e){}
  if(p7)html+=(html?"<br>":"")+"🏅 已继承社交特别篇：「关系回声」最佳 <b>"+p7.rating+"</b> · "+p7.diff;
  var p8=null;
  try{p8=JSON.parse(localStorage.getItem("brainexp_ch8_best_v1"));}catch(e){}
  if(p8)html+=(html?"<br>":"")+"🏅 已继承第八章：「能量峡谷」最佳 <b>"+p8.rating+"</b> · "+p8.diff;
  var p9=null;
  try{p9=JSON.parse(localStorage.getItem("brainexp_ch9_best_v1"));}catch(e){}
  if(p9)html+=(html?"<br>":"")+"🏅 已继承终章：「大脑王座」最佳 <b>"+p9.rating+"</b> · "+p9.diff;
  var p10=null;
  try{p10=JSON.parse(localStorage.getItem("brainexp_ch10_best_v1"));}catch(e){}
  if(p10)html+=(html?"<br>":"")+"🏅 已继承边界篇：「界线平原」最佳 <b>"+p10.rating+"</b> · "+p10.diff;
  var p11=null;
  try{p11=JSON.parse(localStorage.getItem("brainexp_ch11_best_v1"));}catch(e){}
  if(p11)html+=(html?"<br>":"")+"🏅 已继承旁观篇：「看台边」最佳 <b>"+p11.rating+"</b> · "+p11.diff;
  b.innerHTML=html;
}

/* ================= HUD ================= */
function renderSquad(){
  var box=$("#squad"); box.innerHTML="";
  Object.keys(CHARS).forEach(function(k){
    var c=CHARS[k];
    var chip=el("div","pchip"+(state.me===k?" me":""));
    chip.style.borderColor=state.me===k?"var(--gold)":"var(--line)";
    var ava=el("span","ava");
    ava.innerHTML=charSVG(k,22);
    chip.appendChild(ava);
    chip.appendChild(el("span",null,c.name));
    if(state.me===k)chip.appendChild(el("span","you","你"));
    box.appendChild(chip);
  });
  updateTrustUI();
}
function updateTrustUI(){
  $("#trustFill").style.width=Math.min(100,Math.round(state.trust/35*100))+"%";
  $("#trustNum").textContent=state.trust;
}
function addTrust(n,reason){
  state.trust=Math.max(0,state.trust+n);
  updateTrustUI();
  if(n>0){
    var w=document.querySelector(".trust-wrap");
    var f=el("span","float-trust","+"+n+(reason?" "+reason:""));
    w.appendChild(f);
    setTimeout(function(){f.remove();},1400);
  }
  autosave();
}
function renderMap(node){
  var strip=$("#mapStrip"); if(!strip)return;
  strip.innerHTML="";
  MAP_NODES.forEach(function(n,i){
    if(i>0)strip.appendChild(el("span","map-link"));
    var d=el("div","map-node"+(i<node?" passed":"")+(i===node?" current":""));
    d.appendChild(el("span","mn",n.e));
    d.appendChild(el("span",null,n.t));
    strip.appendChild(d);
  });
}

/* ================= 标题 / 难度 / 角色 ================= */
function refreshTitle(){
  $("#btn-continue").classList.toggle("hidden",!load());
  bestLine();
}
function setDiffBadge(){
  $("#badge-diff").textContent="难度："+DIFFS[state.diff].name;
  $("#pause-diff").textContent=DIFFS[state.diff].name;
}
function renderDiffGrid(){
  var g=$("#diffGrid"); g.innerHTML="";
  DIFF_ORDER.forEach(function(k){
    var d=DIFFS[k];
    var b=el("button","card");
    var dots=el("div","lvl-dots");
    for(var i=1;i<=4;i++)dots.appendChild(el("i",i<=d.level?"on":""));
    b.appendChild(dots);
    b.appendChild(el("div","ct",d.name+(state.diff===k?" · 当前":"")));
    b.appendChild(el("div","cd",d.desc));
    b.onclick=function(){
      state.diff=d.key;
      setDiffBadge();
      autosave();
      if(diffReturn==="new"){renderCharGrid();show("scr-char");}
      else{toast("难度已切换为 "+d.name);closeModal("#overlay-pause");}
    };
    g.appendChild(b);
  });
}
function renderCharGrid(){
  var g=$("#charGrid"); g.innerHTML="";
  var chosen=state.diff;
  Object.keys(CHARS).forEach(function(k){
    var c=CHARS[k];
    var b=el("button","card char-card");
    var ava=el("div","ava-big");
    ava.innerHTML=charSVG(k,88);
    b.appendChild(ava);
    b.appendChild(el("div","ct",c.name));
    b.appendChild(el("div","role",c.role));
    b.appendChild(el("div","cd",c.desc));
    var sk=el("div","sk");
    c.skills.forEach(function(sid){sk.appendChild(el("span",null,""));});
    c.skills.forEach(function(sid){
      var w=el("span");
      w.innerHTML=totem(sid,30,c.hex);
      sk.appendChild(w);
    });
    b.appendChild(sk);
    b.appendChild(el("div","voice","内心小声音："+c.voice));
    b.onclick=function(){
      beep("click");
      state=fresh();
      state.diff=chosen;
      state.me=k; state.skills=["micro"]; state.trust=8; state.sceneId="i1";
      setDiffBadge();
      renderSquad();
      save(true);
      gotoScene("i1");
    };
    g.appendChild(b);
  });
}
function renderHelp(){
  var h=[
   ["全部选择题，点一点就能玩。","mark"],
   ["选错不惩罚，战斗中可以换招重来。","monitor"],
   ["知识点锁小学，方法都是成年人验证过的。","recode"],
   ["随时暂停存档，每次前进也会自动存。","trigger"],
   ["四档难度，随时切换，随你心情。","micro"],
   ["组队值决定连招——怎么对队友，比怎么打 Boss 更重要。","micro"]
  ];
  var g=$("#helpList"); g.innerHTML="";
  h.forEach(function(p){
    var it=el("div","help-item");
    var ic=el("span","hi");
    ic.innerHTML=totem(p[1],24,"#d8b45a");
    it.appendChild(ic);
    it.appendChild(el("span",null,p[0]));
    g.appendChild(it);
  });
}

/* ================= 剧情引擎（漫画分镜） ================= */
var typeTimer=null, typing=null;
function completeTyping(){
  if(typeTimer){clearInterval(typeTimer);typeTimer=null;}
  if(typing){typing.node.textContent=typing.text;typing=null;}
}
function typeInto(node,text){
  if(text==null)text="";
  var n=0; node.textContent="";
  typing={node:node,text:text};
  typeTimer=setInterval(function(){
    n++;
    node.textContent=text.slice(0,n);
    if(n>=text.length){clearInterval(typeTimer);typeTimer=null;typing=null;}
  },26);
}
function renderScene(id){
  state.sceneId=id;
  if(NODE_OF_SCENE[id]!=null){state.node=NODE_OF_SCENE[id];renderMap(state.node);}
  autosave();
  var sc=SCENES[id];
  if(!sc){console.error("missing scene",id);return;}
  if(sc.onEnter)sc.onEnter();
  if(sc.kind==="story")renderComic(sc);
  else if(sc.kind==="choice")renderChoice(sc);
  else if(sc.kind==="skill"){
    if(state.skills.indexOf(sc.skill)<0)state.skills.push(sc.skill);
    openSkillModal(sc.skill,sc.lead||"",function(){gotoScene(sc.next);});
  }
  else if(sc.kind==="combo")renderComboCard();
}
function gotoScene(id){
  if(id==="BATTLE"){startBattle();return;}
  if(id==="END"){showEnd();return;}
  show("scr-game");
  renderScene(id);
}
function buildStage(sceneId){
  var box=$("#gameBody");
  box.innerHTML="";
  var frame=el("div","comic-frame");
  frame.dataset.scene=sceneId;
  frame.insertAdjacentHTML("afterbegin",sceneSVG(sceneKindOf(sceneId)));
  if(sceneId==="conv"){
    frame.insertAdjacentHTML("beforeend",'<div class="stage-boss" style="opacity:0;transform:translateY(54px)">'+bossSVG(150)+'</div>');
  }
  var narr=el("div","stage-caption hidden");
  frame.appendChild(narr);
  var cap=el("div","caption hidden");
  frame.appendChild(cap);
  var fx=el("div","stage-fx");
  frame.appendChild(fx);
  var row=el("div","actor-row");
  CHAR_ORDER.forEach(function(k){
    var c=CHARS[k];
    var a=el("div","actor");
    a.dataset.k=k;
    var f=el("div","ava-svg");
    f.innerHTML=charSVG(k,78);
    if(k===state.me)f.style.filter="drop-shadow(0 0 6px rgba(216,180,90,.45))";
    a.appendChild(f);
    a.appendChild(el("div","name-tag",c.name));
    row.appendChild(a);
  });
  frame.appendChild(row);
  fxAnimate(row,[
    {transform:"translateX(-26%)",opacity:0},
    {transform:"translateX(0)",opacity:1}
  ],{duration:480,easing:"ease-out",fill:"forwards"});
  box.appendChild(frame);
  var bubble=el("div","bubble-wrap hidden");
  var spr=el("div","speaker-row");
  spr.appendChild(el("span","speaker-chip"));
  bubble.appendChild(spr);
  bubble.appendChild(el("div","bubble-text"));
  box.appendChild(bubble);
  var dots=el("div","dots");
  box.appendChild(dots);
  var tray=el("div","choice-tray hidden");
  box.appendChild(tray);
  return {
    narr:narr,cap:cap,bubble:bubble,fx:fx,row:row,frame:frame,
    chip:bubble.querySelector(".speaker-chip"),
    txt:bubble.querySelector(".bubble-text"),
    dots:dots,tray:tray
  };
}

function setActiveActor(key){
  var actors=$$("#gameBody .actor");
  actors.forEach(function(a){
    var on=(key&&a.dataset.k===key)||(key==="ALL");
    a.classList.toggle("active",!!on);
  });
}
function litFly(fx){
  ["song","jiu","mian","shan"].forEach(function(k,i){
    var d=el("div","spark");
    var col=CHARS[k].hex;
    d.style.width="18px"; d.style.height="18px";
    d.style.background=col;
    d.style.boxShadow="0 0 18px "+col;
    var sx=(i%2)*90+3, sy=(i<2?8:86);
    d.style.left=sx+"%"; d.style.top=sy+"%";
    fx.appendChild(d);
    var a=fxAnimate(d,[
      {transform:"translate(0,0) scale(1)",opacity:1},
      {transform:"translate("+((i%2?-1:1)*(14-i*8))+"vw,-"+(30+i*4)+"vh) scale(.4)",opacity:1,offset:.6},
      {transform:"translate("+((44-sx))+"%,-"+(50-sy)+"%) scale(.1)",opacity:0}
    ],{duration:900,easing:"ease-in-out"});
    if(a)a.onfinish=function(){d.remove();};
    else setTimeout(function(){d.remove();},900);
  });
  beep("unlock");
}
function bubbleRain(fx){
  for(var i=0;i<8;i++){
    (function(k){
      setTimeout(function(){
        var p=el("i","ember");
        var sz=5+Math.random()*10;
        p.style.width=sz+"px"; p.style.height=sz+"px";
        p.style.left=(20+Math.random()*60)+"%";
        p.style.top="62%";
        fx.appendChild(p);
        var a=fxAnimate(p,[
          {transform:"translateY(0) scale(.5)",opacity:.9},
          {transform:"translateY(-70px) scale(1.1)",opacity:0}
        ],{duration:900,easing:"ease-out"});
        if(a)a.onfinish=function(){p.remove();};
        else setTimeout(function(){p.remove();},900);
      },k*90);
    })(i);
  }
  beep("hit");
}
function focusStoneFx(){
  var st=$("#gameBody .stone-hl");
  if(st){
    st.style.transition="none"; st.style.filter="brightness(1.5)";
    setTimeout(function(){st.style.transition="filter .8s";st.style.filter="";},450);
  }
  beep("click");
}
function swampClearFx(){
  var f=$("#gameBody .comic-frame");
  if(f){f.style.transition="filter .8s";f.style.filter="brightness(1.12) saturate(1.15)";}
  beep("unlock");
}
function campfireFx(ui){
  if(ui.frame){
    ui.frame.classList.add("fire-up");
    setTimeout(function(){ui.frame.classList.remove("fire-up");},1300);
  }
  beep("unlock");
}
function marchFx(ui){
  fxAnimate(ui.row,[
    {transform:"translateX(0)",opacity:1},
    {transform:"translateX(-46%)",opacity:0}
  ],{duration:850,easing:"ease-in",fill:"forwards"});
  fxAnimate(ui.frame,[
    {transform:"scale(1)"},
    {transform:"scale(1.07)"}
  ],{duration:850,easing:"ease-in",fill:"forwards"});
}
function bossEyeFx(ui){
  for(var i=0;i<2;i++){
    (function(k){
      var d=el("div","spark");
      d.style.width="11px"; d.style.height="11px";
      d.style.background="#e8e2cf";
      d.style.boxShadow="0 0 18px rgba(232,226,207,.95)";
      d.style.left=(76+k*4.5)+"%"; d.style.top="44%";
      ui.fx.appendChild(d);
      var a=fxAnimate(d,[
        {opacity:0,transform:"scale(.3)"},
        {opacity:1,transform:"scale(1.25)",offset:.45},
        {opacity:1,transform:"scale(1)",offset:.8},
        {opacity:0,transform:"scale(.4)"}
      ],{duration:1500,delay:k*200,easing:"ease"});
      if(a)a.onfinish=function(){d.remove();};
      else setTimeout(function(){d.remove();},1800);
    })(i);
  }
  beep("click");
}
function bossRiseFx(ui){
  var b=$("#gameBody .stage-boss");
  fxAnimate(b,[
    {transform:"translateY(54px)",opacity:0},
    {transform:"translateY(-7px)",opacity:1,offset:.75},
    {transform:"translateY(0)",opacity:1}
  ],{duration:950,easing:"ease-out",fill:"forwards"});
  beep("hit");
}
function playAnim(name,ui){
  if(name==="lights")litFly(ui.fx);
  else if(name==="focus-stone")focusStoneFx();
  else if(name==="boss-burst")bubbleRain(ui.fx);
  else if(name==="swamp-clear")swampClearFx();
  else if(name==="campfire")campfireFx(ui);
  else if(name==="march")marchFx(ui);
  else if(name==="boss-eye")bossEyeFx(ui);
  else if(name==="boss-rise")bossRiseFx(ui);
}

function linePlayer(ui){
  function showNarr(text){
    ui.narr.classList.remove("hidden"); ui.cap.classList.add("hidden"); ui.bubble.classList.add("hidden");
    setActiveActor(null);
    typeInto(ui.narr,text);
  }
  function showAct(text){
    ui.cap.classList.remove("hidden"); ui.narr.classList.add("hidden"); ui.bubble.classList.add("hidden");
    setActiveActor(null);
    typeInto(ui.cap,"（"+text+"）");
  }
  function showSay(who,text){
    ui.bubble.classList.remove("hidden"); ui.narr.classList.add("hidden"); ui.cap.classList.add("hidden");
    var key=NAME2KEY[who];
    setActiveActor(key==="boss"?null:(who==="四人"?"ALL":key));
    ui.chip.textContent=who;
    if(key&&CHARS[key])ui.chip.style.background=CHARS[key].hex;
    else if(key==="boss")ui.chip.style.background="var(--danger)";
    else ui.chip.style.background="var(--gold2)";
    typeInto(ui.txt,text);
  }
  return {
    narr:showNarr,act:showAct,say:showSay,
    play:function(ln){
      if(ln.anim){playAnim(ln.anim,ui);hideAllText(ui);}
      else if(ln.act)showAct(ln.act);
      else if(ln.who==="旁白")showNarr(ln.text);
      else showSay(ln.who,ln.text);
    }
  };
  function hideAllText(ui){
    ui.narr.classList.add("hidden"); ui.cap.classList.add("hidden"); ui.bubble.classList.add("hidden");
  }
}
function renderComic(sc){
  var box=$("#gameBody");
  var ui=buildStage(state.sceneId);
  var player=linePlayer(ui);
  completeTyping();
  var hint=$("#nextHint");
  hint.textContent="点击画面继续 ▸";
  hint.classList.remove("hidden","choose");
  ui.dots.innerHTML="";
  sc.lines.forEach(function(){ui.dots.appendChild(el("i"));});
  var i=0;
  function paintDots(){
    $$("#gameBody .dots i").forEach(function(d,idx){d.classList.toggle("cur",idx===i);});
  }
  function step(){
    if(i>=sc.lines.length){
      $$("#gameBody .dots i").forEach(function(d){d.classList.remove("cur");});
      gotoScene(sc.next);return;
    }
    player.play(sc.lines[i]);
    i++; paintDots();
  }
  box.onclick=function(){
    if(typeTimer){completeTyping();return;}
    step();
  };
  step();
}
function renderChoice(sc){
  var box=$("#gameBody");
  var ui=buildStage(state.sceneId);
  var player=linePlayer(ui);
  completeTyping();
  ui.dots.innerHTML="";
  ui.tray.classList.remove("hidden");
  if(sc.prompt)ui.tray.appendChild(el("div","choice-title","【你的选择】"+sc.prompt));
  /* 选择引导：改提示文案 + 平滑滚动把选项带进视口 */
  var hint=$("#nextHint");
  hint.textContent="▼ 做出你的选择";
  hint.classList.remove("hidden");
  hint.classList.add("choose");
  setTimeout(function(){
    if(typeof ui.tray.scrollIntoView==="function"){
      try{ui.tray.scrollIntoView({behavior:"smooth",block:"center"});}
      catch(e){try{ui.tray.scrollIntoView();}catch(e2){}}
    }
  },80);
  var letters="ABCD";
  sc.options.forEach(function(opt,idx){
    var b=el("button","opt");
    if(sc.letters)b.appendChild(el("span","ol",letters[idx]||"·"));
    b.appendChild(el("span",null,opt.t));
    b.onclick=function(ev){
      ev.stopPropagation();
      beep("click");
      hint.classList.add("hidden");
      hint.classList.remove("choose");
      if(opt.trust)addTrust(opt.trust);
      if(opt.flag)state.flags[opt.flag]=(state.flags[opt.flag]||0)+1;
      if(opt.branch)state.branch=opt.branch;
      autosave();
      box.onclick=null;
      ui.tray.parentNode.removeChild(ui.tray);
      var lines=opt.after||[];
      if(!lines.length){gotoScene(opt.next);return;}
      var j=0;
      box.onclick=function(){
        if(typeTimer){completeTyping();return;}
        if(j>=lines.length){gotoScene(opt.next);return;}
        player.play(lines[j]);
        j++;
      };
      player.play(lines[0]);j=1;
    };
    ui.tray.appendChild(b);
  });
  setActiveActor(null);
}

/* ---------- 连招卡 ---------- */
function renderComboCard(){
  var box=$("#skillBox"); box.innerHTML="";
  box.appendChild(el("div","skill-name","🔗 连招解锁"));
  var hero=el("div","combo-hero");
  hero.innerHTML=comboBadge(false,96);
  box.appendChild(hero);
  var cn=COMBOS[0];
  var mem=cn.members.map(function(m){return SKILLS[m].name+"（"+CHARS[SKILLS[m].owner].name+"）";}).join("＋");
  box.appendChild(el("div","mantra","「"+cn.name+"」＝ "+mem));
  box.appendChild(el("div","note-sec",cn.desc));
  box.appendChild(el("div","locked-note","十一个关卡，都走过来了。远征没有终点——下一站，是你的每一天。\n冲突没有解决的章节，连招图标会是灰色的。"));
  beep("win");
  var b=el("button","btn primary","前往结算");
  b.style.marginTop="18px"; b.style.width="100%";
  b.onclick=function(){beep("click");closeModal("#modal-skill");showEnd();};
  box.appendChild(b);
  openModal("#modal-skill");
}

/* ---------- 技能卡（图腾翻转） ---------- */
function openSkillModal(id,lead,onDone){
  var sk=SKILLS[id]; if(!sk){onDone&&onDone();return;}
  var owner=CHARS[sk.owner];
  var d=diff();
  var box=$("#skillBox"); box.innerHTML="";
  box.appendChild(el("div","skill-name","🎴 新技能入手"));
  var tagRow=el("div"); tagRow.style.marginTop="6px";
  tagRow.style.textAlign="center";
  var ot=el("span","own-tag",owner.name);
  ot.style.background=owner.hex;
  tagRow.appendChild(ot);
  if(d.tags)tagRow.appendChild(el("span","new-tag","NEW"));
  box.appendChild(tagRow);
  if(lead)box.appendChild(el("div","lead-note",lead));
  var flip=el("div","flip-card");
  var inner=el("div","flip-inner");
  var front=el("div","face front");
  var frontCard=el("div","cardface");
  var tb=el("div","totem-big");
  tb.innerHTML=totem(id,84,owner.hex);
  frontCard.appendChild(tb);
  frontCard.appendChild(el("div","cname",sk.name));
  frontCard.appendChild(el("div","mantra",sk.mantra));
  front.appendChild(frontCard);
  inner.appendChild(front);
  if(d.card!=="one"){
    var back=el("div","face back");
    var backCard=el("div","cardface");
    note("一句话版",sk.one,backCard);
    note("原理 · WHY",owner.name+"的批注："+sk.why,backCard);
    note("跨界 · CROSS",sk.cross,backCard);
    back.appendChild(backCard);
    inner.appendChild(back);
    inner.onclick=function(){
      inner.classList.toggle("flipped");
      beep("click");
    };
    box.appendChild(el("div","flip-tip","👆 点击卡牌翻面，看完整笔记"));
  }else{
    box.appendChild(el("div","locked-note","困难模式：完整笔记见章末图鉴。现在，记住这句咒语，就够上路了。"));
  }
  flip.appendChild(inner);
  box.appendChild(flip);
  beep("unlock");
  var b=el("button","btn primary","记住啦 ✔");
  b.style.marginTop="18px"; b.style.width="100%";
  b.onclick=function(){beep("click");closeModal("#modal-skill");onDone&&onDone();};
  box.appendChild(b);
  openModal("#modal-skill");
  function note(lab,text,parent){
    var sec=el("div","note-sec");
    sec.appendChild(el("div","lab",lab));
    sec.appendChild(el("div",null,text));
    parent.appendChild(sec);
  }
}

/* ================= 战斗 ================= */
function startBattle(restore){
  var bg=$("#battleground");
  var old=bg.querySelector(".scene-svg");
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  bg.insertAdjacentHTML("afterbegin",sceneSVG("arena"));
  if(restore)state.battle=restore;
  else state.battle={round:0,hp:100,log:[],borrowed:[],invalid:0,sel:[],r3First:true,declined:false};
  state.node=2; renderMap(2);
  var bw=$("#bossWrap");
  bw.style.opacity="0";
  bw.innerHTML=bossSVG(150)+'<div id="bossStamps"></div>';
  var rise=fxAnimate(bw,[
    {transform:"translateY(48px)",opacity:0},
    {transform:"translateY(0)",opacity:1}
  ],{duration:700,easing:"ease-out"});
  if(rise)rise.onfinish=function(){bw.style.opacity="1";};
  else bw.style.opacity="1";
  show("scr-battle");
  var feed=$("#battleFeed"); if(feed)feed.innerHTML="";
  renderSquadZone(null);
  renderBattle();
  fitBattle();
}
/* 战斗一屏化：实测顶部框架高度，动态设定战斗区高度（适配桌面/手机/窗口缩放） */
function fitBattle(){
  var sec=$("#scr-battle");
  if(!sec||!sec.classList.contains("active"))return;
  var tb=$("#topbar"),hud=$("#hud"),main=$("main");
  /* 注意：#mapStrip 嵌套在 #hud 内，已包含在 hud 高度中，不要重复相加 */
  var top=(tb?tb.getBoundingClientRect().height:0)
         +(hud?hud.getBoundingClientRect().height:0)
         +(main?parseFloat(getComputedStyle(main).paddingTop)||0:0);
  var pb=(main?parseFloat(getComputedStyle(main).paddingBottom)||0:0);
  sec.style.height=Math.max(520,window.innerHeight-top-pb-4)+"px";
}
window.addEventListener("resize",function(){fitBattle();});
/* 出招镜头：画面轻微推近，把"出招→命中→掉血"的视线锁在画面内 */
function zoomPunch(){
  var bg=$("#battleground");
  if(!bg||typeof bg.animate!=="function")return;
  bg.classList.remove("zoom");
  void bg.offsetWidth;
  bg.classList.add("zoom");
}
function availSkills(){
  var seen={},out=[];
  state.skills.concat(state.battle.borrowed||[]).forEach(function(id){
    if(!seen[id]&&SKILLS[id]){seen[id]=1;out.push(id);}
  });
  return out;
}
function renderBattle(){
  var b=state.battle, r=ROUNDS[b.round];
  $("#bossBubble").textContent=r.bossLine;
  $("#roundName").textContent=r.name;
  $("#roundName").classList.remove("hidden");
  $("#bossHpNum").textContent=Math.max(0,b.hp);
  $("#bossHpFill").style.width=Math.max(0,b.hp)+"%";
  var bw=$("#bossWrap");
  if(bw)bw.classList.toggle("weak",b.hp>0&&b.hp<=30);
  var ease=$("#battle-ease");
  if(diff().hints){ease.textContent=r.ease;ease.classList.remove("hidden");}
  else ease.classList.add("hidden");
  /* 出招记录改为画中浮层：只飘最新一条，旧的淡出，不撑长页面 */
  var t=b.log[b.log.length-1];
  var feed=$("#battleFeed");
  if(t&&feed){
    var cls="bf-line";
    if(t.indexOf("【出招】")===0)cls="bf-line hit";
    else if(t.indexOf("【解说】")===0){cls="bf-line act";t=t.replace("【解说】","");}
    Array.prototype.forEach.call(feed.children,function(c){c.classList.add("fade");});
    feed.appendChild(el("div",cls,t));
    while(feed.children.length>2)feed.removeChild(feed.firstChild);
    clearTimeout(feed._t);
    feed._t=setTimeout(function(){
      Array.prototype.forEach.call(feed.children,function(c){c.classList.add("fade");});
      setTimeout(function(){feed.innerHTML="";},700);
    },2600);
  }
  renderHand();
  updateConfirm();
}

function renderHand(){
  var b=state.battle, r=ROUNDS[b.round];
  var hand=$("#hand"); hand.innerHTML="";
  if(r.valid==="COMBO"){
    hand.appendChild(el("span","trust-label","选两位【不同角色】的卡牌，组合出招："));
  }
  availSkills().forEach(function(id){
    var sk=SKILLS[id], owner=CHARS[sk.owner];
    var chip=el("button","chip"+(b.sel.indexOf(id)>=0?" on":""));
    chip.dataset.id=id;
    chip.style.borderTopColor=owner.hex;
    var od=el("span","own",owner.name);
    od.style.color=owner.hex;
    chip.appendChild(od);
    var cem=el("span","cem");
    cem.innerHTML=totem(id,44,owner.hex);
    chip.appendChild(cem);
    chip.appendChild(el("span",null,sk.name));
    chip.onclick=function(){
      if(b.done||b.locked)return;
      beep("click");
      if(r.valid!=="COMBO"){
        b.sel=[id];
        renderHand(); updateConfirm();
        return;
      }
      var i=b.sel.indexOf(id);
      if(i>=0)b.sel.splice(i,1);
      else{
        if(b.sel.length>=2){toast("组合技只需要两位队友");return;}
        b.sel.push(id);
      }
      renderHand(); updateConfirm();
    };
    hand.appendChild(chip);
  });
}
function updateConfirm(){
  var b=state.battle;
  $("#btn-confirm").disabled=!b||b.sel.length===0||!!b.done||!!b.locked;
  $("#btn-confirm").textContent=ROUNDS[b.round].valid==="COMBO"?"组合出招 🔗":"确认出招 ⚔";
}
function ownersOf(sel){return sel.map(function(id){return SKILLS[id].owner;});}
function chipEls(ids){return ids.map(function(id){return document.querySelector('.chip[data-id="'+id+'"]');});}
function confirmSkill(){
  var b=state.battle;
  if(!b||b.done||b.locked)return;
  var r=ROUNDS[b.round], rk=r.rk||["whisper","warm","curse"][b.round];
  if(b.sel.length===0){toast("先选一招");return;}
  var els=chipEls(b.sel);
  if(b.round<2){
    var id=b.sel[0];
    if(r.valid.indexOf(id)>=0){
      b.log.push("【出招】"+CHARS[SKILLS[id].owner].name+" · "+SKILLS[id].name);
      REPLAY[rk][id].forEach(function(l){b.log.push(l);});
      b.hp-=30; b.sel=[];
      b.round++;
      renderBattle();
      zoomPunch();
      flyCards(els,function(){impactFx(false);stampBoss(id);});
    }else{
      b.invalid++;
      b.log.push("（没打中）");
      REPLAY[rk].miss.forEach(function(l){b.log.push(l);});
      b.sel=[];
      renderBattle();
      dmgFloat("MISS","miss");
      tauntBoss();
    }
  }else{
    if(b.sel.length<2){
      REPLAY[rk].single.forEach(function(l){b.log.push(l);});
      b.log.push("（这一回合，一个人接不住）");
      b.r3First=false;
      renderBattle();
      tauntBoss();
      squadShake();
      offerBorrow();
    }else if(ownersOf(b.sel)[0]===ownersOf(b.sel)[1]){
      REPLAY[rk].same.forEach(function(l){b.log.push(l);});
      b.r3First=false;
      renderBattle();
      tauntBoss();
      squadShake();
      offerBorrow();
    }else{
      var key=b.sel.slice().sort().join("+");
      var lines=COMBO_LINES[key]||COMBO_FALLBACK;
      var cname=COMBO_NAMES[key]||"跨角色组合";
      b.log.push("【出招】组合技 · "+b.sel.map(function(i){return SKILLS[i].name;}).join("＋"));
      lines.forEach(function(l){b.log.push(l);});
      var comboIds=b.sel.slice();
      b.hp=0; b.sel=[];
      b.locked=true; /* 胜利过渡窗口锁：防止重复出招（winBattle 的 done 哨兵不受影响） */
      renderBattle();
      zoomPunch();
      flyCards(els,function(){impactFx(true);comboIds.forEach(function(sid){stampBoss(sid);});});
      comboBanner(cname,key);
      bossBurstFx();
      setTimeout(winBattle,1600);
    }
  }
  autosave();
}
function offerBorrow(){
  var b=state.battle;
  var plan=null;
  for(var i=0;i<BORROW_ORDER.length;i++){
    var id=BORROW_ORDER[i];
    if(state.skills.indexOf(id)<0&&b.borrowed.indexOf(id)<0&&SKILLS[id].owner!==state.me){plan=id;break;}
  }
  $("#btn-borrow-no").classList.toggle("hidden",!!(b.declined||!plan));
  if(b.sel.length>=2)b.sel=[];
  if(!plan){
    $("#borrowText").textContent="队友们在岸上喊成一片——再挑两位不同角色的卡牌试试！";
  }else{
    $("#borrowAva").innerHTML=charSVG(SKILLS[plan].owner,64);
    $("#borrowText").textContent=BORROW_LINE[SKILLS[plan].owner]+"（获得「"+SKILLS[plan].name+"」，组队值 +3）";
    $("#modal-borrow").dataset.plan=plan;
  }
  openModal("#modal-borrow");
}
function winBattle(){
  var b=state.battle;
  if(!b||b.done)return;
  b.done=true;
  state.battleDone={
    perfect:b.invalid===0&&b.r3First,
    comboFirst:b.r3First,
    invalid:b.invalid,
    borrowed:b.borrowed.length>0
  };
  state.battle=null;
  gotoScene("w1");
}

/* ================= 结算 ================= */
function computeRating(){
  var t=state.trust;
  var bd=state.battleDone;
  if(bd){
    if(bd.perfect)t+=6;
    if(bd.comboFirst)t+=4;
  }
  var rating="B";
  if(t>=28)rating="SSS"; else if(t>=20)rating="S"; else if(t>=13)rating="A";
  if((state.flags.toxic||0)>=2&&RANK[rating]>RANK.A)rating="A";
  return {trust:t,rating:rating};
}
function showEnd(){
  var r=computeRating();
  state.secret=(state.me==="shan"&&state.branch==="D"&&RANK[r.rating]>=RANK.S);
  var best=saveBest(r.rating);
  state.node=4; renderMap(4);
  var box=$("#endBody"); box.innerHTML="";
  var card=el("div","end-card");
  var eh=el("div","end-hero");
  eh.innerHTML=campStrip("end");
  card.appendChild(eh);
  card.appendChild(el("div","page-sub","数字篇 · 屏中潮 —— 完"));
  /* 两栏：左 = 评级+评语+统计；右 = 图腾墙+眠眠观察+最佳记录 */
  var main=el("div","end-main");
  var left=el("div");
  var wrap=el("div","rating-wrap"+(RANK[r.rating]>=RANK.S?" glow":""));
  wrap.appendChild(el("div","rating-big "+r.rating,r.rating));
  left.appendChild(wrap);
  left.appendChild(el("div","end-line",diffRatingLine(r.rating)));
  var stats=el("div","end-stats");
  [["组队值",r.trust],["战斗评价",battleText()],["走的路线",routeName()]].forEach(function(p){
    var s=el("div","stat"); s.appendChild(el("div","v",p[1])); s.appendChild(el("div","k",p[0])); stats.appendChild(s);
  });
  left.appendChild(stats);
  main.appendChild(left);
  var right=el("div");
  var wall=el("div","totem-wall");
  state.skills.forEach(function(id){
    var w=el("div","tw gold");
    var ic=el("span","twi");
    ic.innerHTML=totem(id,38,CHARS[SKILLS[id].owner].hex);
    w.appendChild(ic);
    w.appendChild(el("span",null,SKILLS[id].name));
    wall.appendChild(w);
  });
  [["小队公约","pact"],["连招 · "+COMBOS[0].name,"combo"]].forEach(function(p){
    var w=el("div","tw");
    var ic=el("span","twi");
    ic.innerHTML=p[1]==="pact"?pactBadge(38):comboBadge(false,38);
    w.appendChild(ic);
    w.appendChild(el("span",null,p[0]));
    wall.appendChild(w);
  });
  right.appendChild(wall);
  var ob=el("div","observe");
  ob.textContent="眠眠的观察："+observeLine();
  right.appendChild(ob);
  right.appendChild(el("div","footer-note","🏆 本章最佳记录："+best.rating+" · "+best.diff+"（已留存）"));
  main.appendChild(right);
  card.appendChild(main);
  if(state.secret){
    var sec=el("div","secret");
    sec.textContent="✨ 隐藏台词：深夜最亮的那块屏，关掉它的人，是你自己——明天见。";
    card.appendChild(sec);
  }
  var row=el("div","center-row");
  var b1=el("button","btn primary","📖 章末图鉴");
  b1.onclick=function(){codexReturn="end";openCodex();};
  var b2=el("button","btn","🔁 重玩本章");
  b2.onclick=function(){
    var chosen=state.diff;
    state=fresh(); state.diff=chosen;
    diffReturn="new"; renderDiffGrid(); show("scr-diff");
  };
  var b3=el("button","btn ghost","🏟 回主页");
  b3.onclick=function(){location.href="Ch0-大脑营地.html";};
  row.appendChild(b1);row.appendChild(b2);row.appendChild(b3);
  card.appendChild(row);
  box.appendChild(card);
  show("scr-end");
  if(RANK[r.rating]>=RANK.S){confetti(36);beep("win");}
  autosave();
}
function diffRatingLine(r){
  if(r==="SSS")return "满分小队——四个人，都长成了彼此的外挂。";
  if(r==="S")return "漂亮的配合！再听听那几句没说出口的话，SSS 在等你。";
  if(r==="A")return "过关了。深夜最亮的那块屏，是你自己关掉的。";
  return "也走过了屏中潮。屏幕里的潮水很响，你听见了自己。";
}
function battleText(){
  var bd=state.battleDone;
  if(!bd)return "—";
  if(bd.perfect)return "完美 · 零失误一击穿";
  if(bd.invalid>=3)return "波折 · 试了 "+bd.invalid+" 次错招";
  if(bd.borrowed)return "稳健 · 借招成功";
  return "良好";
}
function routeName(){
  var m={A:"A线 · 先锁屏一下",B:"B线 · 先想清比什么",C:"C线 · 先问一句",D:"D线 · 先认累信号"};
  return state.branch?m[state.branch]:"—";
}
function observeLine(){
  var f=state.flags;
  if((f.toxic||0)>=1)return "「刚才那句话，有点扎人。下次想脱口而出的时候，先喝口水——我给你们续上。」";
  if(f.hush)return "（眠眠看了闪闪一眼，什么都没说，只是把水杯放在了闪闪手边。）";
  return "「以后再刷到停不下来，我先认一下身体的信号：眼睛酸、心里空，就落闸。屏幕朝下，说一句『明天见』。」";
}

/* ================= 图鉴 ================= */
function openCodex(){
  var g=$("#codexGrid"); g.innerHTML="";
  var owned={};
  state.skills.forEach(function(id){owned[id]=1;});
  Object.keys(SKILLS).forEach(function(id){
    var sk=SKILLS[id], owner=CHARS[sk.owner];
    var c=el("div","cdx-card"+(owned[id]?"":" locked"));
    var t=el("div","cdx-t");
    if(owned[id])t.innerHTML=totem(id,60,owner.hex);
    else t.innerHTML=totem(id,60,"#5c7263");
    c.appendChild(t);
    c.appendChild(el("div","cdx-name",(owned[id]?"":"🔒 ")+sk.name));
    var row=el("div","codex-skill-row");
    var tag=el("span","own-tag",owner.name); tag.style.background=owner.hex;
    row.appendChild(tag);
    c.appendChild(row);
    c.appendChild(el("div","mantra",sk.mantra));
    if(diff().card!=="one"||owned[id]){
      var s=el("div","note-sec");
      s.appendChild(el("div",null,sk.one));
      c.appendChild(s);
    }
    g.appendChild(c);
  });
  var cc=el("div","cdx-card");
  var ct=el("div","cdx-t");
  ct.innerHTML=pactBadge(60);
  cc.appendChild(ct);
  cc.appendChild(el("div","cdx-name","小队公约"));
  cc.appendChild(el("div","mantra","屏幕里的生活，是修过图的；我的价值，不靠点赞数！"));
  cc.appendChild(el("div","note-sec","数字篇诞生。公约会随章节累积，章末统一收录。"));
  g.appendChild(cc);
  COMBOS.forEach(function(cn){
    var c=el("div","cdx-card"+(cn.locked?" locked":""));
    var t=el("div","cdx-t");
    t.innerHTML=comboBadge(!!cn.locked,60);
    c.appendChild(t);
    c.appendChild(el("div","cdx-name",(cn.locked?"🔒 ":"")+cn.name));
    c.appendChild(el("div","mantra",cn.members.map(function(m){return SKILLS[m].name;}).join("＋")));
    c.appendChild(el("div","note-sec",cn.desc));
    g.appendChild(c);
  });
  var hc=el("div","cdx-card");
  var ht=el("div","cdx-t"); ht.innerHTML=helpBadge(60);
  hc.appendChild(ht);
  hc.appendChild(el("div","cdx-name","求助口袋卡"));
  hc.appendChild(el("div","mantra","求助不是软弱，是精准调用资源。"));
  var hnote=el("div","note-sec");
  hnote.appendChild(el("div",null,"正面：写下 3 个你信得过的大人 —— ①＿＿＿ ②＿＿＿ ③＿＿＿"));
  hnote.appendChild(el("div",null,"背面：54321 着陆 —— 看 5 样 · 摸 4 样 · 听 3 声 · 闻 2 样 · 尝 1 味"));
  hnote.appendChild(el("div",null,"心里乱的时候：先着陆，再找人说。"));
  hc.appendChild(hnote);
  g.appendChild(hc);
  show("scr-codex");
}

/* ================= 弹窗 ================= */
function openModal(sel){$(sel).classList.remove("hidden");}
function closeModal(sel){$(sel).classList.add("hidden");}

/* ================= 绑定 ================= */
function boot(){
  renderDiffGrid();
  refreshTitle();
  renderSquad();
  setDiffBadge();
  renderHelp();
  $("#heroCamp").innerHTML=campStrip("hero");
  $("#heroSquad").innerHTML=CHAR_ORDER.map(function(k){
    return '<div class="hs">'+charSVG(k,64)+'</div>';
  }).join("");

  $("#btn-new").onclick=function(){diffReturn="new";renderDiffGrid();show("scr-diff");};
  $("#btn-continue").onclick=function(){
    var sv=load(); if(!sv){toast("没有找到存档");return;}
    state=Object.assign(fresh(),sv);
    setDiffBadge(); renderSquad();
    if(state.battle)startBattle(state.battle);
    else gotoScene(state.sceneId||"i1");
  };
  $("#btn-help").onclick=function(){
    var cur=document.querySelector(".screen.active");
    helpReturn=cur?cur.id:"scr-title";
    show("scr-help");
  };
  $("#btn-help2").onclick=function(){helpReturn="scr-title";show("scr-help");};
  $("#btn-home").onclick=function(){location.href="Ch0-大脑营地.html";};
  $("#btn-help-back").onclick=function(){show(helpReturn);};
  $("#btn-codex-back").onclick=function(){
    if(codexReturn==="pause")openModal("#overlay-pause");
    else show("scr-end");
  };
  $("#btn-codex-in").onclick=function(){codexReturn="pause";closeModal("#overlay-pause");openCodex();};
  $("#btn-pause").onclick=function(){openModal("#overlay-pause");};
  $("#btn-resume").onclick=function(){closeModal("#overlay-pause");};
  $("#btn-save").onclick=function(){save(false);};
  $("#btn-load").onclick=function(){
    var sv=load(); if(!sv){toast("还没有存档");return;}
    state=Object.assign(fresh(),sv);
    setDiffBadge(); renderSquad();
    if(state.battle)startBattle(state.battle);else gotoScene(state.sceneId||"i1");
    closeModal("#overlay-pause");
    toast("📂 已读取");
  };
  $("#btn-diff-in").onclick=function(){diffReturn="game";renderDiffGrid();show("scr-diff");};
  $("#btn-quit").onclick=function(){closeModal("#overlay-pause");refreshTitle();show("scr-title");};
  $("#btn-home-pause").onclick=function(){location.href="Ch0-大脑营地.html";};
  $("#btn-confirm").onclick=confirmSkill;
  $("#btn-borrow-yes").onclick=function(){
    var plan=$("#modal-borrow").dataset.plan, b=state.battle;
    if(b&&plan&&SKILLS[plan]&&state.skills.indexOf(plan)<0&&b.borrowed.indexOf(plan)<0){
      b.borrowed.push(plan);
      b.log.push("【解说】"+BORROW_LINE[SKILLS[plan].owner]);
      addTrust(3,"借招成功");
      renderBattle();
    }
    closeModal("#modal-borrow");
  };
  $("#btn-borrow-no").onclick=function(){
    state.battle.declined=true;
    closeModal("#modal-borrow");
    toast("眠眠：「那……再把这一回合想一想。」");
  };
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){
      if(!$("#overlay-pause").classList.contains("hidden")){closeModal("#overlay-pause");return;}
      if(modalOpen())return;
      var cur=document.querySelector(".screen.active");
      if(cur&&(cur.id==="scr-game"||cur.id==="scr-battle"))openModal("#overlay-pause");
      return;
    }
    if(e.key==="Enter"||e.key===" "){
      if(modalOpen())return;
      var g=$("#gameBody");
      if(g&&!$("#scr-game").classList.contains("hidden")){e.preventDefault();g.click();}
    }
  });
}

boot();
})();
