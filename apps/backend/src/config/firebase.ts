import { initializeApp as initializeWebApp, getApps as getWebApps } from 'firebase/app';
import { getFirestore as getWebFirestore } from 'firebase/firestore';
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

let db: any;

try {
  if (ENV.FIREBASE_CLIENT_EMAIL && ENV.FIREBASE_PRIVATE_KEY) {
    const adminApp = getAdminApps().length === 0
      ? initializeAdminApp({
          credential: cert({
            projectId: ENV.FIREBASE_PROJECT_ID,
            clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
            privateKey: ENV.FIREBASE_PRIVATE_KEY,
          }),
        })
      : getAdminApps()[0];

    db = getAdminFirestore(adminApp);
    console.log('⚡ Firebase Admin SDK Connected via Service Account Credentials.');
  } else {
    // Connect using Web App config (apiKey, projectId, appId)
    const webApp = getWebApps().length === 0 ? initializeWebApp(firebaseConfig) : getWebApps()[0];
    db = getWebFirestore(webApp);
    console.log('⚡ Firebase SDK Connected via Web Config Project ID:', ENV.FIREBASE_PROJECT_ID);
  }
} catch (error) {
  console.warn('⚠️ Firebase Initialization Warning:', error);
  const webApp = getWebApps().length === 0 ? initializeWebApp(firebaseConfig) : getWebApps()[0];
  db = getWebFirestore(webApp);
}

export { db };
