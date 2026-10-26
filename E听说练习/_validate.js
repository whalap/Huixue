const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('data.js', 'utf8');
const sb = {};
vm.runInNewContext(code + '\n; this.SITE_DATA=SITE_DATA;', sb);
const D = sb.SITE_DATA;
const mods = D.modules;
let problems = 0;
const flag = (m, id, msg) => { problems++; console.log(`  [FAIL] ${m}/${id}: ${msg}`); };
const norm = s => (s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();

for (const m of mods) {
  console.log(`\n=== module ${m.id} (${m.name}) ===`);
  for (const lv of ['A1','A2','B1']) {
    const ts = m.tasks[lv] || [];
    if (ts.length !== 100) flag(m.id, lv, `count=${ts.length} (expected 100)`);
    const ids = ts.map(t=>t.id);
    if (new Set(ids).size !== ids.length) flag(m.id, lv, 'duplicate task id');

    if (m.id === 'retell') {
      const seen = new Set();
      for (const t of ts) {
        if (!t.passage) flag(m.id, t.id, 'missing passage');
        if (!Array.isArray(t.points) || !Array.isArray(t.keywords)) flag(m.id, t.id, 'points/keywords not arrays');
        else if (t.points.length !== t.keywords.length) flag(m.id, t.id, `points(${t.points.length})!=keywords(${t.keywords.length})`);
        else {
          const body = norm(t.passage);
          for (let i=0;i<t.keywords.length;i++){
            const kws = Array.isArray(t.keywords[i]) ? t.keywords[i] : [t.keywords[i]];
            const hit = kws.some(k => k && body.includes(norm(k)));
            if (!hit) flag(m.id, t.id, `point[${i}]="${t.points[i]}" has NO hittable keyword among [${kws.join('|')}]`);
          }
        }
        const sig = norm(t.passage);
        if (seen.has(sig)) flag(m.id, t.id, 'duplicate passage within level');
        seen.add(sig);
      }
    }

    if (m.id === 'ask') {
      const seenCn = new Set();
      for (const t of ts) {
        if (!Array.isArray(t.prompts) || !t.prompts.length) flag(m.id, t.id, 'no prompts');
        else for (const p of t.prompts) {
          if (!p.cn || !p.en) flag(m.id, t.id, 'prompt missing cn/en');
          if (seenCn.has(p.cn)) flag(m.id, t.id, `dup cn "${p.cn}"`);
          seenCn.add(p.cn);
        }
      }
    }

    if (m.id === 'listenanswer') {
      const seenMono = new Set();
      for (const t of ts) {
        if (!Array.isArray(t.questions) || !Array.isArray(t.keys)) flag(m.id, t.id, 'questions/keys not arrays');
        else if (t.questions.length !== t.keys.length) flag(m.id, t.id, `questions(${t.questions.length})!=keys(${t.keys.length})`);
        const sig = norm(t.monologue||'');
        if (seenMono.has(sig)) flag(m.id, t.id, 'duplicate monologue within level');
        seenMono.add(sig);
      }
    }

    if (m.id === 'listenchoose') {
      const seen = new Set();
      for (const t of ts) {
        if (!Array.isArray(t.questions)) { flag(m.id, t.id, 'no questions'); continue; }
        for (const q of t.questions) {
          if (!Array.isArray(q.opts) || q.opts.length < 2) flag(m.id, t.id, `q "${q.q}" opts<2`);
          else if (typeof q.ans !== 'number' || q.ans < 0 || q.ans >= q.opts.length) flag(m.id, t.id, `q "${q.q}" bad ans index ${q.ans}`);
        }
        const sig = norm((t.dialogue||[]).map(d=>d.t).join(' ')) + ' || ' + norm(t.questions.map(q=>q.q).join(' '));
        if (seen.has(sig)) flag(m.id, t.id, 'duplicate dialogue+questions within level');
        seen.add(sig);
      }
    }

    if (m.id === 'readaloud') {
      for (const t of ts) if (!t.text) flag(m.id, t.id, 'missing text');
    }
  }
}
// ---- official 全真模拟真题校验 ----
console.log(`\n=== official 全真模拟 ===`);
const off = D.official;
if (!off || !Array.isArray(off.papers) || !off.papers.length) flag('official','', 'missing papers');
else {
  for (const paper of off.papers) {
    const items = paper.items || [];
    for (const it of items) {
      const t = it.task || {};
      if (it.type === 'readaloud') { if (!t.text) flag('official', t.id, 'missing text'); }
      else if (it.type === 'listenchoose') {
        if (!Array.isArray(t.questions)) flag('official', t.id, 'no questions');
        else for (const q of t.questions){ if(!Array.isArray(q.opts)||q.opts.length<2) flag('official',t.id,`q "${q.q}" opts<2`); else if(typeof q.ans!=='number'||q.ans<0||q.ans>=q.opts.length) flag('official',t.id,`q "${q.q}" bad ans`); }
      }
      else if (it.type === 'listenanswer') {
        if (!Array.isArray(t.questions)||!Array.isArray(t.keys)) flag('official',t.id,'questions/keys not arrays');
        else if (t.questions.length !== t.keys.length) flag('official',t.id,`questions(${t.questions.length})!=keys(${t.keys.length})`);
      }
      else if (it.type === 'retell') {
        if (!Array.isArray(t.points)||!Array.isArray(t.keywords)) flag('official',t.id,'points/keywords not arrays');
        else if (t.points.length !== t.keywords.length) flag('official',t.id,`points(${t.points.length})!=keywords(${t.keywords.length})`);
        else { const body=norm(t.passage); for(let i=0;i<t.keywords.length;i++){const kws=Array.isArray(t.keywords[i])?t.keywords[i]:[t.keywords[i]]; if(!kws.some(k=>k&&body.includes(norm(k)))) flag('official',t.id,`point[${i}] no hittable keyword`);} }
      }
      else if (it.type === 'ask') {
        if (!Array.isArray(t.prompts)||!t.prompts.length) flag('official',t.id,'no prompts');
        else for (const p of t.prompts) if(!p.cn||!p.en) flag('official',t.id,'prompt missing cn/en');
      }
    }
  }
}

console.log(`\n========== TOTAL PROBLEMS: ${problems} ==========`);
process.exit(problems ? 1 : 0);
