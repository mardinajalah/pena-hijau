import { initializeApp as initializeWebApp, getApps as getWebApps } from 'firebase/app';
import {
  getFirestore as getWebFirestore,
  collection as webCollection,
  doc as webDoc,
  getDocs as webGetDocs,
  getDoc as webGetDoc,
  setDoc as webSetDoc,
  deleteDoc as webDeleteDoc,
  query as webQuery,
  where as webWhere,
  limit as webLimit,
  WhereFilterOp,
} from 'firebase/firestore';
import { initializeApp as initializeAdminApp, cert, getApps as getAdminApps } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { ENV } from './env';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

let rawDb: any;
let isAdminSdk = false;

try {
  if (ENV.FIREBASE_CLIENT_EMAIL && ENV.FIREBASE_PRIVATE_KEY) {
    const adminApp =
      getAdminApps().length === 0
        ? initializeAdminApp({
            credential: cert({
              projectId: ENV.FIREBASE_PROJECT_ID,
              clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
              privateKey: ENV.FIREBASE_PRIVATE_KEY,
            }),
          })
        : getAdminApps()[0];

    rawDb = getAdminFirestore(adminApp);
    isAdminSdk = true;
    console.log('⚡ Firebase Admin SDK Connected via Service Account Credentials.');
  } else {
    const webApp = getWebApps().length === 0 ? initializeWebApp(firebaseConfig) : getWebApps()[0];
    rawDb = getWebFirestore(webApp);
    console.log('⚡ Firebase SDK Connected via Web Config Project ID:', ENV.FIREBASE_PROJECT_ID);
  }
} catch (error) {
  console.warn('⚠️ Firebase Initialization Warning:', error);
  const webApp = getWebApps().length === 0 ? initializeWebApp(firebaseConfig) : getWebApps()[0];
  rawDb = getWebFirestore(webApp);
}

// Unified Firestore collection interface supporting both Admin SDK & Web SDK
export const db = {
  collection(colName: string) {
    if (isAdminSdk && typeof rawDb.collection === 'function') {
      return rawDb.collection(colName);
    }

    return {
      doc(docId: string) {
        const docRef = webDoc(rawDb, colName, docId);
        return {
          async get() {
            const snap = await webGetDoc(docRef);
            return {
              exists: snap.exists(),
              id: snap.id,
              data: () => snap.data(),
            };
          },
          async set(data: any, options?: { merge?: boolean }) {
            await webSetDoc(docRef, data, { merge: options?.merge ?? false });
          },
          async update(data: any) {
            await webSetDoc(docRef, data, { merge: true });
          },
          async delete() {
            await webDeleteDoc(docRef);
          },
        };
      },

      where(field: string, opStr: WhereFilterOp, value: any) {
        const colRef = webCollection(rawDb, colName);
        let q = webQuery(colRef, webWhere(field, opStr, value));

        return {
          limit(num: number) {
            q = webQuery(q, webLimit(num));
            return {
              async get() {
                const snap = await webGetDocs(q);
                return {
                  empty: snap.empty,
                  docs: snap.docs.map((d) => ({
                    id: d.id,
                    data: () => d.data(),
                  })),
                };
              },
            };
          },
          async get() {
            const snap = await webGetDocs(q);
            return {
              empty: snap.empty,
              docs: snap.docs.map((d) => ({
                id: d.id,
                data: () => d.data(),
              })),
            };
          },
        };
      },

      async get() {
        const colRef = webCollection(rawDb, colName);
        const snap = await webGetDocs(colRef);
        return {
          empty: snap.empty,
          docs: snap.docs.map((d) => ({
            id: d.id,
            data: () => d.data(),
          })),
        };
      },
    };
  },
};
