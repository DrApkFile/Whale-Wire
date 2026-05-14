import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Resilient Initialization
// If we're on the server and missing an API key (like during some build steps),
// we use a minimal placeholder to prevent module-level crashes.
const isBrowser = typeof window !== "undefined";

const app = (getApps().length > 0)
    ? getApp()
    : (isBrowser || firebaseConfig.apiKey)
        ? initializeApp(firebaseConfig)
        : initializeApp({ apiKey: "build-placeholder", projectId: "build-placeholder" });

export const auth = getAuth(app);
export const db = getFirestore(app);
