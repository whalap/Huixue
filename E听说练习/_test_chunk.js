/* 断句与语调逻辑实测 */
function isYesNoQuestion(s){
  const t=s.trim();
  if(!/\?$/.test(t)) return false;
  if(/,\s*(?:is|are|was|were|do|does|did|can|could|will|would|have|has|had|should|shall|may|might|must)\s*(?:n't|not)?\s*[a-z]+\s*\?$/i.test(t)) return true;
  if(/^(do|does|did|is|are|was|were|am|can|could|will|would|shall|should|may|might|must|have|has|had)\b/i.test(t)) return true;
  return false;
}
const REPORT_VERBS=/^(said|says|say|think|thinks|thought|know|knows|knew|believe|believes|believed|hope|hopes|hoped|feel|feels|felt|find|finds|found|explain|explains|explained|agree|agrees|agreed|understand|understands|understood|remember|remembers|forget|forgets|forgot|suggest|suggests|suggested|show|shows|showed|tell|tells|told|write|writes|wrote|report|reports|reported|announce|announced|promise|promised|decide|decided|discover|discovered|realize|realized|admit|admitted|argue|argued|claim|claimed|warn|warned|notice|noticed|hear|heard|see|saw|learn|learned|mean|meant|wonder|wonders|wondered|ask|asks|asked)$/i;
function splitChunks(s){
  const s0=String(s).trim().replace(/\s+/g,' ');
  const out=[]; let buf='';
  for(let i=0;i<s0.length;i++){
    const ch=s0[i];
    buf+=ch;
    if(ch===','||ch===';'||ch===':'||ch==='—'||ch==='–'){ out.push(buf); buf=''; }
  }
  if(buf.trim()) out.push(buf);
  const parts=out.map(x=>x.trim()).filter(Boolean);
  if(parts.length===1){
    const m=parts[0].match(/\b(that|whether|if)\b/i);
    if(m && m.index>0){
      const head=parts[0].slice(0,m.index).trim();
      const tail=parts[0].slice(m.index).trim();
      const lastWord=(head.split(/\s+/).pop()||'');
      if(REPORT_VERBS.test(lastWord) && tail.split(/\s+/).length>=6){ return [head, tail]; }
    }
  }
  return parts;
}
function splitSentences(text){
  return (String(text).match(/[^.!?]+[.!?]*/g)||[String(text)]).map(s=>s.trim()).filter(Boolean);
}
function renderChunked(text){
  const sents=splitSentences(text);
  let html='';
  sents.forEach((s,si)=>{
    const chunks=splitChunks(s);
    const yN=isYesNoQuestion(s);
    chunks.forEach((c,ci)=>{
      const last=(ci===chunks.length-1);
      html+=c;
      if(last){ html+= yN ? '↗' : '↘'; }
      else { html+='↗ / '; }
    });
    if(si<sents.length-1) html+=' ';
  });
  return html;
}

const CASES = [
  ['A1 陈述+句首介词短语', 'At school, I have many friends. We play together after class.'],
  ['A1 介词短语紧跟动词(不应切)', 'I go to school by bus every day.'],
  ['A1 一般疑问句', 'Do you like playing basketball?'],
  ['A1 特殊疑问句', 'Where do you usually have lunch?'],
  ['A1 be开头疑问', 'Is your new school big?'],
  ['A1 感叹句', 'What a beautiful garden it is!'],
  ['A1 呼语', 'Li Hua, come here please.'],
  ['A2 句首状语从句', 'When I get home, I always do my homework first.'],
  ['A2 if状语从句', 'If it rains tomorrow, we will stay at home.'],
  ['A2 非限制性定语从句', 'My sister, who loves music, plays the piano well.'],
  ['A2 限制性定语从句(不应在that前停)', 'The book that I bought yesterday is very interesting.'],
  ['A2 短宾语从句(不应停)', 'I know that he is right.'],
  ['A2 长宾语从句(应停)', 'She said that she would come to the party the next day.'],
  ['B1 多句混合', 'The Earth is an amazing planet! Some places are very hot, like the areas near the equator. Can you believe it?'],
  ['B1 分号+破折号', 'Life begins again in spring; the snow melts. We work hard — and we never give up.'],
  ['B1 反意疑问句', 'You like it, don\'t you?'],
  ['B1 反意疑问句带not', 'She isn\'t coming, is she?'],
  ['B1 冒号列举', 'I need three things: a pen, a notebook and a ruler.'],
  ['B1 无标点长句', 'The teacher explained that the students who worked hard would surely pass the final examination.'],
];
let fail=0;
for(const [name, txt] of CASES){
  const out = renderChunked(txt);
  console.log('【'+name+'】');
  console.log('  原文: '+txt);
  console.log('  断句: '+out);
  // 基本断言
  const sents = splitSentences(txt);
  const chunks = sents.map(splitChunks);
  if(chunks.some(c=>c.length===0)){ console.log('  ✗ 出现空意群'); fail++; }
  if(sents.some(s=>!s.trim())){ console.log('  ✗ 出现空句'); fail++; }
  console.log('');
}
console.log('=================================');
console.log(fail===0 ? '结构断言全部通过 ✔（0 空意群 / 0 空句）' : '有 '+fail+' 处结构问题');

// 句末语调专项断言
const TONE=[
  ['Do you like it?','up'],['Is she happy?','up'],['Can we go now?','up'],
  ['Where are you?','down'],['What a day!','down'],['I am fine.','down'],
  ['You like it, don\'t you?','up'],['She isn\'t coming, is she?','up'],
];
let tf=0;
console.log('\n句末语调专项：');
for(const [q,exp] of TONE){
  const got = isYesNoQuestion(q)?'up':'down';
  const ok = got===exp;
  if(!ok) tf++;
  console.log('  '+(ok?'✔':'✗')+' '+q.padEnd(28)+' 期望 '+exp+' 实际 '+got);
}
console.log(tf===0?'语调判定全部通过 ✔':'语调判定有 '+tf+' 处不符');

/* ============================================================
   指引例句一致性专项：指引面板里教的 ✓ 读法，
   必须与 renderChunked 对同一句生成的结果完全一致，
   否则"教学"和"工具"会互相打架。
   ============================================================ */
console.log('\n指引例句一致性专项：');
const GUIDE_CASES = [
  // [名称, 例句, 期望的断句输出(与指引中 ✓ 读法一致)]
  ['四·逗号处',       'My name is Li Hua, and I am twelve.',                       'My name is Li Hua,↗ / and I am twelve.↘'],
  ['四·句首介词短语', 'In the morning, I get up at seven.',                        'In the morning,↗ / I get up at seven.↘'],
  ['四·紧跟动词不停', 'I go to school.',                                           'I go to school.↘'],
  ['四·紧跟动词不停', 'I get up at seven.',                                        'I get up at seven.↘'],
  ['四·呼语',         'Li Hua, come here.',                                        'Li Hua,↗ / come here.↘'],
  ['四·列举逗号',     'I like apples, oranges and bananas.',                       'I like apples,↗ / oranges and bananas.↘'],
  ['五·句首状语从句', 'When I got home, I had dinner with my family.',             'When I got home,↗ / I had dinner with my family.↘'],
  ['五·非限制性从句', 'My brother, who lives in Beijing, is a doctor.',            'My brother,↗ / who lives in Beijing,↗ / is a doctor.↘'],
  ['五·限制性从句',   'The book that I bought yesterday is very interesting.',     'The book that I bought yesterday is very interesting.↘'],
  ['五·短宾语从句',   'I know that he is right.',                                  'I know that he is right.↘'],
  ['五·长宾语从句',   'She said that she would come to the party the next day.',   'She said↗ / that she would come to the party↗ / the next day.↘'],
  ['六·错误1对照✓',   'In the morning, I get up at seven, and then I go to school by bus.', 'In the morning,↗ / I get up at seven,↗ / and then I go to school by bus.↘'],
  ['六·错误2对照✓',   'I go to school by bus with my friend.',                     'I go to school by bus with my friend.↘'],
  ['三·陈述句末',     'I like music.',                                             'I like music.↘'],
  ['三·一般疑问句末', 'Do you like music?',                                        'Do you like music?↗'],
  ['六·错误3对照✓(A2/B1)', 'She said that she would come to the party.',           'She said↗ / that she would come to the party.↘'],
];
let gf=0;
for(const [name, txt, exp] of GUIDE_CASES){
  const got = renderChunked(txt);
  const ok = got===exp;
  if(!ok) gf++;
  console.log('  '+(ok?'✔':'✗')+' '+name.padEnd(24)+' '+txt);
  if(!ok){
    console.log('      期望: '+exp);
    console.log('      实际: '+got);
  }
}
console.log(gf===0?'指引例句与算法输出全部一致 ✔':'有 '+gf+' 处指引例句与算法不一致 ✗');
