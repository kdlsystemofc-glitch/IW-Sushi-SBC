const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // 1. Desktop 1440x900 - Checkpoints 0%, 20%, 40%, 60%, 80%, 100%
  const context1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page1440 = await context1440.newPage();
  await page1440.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page1440.waitForTimeout(1000);

  const st = await page1440.evaluate(() => {
    const t = window.ScrollTrigger.getAll().find(tr => tr.trigger && tr.trigger.id === 'scene-fogo-section');
    return t ? { start: t.start, end: t.end } : null;
  });

  const steps = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  for (const p of steps) {
    const y = st.start + (st.end - st.start) * p;
    await page1440.evaluate((pos) => window.scrollTo(0, pos), y);
    await page1440.waitForTimeout(400);
    await page1440.screenshot({ path: `proof_fogo_1440_${Math.round(p * 100)}.png` });
    console.log(`Captured proof_fogo_1440_${Math.round(p * 100)}.png`);
  }

  // 2. Desktop 1920x1080
  const context1920 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page1920 = await context1920.newPage();
  await page1920.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page1920.waitForTimeout(1000);
  const st1920 = await page1920.evaluate(() => {
    const t = window.ScrollTrigger.getAll().find(tr => tr.trigger && tr.trigger.id === 'scene-fogo-section');
    return t ? { start: t.start, end: t.end } : null;
  });
  const y1920 = st1920.start + (st1920.end - st1920.start) * 0.5;
  await page1920.evaluate((pos) => window.scrollTo(0, pos), y1920);
  await page1920.waitForTimeout(500);
  await page1920.screenshot({ path: 'proof_fogo_1920_midpoint.png' });
  console.log('Captured proof_fogo_1920_midpoint.png');

  // 3. Mobile 390x844
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(1000);
  const elOffset = await pageMobile.evaluate(() => {
    const el = document.querySelector('#scene-fogo-section');
    return el ? el.offsetTop : 3000;
  });
  await pageMobile.evaluate((pos) => window.scrollTo(0, pos), elOffset);
  await pageMobile.waitForTimeout(500);
  await pageMobile.screenshot({ path: 'proof_fogo_mobile.png' });
  console.log('Captured proof_fogo_mobile.png');

  await browser.close();
  console.log('All Fogo Viewport Proofs Completed.');
})();
