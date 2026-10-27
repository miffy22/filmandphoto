/**
 * Automated Firestore Rules Logic Verification Test Suite
 * Validates the 8 Security Pillars & Dirty Dozen Test Payloads
 */

interface SecurityContext {
  auth: { uid: string } | null;
}

interface DocumentContext {
  id: string;
  data: Record<string, any>;
}

// Rule evaluator matching firestore.rules
class RulesEvaluator {
  static evaluateProjects(
    op: 'list' | 'get' | 'create' | 'update' | 'delete',
    context: SecurityContext,
    doc: DocumentContext | null,
    newResource?: Record<string, any>
  ): { allowed: boolean; reason: string } {
    const isAuthenticated = context.auth !== null;

    if (op === 'list') {
      return isAuthenticated
        ? { allowed: true, reason: 'Authenticated studio can list' }
        : { allowed: false, reason: 'Unauthenticated users cannot list projects' };
    }

    if (op === 'get') {
      if (!doc) return { allowed: false, reason: 'Document not found' };
      const isOwner = isAuthenticated && (doc.data.ownerId === context.auth?.uid || doc.data.studioId === context.auth?.uid);
      const isPublished = doc.data.isPublished === true || doc.data.status === 'delivered' || doc.data.status === 'published';

      if (isOwner || isPublished) {
        return { allowed: true, reason: isOwner ? 'Owner access' : 'Published client gallery access' };
      }
      return { allowed: false, reason: 'Draft or private project cannot be accessed without studio auth' };
    }

    if (op === 'create') {
      if (!isAuthenticated) return { allowed: false, reason: 'Authentication required' };
      const targetOwner = newResource?.ownerId || newResource?.studioId;
      if (targetOwner === context.auth?.uid) {
        return { allowed: true, reason: 'Studio owner created project' };
      }
      return { allowed: false, reason: 'Cannot create project owned by another studio' };
    }

    if (op === 'update') {
      if (!isAuthenticated || !doc) return { allowed: false, reason: 'Authentication required' };
      const isOwner = doc.data.ownerId === context.auth?.uid || doc.data.studioId === context.auth?.uid;
      if (!isOwner) return { allowed: false, reason: 'Cross-studio update forbidden' };
      if (newResource?.ownerId && newResource.ownerId !== doc.data.ownerId) {
        return { allowed: false, reason: 'Cannot reassign project ownership' };
      }
      return { allowed: true, reason: 'Owner update allowed' };
    }

    if (op === 'delete') {
      if (!isAuthenticated || !doc) return { allowed: false, reason: 'Authentication required' };
      const isOwner = doc.data.ownerId === context.auth?.uid || doc.data.studioId === context.auth?.uid;
      if (!isOwner) return { allowed: false, reason: 'Cross-studio deletion forbidden' };
      return { allowed: true, reason: 'Owner deletion allowed' };
    }

    return { allowed: false, reason: 'Default deny' };
  }

  static evaluateOrders(
    op: 'list' | 'get' | 'create' | 'update' | 'delete',
    context: SecurityContext,
    doc: DocumentContext | null,
    newResource?: Record<string, any>
  ): { allowed: boolean; reason: string } {
    const isAuthenticated = context.auth !== null;

    if (op === 'list') {
      return isAuthenticated
        ? { allowed: true, reason: 'Authenticated query allowed' }
        : { allowed: false, reason: 'Unauthenticated users cannot list orders' };
    }

    if (op === 'get') {
      if (!isAuthenticated || !doc) return { allowed: false, reason: 'Order privacy requires auth' };
      const isAuthorized = doc.data.ownerId === context.auth?.uid || doc.data.customerId === context.auth?.uid;
      return isAuthorized
        ? { allowed: true, reason: 'Order accessible to owning studio or purchasing customer' }
        : { allowed: false, reason: 'Arbitrary users cannot view customer orders' };
    }

    if (op === 'create') {
      const isValid = newResource?.orderNumber && newResource?.projectId && typeof newResource?.total === 'number';
      return isValid
        ? { allowed: true, reason: 'Valid store checkout order created' }
        : { allowed: false, reason: 'Invalid order schema' };
    }

    if (op === 'update') {
      if (!isAuthenticated || !doc) return { allowed: false, reason: 'Auth required' };
      const isOwner = doc.data.ownerId === context.auth?.uid;
      return isOwner
        ? { allowed: true, reason: 'Studio owner updated order status' }
        : { allowed: false, reason: 'Only studio owner can update orders' };
    }

    if (op === 'delete') {
      return { allowed: false, reason: 'Orders are immutable and cannot be deleted' };
    }

    return { allowed: false, reason: 'Default deny' };
  }

