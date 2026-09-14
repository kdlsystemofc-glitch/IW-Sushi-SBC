const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const st = await page.evaluate(() => {
    const t = window.ScrollTrigger.getAll().find(tr => tr.trigger && tr.trigger.id === 'scene-fogo-section');
    return t ? { start: t.start, end: t.end } : null;
  });

  console.log('Scene Fogo ScrollTrigger:', st);

  const steps = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  for (const p of steps) {
    const y = st.start + (st.end - st.start) * p;
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `debug_fogo_${Math.round(p * 100)}.png` });
    console.log(`Captured debug_fogo_${Math.round(p * 100)}.png`);
  }

  await browser.close();
})();
