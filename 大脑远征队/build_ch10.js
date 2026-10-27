/* Ch10 构建：从 Ch9 静态源码(_ch10_base.html)换数据 → Ch10-边界篇.html
 * 章节主题：边界篇 · 界线平原（元宝游戏包「红线黄线站位」落地）
 * 新技能：边界宣言(boundary,闪)——「我不接受___，因为___」；分支=认知重编程(松)/自我解释(究)/边界宣言(闪)/状态监控(眠) 四角色
 * Boss：逼逼（逼你同意主 · 「就玩一下嘛，别小气」的声音）——替你做决定、把起外号说成开玩笑
 * 外部伙伴：阿嗨（借队员台词间接出场，NAME2KEY 不含 NPC）
 * 章末公约：「我不接受___，因为___——这句话，我可以练！」
 * 反卡死：R1/R2 有效池必含 micro+全分支技能；R3=COMBO 任意两不同角色
 * 学业铁律：生活例子为主（借漫画、等电话、约玩），不施压
 */
var fs = require("fs");
var SRC = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/_ch10_base.html";
var OUT = "D:/WorkBuddyWorkSpace/2026-10-16-16-25-39/Ch10-边界篇.html";
var s = fs.readFileSync(SRC, "utf8");
var miss = [];

function rep(a, b) { if (s.indexOf(a) < 0) { miss.push("rep: " + a.slice(0, 70)); return; } s = s.split(a).join(b); }
function swapRange(startMark, endMark, newText) {
  var i = s.indexOf(startMark), j = s.indexOf(endMark, i);
  if (i < 0 || j < 0) { miss.push("range: " + startMark.slice(0, 50)); return; }
  s = s.slice(0, i) + newText + s.slice(j);
}

/* ============ 1. 标题 / 页面文案 ============ */
rep('<title>大脑远征队 · 终章「大脑王座」</title>',
    '<title>大脑远征队 · 边界篇「界线平原」</title>');
rep('<div class="sub">终章 · 大脑王座 —— 八章所学，合成你的一招</div>',
    '<div class="sub">边界篇 · 界线平原 —— 说不行，也给理由</div>');
rep('<div class="boss-name">浑浑 · 混沌主</div>',
    '<div class="boss-name">逼逼 · 逼你同意主</div>');
rep('card.appendChild(el("div","page-sub","终章 · 大脑王座 —— 完"));',
    'card.appendChild(el("div","page-sub","边界篇 · 界线平原 —— 完"));');
rep('if(r==="A")return "过关了。王座上没有别人——这一路，是你自己走过来的。";',
    'if(r==="A")return "过关了。三条线都在你手里——红的、黄的、绿的，你自己选。";');
rep('return "也走上了大脑王座。远征没有终点——下一站，是你的每一天。";',
    'return "也守住了三条线。说「不行」的那一次，你把自己立住了。";');
rep('cc.appendChild(el("div","note-sec","终章诞生。公约会随章节累积，章末统一收录。"));',
    'cc.appendChild(el("div","note-sec","边界篇诞生。公约会随章节累积，章末统一收录。"));');
/* 图鉴·公约卡文案 → 本章公约 */
rep('cc.appendChild(el("div","mantra","事情再多，也一件一件来；没有万能的一招，只有合适的一招。"));',
    'cc.appendChild(el("div","mantra","我不接受___，因为___——这句话，我可以练。"));');

/* ============ 2. 角色技能绑定（boss 改名逼逼） ============ */
rep('var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","浑浑":"boss","四人":"all"};',
    'var NAME2KEY={"松松":"song","究究":"jiu","眠眠":"mian","闪闪":"shan","逼逼":"boss","四人":"all"};');

