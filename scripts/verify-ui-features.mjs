import path from 'node:path';
import { chromium } from 'playwright-core';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  console.log('Navigating to invitation page...');
  await page.goto(
    'http://localhost:3000/undangan/destia-rakafansa?to=Budi+Santoso',
    {
      waitUntil: 'networkidle',
    },
  );

  // Click cover enter button
  const enterBtn = page
    .locator('.cover__btn, button:has-text("BUKA UNDANGAN")')
    .first();
  if (await enterBtn.isVisible()) {
    await enterBtn.click();
    await page.waitForTimeout(800);
  }

  // Scroll to Countdown Section
  const countdownSection = page.locator('#countdown');
  if (await countdownSection.isVisible()) {
    await countdownSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const ssPath = path.join(
      process.cwd(),
      '.tempmediaStorage',
      'ui_feature_countdown.png',
    );
    await countdownSection.screenshot({ path: ssPath });
    console.log('Captured countdown section:', ssPath);
  }

  // Scroll to Gift Section and Click Show QR
  const giftSection = page.locator('#gift');
  if (await giftSection.isVisible()) {
    await giftSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const qrToggle = page.locator('button[title="Tampilkan QR Code"]').first();
    if (await qrToggle.isVisible()) {
      await qrToggle.click();
      await page.waitForTimeout(400);
    }
    const ssPath = path.join(
      process.cwd(),
      '.tempmediaStorage',
      'ui_feature_gift_qr.png',
    );
    await giftSection.screenshot({ path: ssPath });
    console.log('Captured gift with QR section:', ssPath);
  }

  // Scroll to RSVP Section, fill form and submit to capture GuestPass QR
  const rsvpSection = page.locator('#rsvp');
  if (await rsvpSection.isVisible()) {
    await rsvpSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const submitBtn = page.locator('.rsvp__submit-btn').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
    const ssPath = path.join(
      process.cwd(),
      '.tempmediaStorage',
      'ui_feature_rsvp_pass.png',
    );
    await rsvpSection.screenshot({ path: ssPath });
    console.log('Captured RSVP with QR E-Pass:', ssPath);
  }

  await browser.close();
  console.log('Browser verification completed successfully!');
}

run().catch((e) => {
  console.error('UI verification error:', e);
});
