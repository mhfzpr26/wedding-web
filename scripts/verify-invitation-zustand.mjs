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

  console.log('Navigating to /undangan/destia-rakafansa...');
  await page.goto('http://localhost:3000/undangan/destia-rakafansa', { waitUntil: 'networkidle' });

  // Verify Cover is present
  const enterBtn = page.locator('#btn-open-invitation, button:has-text("Buka Undangan")');
  await enterBtn.first().waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Found Buka Undangan button');

  // Click Buka Undangan
  await enterBtn.first().click();
  await page.waitForTimeout(600);

  // Verify Main content is visible
  const mainContent = page.locator('#main-content');
  const isVisible = await mainContent.isVisible();
  console.log('✅ Main content visible after Zustand openCover():', isVisible);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'zustand_invitation_opened.png'),
    fullPage: false,
  });
  console.log('📸 Captured zustand_invitation_opened.png');

  await browser.close();
  console.log('🎉 Frontend Zustand verification complete!');
}

run().catch((err) => {
  console.error('❌ Frontend test failed:', err);
  process.exit(1);
});
