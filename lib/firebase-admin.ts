import * as admin from "firebase-admin";

/**
 * RESILIENT FIREBASE ADMIN INITIALIZER
 * Optimized for Vercel/Next.js runtime environments.
 */

function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // PEM normalization - EXTRA AGGRESSIVE
    if (privateKey) {
        privateKey = privateKey.trim();
        // Remove quotes if present
        privateKey = privateKey.replace(/^['"]|['"]$/g, '');
        // Standardize newlines
        privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r/g, '');

        // Ensure markers exist
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
    if (process.env.NODE_ENV === 'production') {
        if (admin.apps.length > 0) return admin.app();
        console.warn("Initializing Build-Phase Admin App");
        return admin.initializeApp({ projectId: projectId || "whale-wire" });
    }

    throw new Error("Missing critical Admin credentials in environment");
}

// Accessors that reveal the true error
export const getAdminDb = () => {
    try {
        const app = initializeAdmin();
        return app.firestore();
    } catch (e: any) {
        // We throw the actual error so the webhook can catch and report it
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
