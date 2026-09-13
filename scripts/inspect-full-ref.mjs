import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/reference_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function inspect() {
  console.log('--- Starting Deep Inspection of https://rafli-fitri.diginvit.com/ ---');
  
  const browser = await chromium.launch({
    headless: false, // Visible Chromium window
    args: ['--ignore-certificate-errors', '--disable-web-security']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Log console and errors
  page.on('console', msg => console.log('REF CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('REF ERROR:', err.message));

  console.log('Navigating to root page...');
  await page.goto('https://rafli-fitri.diginvit.com/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2000);

  // 1. Capture Cover
  await page.screenshot({ path: path.join(outDir, '01_cover_fullscreen.png'), fullPage: true });
  console.log('Captured 01_cover_fullscreen.png');

  // 2. Click Open Invitation
  console.log('Looking for Open button...');
  try {
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(b => /open|buka/i.test(b.innerText));
      if (btn) {
        btn.click();
        return btn.innerText;
      }
      return null;
    });
    console.log('Evaluated click result:', clicked);
  } catch(e) {
    console.log('Click error, retrying with force click:', e.message);
    const openBtn = page.locator('button, a').filter({ hasText: /open|buka/i }).first();
    await openBtn.click({ force: true });
  }

  console.log('Waiting 2.5s for transition animation...');
  await page.waitForTimeout(2500);

  // 3. Capture Opened view
  await page.screenshot({ path: path.join(outDir, '02_opened_view.png'), fullPage: true });
  console.log('Captured 02_opened_view.png');

  // 4. Check for any scrollable container or buttons
  const analysis = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    
    // Check elements that have scrollHeight > clientHeight
    const scrollables = all.filter(el => {
      return el.scrollHeight > el.clientHeight + 10;
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      id: el.id,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      scrollTop: el.scrollTop
    }));

    // Find all interactive elements (buttons, links, icons)
    const interactives = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], svg')).map(el => ({
      tag: el.tagName,
      text: (el.innerText || '').trim(),
      className: el.className ? (typeof el.className === 'string' ? el.className : el.className.baseVal) : '',
      ariaLabel: el.getAttribute('aria-label') || '',
      href: el.getAttribute('href') || ''
    }));

    return {
      title: document.title,
      htmlLength: document.documentElement.outerHTML.length,
      scrollables,
      interactives
    };
  });

  console.log('Page analysis:', JSON.stringify(analysis, null, 2));
  fs.writeFileSync('public/reference_deep_analysis.json', JSON.stringify(analysis, null, 2));

  // 5. Try scrolling whatever container is scrollable!
  const scrollSuccess = await page.evaluate(async () => {
    // Try window scroll
    window.scrollBy(0, 500);

    // Try all scrollable elements
    const all = Array.from(document.querySelectorAll('*'));
    let scrolledAny = false;
    for (const el of all) {
      if (el.scrollHeight > el.clientHeight + 10) {
        el.scrollTop = 500;
        scrolledAny = true;
      }
    }
    return scrolledAny;
  });
  console.log('Scrolled any container?', scrollSuccess);

  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, '03_after_scroll_test.png'), fullPage: true });

  // 6. Inspect the JS bundle files from the network to see all routes/features in this wedding template!
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
  });
  console.log('Script bundles found:', scripts);

  console.log('Keeping Chromium open for 5 seconds...');
  await page.waitForTimeout(5000);
  await browser.close();
  console.log('Inspection complete!');
}

inspect().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