/* ============ 3. SKILLS（5 个：micro 沿用 + reprog/selfexplain/monitor 复用 + boundary 新） ============ */
var SKILLS_BLOCK = [
'var SKILLS={',
'  micro  :{name:"微步骤启动",owner:"song",',
'           one:"大事切成五秒能做完的小事，第一步小到不可能失败。",',
'           mantra:"「先做第一步，第一步只花五秒。」",',
'           why:"大脑看见「大任务」会害怕，看见「抬一下手」不会——启动的阻力变小了，你就动了。",',
'           cross:"再高的楼，也是一阶一阶上的。想拍球？先拍一下，就一下。"},',
'  reprog :{name:"认知重编程",owner:"song",',
'           one:"对方的话是对方的——「别小气」「大家都这样」，换成我自己的台词。",',
'           mantra:"「那句话，我可以不认领。」",',
'           why:"话是别人塞过来的，接不接，你说了算。换一句自己的，力气就回到你身上。",',
'           cross:"别人说「你肯定不敢」——换成「我还没决定」。台词一换，脚步就听你的了。"},',
'  selfexplain:{name:"自我解释",owner:"jiu",',
'           one:"先说为什么，再决定动不动——理由是自己的，选择才是自己的。",',
'           mantra:"「先问一句：为什么？」",',
'           why:"说得清理由的人，才不会被人一句话推着走。知其然，更知其所以然。",',
'           cross:"朋友约你玩，你不想去——说得出「我在等一个电话」，就不怕被说小气。"},',
'  boundary:{name:"边界宣言",owner:"shan",',
'           one:"能接受、看情况、不行——三种颜色，我自己选。不行，就说：「我不接受___，因为___。」",',
'           mantra:"「我不接受，因为___。」",',
'           why:"边界不是墙，是门——门在你自己手里。会说「不行」的人，别人才知道你的「行」值多少。",',
'           cross:"借出去的漫画不想再借？说一句「这本我还没看完」——门，还在你手里。"},',
'  monitor:{name:"状态监控",owner:"mian",',
'           one:"身体先知道：肩膀发紧、胃在打结、手心出汗——信号亮起，先认下来。",',
'           mantra:"「信号亮了，就降一档。」",',
'           why:"情绪还没开口，身体先报了信。认得信号的人，不会在撑不住的时候还硬撑。",',
'           cross:"一想到要当众发言就手心汗？那是身体在说「我在乎」——认下来，再决定要不要上。"}',
'};',
''
].join("\n");
swapRange("var SKILLS={", "var COMBOS=[", SKILLS_BLOCK);

/* ============ 4. COMBOS（两个跨角色连招） ============ */
var COMBOS_BLOCK = [
'var COMBOS=[',
'  {name:"说不行，也给理由",members:["boundary","reprog"],',
'   desc:"边界宣言（闪）＋认知重编程（松）——把「别小气」换成自己的话，再补一句「因为我___」。逼逼最怕你既立了线，又说清了理由。"},',
'  {name:"先看颜色再开口",members:["boundary","selfexplain"],',
'   desc:"边界宣言（闪）＋自我解释（究）——能接受、看情况、还是不行？先想清楚为什么，再开口。线在心里，话才稳。"}',
'];',
''
].join("\n");
swapRange("var COMBOS=[", "/* ---------- 剧情场景 ---------- */", COMBOS_BLOCK);

