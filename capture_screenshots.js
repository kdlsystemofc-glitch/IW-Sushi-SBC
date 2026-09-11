import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch();
  
  // 1. Desktop 1440x900
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:4173');
  await pageDesktop.waitForTimeout(2500); // Wait for GSAP neon animation to settle
  await pageDesktop.screenshot({ path: 'screenshot_desktop.png', fullPage: false });
  console.log('Desktop screenshot saved');

  // 2. Mobile 390x844 (iPhone 13/14/15 size)
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:4173');
  await pageMobile.waitForTimeout(2500);
  await pageMobile.screenshot({ path: 'screenshot_mobile.png', fullPage: false });
  console.log('Mobile screenshot saved');

  await browser.close();
}

capture().catch(console.error);
