import * as admin from "firebase-admin";

/**
 * RESILIENT FIREBASE ADMIN INITIALIZER
 * Uses Base64 decoding to bypass all PEM / Env newline issues.
 */

function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    // Attempt 1: Base64 Decoded Private Key (The Gold Standard)
    let privateKey = process.env.FIREBASE_PRIVATE_KEY_B64;
    if (privateKey) {
        try {
            // Buffer.from works in Vercel/Node environments
            privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
        } catch (e) {
            console.error("Base64 decoding failed, trying raw...");
        }
    }

    // Attempt 2: Fallback to Raw Private Key
    if (!privateKey) {
        privateKey = process.env.FIREBASE_PRIVATE_KEY;
    }

    // PEM normalization (Cleanup in case raw key was used)
    if (privateKey) {
        privateKey = privateKey.trim();
        privateKey = privateKey.replace(/^['"]|['"]$/g, '');
        privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r/g, '');

        if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
            privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
        }
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
            console.error("Critical Admin cert error:", err.message);
            throw new Error(`Credential Error: ${err.message}`);
        }
    }

    // Fallback for static builds
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
