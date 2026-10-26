const puppeteer = require('C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
const path = require('path');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new',
    args: ['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',
           '--autoplay-policy=no-user-gesture-required','--window-size=1100,1400'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type()==='error') errors.push('CONSOLE: ' + m.text()); });
  const url = 'file://' + path.resolve('index.html');
  await page.goto(url, { waitUntil: 'load' });
  // 首页容器渲染：#levels 与 #cards 是静态元素，且其子节点由 JS 渲染
  await page.waitForSelector('#cards', { timeout: 10000 });
  await page.waitForFunction(() => document.querySelector('#cards') && document.querySelector('#cards').children.length > 0, { timeout: 10000 });
  const counts = await page.evaluate(() => {
    const out = {};
    (SITE_DATA.modules||[]).forEach(m => { out[m.id] = (m.tasks.A1.length + m.tasks.A2.length + m.tasks.B1.length); });
    return out;
  });
  console.log('MODULE TOTALS:', JSON.stringify(counts));
  // 进入 ask 模块，检查中英文渲染
  const askInfo = await page.evaluate(() => {
    const m = SITE_DATA.modules.find(x=>x.id==='ask');
    const t = m.tasks.A1[0];
    return { cn: t.prompts[0].cn, en: t.prompts[0].en, total: m.tasks.A1.length };
  });
  console.log('ASK A1[0]:', JSON.stringify(askInfo));
  // 进入 retell 模块，检查 points/keywords 对齐
  const rtInfo = await page.evaluate(() => {
    const m = SITE_DATA.modules.find(x=>x.id==='retell');
    const t = m.tasks.B1[0];
    return { id: t.id, pts: t.points.length, kws: t.keywords.length, aligned: t.points.length===t.keywords.length };
  });
  console.log('RETELL B1[0]:', JSON.stringify(rtInfo));
  // 检查尾音逻辑关键函数存在且能剥离所有格
  const ending = await page.evaluate(() => {
    const has = typeof endingSuffix === 'function' && typeof wordBase === 'function';
    const base = (typeof wordBase==='function') ? wordBase("Amy's") : null;
    return { has, base };
  });
  console.log('ENDING FNS:', JSON.stringify(ending));
  console.log('ERRORS:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(errors.length ? 2 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
