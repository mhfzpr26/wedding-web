import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const SCREENSHOT_DIR =
  'C:\\Users\\mhafi\\.gemini\\antigravity-ide\\brain\\b3201bb1-3947-4149-bc22-de6c30131c02\\.tempmediaStorage';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function getShotPath(filename) {
  return path.join(SCREENSHOT_DIR, filename);
}

const results = [];

function record(testName, passed, details = '') {
  results.push({ testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${testName} ${details ? `(${details})` : ''}`);
}

async function runSuite() {
  console.log(
    '🚀 Starting Comprehensive Playwright E2E Test for WEDFLOW Admin Panel...\n',
  );

  const browser = await chromium.launch({
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  // ==========================================
  // 1. DESKTOP TESTS (1440 x 900)
  // ==========================================
  console.log('--- Phase 1: Desktop Viewport (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await desktopContext.newPage();

  // Test 1.1: Dashboard Loads
  try {
    await page.goto('http://localhost:3000/admin', {
      waitUntil: 'networkidle',
    });
    await page.waitForSelector('text=Dashboard & Undangan', { timeout: 8000 });
    const title = await page.title();
    const hasBrand = title.includes('WEDFLOW');
    record(
      'Desktop: Dashboard Page Load & Title',
      hasBrand,
      `Title: "${title}"`,
    );
    await page.screenshot({
      path: getShotPath('playwright_desktop_dashboard.png'),
    });
  } catch (err) {
    record('Desktop: Dashboard Page Load', false, err.message);
  }

  // Test 1.2: KPI Cards and Table
  try {
    const hasTable = await page
      .locator('text=Seluruh Undangan Client')
      .isVisible();
    record(
      'Desktop: KPI Metrics & Invitations Table',
      hasTable,
      `Table visible: ${hasTable}`,
    );
  } catch (err) {
    record('Desktop: KPI Metrics', false, err.message);
  }

  // Test 1.3: Navigate to Clients CRM
  try {
    await page.click('text=Data Client');
    await page.waitForSelector('text=CRM Pengelolaan Client', {
      timeout: 5000,
    });
    const isCrmVisible = await page
      .locator('text=CRM Pengelolaan Client')
      .isVisible();
    record('Desktop: Navigate to Clients CRM', isCrmVisible);
    await page.screenshot({
      path: getShotPath('playwright_desktop_clients.png'),
    });
  } catch (err) {
    record('Desktop: Navigate to Clients CRM', false, err.message);
  }

  // Test 1.4: Navigate to Studio Editor
  try {
    await page.click('text=Studio Editor');
    await page.waitForSelector('text=Sedang Menyunting', { timeout: 5000 });
    const hasTenantBar = await page
      .locator('text=Sedang Menyunting')
      .isVisible();
    record('Desktop: Studio Editor Tenant Context Bar', hasTenantBar);
    await page.screenshot({
      path: getShotPath('playwright_desktop_studio_couple.png'),
    });
  } catch (err) {
    record('Desktop: Studio Editor Tenant Context Bar', false, err.message);
  }

  // Test 1.5: Switch Editor Tabs (Acara / Events)
  try {
    await page.click('button[role="tab"]:has-text("Acara")');
    await page.waitForSelector('text=Rangkaian Acara Pernikahan', {
      timeout: 5000,
    });
    const hasEvents = await page
      .locator('text=Rangkaian Acara Pernikahan')
      .isVisible();
    record('Desktop: Editor Tab "Acara" (Events Tab)', hasEvents);
    await page.screenshot({
      path: getShotPath('playwright_desktop_studio_events.png'),
    });
  } catch (err) {
    record('Desktop: Editor Tab "Acara"', false, err.message);
  }

  // Test 1.6: Switch Editor Tabs (Media)
  try {
    await page.click('button[role="tab"]:has-text("Media")');
    await page.waitForSelector('text=Musik Latar', { timeout: 5000 });
    const hasMedia = await page.locator('text=Musik Latar').isVisible();
    record('Desktop: Editor Tab "Media"', hasMedia);
    await page.screenshot({
      path: getShotPath('playwright_desktop_studio_media.png'),
    });
  } catch (err) {
    record('Desktop: Editor Tab "Media"', false, err.message);
  }

  // Test 1.7: Switch Editor Tabs (Hadiah / Gifts)
  try {
    await page.click('button[role="tab"]:has-text("Hadiah")');
    await page.waitForSelector('text=Rekening Bank & Amplop Digital', {
      timeout: 5000,
    });
    const hasGifts = await page
      .locator('text=Rekening Bank & Amplop Digital')
      .isVisible();
    record('Desktop: Editor Tab "Hadiah" (Gifts Tab)', hasGifts);
    await page.screenshot({
      path: getShotPath('playwright_desktop_studio_gifts.png'),
    });
  } catch (err) {
    record('Desktop: Editor Tab "Hadiah"', false, err.message);
  }

  // Test 1.8: Template Catalog
  try {
    await page.click('text=Template Catalog');
    await page.waitForSelector('text=Katalog Template Undangan', {
      timeout: 5000,
    });
    const hasCatalog = await page
      .locator('text=Katalog Template Undangan')
      .isVisible();
    record('Desktop: Navigate to Template Catalog', hasCatalog);
    await page.screenshot({
      path: getShotPath('playwright_desktop_templates.png'),
    });
  } catch (err) {
    record('Desktop: Navigate to Template Catalog', false, err.message);
  }

  // Test 1.9: Open Modal (Buat Undangan)
  try {
    // Click Buat Undangan in sidebar
    await page.locator('button:has-text("Buat Undangan")').first().click();
    await page.waitForSelector('text=Buat Undangan Baru', { timeout: 5000 });
    await page.waitForTimeout(500); // Wait for modal animation to complete
    const modalVisible = await page
      .locator('text=Buat Undangan Baru')
      .isVisible();
    record('Desktop: "Buat Undangan" Modal Open', modalVisible);
    await page.screenshot({
      path: getShotPath('playwright_desktop_invitation_modal.png'),
    });
    // Close modal
    await page.click('button:has-text("Batal")');
  } catch (err) {
    record('Desktop: "Buat Undangan" Modal Open', false, err.message);
  }

  await desktopContext.close();

  // ==========================================
  // 2. MOBILE RESPONSIVE TESTS (iPhone 14 / 390x844)
  // ==========================================
  console.log('\n--- Phase 2: Mobile Viewport (iPhone 14 - 390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();

  // Test 2.1: Mobile Dashboard Load & Hamburger Button
  try {
    await mobilePage.goto('http://localhost:3000/admin', {
      waitUntil: 'networkidle',
    });
    await mobilePage.waitForSelector('button[aria-label="open drawer"]', {
      timeout: 8000,
    });
    const hamburgerBtn = mobilePage.locator('button[aria-label="open drawer"]');
    const isHamburgerVisible = await hamburgerBtn.isVisible();
    record('Mobile: TopBar Hamburger Menu Visible', isHamburgerVisible);
    await mobilePage.screenshot({
      path: getShotPath('playwright_mobile_dashboard.png'),
    });
  } catch (err) {
    record('Mobile: TopBar Hamburger Menu Visible', false, err.message);
  }

  // Test 2.2: Mobile Drawer Open & Navigation
  try {
    await mobilePage.click('button[aria-label="open drawer"]');
    await mobilePage.waitForSelector('div[role="presentation"]', {
      timeout: 5000,
    });
    await mobilePage.waitForTimeout(400);
    record('Mobile: Drawer Slides Out on Hamburger Click', true);
    await mobilePage.screenshot({
      path: getShotPath('playwright_mobile_drawer_open.png'),
    });

    // Click Studio Editor in Drawer
    await mobilePage.click('div[role="presentation"] >> text=Studio Editor');
    await mobilePage.waitForSelector('text=Sedang Menyunting', {
      timeout: 5000,
    });
    await mobilePage.waitForTimeout(500); // Wait for drawer to slide away
    const isStudioMobile = await mobilePage
      .locator('text=Sedang Menyunting')
      .isVisible();
    record('Mobile: Navigation via Drawer to Studio Editor', isStudioMobile);
    await mobilePage.screenshot({
      path: getShotPath('playwright_mobile_studio.png'),
    });
  } catch (err) {
    record('Mobile: Drawer Interaction', false, err.message);
  }

  await mobileContext.close();

  // ==========================================
  // 3. TABLET VIEWPORT (iPad - 768x1024)
  // ==========================================
  console.log('\n--- Phase 3: Tablet Viewport (iPad - 768x1024) ---');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const tabletPage = await tabletContext.newPage();

  try {
    await tabletPage.goto('http://localhost:3000/admin', {
      waitUntil: 'networkidle',
    });
    await tabletPage.waitForSelector('text=Dashboard & Undangan', {
      timeout: 8000,
    });
    record('Tablet: Dashboard Responsive Load (768x1024)', true);
    await tabletPage.screenshot({
      path: getShotPath('playwright_tablet_dashboard.png'),
    });
  } catch (err) {
    record('Tablet: Dashboard Responsive Load', false, err.message);
  }

  await tabletContext.close();
  await browser.close();

  // Summary
  console.log('\n==========================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  console.log(
    `E2E TEST SUMMARY: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(0)}%)`,
  );
  console.log('==========================================\n');

  if (passed < total) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
