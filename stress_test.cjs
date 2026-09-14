const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:5175/...');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Audit Runtime Architecture
  const runtimeCheck = await page.evaluate(() => {
    // @ts-ignore
    const gsapTriggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0;
    // Check performance entries
    const perfEntries = performance.getEntriesByType('navigation')[0];
    return {
      scrollTriggersCount: gsapTriggers,
      domNodes: document.querySelectorAll('*').length,
      imagesCount: document.querySelectorAll('img').length,
      pictureSources: document.querySelectorAll('picture source').length,
    };
  });

  // 2. Stress Test: DOWN -> UP -> DOWN -> UP -> DOWN (5 cycles)
  console.log('Starting 5-cycle scroll stress test...');
  const memSnapshots = [];

  for (let i = 1; i <= 5; i++) {
    const scrollMax = await page.evaluate(() => document.body.scrollHeight);
    // Scroll Down
    await page.evaluate((max) => {
      window.scrollTo({ top: max, behavior: 'smooth' });
    }, scrollMax);
    await page.waitForTimeout(600);

    // Scroll Up
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(600);

    const mem = await page.evaluate(() => {
      // @ts-ignore
      return window.performance && window.performance.memory ? {
        usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024)
      } : { status: 'standard memory api' };
    });
    memSnapshots.push({ cycle: i, mem });
    console.log(`Cycle ${i} completed.`);
  }

  // 3. Test Resize & Reload
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // 4. Web Vitals Inspection (CLS, LCP)
  const vitals = await page.evaluate(() => {
    let cls = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // @ts-ignore
        if (!entry.hadRecentInput) cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    let lcp = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        lcp = entries[entries.length - 1].startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    return { cls, lcp: Math.round(lcp) };
  });

  console.log('PERFORMANCE AUDIT METRICS:', {
    runtime: runtimeCheck,
    memorySnapshots: memSnapshots,
    webVitals: vitals
  });

  await browser.close();
})();
