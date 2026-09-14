const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push('[' + msg.type() + '] ' + msg.text()));
  page.on('pageerror', err => consoleLogs.push('[PAGE ERROR] ' + err.toString()));

  console.log('Navigating to http://localhost:5175/...');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Opening 33/33/33
  await page.screenshot({ path: 'proof_01_opening_33_33_33.png' });
  console.log('Captured 1: Opening 33/33/33');

  // 2. Opening Hover 62/19/19
  await page.hover('#triptych-col-1');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'proof_02_opening_hover_62_19_19.png' });
  console.log('Captured 2: Opening Hover 62/19/19');

  // Unhover
  await page.mouse.move(0, 0);
  await page.waitForTimeout(600);

  // 3. Opening Takeover 100vw (scroll inside hero trigger)
  await page.evaluate(() => {
    const st = window.ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'hero-section');
    window.scrollTo(0, st.end * 0.9);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'proof_03_opening_takeover_100vw.png' });
  console.log('Captured 3: Opening Takeover 100vw');

  // 4. Scene 02 Midpoint (O Rigor)
  await page.evaluate(() => {
    const st = window.ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'scene-rigor-section');
    window.scrollTo(0, (st.start + st.end) / 2);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'proof_04_scene_02_midpoint.png' });
  console.log('Captured 4: Scene 02 Midpoint');

  // 5. Scene 03 Midpoint (O Fogo)
  await page.evaluate(() => {
    const st = window.ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'scene-fogo-section');
    window.scrollTo(0, (st.start + st.end) / 2);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'proof_05_scene_03_midpoint.png' });
  console.log('Captured 5: Scene 03 Midpoint');

  // 6. Scene 04 Midpoint (O Salão)
  await page.evaluate(() => {
    const st = window.ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'scene-salao-section');
    window.scrollTo(0, (st.start + st.end) / 2);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'proof_06_scene_04_midpoint.png' });
  console.log('Captured 6: Scene 04 Midpoint');

  // 7. Final Scene (A Mesa)
  await page.evaluate(() => {
    const el = document.querySelector('#scene-mesa');
    window.scrollTo(0, el.offsetTop);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'proof_07_scene_final.png' });
  console.log('Captured 7: Final Scene');

  // 8. Test Reverse Scroll back to Top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'proof_08_reverse_top.png' });
  console.log('Captured 8: Reverse Scroll Top');

  // Mobile Viewport Capture (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'proof_mobile_hero.png' });
  await mobilePage.screenshot({ path: 'proof_mobile_full.png', fullPage: true });
  console.log('Captured Mobile Screenshots');

  console.log('Console Logs Summary:', JSON.stringify(consoleLogs, null, 2));

  await browser.close();
  console.log('ALL PROOF CAPTURES COMPLETED SUCCESSFULLY.');
})();
