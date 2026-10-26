const puppeteer = require('C:/Users/whalap/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new',
    args: ['--no-sandbox','--no-proxy-server','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type()==='error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('http://localhost:8092/', { waitUntil: 'load' });
  await page.waitForSelector('#cards', { timeout: 10000 });
  await page.waitForFunction(() => document.querySelector('#cards').children.length > 0, { timeout: 10000 });
  const info = await page.evaluate(() => ({
    mods: SITE_DATA.modules.map(m=>m.id),
    official: !!(SITE_DATA.official && SITE_DATA.official.papers.length),
    total: SITE_DATA.modules.reduce((a,m)=>a+m.tasks.A1.length+m.tasks.A2.length+m.tasks.B1.length,0),
    swReg: 'serviceWorker' in navigator
  }));
  console.log('INFO:', JSON.stringify(info));
  console.log('ERRORS:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(errors.length ? 2 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