/* ============ 5. SCENES ============ */
var SCENES_BLOCK = [
'var SCENES={',
' i1:{kind:"story",next:"i2",lines:[',
'  {anim:"lights"},',
'  {who:"眠眠",text:"第十个世界了……"},',
'  {who:"闪闪",text:"脚下的地，分成三种颜色。"},',
'  {anim:"campfire"}',
' ]},',
' i2:{kind:"skill",skill:"micro",lead:"松松放下背包：「老规矩——先迈五秒一步。守住线，也是这么守的。」",next:"i3"},',
' i3:{kind:"story",next:"choice1",lines:[',
'  {who:"究究",text:"那条白线，会动。"},',
'  {who:"闪闪",text:"（小声）阿嗨今天……也来了。"},',
'  {anim:"focus-stone"},',
'  {anim:"boss-eye"}',
' ]},',
'',
' choice1:{kind:"choice",letters:true,prompt:"逼逼从线后探出身：「就玩一下嘛——别小气。」阿嗨笑着把球塞过来。你先出哪一招？",options:[',
'  {t:"先接住：别让他落了面子",next:"a1",branch:"A",',
'   after:[{act:"松松把球接住了。"},{who:"松松",text:"先接住，再说。"}]},',
'  {t:"先想清：我到底想不想玩",next:"b1",branch:"B",',
'   after:[{act:"究究抬起手。"},{who:"究究",text:"先问自己一句。"}]},',
'  {t:"先开口：这句话，我可以说",next:"c1",branch:"C",',
'   after:[{act:"闪闪深吸一口气。"},{who:"闪闪",text:"这次，不硬撑。"}]},',
'  {t:"先看信号：我身体哪儿紧了",next:"d1",branch:"D",',
'   after:[{act:"眠眠把手放上肩。"},{who:"眠眠",text:"我这里……发紧。"}]}',
' ]},',
'',
' /* ---- A 线 · 认知重编程 ---- */',
' a1:{kind:"story",next:"a2",lines:[',
'  {who:"松松",text:"「别小气」……这话我收过不少。"},',
'  {who:"闪闪",text:"（苦笑）我也是。"}',
' ]},',
' a2:{kind:"skill",skill:"reprog",lead:"究究推了推眼镜：「认知重编程——『别小气』是对方的话。换成我自己的：『我现在不想玩这个。』」",next:"a3"},',
' a3:{kind:"choice",letters:false,prompt:"松松怕：「可阿嗨会不高兴。」你说：",options:[',
'  {t:"「不高兴，也可以说。感受没有对错。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"松松",text:"（点头）……那我说了。"}]},',
'  {t:"「那就算了，陪他玩吧。」",next:"conv",trust:2,',
'   after:[{act:"松松把话咽了回去。"}]},',
'  {t:"「你就是想太多。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"松松别过脸去。"}]}',
' ]},',
'',
' /* ---- B 线 · 自我解释 ---- */',
' b1:{kind:"story",next:"b2",lines:[',
'  {who:"究究",text:"先问自己——我想不想？"},',
'  {who:"眠眠",text:"为什么不想？"}',
' ]},',
' b2:{kind:"skill",skill:"selfexplain",lead:"究究摊开纸：「自我解释——把『不想』说出来，再补一句为什么：『我在看书，这一章看完就来。』」",next:"b3"},',
' b3:{kind:"choice",letters:false,prompt:"究究卡壳：「为什么……怎么说？」你说：",options:[',
'  {t:"「说一个真的理由，不用完美。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"究究",text:"（写）……这一个就行。"}]},',
'  {t:"「随便编一个就行。」",next:"conv",trust:2,',
'   after:[{act:"究究把纸揉掉了。"}]},',
'  {t:"「没理由就是没理由，别问。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"究究低下了头。"}]}',
' ]},',
'',
' /* ---- C 线 · 边界宣言 ---- */',
' c1:{kind:"story",next:"c2",lines:[',
'  {who:"闪闪",text:"我句式……我学过。"},',
'  {who:"眠眠",text:"这次，再加一句。"}',
' ]},',
' c2:{kind:"skill",skill:"boundary",lead:"闪闪抽出一块三色牌：「边界宣言——『我不接受___，因为___。』能接受、看情况、不行，三种颜色，我自己选。」",next:"c3"},',
' c3:{kind:"choice",letters:false,prompt:"闪闪声音发虚：「万一他不理我了呢？」你说：",options:[',
'  {t:"「说完，他还是他，你还是你。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"闪闪",text:"（握拳）……我说。"}]},',
'  {t:"「那还是别说了。」",next:"conv",trust:2,',
'   after:[{act:"闪闪把牌放下了。"}]},',
'  {t:"「不说就对了，别矫情。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"闪闪退到了线后。"}]}',
' ]},',
'',
' /* ---- D 线 · 状态监控 ---- */',
' d1:{kind:"story",next:"d2",lines:[',
'  {who:"眠眠",text:"（按肩）这里发紧。"},',
'  {who:"松松",text:"身体先知道。"}',
' ]},',
' d2:{kind:"skill",skill:"monitor",lead:"眠眠看一眼心率：「状态监控——身体发紧，是在说『我不舒服』。信号亮起，先认下来。」",next:"d3"},',
' d3:{kind:"choice",letters:false,prompt:"眠眠犹豫：「发紧……算理由吗？」你说：",options:[',
'  {t:"「算。信号亮着，就是在报信。」",next:"conv",trust:8,flag:"kind",',
'   after:[{who:"眠眠",text:"（深呼吸）……认下了。"}]},',
'  {t:"「不算，想多了。」",next:"conv",trust:2,',
'   after:[{act:"眠眠把手放下了。"}]},',
'  {t:"「就是你太娇气。」",next:"conv",trust:-5,flag:"toxic",',
'   after:[{act:"眠眠把地图合上了。"}]}',
' ]},',
'',
' /* ---- 汇合 → Boss ---- */',
' conv:{kind:"story",next:"BATTLE",lines:[',
'  {anim:"boss-rise"},',
'  {who:"逼逼",text:"就玩一下嘛——别小气！"},',
'  {who:"眠眠",text:"（腿软）三条线……都在晃。"},',
'  {who:"四人",text:"站稳了——哪条线，都不白让！"}',
' ]},',
'',
' /* ---- 战后 ---- */',
' w1:{kind:"story",next:"w2",lines:[',
'  {anim:"boss-burst"},',
'  {who:"逼逼",text:"你们……把「愿意」和「应该」分开了……"}',
' ]},',
' w2:{kind:"story",next:"w3",onEnter:function(){',
'   if(!state.flags.conv2){state.flags.conv2=1;addTrust(2,"小队第一次同频");}',
' },lines:[',
'  {anim:"swamp-clear"},',
'  {who:"闪闪",text:"说不行，也给理由。"},',
'  {who:"四人",text:"「我不接受___，因为___——这句话，我可以练！」"},',
'  {who:"四人",text:"说不行，也给理由——三色的线，我自己守！"}',
' ]},',
' w3:{kind:"combo",next:"END"}',
'};',
''
].join("\n");
swapRange("var SCENES={", "/* ---------- 战斗 ---------- */", SCENES_BLOCK);

