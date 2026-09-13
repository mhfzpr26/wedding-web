import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const outDir = path.resolve('public/screenshots_final');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Chromium to verify updated UI...');
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000/?to=Bayu ...');
  await page.goto('http://localhost:3000/?to=Bayu', {
    waitUntil: 'networkidle',
  });

  // 1. Cover with avatar & guest Bayu
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outDir, '01_mobile_cover_avatar.png'),
  });
  console.log('Captured 01_mobile_cover_avatar.png');

  // 2. Open Invitation
  const playBtn = page.locator('.netflix-cover__btn-play');
  if (await playBtn.isVisible()) {
    await playBtn.click();
    console.log('Clicked Play button');
  }
  await page.waitForTimeout(1500);

  // 3. Hero Poster Section
  await page.screenshot({
    path: path.join(outDir, '02_mobile_hero_poster.png'),
  });
  console.log('Captured 02_mobile_hero_poster.png');

  // 4. The 1 Dedicated Video Trailer Section
  const trailer = page.locator('#trailer');
  if (await trailer.isVisible()) {
    await trailer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, '03_mobile_trailer_player.png'),
    });
    console.log('Captured 03_mobile_trailer_player.png');
  }

  // 5. Lead Cast Cards (Destia & Rakafansa)
  const couple = page.locator('#couple');
  if (await couple.isVisible()) {
    await couple.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, '04_mobile_lead_cast.png'),
    });
    console.log('Captured 04_mobile_lead_cast.png');
  }

  // 6. Photo-Dominant Gallery Section
  const gallery = page.locator('#gallery');
  if (await gallery.isVisible()) {
    await gallery.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, '05_mobile_photo_gallery.png'),
    });
    console.log('Captured 05_mobile_photo_gallery.png');

    // Click first photo to test Lightbox
    const firstCard = page.locator('.netflix-gallery__card').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(outDir, '06_mobile_gallery_lightbox.png'),
      });
      console.log('Captured 06_mobile_gallery_lightbox.png');

      // Close lightbox
      const closeBtn = page.locator('.netflix-lightbox__btn-close');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(400);
      }
    }
  }

  // 7. Love Story Timeline
  const story = page.locator('#story');
  if (await story.isVisible()) {
    await story.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, '07_mobile_love_story.png'),
    });
    console.log('Captured 07_mobile_love_story.png');
  }

  // 8. Countdown Timer
  const countdown = page.locator('#countdown');
  if (await countdown.isVisible()) {
    await countdown.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, '08_mobile_countdown.png'),
    });
    console.log('Captured 08_mobile_countdown.png');
  }

  // 9. Event Episodes (Akad & Resepsi)
  const eventSec = page.locator('#event');
  if (await eventSec.isVisible()) {
    await eventSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, '09_mobile_event_venues.png'),
    });
    console.log('Captured 09_mobile_event_venues.png');
  }

  // 10. RSVP Section
  const rsvp = page.locator('#rsvp');
  if (await rsvp.isVisible()) {
    await rsvp.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outDir, '10_mobile_rsvp.png') });
    console.log('Captured 10_mobile_rsvp.png');
  }

  await browser.close();
  console.log(
    'All verification screenshots captured successfully in public/screenshots_final/',
  );
}

run().catch((err) => {
  console.error('Error during UI verification:', err);
  process.exit(1);
});
