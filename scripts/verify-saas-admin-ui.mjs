import { chromium } from 'playwright-core';
import path from 'node:path';

const ARTIFACT_DIR =
  'C:/Users/mhafi/.gemini/antigravity-ide/brain/b3201bb1-3947-4149-bc22-de6c30131c02/.tempmediaStorage';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('Navigating to /admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });

  // 1. Go to Studio Editor
  await page.click('button:has-text("Studio Editor Konten")');
  await page.waitForTimeout(600);

  // 2. Click Mempelai tab
  await page.click('button:has-text("2. Mempelai")');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_editor_couple.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_editor_couple.png');

  // 3. Click Acara & Rangkaian tab
  await page.click('button:has-text("3. Acara & Rangkaian")');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_editor_events.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_editor_events.png');

  await browser.close();
}

run().catch((err) => {
  console.error('❌ Browser test failed:', err);
  process.exit(1);
});
