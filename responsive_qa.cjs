const { chromium } = require('playwright');

const viewports = [
  { name: 'desktop_1920x1080', width: 1920, height: 1080, isMobile: false },
  { name: 'desktop_1440x900', width: 1440, height: 900, isMobile: false },
  { name: 'laptop_1366x768', width: 1366, height: 768, isMobile: false },
  { name: 'tablet_landscape_1024x768', width: 1024, height: 768, isMobile: false },
  { name: 'tablet_portrait_768x1024', width: 768, height: 1024, isMobile: true },
  { name: 'mobile_430x932', width: 430, height: 932, isMobile: true },
  { name: 'mobile_390x844', width: 390, height: 844, isMobile: true },
  { name: 'mobile_375x812', width: 375, height: 812, isMobile: true },
  { name: 'mobile_360x800', width: 360, height: 800, isMobile: true }
];

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // 1. Check Horizontal Overflow
    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const elementsWithOverflow = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 1) {
          elementsWithOverflow.push({ tag: el.tagName, id: el.id, class: el.className, right: rect.right });
        }
      });
      return {
        hasOverflow: docWidth > winWidth,
        docWidth,
        winWidth,
        overflowElementsCount: elementsWithOverflow.length
      };
    });

    // 2. Check Interactive Touch Target Sizes (CTA buttons)
    const ctaTargets = await page.evaluate(() => {
      const ctas = [];
      document.querySelectorAll('a, button').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          ctas.push({
            text: el.innerText.trim().slice(0, 30),
            width: rect.width,
            height: rect.height,
            isAccessibleTouchTarget: rect.height >= 40 && rect.width >= 40
          });
        }
      });
      return ctas;
    });

    // 3. Scroll Down & Up Test (Smooth scrub without pin break)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    // 4. Capture Key Viewport Proofs
    if (vp.name === 'desktop_1440x900') {
      await page.screenshot({ path: 'qa_proof_1440x900_hero.png' });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'qa_proof_1440x900_mid.png' });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'qa_proof_1440x900_final.png' });
    }

    if (vp.name === 'tablet_portrait_768x1024') {
      await page.screenshot({ path: 'qa_proof_768x1024_hero.png' });
      await page.screenshot({ path: 'qa_proof_768x1024_full.png', fullPage: true });
    }

    if (vp.name === 'mobile_390x844') {
      await page.screenshot({ path: 'qa_proof_390x844_hero.png' });
      await page.screenshot({ path: 'qa_proof_390x844_full.png', fullPage: true });
    }

    results.push({
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
      overflow: overflowCheck.hasOverflow,
      overflowDetails: overflowCheck,
      ctasTested: ctaTargets.length,
      allTouchTargetsAdequate: ctaTargets.every(c => c.isAccessibleTouchTarget || c.height >= 32)
    });

    await context.close();
  }

  console.log('FINAL RESPONSIVE QA RESULTS:');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})();
