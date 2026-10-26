/* Unit1 习题与测试 —— 无头浏览器实测 */
const QUIZ_HTML = 'file:///D:/WorkBuddyWorkSpace/2026-10-23-12-57-00/慧学学习网络/01_课本同步_沪教版七上/单元习题与测试/Unit1_习题与测试.html';
const puppeteer = require('C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/manifest/i.test(m.text())) errs.push('CONSOLE: ' + m.text()); });
  await p.goto(QUIZ_HTML, { waitUntil: 'load' });
  await p.waitForSelector('#tabs', { timeout: 10000 });

  // 1) 五份卷子结构
  const struct = await p.evaluate(() => {
    return PAPERS.map(pp => ({
      id: pp.id,
      secs: pp.sections.length,
      items: pp.sections.reduce((n, s) => n + s.items.length, 0),
      full: pp.sections.reduce((n, s) => n + s.items.reduce((m, it) => m + (it.score || 1), 0), 0),
      types: [...new Set(pp.sections.flatMap(s => s.items.map(i => i.type)))].join(',')
    }));
  });
  console.log('=== 卷子结构 ===');
  struct.forEach(s => console.log(` ${s.id}: ${s.secs}大题 ${s.items}题 满分${s.full} [${s.types}]`));

  // 2) 逐份渲染 + 全对答案提交
  console.log('=== 渲染与批改 ===');
  for (let i = 0; i < struct.length; i++) {
    const r = await p.evaluate(async (idx) => {
      selectPaper(idx);
      const pp = PAPERS[idx];
      // 填入正确答案
      const answers = {};
      pp.sections.forEach((s, si) => s.items.forEach((it, qi) => {
        if (it.type === 'essay') return;
        answers['q' + si + '_' + qi] = (it.type === 'tf') ? it.a : (it.type === 'text' ? (it.a2 ? it.a2[0] : it.a) : String(it.a));
      }));
      // 模拟用户点击/输入
      for (const k in answers) {
        const opt = document.querySelector(`.opt[data-q="${k}"][data-v="${answers[k]}"]`);
        if (opt) opt.click();
        const inp = document.querySelector(`.ans-in[data-q="${k}"]`);
        if (inp) { inp.value = answers[k]; inp.dispatchEvent(new Event('input')); }
      }
      grade();
      const sc = document.querySelector('.score');
      return {
        id: pp.id,
        rendered: !!document.querySelector('.paper'),
        qCount: document.querySelectorAll('.q').length,
        scoreText: sc ? sc.textContent.replace(/\s+/g, ' ').slice(0, 60) : 'NO_SCORE',
        saved: !!store.load(pp.id)
      };
    }, i);
    console.log(` ${r.id}: 渲染${r.qCount}题 | ${r.scoreText} | 存档${r.saved ? 'OK' : 'FAIL'}`);
  }

  // 3) 故意答错 → 应判错并标红
  const wrong = await p.evaluate(() => {
    selectPaper(0);
    const pp = PAPERS[0];
    store.clear(pp.id); answers = {};
    renderPaper(pp, false);
    // 第1题选错误项
    const q0 = document.querySelector('.opt[data-q="q0_0"]:not(.ok)');
    q0.click();
    // 填空题留空
    grade();
    const sc = document.querySelector('.score');
    const badOpt = document.querySelector('.opt.bad');
    return { score: sc ? sc.textContent.replace(/\s+/g, ' ').slice(0, 50) : 'NONE', badMarked: !!badOpt };
  });
  console.log('=== 答错测试 ===', JSON.stringify(wrong));

  // 4) 切换/持久化
  const persist = await p.evaluate(() => {
    const r = {};
    PAPERS.forEach(pp => { r[pp.id] = !!store.load(pp.id); });
    return r;
  });
  console.log('=== 存档状态 ===', JSON.stringify(persist));

  // 5) tf 题答案类型正确性
  const tf = await p.evaluate(() => {
    selectPaper(2); // 练习三含 tf
    const pp = PAPERS[2];
    const tfItem = pp.sections.flatMap(s => s.items).find(i => i.type === 'tf');
    const isOk = isRight(tfItem, tfItem.a);
    const wrong2 = isRight(tfItem, tfItem.a === 'T' ? 'F' : 'T');
    return { a: tfItem.a, acceptsTrue: isOk, rejectsFalse: !wrong2 };
  });
  console.log('=== T/F 批改 ===', JSON.stringify(tf));

  await b.close();
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'NO_JS_ERRORS');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