/* ============ 6. ROUNDS ============ */
var ROUNDS_BLOCK = [
'var ROUNDS=[',
' {name:"第 1 回合 · 红线",rk:"red",',
'  bossLine:"「就玩一下嘛——别小气！」逼逼一脚踩过你的红线。",',
'  valid:["micro","reprog","selfexplain","boundary","monitor"],',
'  ease:"眠眠：接住、想清、开口、看信号——用哪招都行。"},',
' {name:"第 2 回合 · 黄线",rk:"yellow",',
'  bossLine:"「大家都是这样的！」逼逼把黄线涂成了红的。",',
'  valid:["micro","reprog","selfexplain","boundary","monitor"],',
'  ease:"眠眠：稳住——想清楚为什么，再决定让不让。"},',
' {name:"第 3 回合 · 绿区",rk:"core",',
'  bossLine:"「你一个人，守不住三条线！」逼逼胀到最大。",',
'  valid:"COMBO",',
'  ease:"眠眠：一个人守不住。找一位不同角色的队友，各出一招。"}',
'];',
''
].join("\n");
swapRange("var ROUNDS=[", "var REPLAY={", ROUNDS_BLOCK);

/* ============ 7. REPLAY ============ */
var REPLAY_BLOCK = [
'var REPLAY={',
' red:{',
'  micro:["五秒一步——先退半步，离开红线。逼逼的脚，落了空。"],',
'  reprog:["「别小气」是对方的话。换成「我现在不想玩」——红线，亮了回来。"],',
'  selfexplain:["究究问一句「我为什么不想？」——理由一出口，红线站稳了。"],',
'  boundary:["「我不接受，因为我在看书。」三色牌一举，红线钉回地上。"],',
'  monitor:["眠眠按住发紧的肩：信号亮着——先认，再退半步。红线，回来了。"],',
'  miss:["眠眠：「再想一招。接住、想清、开口、看信号——都行。」"]',
' },',
' yellow:{',
'  micro:["五秒一步：先离开黄区中心，往边上看。逼逼的脚，慢了。"],',
'  reprog:["「大家都这样」——换成「我可以和大家不一样」。黄线，分了回来。"],',
'  selfexplain:["把「看情况」说出条件来：「这章看完，我就来。」黄线稳了。"],',
'  boundary:["「看情况——不是不行，是有条件。」三色牌一转，黄线归位。"],',
'  monitor:["身体还紧着？那这一档，先不答应。信号亮了，就降一档。"],',
'  miss:["眠眠：「再想一招。接住、想清、开口、看信号——都行。」"]',
' },',
' core:{',
'  boundary:["逼逼退了一步：「一个人……守不住……」线后伸过来一只手。"],',
'  same:["两股同色的力气撞在一起，互相抵消。眠眠：「两个人，两招——再来！」"]',
' }',
'};',
''
].join("\n");
swapRange("var REPLAY={", "var COMBO_LINES={", REPLAY_BLOCK);

/* ============ 8. COMBO_LINES / NAMES / FALLBACK / BORROW ============
 * key = 两技能 id 字母序排序后 "+" 连接；5 技能 C(5,2)=10，排除 micro+reprog 同 owner（松）→ 9 条 */
var COMBO_BLOCK = [
'var COMBO_LINES={',
' "boundary+micro"     :["闪闪立牌「我不接受，因为这一章看完就来」，松松数五秒：先退半步。","先站稳，再开口。"],',
' "boundary+monitor"   :["闪闪举牌，眠眠按住发紧的肩：信号亮着，就不硬接。","牌和信号，一起用。"],',
' "boundary+reprog"    :["闪闪把「别小气」换成自己的话，再补一句「因为我___」。","换完台词，再划线。"],',
' "boundary+selfexplain":["闪闪问「我为什么不行」，究究把理由写清楚——牌上有字了。","想清了，才说得稳。"],',
' "micro+monitor"      :["松松退半步，眠眠按住肩：先离开红线，再认信号。","退一步，松一寸。"],',
' "micro+selfexplain"  :["松松只走一小步，究究问：这一小步，为什么值得走？","小步，也想一想。"],',
' "monitor+reprog"     :["眠眠的信号一亮，松松把那句话翻译成自己的。","信号亮，就换词。"],',
' "monitor+selfexplain":["眠眠说「这里发紧」，究究问：紧在说什么？","身体在说话，脑子记下来。"],',
' "reprog+selfexplain" :["松松换掉对方的话，究究补上自己的理由。","换一句，再说清。"]',
'};',
'var COMBO_NAMES={',
' "boundary+micro":"先站再开","boundary+monitor":"牌随信号","boundary+reprog":"划线换词","boundary+selfexplain":"想清说稳",',
' "micro+monitor":"退一步","micro+selfexplain":"小步一想","monitor+reprog":"亮就换词","monitor+selfexplain":"身体记话","reprog+selfexplain":"换句说清"',
'};',
'var COMBO_FALLBACK=["两股不同颜色的力气，在界碑前立成一枚三色徽章。","逼逼的「就玩一下嘛」，被正式挡在了线外。"];',
'var BORROW_ORDER=["boundary","reprog","selfexplain","monitor"];',
'var BORROW_LINE={',
' shan:"闪闪：「边界宣言借你们——『我不接受___，因为___。』」",',
' song:"松松：「认知重编程借你们！把那句话换成自己的！」",',
' jiu :"究究：「自我解释借你们——先说为什么。」",',
' mian:"眠眠：「状态监控借你们！看身体哪儿在报信。」"',
'};',
''
].join("\n");
swapRange("var COMBO_LINES={", "/* ---------- 章节地图 ---------- */", COMBO_BLOCK);

