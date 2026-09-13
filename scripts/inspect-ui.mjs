import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome via Playwright...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true, // headless so it runs cleanly and captures fast
  });

  // Desktop capture
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000/?to=Budi+Santoso', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(outDir, '00_desktop_cover.png') });
  const desktopPlay = desktopPage.locator('.netflix-cover__btn-play');
  if (await desktopPlay.isVisible()) await desktopPlay.click();
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: path.join(outDir, '00_desktop_opened.png') });
  await desktopContext.close();

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000/?to=Budi+Santoso ...');
  await page.goto('http://localhost:3000/?to=Budi+Santoso', { waitUntil: 'networkidle' });

  // 1. Capture Hero Cover
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '01_mobile_cover.png') });
  console.log('Captured 01_mobile_cover.png');

  // 2. Click Play to open invitation
  const playBtn = page.locator('.netflix-cover__btn-play');
  if (await playBtn.isVisible()) {
    await playBtn.click();
    console.log('Clicked Play button');
  }
  await page.waitForTimeout(1500);

  // 2b. Capture Prologue / Opening
  await page.screenshot({ path: path.join(outDir, '02_mobile_prologue.png') });
  console.log('Captured 02_mobile_prologue.png');

  // 3. Scroll to Couple (Meet the Lead Cast)
  await page.locator('#couple').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '03_mobile_couple.png') });
  console.log('Captured 03_mobile_couple.png');

  // 4. Scroll to Event (Episodes)
  await page.locator('#event').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '04_mobile_episodes.png') });
  console.log('Captured 04_mobile_episodes.png');

  // 5. Scroll to Love Story (Trailers & More)
  await page.locator('#story').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '05_mobile_story.png') });
  console.log('Captured 05_mobile_story.png');

  // 6. Scroll to Countdown
  await page.locator('#countdown').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '06_mobile_countdown.png') });
  console.log('Captured 06_mobile_countdown.png');

  // 7. Scroll to RSVP (Who's Watching?)
  await page.locator('#rsvp').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '07_mobile_rsvp.png') });
  console.log('Captured 07_mobile_rsvp.png');

  // 8. Scroll to Wishes (Audience Reviews)
  await page.locator('#wishes').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '08_mobile_wishes.png') });
  console.log('Captured 08_mobile_wishes.png');

  // 9. Scroll to Gift & Closing (End Credits)
  await page.locator('#closing').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '09_mobile_closing.png') });
  console.log('Captured 09_mobile_closing.png');

  await browser.close();
  console.log('All screenshots saved successfully in public/screenshots/');
}

run().catch((err) => {
  console.error('Playwright execution error:', err);
  process.exit(1);
});
