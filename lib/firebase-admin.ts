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

    // PEM normalization
    if (privateKey) {
        privateKey = privateKey.trim().replace(/^['"]|['"]$/g, '');
        privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r/g, '');
    }

    try {
        if (projectId && clientEmail && privateKey) {
            return admin.initializeApp({
                credential: admin.credential.cert({
                    project_id: projectId,
                    client_email: clientEmail,
                    private_key: privateKey,
                } as any),
            });
        }

        // Build-time / Missing Config placeholder 
        // We use the actual projectId if available to prevent misrouting
        return admin.initializeApp({
            projectId: projectId || "whale-wire",
        });
    } catch (err: any) {
        console.error("Admin Init Error:", err.message);
        if (admin.apps.length > 0) return admin.app();
        throw err;
    }
}

export const getAdminDb = () => {
    try {
        const app = initializeAdmin();
        return app.firestore();
    } catch (e) {
        return null;
    }
};

export const getAdminAuth = () => {
    try {
        const app = initializeAdmin();
        return app.auth();
    } catch (e) {
        return null;
    }
};