/* ============ 9. 地图 ============ */
var MAP_BLOCK = [
'var MAP_NODES=[{k:"enter",t:"集结",e:"🚩"},{k:"plain",t:"界线平原",e:"🚧"},{k:"boss",t:"逼逼",e:"⚔"},{k:"pact",t:"公约",e:"📜"},{k:"end",t:"结算",e:"🏁"}];',
'var NODE_OF_SCENE={i1:0,i2:0,i3:0,choice1:1,a1:1,a2:1,a3:1,b1:1,b2:1,b3:1,c1:1,c2:1,c3:1,d1:1,d2:1,d3:1,conv:2,w1:3,w2:3,w3:3};',
''
].join("\n");
swapRange("var MAP_NODES=[", "/* ================= 状态 ================= */", MAP_BLOCK);

/* ============ 10. 存档版本 ============ */
rep('var SAVE_KEY="brainexp_ch9_save_v1";', 'var SAVE_KEY="brainexp_ch10_save_v1";');
rep('var BEST_KEY="brainexp_ch9_best_v1";', 'var BEST_KEY="brainexp_ch10_best_v1";');
/* 标题页继承前九章记录（追加 Ch9 继承） */
rep('  if(p8)html+=(html?"<br>":"")+"🏅 已继承第八章：「能量峡谷」最佳 <b>"+p8.rating+"</b> · "+p8.diff;',
    '  if(p8)html+=(html?"<br>":"")+"🏅 已继承第八章：「能量峡谷」最佳 <b>"+p8.rating+"</b> · "+p8.diff;\n  var p9=null;\n  try{p9=JSON.parse(localStorage.getItem("brainexp_ch9_best_v1"));}catch(e){}\n  if(p9)html+=(html?"<br>":"")+"🏅 已继承终章：「大脑王座」最佳 <b>"+p9.rating+"</b> · "+p9.diff;');

/* ============ 11. 新技能图腾：边界宣言（三色界碑+顶星） ============ */
var TOTEM_ADD = [
'TOTEM_ART.boundary=\'<path d="M24 5.5 l1.9 3.8 4.2 .6 -3 2.9 .7 4.2 -3.8 -2 -3.8 2 .7 -4.2 -3 -2.9 4.2 -.6 Z" fill="TOT"/><rect x="17" y="14" width="14" height="28" rx="2" fill="none" stroke="TOT" stroke-width="2.4"/><rect x="19.4" y="16" width="9.2" height="6.6" fill="#e05a4a"/><rect x="19.4" y="23.5" width="9.2" height="6.6" fill="#f0b24a"/><rect x="19.4" y="31" width="9.2" height="6.6" fill="#8fbf6a"/><rect x="14" y="42" width="20" height="3.6" rx="1.6" fill="TOT" opacity=".55"/>\';',
''
].join("\n");
rep("function totem(id,size,color){", TOTEM_ADD + "\nfunction totem(id,size,color){");

/* ============ 12. Boss 逼逼（逼你同意主 · 「就玩一下嘛，别小气」的声音） ============
 * 铁律：五官画在上部避开对话气泡；金色推手伸出遮挡区；纯色+明暗面，不用 url(#gradient) */
