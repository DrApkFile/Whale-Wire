import * as admin from "firebase-admin";

/**
 * IRONCLAD FIREBASE ADMIN INITIALIZER
 * Uses the full Service Account JSON to bypass variable-level mangling.
 */

function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    // 1. ATTEMPT FULL JSON PARSE (The Ironclad Method)
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountJson) {
        try {
            const cert = JSON.parse(serviceAccountJson);

            // Critical fix: Ensure private_key has correct newlines if they were escaped in the JSON string
            if (cert.private_key) {
                cert.private_key = cert.private_key.replace(/\\n/g, '\n');
            }

            return admin.initializeApp({
                credential: admin.credential.cert(cert),
            });
        } catch (e: any) {
            console.error("JSON initialization failed:", e.message);
        }
    }

    // 2. FALLBACK TO INDIVIDUAL VARIABLES (Legacy / Dev)
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (projectId && clientEmail && privateKey) {
        try {
            return admin.initializeApp({
                credential: admin.credential.cert({
                    project_id: projectId,
                    client_email: clientEmail,
                    private_key: privateKey,
                } as any),
            });
        } catch (err: any) {
            throw new Error(`Ironclad Failed. Individual Init Error: ${err.message}`);
        }
    }

    // 3. BUILD-PHASE PADDING
    if (admin.apps.length > 0) return admin.app();
    return admin.initializeApp({ projectId: projectId || "whale-wire" });
}

export const getAdminDb = () => {
    try {
        const app = initializeAdmin();
        return app.firestore();
    } catch (e: any) {
        throw e;
    }
};

export const getAdminAuth = () => {
    try {
        const app = initializeAdmin();
        return app.auth();
    } catch (e: any) {
        throw e;
    }
};
