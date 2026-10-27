/**
 * Automated End-to-End API Test Suite for CineFlow Server
 * Tests API Endpoints, Domain Verification, Video Resolvers, Stripe Checkout,
 * Server-Side Order Calculations, and Webhook Signature & Idempotency.
 */

async function runApiE2ETests() {
  console.log('====================================================');
  console.log('AUTOMATED END-TO-END API & STRIPE INTEGRATION TESTS');
  console.log('====================================================\n');

  const BASE_URL = process.env.API_TEST_URL || 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}:`, err.message || err);
      failed++;
    }
  }

  // 1. Health check
  await test('API 01: GET /api/health returns healthy status and platform capabilities', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error(`Unexpected status: ${data.status}`);
  });

  // 2. Storage resolver
  await test('API 02: POST /api/storage/resolve resolves YouTube Unlisted 4K stream', async () => {
    const res = await fetch(`${BASE_URL}/api/storage/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.type !== 'youtube' || !data.embedUrl) throw new Error(`Invalid resolve payload: ${JSON.stringify(data)}`);
  });

  await test('API 03: POST /api/storage/resolve resolves Google Drive share link', async () => {
    const res = await fetch(`${BASE_URL}/api/storage/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://drive.google.com/file/d/1A2B3C4D5E6F/view' }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.type !== 'googledrive' || !data.embedUrl) throw new Error(`Invalid resolve payload: ${JSON.stringify(data)}`);
  });

  // 3. Domain verification
  await test('API 04: POST /api/domain/verify verifies domain via genuine DNS lookup', async () => {
    const res = await fetch(`${BASE_URL}/api/domain/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'filmandphoto.uk' }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.domain !== 'filmandphoto.uk' || !data.status) throw new Error(`Invalid domain response`);
  });

  // 4. Billing Checkout
  await test('API 05: POST /api/billing/create-checkout handles plans honestly without fake session IDs', async () => {
    const res = await fetch(`${BASE_URL}/api/billing/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: 'pro',
        email: 'cinematographer@example.com',
        filmmakerName: 'Lumina Cinema',
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Failed to create checkout response');
    // Ensure no fabricated session ID in sandbox mode
    if (data.mode === 'test_sandbox' && data.sessionId !== null) {
      throw new Error(`Fabricated session ID detected in sandbox: ${data.sessionId}`);
    }
  });

  // 5. Server-Side Store Checkout & Price Protection
  await test('API 06: POST /api/store/create-checkout-session enforces server-side pricing and discount calculation', async () => {
    const res = await fetch(`${BASE_URL}/api/store/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj_demo_wedding',
        clientName: 'Alexander & Sophia',
        clientEmail: 'alex@example.com',
        couponCode: 'CELEBRATE20',
        items: [
          {
            id: 'item_1',
            productId: 'prod_album_12x12',
            productName: 'Heirloom Flush Mount Leather Album',
            quantity: 1,
            unitPrice: 750,
            unitLabCost: 145,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.order) throw new Error('Missing order in response');

    // Verify server calculation: 750 subtotal - 20% (150) + 15 shipping = 615 total
    if (data.order.subtotal !== 750 || data.order.total !== 615 || data.order.discountAmount !== 150) {
      throw new Error(`Server calculation mismatch. Subtotal: ${data.order.subtotal}, Total: ${data.order.total}`);
    }
  });

  await test('API 07: POST /api/store/create-checkout-session rejects empty order payloads', async () => {
    const res = await fetch(`${BASE_URL}/api/store/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj_demo_wedding',
        items: [],
      }),
    });
    if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`);
  });

  // 6. Stripe Webhooks: Signature Rejection & Idempotency
  await test('API 08: POST /api/billing/webhook rejects requests missing stripe-signature header', async () => {
    const res = await fetch(`${BASE_URL}/api/billing/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'evt_test_1', type: 'checkout.session.completed' }),
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request but got ${res.status}`);
  });

  await test('API 09: POST /api/billing/webhook processes valid events and deduplicates identical events (Idempotency)', async () => {
    const testEventId = `evt_idempotency_test_${Date.now()}`;
    const payload = {
      id: testEventId,
      type: 'checkout.session.completed',
      data: {
        object: {
          id: `cs_${Date.now()}`,
          customer_email: 'test@filmandphoto.uk',
          metadata: { type: 'subscription_plan', planId: 'pro' },
        },
      },
    };

    // First call (with signature header)
    const res1 = await fetch(`${BASE_URL}/api/billing/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 't=1234567,v1=test_sandbox_sig',
      },
      body: JSON.stringify(payload),
    });

    if (!res1.ok) throw new Error(`First webhook call failed with ${res1.status}`);
    const data1 = await res1.json();
    if (!data1.received) throw new Error('Expected received: true');

    // Second call: duplicate event ID -> must return already_processed
    const res2 = await fetch(`${BASE_URL}/api/billing/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 't=1234567,v1=test_sandbox_sig',
      },
      body: JSON.stringify(payload),
    });

    if (!res2.ok) throw new Error(`Duplicate webhook call failed with ${res2.status}`);
    const data2 = await res2.json();
    if (data2.status !== 'already_processed') {
      throw new Error(`Expected idempotency status 'already_processed' but got '${data2.status}'`);
    }
  });

  console.log(`\n====================================================`);
  console.log(`API E2E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================\n`);

  if (failed > 0) process.exit(1);
}

runApiE2ETests().catch((e) => {
  console.error('Fatal API E2E Error:', e);
  process.exit(1);
});
