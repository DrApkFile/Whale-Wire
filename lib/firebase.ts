import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Resilient Initialization for Prerendering
let app: FirebaseApp | undefined;
try {
    if (firebaseConfig.apiKey) {
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
} catch (e) {
    console.warn("Client Firebase Init postponed - likely build phase");
}

// CAUTION: We use type-casting if app is missing to satisfy TS, 
// but we must be careful in components. Components should check for auth/db existence.
const auth = app ? getAuth(app) : ({} as Auth);
const db = app ? getFirestore(app) : ({} as Firestore);

export { auth, db };
