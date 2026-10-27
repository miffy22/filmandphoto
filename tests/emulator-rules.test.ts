import fs from 'fs';
import path from 'path';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';

const PROJECT_ID = 'demo-filmandphoto-rules-test';

async function runEmulatorSecurityTests() {
  console.log('====================================================');
  console.log('REAL FIRESTORE RULES EMULATOR SECURITY TEST SUITE');
  console.log('Testing actual firestore.rules against Google Emulator');
  console.log('====================================================\n');

  const rulesContent = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');

  const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
    },
  });

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

  try {
    // Seed initial test data using administrative bypass context
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();

      // Seed Studio Alpha & Studio Bravo
      await setDoc(doc(adminDb, 'studios', 'studio_alpha'), {
        id: 'studio_alpha',
        name: 'Alpha Films',
        ownerId: 'studio_alpha',
        email: 'alpha@example.com',
      });
      await setDoc(doc(adminDb, 'studios', 'studio_bravo'), {
        id: 'studio_bravo',
        name: 'Bravo Films',
        ownerId: 'studio_bravo',
        email: 'bravo@example.com',
      });

      // Seed Projects: 1 Draft, 1 Published for Studio Alpha
      await setDoc(doc(adminDb, 'projects', 'proj_alpha_draft'), {
        id: 'proj_alpha_draft',
        title: 'Secret Unreleased Wedding',
        ownerId: 'studio_alpha',
        status: 'draft',
        isPublished: false,
      });
      await setDoc(doc(adminDb, 'projects', 'proj_alpha_published'), {
        id: 'proj_alpha_published',
        title: 'Sophia & Alexander Official 4K Gallery',
        ownerId: 'studio_alpha',
        status: 'delivered',
        isPublished: true,
      });

      // Seed Order for Studio Alpha
      await setDoc(doc(adminDb, 'orders', 'ord_1001'), {
        id: 'ord_1001',
        orderNumber: 'CF-1001',
        projectId: 'proj_alpha_published',
        ownerId: 'studio_alpha',
        customerId: 'customer_sophia',
        total: 350,
        status: 'in_production',
      });
    });

    // 1. Unauthenticated client tests
    const unauthDb = testEnv.unauthenticatedContext().firestore();

    await test('T01: Unauthenticated visitors cannot list projects', async () => {
      await assertFails(getDocs(collection(unauthDb, 'projects')));
    });

    await test('T02: Unauthenticated visitors cannot list studios', async () => {
      await assertFails(getDocs(collection(unauthDb, 'studios')));
    });

    await test('T03: Unauthenticated visitors cannot list orders', async () => {
      await assertFails(getDocs(collection(unauthDb, 'orders')));
    });

    await test('T04: Unauthenticated visitors cannot read private draft projects', async () => {
      await assertFails(getDoc(doc(unauthDb, 'projects', 'proj_alpha_draft')));
    });

    await test('T05: Unauthenticated gallery guests CAN fetch published project', async () => {
      await assertSucceeds(getDoc(doc(unauthDb, 'projects', 'proj_alpha_published')));
    });

    await test('T06: Unauthenticated guests CANNOT delete published projects', async () => {
      await assertFails(deleteDoc(doc(unauthDb, 'projects', 'proj_alpha_published')));
    });

    await test('T07: Unauthenticated guests CANNOT update published projects', async () => {
      await assertFails(updateDoc(doc(unauthDb, 'projects', 'proj_alpha_published'), { title: 'Defaced Title' }));
    });

    await test('T08: Untrusted clients CANNOT create orders directly (prevents price tampering)', async () => {
      await assertFails(
        setDoc(doc(unauthDb, 'orders', 'fake_order'), {
          orderNumber: 'CF-9999',
          projectId: 'proj_alpha_published',
          total: 1, // Tampered price
          status: 'paid',
        })
      );
    });

    // 2. Studio Alpha authenticated tests
    const studioAlphaDb = testEnv.authenticatedContext('studio_alpha').firestore();

    await test('T09: Studio Alpha CAN read its own draft projects', async () => {
      await assertSucceeds(getDoc(doc(studioAlphaDb, 'projects', 'proj_alpha_draft')));
    });

    await test('T10: Studio Alpha CAN update its own projects', async () => {
      await assertSucceeds(
        updateDoc(doc(studioAlphaDb, 'projects', 'proj_alpha_published'), {
          customNotes: 'Updated by studio author',
        })
      );
    });

    await test('T11: Studio Alpha CAN create new projects assigned to its own UID', async () => {
      await assertSucceeds(
        setDoc(doc(studioAlphaDb, 'projects', 'proj_alpha_new'), {
          id: 'proj_alpha_new',
          title: 'Elena & Julian',
          ownerId: 'studio_alpha',
          isPublished: false,
          status: 'draft',
        })
      );
    });

    await test('T12: Studio Alpha CAN read orders placed for its projects', async () => {
      await assertSucceeds(getDoc(doc(studioAlphaDb, 'orders', 'ord_1001')));
    });

    // 3. Studio Bravo cross-studio isolation tests
    const studioBravoDb = testEnv.authenticatedContext('studio_bravo').firestore();

    await test('T13: Studio Bravo CANNOT edit Studio Alpha projects (Cross-Studio Edit Denial)', async () => {
      await assertFails(
        updateDoc(doc(studioBravoDb, 'projects', 'proj_alpha_published'), {
          title: 'Tampered by Competitor',
        })
      );
    });

    await test('T14: Studio Bravo CANNOT delete Studio Alpha projects (Cross-Studio Delete Denial)', async () => {
      await assertFails(deleteDoc(doc(studioBravoDb, 'projects', 'proj_alpha_published')));
    });

    await test('T15: Studio Bravo CANNOT inspect Studio Alpha private studio profile', async () => {
      await assertFails(getDoc(doc(studioBravoDb, 'studios', 'studio_alpha')));
    });

    await test('T16: Studio Bravo CANNOT inspect Studio Alpha private customer orders', async () => {
      await assertFails(getDoc(doc(studioBravoDb, 'orders', 'ord_1001')));
    });

    // 4. Customer order privacy
    const customerSophiaDb = testEnv.authenticatedContext('customer_sophia').firestore();
    const otherCustomerDb = testEnv.authenticatedContext('stranger_customer').firestore();

    await test('T17: Customer Sophia CAN read her own order', async () => {
      await assertSucceeds(getDoc(doc(customerSophiaDb, 'orders', 'ord_1001')));
    });

    await test('T18: Stranger Customer CANNOT read Customer Sophia order (Customer Privacy)', async () => {
      await assertFails(getDoc(doc(otherCustomerDb, 'orders', 'ord_1001')));
    });

    await test('T19: Orders cannot be deleted by anyone (Financial Audit Immutability)', async () => {
      await assertFails(deleteDoc(doc(studioAlphaDb, 'orders', 'ord_1001')));
    });
  } finally {
    await testEnv.cleanup();
  }

  console.log(`\n====================================================`);
  console.log(`EMULATOR TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runEmulatorSecurityTests().catch((e) => {
  console.error('Fatal Emulator Test Suite Error:', e);
  process.exit(1);
});
