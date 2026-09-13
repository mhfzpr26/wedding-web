import assert from 'node:assert';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testDependenciesIntegration() {
  console.log('🚀 [START] Verifying Dependencies Integration in WEDFLOW...\n');

  // ==========================================
  // TEST 1: ZOD Validation on /api/rsvp
  // ==========================================
  console.log('🧪 Test 1: Testing Zod Validation on /api/rsvp...');

  // 1A. Invalid RSVP (empty name)
  const invalidRsvpRes = await fetch(`${BASE_URL}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '',
      attendance: 'Hadir',
    }),
  });
  assert.strictEqual(
    invalidRsvpRes.status,
    400,
    `Expected 400 Bad Request for empty name, got ${invalidRsvpRes.status}`,
  );
  const invalidRsvpData = await invalidRsvpRes.json();
  assert.ok(
    invalidRsvpData.details?.name,
    'Expected details.name error in response',
  );
  console.log(
    '  ✅ [PASS] Invalid RSVP rejected with 400 and field error:',
    invalidRsvpData.error,
  );

  // 1B. Valid RSVP
  const validRsvpRes = await fetch(`${BASE_URL}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. Testing Zod Valid',
      attendance: 'Hadir',
      guestCount: 2,
      notes: 'Selamat menempuh hidup baru!',
      invitationSlug: 'destia-rakafansa',
    }),
  });
  assert.strictEqual(
    validRsvpRes.status,
    201,
    `Expected 201 Created for valid RSVP, got ${validRsvpRes.status}`,
  );
  console.log('  ✅ [PASS] Valid RSVP accepted with 201 Created.');

  // ==========================================
  // TEST 2: ZOD Validation on /api/wishes
  // ==========================================
  console.log('\n🧪 Test 2: Testing Zod Validation on /api/wishes...');

  // 2A. Invalid Wish (empty message)
  const invalidWishRes = await fetch(`${BASE_URL}/api/wishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rahmat',
      message: 'a', // Too short (min 3)
    }),
  });
  assert.strictEqual(
    invalidWishRes.status,
    400,
    `Expected 400 for wish < 3 chars, got ${invalidWishRes.status}`,
  );
  const invalidWishData = await invalidWishRes.json();
  assert.ok(invalidWishData.details?.message, 'Expected details.message error');
  console.log(
    '  ✅ [PASS] Invalid wish rejected with 400:',
    invalidWishData.error,
  );

  // 2B. Valid Wish
  const validWishRes = await fetch(`${BASE_URL}/api/wishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Keluarga Besar Budi',
      status: 'Hadir',
      message: 'Barakallahu lakuma wa baraka alaikuma!',
      invitationSlug: 'destia-rakafansa',
    }),
  });
  assert.strictEqual(
    validWishRes.status,
    201,
    `Expected 201 for valid wish, got ${validWishRes.status}`,
  );
  console.log('  ✅ [PASS] Valid wish accepted with 201 Created.');

  // ==========================================
  // TEST 3: ZOD Validation on /api/admin/saas/clients
  // ==========================================
  console.log(
    '\n🧪 Test 3: Testing Zod Validation on /api/admin/saas/clients...',
  );

  const invalidClientRes = await fetch(`${BASE_URL}/api/admin/saas/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'X', // Too short
      phone: 'not-a-phone!@#$',
    }),
  });
  assert.strictEqual(
    invalidClientRes.status,
    400,
    `Expected 400 for invalid client input, got ${invalidClientRes.status}`,
  );
  const invalidClientData = await invalidClientRes.json();
  console.log(
    '  ✅ [PASS] Invalid client rejected with 400:',
    invalidClientData.error,
  );

  // ==========================================
  // TEST 4: ZOD Validation on /api/admin/saas/invitations
  // ==========================================
  console.log(
    '\n🧪 Test 4: Testing Zod Validation on /api/admin/saas/invitations...',
  );

  const invalidInvRes = await fetch(`${BASE_URL}/api/admin/saas/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Ok', // min 3
      slug: 'INVALID SLUG WITH SPACES', // invalid slug
    }),
  });
  assert.strictEqual(
    invalidInvRes.status,
    400,
    `Expected 400 for invalid invitation, got ${invalidInvRes.status}`,
  );
  const invalidInvData = await invalidInvRes.json();
  console.log(
    '  ✅ [PASS] Invalid invitation rejected with 400:',
    invalidInvData.error,
  );

  console.log(
    '\n🎉 [SUCCESS] All dependency integration tests passed flawlessly!',
  );
}

testDependenciesIntegration().catch((err) => {
  console.error('\n❌ [FAILED] Verification error:', err);
  process.exit(1);
});