var BOSS_BLOCK = [
'/* ---- Boss 逼逼（逼你同意主 · 「就玩一下嘛，别小气」的声音） ---- */',
'function bossSVG(size){',
'  var chips="";',
'  for(var i=0;i<8;i++){',
'    var a=i*Math.PI/4, px=(60+50*Math.cos(a)).toFixed(1), py=(52+42*Math.sin(a)).toFixed(1);',
'    chips+=\'<circle cx="\'+px+\'" cy="\'+py+\'" r="\'+(5+(i%3))+\'" fill="\'+(i%2?"#5a6472":"#46505e")+\'" opacity="\'+(0.5+(i%3)*0.16).toFixed(2)+\'"/>\';',
'  }',
'  return \'<svg viewBox="0 0 120 110" width="\'+size+\'" height="\'+Math.round(size*0.92)+\'" style="display:block">\'+',
'  \'<ellipse cx="60" cy="56" rx="56" ry="52" fill="rgba(18,26,32,.55)"/>\'+',
'  /* 金色推手三股（向上伸出气泡遮挡区） */',
'  \'<path d="M34 32 Q20 16 36 8" stroke="#f0b24a" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M60 26 Q60 6 74 10" stroke="#f0b24a" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M86 32 Q100 16 84 8" stroke="#f0b24a" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  /* 推出去的手 */',
'  \'<path d="M96 60 q12 2 16 10" stroke="#8a94a4" stroke-width="4" fill="none" stroke-linecap="round"/>\'+',
'  \'<circle cx="112" cy="70" r="4" fill="#8a94a4"/>\'+',
'  /* 团身（左暗右亮两面） */',
'  \'<path d="M18 92 Q10 60 30 44 Q36 20 60 18 Q84 20 90 44 Q110 60 102 92 Z" fill="#5a6472" stroke="#2e3440" stroke-width="3" stroke-linejoin="round"/>\'+',
'  \'<path d="M60 18 Q84 20 90 44 Q110 60 102 92 L60 92 Z" fill="#6e7888"/>\'+',
'  /* 三道推压纹 */',
'  \'<path d="M36 68 q24 -8 48 0" stroke="#46505e" stroke-width="3" fill="none" stroke-linecap="round"/>\'+',
'  \'<path d="M42 78 q18 -6 36 0" stroke="#46505e" stroke-width="2.4" fill="none" stroke-linecap="round"/>\'+',
'  /* 红色 ✕ 眼（画在上部，避开气泡） */',
'  \'<path d="M44 42 l9 9 M53 42 l-9 9" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  \'<path d="M67 42 l9 9 M76 42 l-9 9" stroke="#e05a4a" stroke-width="3.4" stroke-linecap="round"/>\'+',
'  /* 嘴：努出去的语气 */',
'  \'<path d="M52 88 q8 5 16 0" stroke="#2e3440" stroke-width="2.6" fill="none" stroke-linecap="round"/>\'+',
'  chips+',
'  \'<g class="pollen" style="animation-delay:.4s"><path d="M14 18 l4 4 l-4 4 l-4 -4 Z" fill="#f0b24a"/></g>\'+',
'  \'<g class="pollen" style="animation-delay:1.7s"><path d="M104 30 l4 4 l-4 4 l-4 -4 Z" fill="#8a94a4"/></g>\'+',
'  \'</svg>\';',
'}',
''
].join("\n");
swapRange("/* ---- Boss 浑浑（混沌主 · 「想这么多干嘛……都一样」的声音） ---- */", "/* ---- 场景插画 ---- */", BOSS_BLOCK);

