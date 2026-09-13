import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/reference_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching pure Chromium window...');
  const browser = await chromium.launch({
    headless: false, // Opens visible Chromium window for user
    args: ['--ignore-certificate-errors']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  console.log('Navigating to https://rafli-fitri.diginvit.com/ ...');

  try {
    const response = await page.goto('https://rafli-fitri.diginvit.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    console.log('Page response status:', response ? response.status() : 'no response');
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, '01_ref_cover.png') });
  console.log('Captured 01_ref_cover.png');

  // Click the Open Invitation button
  try {
    const btnFound = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      const btn = allElements.find(b => /open|buka|undangan/i.test(b.innerText || ''));
      if (btn) {
        btn.click();
        return btn.innerText.trim();
      }
      return null;
    });
    console.log('Clicked Open button:', btnFound);
  } catch(e) {
    console.log('Error clicking open button:', e.message);
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, '02_ref_opened.png') });
  console.log('Captured 02_ref_opened.png');

  // Scroll down step by step to capture sections
  for (let i = 1; i <= 5; i++) {
    await page.evaluate((step) => window.scrollBy({ top: 800, behavior: 'smooth' }), i);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outDir, `0${i + 2}_ref_section.png`) });
    console.log(`Captured 0${i + 2}_ref_section.png`);
  }

  // Extract page structure details: what features, videos, photo gallery, etc.
  const info = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span'))
      .map(h => (h.innerText || '').trim())
      .filter(t => t.length > 2 && t.length < 100);
    const media = Array.from(document.querySelectorAll('img, video, iframe, audio')).map(m => ({
      tag: m.tagName,
      src: m.src || m.getAttribute('src'),
      alt: m.alt || '',
      className: m.className
    }));
    return {
      title: document.title,
      sampleTexts: [...new Set(headings)].slice(0, 50),
      media: media.filter(m => m.src)
    };
  });

  fs.writeFileSync('public/reference_info.json', JSON.stringify(info, null, 2));
  console.log('Saved reference info to public/reference_info.json');

  console.log('Closing browser in 5 seconds...');
  await page.waitForTimeout(5000);
  await browser.close();
  console.log('Chromium finished inspecting reference site.');
}

run().catch((err) => {
  console.error('Error running chromium:', err);
  process.exit(1);
});
