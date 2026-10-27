import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
} from 'firebase/firestore';
import type { ClientProject, StoreOrder, ProfessionalStudio } from './types/cineflow';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, operating in resilient cached mode.');
    }
    return false;
  }
}

// ==========================================
// CLOUD PERSISTENCE: PROJECTS
// ==========================================

export async function fetchProjectsFromCloud(): Promise<ClientProject[]> {
  const path = 'projects';
  try {
    const snap = await getDocs(collection(db, path));
    const projects: ClientProject[] = [];
    snap.forEach((d) => {
      projects.push(d.data() as ClientProject);
    });
    return projects;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function fetchProjectByIdFromCloud(idOrSlug: string): Promise<ClientProject | null> {
  const path = `projects/${idOrSlug}`;
  try {
    // 1. Try exact document ID
    const docRef = doc(db, 'projects', idOrSlug);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ClientProject;
    }

    // 2. Fallback search across all projects by slug or id
    const all = await fetchProjectsFromCloud();
    const found = all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveProjectToCloud(project: ClientProject): Promise<boolean> {
  const path = `projects/${project.id}`;
  try {
    // Clean any undefined fields for Firestore serialization
    const sanitized = JSON.parse(JSON.stringify(project));
    await setDoc(doc(db, 'projects', project.id), sanitized, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteProjectFromCloud(projectId: string): Promise<boolean> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

// ==========================================
// CLOUD PERSISTENCE: ORDERS (PRINT STORE)
// ==========================================

export async function saveOrderToCloud(order: StoreOrder): Promise<boolean> {
  const path = `orders/${order.id}`;
  try {
    const sanitized = JSON.parse(JSON.stringify(order));
    await setDoc(doc(db, 'orders', order.id), sanitized, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function fetchOrdersFromCloud(): Promise<StoreOrder[]> {
  const path = 'orders';
  try {
    const snap = await getDocs(collection(db, path));
    const orders: StoreOrder[] = [];
    snap.forEach((d) => {
      orders.push(d.data() as StoreOrder);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// ==========================================
// CLOUD PERSISTENCE: STUDIO CONFIG
// ==========================================

export async function saveStudioToCloud(studio: ProfessionalStudio): Promise<boolean> {
  const path = `studios/${studio.id}`;
  try {
    const sanitized = JSON.parse(JSON.stringify(studio));
    await setDoc(doc(db, 'studios', studio.id), sanitized, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function fetchStudioFromCloud(studioId: string): Promise<ProfessionalStudio | null> {
  const path = `studios/${studioId}`;
  try {
    const snap = await getDoc(doc(db, 'studios', studioId));
    if (snap.exists()) {
      return snap.data() as ProfessionalStudio;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}