/* ============ 13. 场景插画整段重写：界碑前 / 界线平原 / 破晓 ============ */
var SCENESVG_BLOCK = [
'function sceneSVG(kind){',
'  var clear=(kind==="clear"), camp=(kind==="camp"), arena=!clear&&!camp;',
'  var sky1=camp?"#1a1428":(clear?"#3a2a1c":"#141020"), sky2=camp?"#0d0a16":(clear?"#241910":"#0a0812");',
'  var sid="sk"+kind;',
'  var body="";',
'  if(camp){',
'    /* 界碑前（集结地）：安全绿岛 + 帐篷 + 界碑 */',
'    body+=\'<rect x="0" y="250" width="880" height="130" fill="#150f20"/><rect x="0" y="250" width="880" height="6" fill="#3a2f52"/>\';',
'    body+=\'<ellipse cx="440" cy="286" rx="330" ry="60" fill="rgba(143,191,106,.07)"/>\';',
'    /* 帐篷 */',
'    body+=\'<path d="M180 292 L230 232 L280 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<path d="M230 232 L280 292 L262 292 L230 254 L198 292 L180 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    body+=\'<path d="M226 292 L230 258 L234 292 Z" fill="#f0d68a" opacity=".8"/>\';',
'    body+=\'<path d="M640 292 L688 238 L736 292 Z" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<path d="M688 238 L736 292 L718 292 L688 260 L658 292 L640 292 Z" fill="#1c1530" stroke="#f0b24a" stroke-width="1.4"/>\';',
'    /* 界碑（三色带 + 底座） */',
'    body+=\'<rect x="428" y="196" width="24" height="76" rx="3" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<rect x="432" y="202" width="16" height="20" fill="#e05a4a"/>\';',
'    body+=\'<rect x="432" y="224" width="16" height="20" fill="#f0b24a"/>\';',
'    body+=\'<rect x="432" y="246" width="16" height="20" fill="#8fbf6a"/>\';',
'    body+=\'<rect x="420" y="272" width="40" height="10" rx="2" fill="#2a2140" stroke="#f0b24a" stroke-width="1.6"/>\';',
'    body+=\'<circle cx="440" cy="190" r="4.6" fill="#f0d68a" class="flicker"/>\';',
'    body+=\'<rect x="300" y="168" width="280" height="34" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<text x="440" y="191" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">边界篇 · 界碑前</text>\';',
'    body+=\'<ellipse cx="220" cy="300" rx="100" ry="15" fill="rgba(240,178,74,.08)" class="fogA"/>\';',
'    body+=\'<ellipse cx="660" cy="306" rx="100" ry="15" fill="rgba(201,143,216,.07)" class="fogA"/>\';',
'  }else if(arena){',
'    /* 界线平原：绿带 / 黄带 / 红带 + 白界线 + 界碑 + 三面旗 */',
'    body+=\'<rect x="0" y="238" width="880" height="46" fill="#1e2a1a"/>\';',
'    body+=\'<rect x="0" y="284" width="880" height="46" fill="#2a2416"/>\';',
'    body+=\'<rect x="0" y="330" width="880" height="50" fill="#2a1616"/>\';',
'    body+=\'<path d="M0 238 h880 M0 284 h880 M0 330 h880" stroke="rgba(240,214,138,.5)" stroke-width="2.4"/>\';',
'    /* 三色半透明罩，让带子更像「地带」 */',
'    body+=\'<rect x="0" y="238" width="880" height="46" fill="rgba(143,191,106,.14)"/>\';',
'    body+=\'<rect x="0" y="284" width="880" height="46" fill="rgba(240,178,74,.13)"/>\';',
'    body+=\'<rect x="0" y="330" width="880" height="50" fill="rgba(224,90,74,.14)"/>\';',
'    /* 界碑横跨三带 */',
'    body+=\'<rect x="428" y="242" width="24" height="92" rx="3" fill="#241b36" stroke="#f0b24a" stroke-width="2"/>\';',
'    body+=\'<rect x="432" y="246" width="16" height="24" fill="#e05a4a"/>\';',
'    body+=\'<rect x="432" y="274" width="16" height="24" fill="#f0b24a"/>\';',
'    body+=\'<rect x="432" y="302" width="16" height="24" fill="#8fbf6a"/>\';',
'    body+=\'<rect x="420" y="334" width="40" height="10" rx="2" fill="#2a2140" stroke="#f0b24a" stroke-width="1.6"/>\';',
'    body+=\'<circle cx="440" cy="236" r="4.6" fill="#f0d68a" class="flicker"/>\';',
'    /* 三面旗：红黄绿插在带边 */',
'    body+=\'<path d="M170 334 v-46" stroke="#8a94a4" stroke-width="2.4"/><path d="M170 292 l30 8 l-30 8 Z" fill="#e05a4a"/>\';',
'    body+=\'<path d="M330 288 v-40" stroke="#8a94a4" stroke-width="2.4"/><path d="M330 252 l28 7 l-28 7 Z" fill="#f0b24a"/>\';',
'    body+=\'<path d="M710 242 v-40" stroke="#8a94a4" stroke-width="2.4"/><path d="M710 206 l28 7 l-28 7 Z" fill="#8fbf6a"/>\';',
'    /* 探照光（竞技味） */',
'    body+=\'<path d="M340 0 L400 238 L280 238 Z" fill="rgba(240,178,74,.08)"/>\';',
'    body+=\'<path d="M540 0 L600 238 L480 238 Z" fill="rgba(201,143,216,.06)"/>\';',
'    body+=\'<rect x="0" y="234" width="880" height="4" fill="rgba(240,178,74,.22)"/>\';',
'    body+=\'<rect x="150" y="150" width="580" height="30" rx="4" fill="#2a1f3a" stroke="#f0b24a" stroke-width="1.8"/>\';',
'    body+=\'<text x="440" y="171" font-size="17" fill="#f0d68a" text-anchor="middle" font-family="sans-serif">边界篇 · 界线平原</text>\';',
'    body+=\'<text x="440" y="362" font-size="18" fill="#f0d68a" text-anchor="middle" font-family="sans-serif" opacity=".85">界 碑</text>\';',
'    body+=\'<ellipse cx="300" cy="300" rx="180" ry="26" fill="rgba(138,148,164,.08)" class="fogA"/>\';',
'    body+=\'<ellipse cx="620" cy="250" rx="180" ry="24" fill="rgba(138,148,164,.07)" class="fogA"/>\';',
'  }else{',
'    /* 破晓：界碑镀金，三色花开 */',
'    body+=\'<rect x="0" y="238" width="880" height="46" fill="#26301c"/>\';',
'    body+=\'<rect x="0" y="284" width="880" height="46" fill="#33291a"/>\';',
'    body+=\'<rect x="0" y="330" width="880" height="50" fill="#3a2420"/>\';',
'    body+=\'<path d="M0 238 h880 M0 284 h880 M0 330 h880" stroke="rgba(240,214,138,.45)" stroke-width="2.2"/>\';',
'    body+=\'<rect x="428" y="242" width="24" height="92" rx="3" fill="#2e2418" stroke="#f0d68a" stroke-width="2.4"/>\';',
'    body+=\'<rect x="432" y="246" width="16" height="24" fill="#e0705a"/>\';',
'    body+=\'<rect x="432" y="274" width="16" height="24" fill="#f0c86a"/>\';',
'    body+=\'<rect x="432" y="302" width="16" height="24" fill="#a8d88a"/>\';',
'    body+=\'<rect x="420" y="334" width="40" height="10" rx="2" fill="#43321f" stroke="#f0d68a" stroke-width="1.6"/>\';',
'    body+=\'<circle cx="440" cy="236" r="5.4" fill="#f0d68a" class="flicker"/>\';',
'    body+=\'<path d="M300 0 L380 238 L260 238 Z" fill="rgba(240,214,138,.10)"/>\';',
'    body+=\'<path d="M580 0 L620 238 L500 238 Z" fill="rgba(240,214,138,.07)"/>\';',
'    body+=\'<g class="flower"><rect x="298" y="250" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="580" y="226" width="9" height="9" rx="2" fill="#e05a4a"/><rect x="222" y="264" width="9" height="9" rx="2" fill="#f0b24a"/><rect x="662" y="274" width="8" height="8" rx="2" fill="#e05a4a"/></g>\';',
'    body+=\'<ellipse cx="440" cy="270" rx="300" ry="40" fill="rgba(240,214,138,.10)" class="fogA"/>\';',
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

/* ============ 14. 营地横幅（标题页/结算页）：王座剪影 → 三色界碑 ============ */
rep("'<path d=\"M424 102 L456 102 L462 112 L418 112 Z\" fill=\"#2a2140\" stroke=\"#f0b24a\" stroke-width=\"2\"/>'+\n  '<path d=\"M428 102 L428 78 Q440 70 452 78 L452 102 Z\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"2\"/>'+\n  '<circle cx=\"440\" cy=\"86\" r=\"4.6\" fill=\"#f0d68a\" class=\"flicker\"/>'+",
    "'<rect x=\"428\" y=\"76\" width=\"24\" height=\"34\" rx=\"3\" fill=\"#241b36\" stroke=\"#f0b24a\" stroke-width=\"1.8\"/>'+\n  '<rect x=\"432\" y=\"78\" width=\"16\" height=\"9\" fill=\"#e05a4a\"/>'+\n  '<rect x=\"432\" y=\"88\" width=\"16\" height=\"9\" fill=\"#f0b24a\"/>'+\n  '<rect x=\"432\" y=\"98\" width=\"16\" height=\"9\" fill=\"#8fbf6a\"/>'+");

/* ============ 15. 结算页分支名 → 边界篇分支 ============ */
rep('var m={A:"A线 · 单线程",B:"B线 · 终极合成",C:"C线 · 身体地图",D:"D线 · 情绪重评"};',
    'var m={A:"A线 · 认知重编程",B:"B线 · 想清为什么",C:"C线 · 边界宣言",D:"D线 · 看身体信号"};');
/* 观察 → 本章主题（三色站位 + 边界宣言收束） */
rep('return "「以后不管遇到什么，我先停一秒：这件事，用哪一招？选定了，就迈五秒一步。」";',
    'return "「以后遇到让我不舒服的事，我先停一秒：能接受、看情况，还是不行？不行，就说『我不接受___，因为___』。」";');
/* 隐藏台词 → 边界篇主题 */
rep('sec.textContent="✨ 隐藏台词：王座上没有别人——这一路，是你自己走过来的。这句话，是你自己说出口的。";',
    'sec.textContent="✨ 隐藏台词：最软的那句话，往往最有力量——「我不接受，因为___」。这句话，是你自己说出口的。";');
/* 连招卡预告语 → 下两位特别篇预告 */
rep('box.appendChild(el("div","locked-note","终章没有预告——远征队的下一站，是你的每一天。\\n冲突没有解决的章节，连招图标会是灰色的。"));',
    'box.appendChild(el("div","locked-note","预告：还有两位新考验——「为别人出手」和「深夜的手机」，在排队报到。\\n冲突没有解决的章节，连招图标会是灰色的。"));');

/* ============ 输出 ============ */
if (miss.length) { console.log("⚠ 未命中替换 " + miss.length + " 处："); miss.forEach(function (m) { console.log("   - " + m); }); }
fs.writeFileSync(OUT, s, "utf8");
console.log("✅ 生成 " + OUT + " (" + (s.length / 1024).toFixed(1) + "KB)");
