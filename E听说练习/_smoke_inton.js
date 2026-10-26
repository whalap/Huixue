/* 断句语调功能实测：真实题库文本 + UI 渲染 */
const puppeteer = require('C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
const path = require('path');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new',
    args: ['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',
           '--autoplay-policy=no-user-gesture-required','--window-size=1100,1600'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type()==='error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('file://' + path.resolve('index.html'), { waitUntil: 'load' });
  await page.waitForSelector('#cards', { timeout: 10000 });

  // ① 对全量 300 篇朗读文本跑断句，检查结构完整性
  const bulk = await page.evaluate(() => {
    const m = SITE_DATA.modules.find(x=>x.id==='readaloud');
    let total=0, multiChunk=0, withTone=0, emptyChunk=0, emptySent=0, yN=0;
    const samples=[];
    ['A1','A2','B1'].forEach(lv=>{
      m.tasks[lv].forEach(t=>{
        total++;
        const sents = splitSentences(t.text);
        if (sents.some(s=>!s.trim())) emptySent++;
        sents.forEach(s=>{
          if (isYesNoQuestion(s)) yN++;
          const cs = splitChunks(s);
          if (cs.some(c=>!c.trim())) emptyChunk++;
          if (cs.length>1) multiChunk++;
        });
        const html = renderChunked(t.text);
        if (html.indexOf('↗')>=0 && html.indexOf('↘')>=0) withTone++;
        if (samples.length<3 && lv==='B1') samples.push({id:t.id, out:renderChunked(t.text).slice(0,180)});
      });
    });
    return { total, multiChunk, withTone, emptyChunk, emptySent, yN, samples };
  });
  console.log('BULK:', JSON.stringify(bulk, null, 1));

  // ② 打开一个 A2 朗读任务，确认断句框与指引面板真的渲染进 DOM
  const ui = await page.evaluate(async () => {
    const m = SITE_DATA.modules.find(x=>x.id==='readaloud');
    currentLevel = 'A2';
    const t = m.tasks.A2[0];
    taskReadAloud(m, t);
    return { launched: true };
  });
  await new Promise(r=>setTimeout(r,400));
  const dom = await page.evaluate(() => {
    const cb = document.querySelector('#chunkBox');
    const gd = document.querySelector('#intonGuide');
    return {
      chunkBoxExists: !!cb,
      chunkText: cb ? cb.textContent.slice(0,160) : null,
      hasUp: cb ? cb.textContent.indexOf('↗')>=0 : false,
      hasDown: cb ? cb.textContent.indexOf('↘')>=0 : false,
      hasSlash: cb ? cb.innerHTML.indexOf('slash')>=0 : false,
      guideExists: !!gd,
      guideOpenable: gd ? gd.tagName.toLowerCase()==='details' : false,
      guideHasClause: gd ? gd.textContent.indexOf('状语从句')>=0 : false,
      guideHasTone2: gd ? gd.textContent.indexOf('二声')>=0 : false
    };
  });
  console.log('UI(A2):', JSON.stringify(dom, null, 1));

  // ③ 切到 A1，确认指引面板不含从句规则（分级正确）
  const domA1 = await page.evaluate(async () => {
    const m = SITE_DATA.modules.find(x=>x.id==='readaloud');
    currentLevel = 'A1';
    taskReadAloud(m, m.tasks.A1[0]);
    return true;
  });
  await new Promise(r=>setTimeout(r,300));
  const a1 = await page.evaluate(() => {
    const gd = document.querySelector('#intonGuide');
    return { guideExists: !!gd, hasClauseRule: gd ? gd.textContent.indexOf('状语从句')>=0 : null };
  });
  console.log('UI(A1) 应不含从句规则:', JSON.stringify(a1));

  // ④ 评分面板：断句/语调两个复选框
  const score = await page.evaluate(() => {
    const has = !!document.querySelector('#ra_chunk') && !!document.querySelector('#ra_tone');
    return { hasChunkAndTone: has };
  });
  console.log('SCORING:', JSON.stringify(score));

  console.log('ERRORS:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(errors.length ? 2 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
