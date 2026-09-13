import path from 'node:path';
import { chromium } from 'playwright-core';

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
  await page.waitForTimeout(1000);

  // 1. Dashboard screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_atomic_dashboard.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_atomic_dashboard.png');

  // 2. Data Client tab
  await page.click('button:has-text("Data Client")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_atomic_clients.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_atomic_clients.png');

  // 3. Studio Editor tab
  await page.click('button:has-text("Studio Editor Konten")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_atomic_editor_template.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_atomic_editor_template.png');

  // 4. Click Mempelai tab
  await page.click('button:has-text("2. Mempelai")');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_atomic_editor_couple.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_atomic_editor_couple.png');

  // 5. Click Acara & Rangkaian tab
  await page.click('button:has-text("3. Acara & Rangkaian")');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_atomic_editor_events.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_atomic_editor_events.png');

  // 6. Click Musik & Video tab
  await page.click('button:has-text("4. Musik & Video")');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_atomic_editor_media.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_atomic_editor_media.png');

  // 7. Click Katalog Template tab
  await page.click('button:has-text("Katalog Template")');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'saas_atomic_templates.png'),
    fullPage: false,
  });
  console.log('📸 Captured saas_atomic_templates.png');

  await browser.close();
  console.log('🎉 All Atomic Design UI screenshots captured successfully!');
}

run().catch((err) => {
  console.error('❌ Browser test failed:', err);
  process.exit(1);
});
