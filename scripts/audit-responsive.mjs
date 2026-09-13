import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const report = {
  desktop: { overflows: [], issues: [] },
  mobile: { overflows: [], issues: [] },
};

const outDir = path.resolve('public/audit_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function auditViewport(page, name, width, height, isMobile) {
  console.log(`\n=== Auditing ${name} (${width}x${height}) ===`);
  await page.setViewportSize({ width, height });
  await page.goto('http://localhost:3000/?to=Tamu+Undangan', {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(1000);

  // Check 1: Cover screen overflow
  const coverOverflow = await page.evaluate(() => {
    const docEl = document.documentElement;
    const body = document.body;
    return {
      scrollWidth: Math.max(docEl.scrollWidth, body.scrollWidth),
      clientWidth: docEl.clientWidth,
      hasHorizontalScroll:
        Math.max(docEl.scrollWidth, body.scrollWidth) > docEl.clientWidth + 1,
    };
  });
  console.log(
    `[Cover] doc scrollWidth: ${coverOverflow.scrollWidth}, clientWidth: ${coverOverflow.clientWidth}, overflow: ${coverOverflow.hasHorizontalScroll}`,
  );

  await page.screenshot({ path: path.join(outDir, `${name}_01_cover.png`) });

  // Open invitation
  const playBtn = page.locator('.netflix-cover__btn-play');
  if (await playBtn.isVisible()) {
    await playBtn.click();
    await page.waitForTimeout(1200);
  }

  // Check after opened: Horizontal scroll on whole document
  const openedOverflow = await page.evaluate(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
    const clientW = docEl.clientWidth;
    return {
      scrollWidth: scrollW,
      clientWidth: clientW,
      hasHorizontalScroll: scrollW > clientW + 1,
    };
  });
  console.log(
    `[Opened] doc scrollWidth: ${openedOverflow.scrollWidth}, clientWidth: ${openedOverflow.clientWidth}, overflow: ${openedOverflow.hasHorizontalScroll}`,
  );

  // Find all elements overflowing horizontally
  const overflowingElements = await page.evaluate((vw) => {
    const elements = document.querySelectorAll('*');
    const bad = [];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      // If element is visible and extends past right edge by more than 2px
      if (rect.width > 0 && rect.height > 0) {
        if (rect.right > vw + 2 || rect.left < -2) {
          const style = window.getComputedStyle(el);
          if (
            style.position !== 'fixed' &&
            style.position !== 'sticky' &&
            style.display !== 'none' &&
            style.visibility !== 'hidden'
          ) {
            bad.push({
              tag: el.tagName.toLowerCase(),
              className: el.className?.toString()?.slice(0, 80) || '',
              id: el.id || '',
              rect: {
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
              },
              computedWidth: style.width,
              computedMaxWidth: style.maxWidth,
            });
          }
        }
      }
    }
    return bad;
  }, width);

  console.log(
    `Found ${overflowingElements.length} overflowing elements in ${name}:`,
  );
  for (const item of overflowingElements.slice(0, 10)) {
    console.log(
      ` - <${item.tag} class="${item.className}" id="${item.id}">: rect=${JSON.stringify(item.rect)} width=${item.computedWidth} maxWidth=${item.computedMaxWidth}`,
    );
  }

  // Check specific sections
  const sections = [
    '#hero',
    '#trailer',
    '#couple',
    '#gallery',
    '#story',
    '#countdown',
    '#event',
    '#rsvp',
    '#wishes',
    '#gift',
    '#closing',
  ];
  for (const secId of sections) {
    const sec = page.locator(secId);
    if (await sec.isVisible()) {
      await sec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const secInfo = await sec.evaluate((node, vw) => {
        const r = node.getBoundingClientRect();
        return {
          id: node.id,
          width: Math.round(r.width),
          vw,
          overflowRight: Math.round(r.right - vw),
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
        };
      }, width);
      if (
        secInfo.scrollWidth > secInfo.clientWidth + 1 ||
        secInfo.overflowRight > 2
      ) {
        console.log(
          `Section ${secId} has overflow! ${JSON.stringify(secInfo)}`,
        );
        report[isMobile ? 'mobile' : 'desktop'].issues.push({
          section: secId,
          ...secInfo,
        });
      }
    }
  }

  // Section screenshots
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, `${name}_02_hero.png`) });

  const couple = page.locator('#couple');
  if (await couple.isVisible()) {
    await couple.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${name}_03_couple.png`) });
  }

  const gallery = page.locator('#gallery');
  if (await gallery.isVisible()) {
    await gallery.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, `${name}_04_gallery.png`),
    });
  }

  const eventSec = page.locator('#event');
  if (await eventSec.isVisible()) {
    await eventSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${name}_05_event.png`) });
  }

  const rsvpSec = page.locator('#rsvp');
  if (await rsvpSec.isVisible()) {
    await rsvpSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${name}_06_rsvp.png`) });
  }

  const giftSec = page.locator('#gift');
  if (await giftSec.isVisible()) {
    await giftSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${name}_07_gift.png`) });
  }

  const wishesSec = page.locator('#wishes');
  if (await wishesSec.isVisible()) {
    await wishesSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${name}_08_wishes.png`) });
  }

  const closingSec = page.locator('#closing');
  if (await closingSec.isVisible()) {
    await closingSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, `${name}_09_closing.png`),
    });
  }

  report[isMobile ? 'mobile' : 'desktop'].overflows.push(
    ...overflowingElements,
  );
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile - iPhone 14 Pro / 15 (390 x 844)
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
  });
  const mobilePage = await mobileCtx.newPage();
  await auditViewport(mobilePage, 'mobile_390', 390, 844, true);

  // 2. Small Mobile - iPhone SE / Android compact (360 x 740)
  const smallMobileCtx = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const smallMobilePage = await smallMobileCtx.newPage();
  await auditViewport(smallMobilePage, 'mobile_360', 360, 740, true);

  // 3. Desktop - 1440 x 900
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopCtx.newPage();
  await auditViewport(desktopPage, 'desktop_1440', 1440, 900, false);

  // 4. Desktop - 1920 x 1080 (Full HD)
  const fhdCtx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const fhdPage = await fhdCtx.newPage();
  await auditViewport(fhdPage, 'desktop_1920', 1920, 1080, false);

  await browser.close();

  fs.writeFileSync('public/audit_report.json', JSON.stringify(report, null, 2));
  console.log('\nAudit completed! Report saved to public/audit_report.json');
}

run().catch(console.error);
