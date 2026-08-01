import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { ENV } from './env';

let app: App;
let db: Firestore;

try {
  if (getApps().length === 0) {
    if (ENV.FIREBASE_CLIENT_EMAIL && ENV.FIREBASE_PRIVATE_KEY) {
      app = initializeApp({
        credential: cert({
          projectId: ENV.FIREBASE_PROJECT_ID,
          clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
          privateKey: ENV.FIREBASE_PRIVATE_KEY,
        }),
        storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
      });
      console.log('⚡ Firebase Admin SDK initialized with Service Account Credentials.');
    } else {
      app = initializeApp({
        projectId: ENV.FIREBASE_PROJECT_ID,
        storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
      });
      console.log('⚡ Firebase Admin SDK initialized with Project ID:', ENV.FIREBASE_PROJECT_ID);
    }
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK initialization warning:', error);
  app = getApps()[0] || initializeApp({ projectId: ENV.FIREBASE_PROJECT_ID || 'penahijau-6c1ba' });
  db = getFirestore(app);
}

export { app, db };