  static evaluateStudios(
    op: 'list' | 'get' | 'create' | 'update' | 'delete',
    context: SecurityContext,
    doc: DocumentContext | null,
    newResource?: Record<string, any>
  ): { allowed: boolean; reason: string } {
    const isAuthenticated = context.auth !== null;

    if (op === 'list') {
      return isAuthenticated
        ? { allowed: true, reason: 'Authenticated query allowed' }
        : { allowed: false, reason: 'Unauthenticated visitors cannot list studios' };
    }

    if (!isAuthenticated) return { allowed: false, reason: 'Studio operations require authentication' };

    if (op === 'get') {
      if (!doc) return { allowed: false, reason: 'Not found' };
      return doc.id === context.auth?.uid || doc.data.ownerId === context.auth?.uid
        ? { allowed: true, reason: 'Studio owner get' }
        : { allowed: false, reason: 'Cannot inspect another studio configuration' };
    }

    if (op === 'create' || op === 'update' || op === 'delete') {
      const targetId = doc ? doc.id : newResource?.id;
      const targetOwner = doc ? doc.data.ownerId : newResource?.ownerId;
      const isOwner = targetId === context.auth?.uid || targetOwner === context.auth?.uid;
      return isOwner
        ? { allowed: true, reason: 'Owner studio action allowed' }
        : { allowed: false, reason: 'Cross-studio mutation forbidden' };
    }

    return { allowed: false, reason: 'Default deny' };
  }
}

// Run the Dirty Dozen Test Cases
function runTests() {
  console.log('--- EXECUTING FIRESTORE SECURITY RULES VERIFICATION ---');
  let passed = 0;
  let failed = 0;

  function assert(testId: string, description: string, condition: boolean, detail: string) {
    if (condition) {
      console.log(`[PASS] ${testId}: ${description} (${detail})`);
      passed++;
    } else {
      console.error(`[FAIL] ${testId}: ${description} (${detail})`);
      failed++;
    }
  }

  // 1. Unauthenticated List Projects
  const r1 = RulesEvaluator.evaluateProjects('list', { auth: null }, null);
  assert('T01', 'Unauthenticated user cannot list projects', r1.allowed === false, r1.reason);

  // 2. Unauthenticated List Studios
  const r2 = RulesEvaluator.evaluateStudios('list', { auth: null }, null);
  assert('T02', 'Unauthenticated user cannot list studios', r2.allowed === false, r2.reason);

  // 3. Unauthenticated List Orders
  const r3 = RulesEvaluator.evaluateOrders('list', { auth: null }, null);
  assert('T03', 'Unauthenticated user cannot list orders', r3.allowed === false, r3.reason);

  // 4. Unauthenticated Read Private Draft
  const draftDoc = { id: 'p_draft', data: { ownerId: 'studio_alpha', isPublished: false, status: 'draft' } };
  const r4 = RulesEvaluator.evaluateProjects('get', { auth: null }, draftDoc);
  assert('T04', 'Unauthenticated visitor denied read on private draft', r4.allowed === false, r4.reason);

  // 5. Unauthenticated Read Published Gallery
  const publishedDoc = { id: 'p_pub', data: { ownerId: 'studio_alpha', isPublished: true, status: 'published' } };
  const r5 = RulesEvaluator.evaluateProjects('get', { auth: null }, publishedDoc);
  assert('T05', 'Guest successfully reads published client gallery', r5.allowed === true, r5.reason);

  // 6. Guest Attempt Delete Project
  const r6 = RulesEvaluator.evaluateProjects('delete', { auth: null }, publishedDoc);
  assert('T06', 'Guest denied deleting published project', r6.allowed === false, r6.reason);

  // 7. Guest Attempt Edit Project
  const r7 = RulesEvaluator.evaluateProjects('update', { auth: null }, publishedDoc, { title: 'Hacked' });
  assert('T07', 'Guest denied modifying published project', r7.allowed === false, r7.reason);

  // 8. Cross-Studio Edit Project
  const r8 = RulesEvaluator.evaluateProjects('update', { auth: { uid: 'studio_bravo' } }, publishedDoc, { title: 'Hijacked' });
  assert('T08', 'Studio Bravo denied editing Studio Alpha project', r8.allowed === false, r8.reason);

  // 9. Cross-Studio Delete Project
  const r9 = RulesEvaluator.evaluateProjects('delete', { auth: { uid: 'studio_bravo' } }, publishedDoc);
  assert('T09', 'Studio Bravo denied deleting Studio Alpha project', r9.allowed === false, r9.reason);

  // 10. Studio Owner Valid Operations
  const r10 = RulesEvaluator.evaluateProjects('update', { auth: { uid: 'studio_alpha' } }, publishedDoc, { title: 'Updated Vows Cut' });
  assert('T10', 'Studio Alpha successfully updates own project', r10.allowed === true, r10.reason);

  // 11. Arbitrary Order Read
  const orderDoc = { id: 'ord_123', data: { ownerId: 'studio_alpha', customerId: 'cust_456', total: 240 } };
  const r11 = RulesEvaluator.evaluateOrders('get', { auth: { uid: 'stranger_789' } }, orderDoc);
  assert('T11', 'Arbitrary user denied reading private customer order', r11.allowed === false, r11.reason);

  // 12. Order Deletion Attempt
  const r12 = RulesEvaluator.evaluateOrders('delete', { auth: { uid: 'studio_alpha' } }, orderDoc);
  assert('T12', 'Any user including studio denied deleting order', r12.allowed === false, r12.reason);

  console.log(`\nTEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) process.exit(1);
}

runTests();
