import * as admin from "firebase-admin";

/**
 * RESILIENT FIREBASE ADMIN INITIALIZER
 * Provides lazy-loaded access to admin services to prevent build-time crashes.
 */

function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
        privateKey = privateKey.trim().replace(/^['"]|['"]$/g, '');
        // Handle physical line breaks, escaped breaks, and carriage returns
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

        // Build-time placeholder
        return admin.initializeApp({
            projectId: projectId || "build-placeholder",
        });
    } catch (err: any) {
        if (admin.apps.length > 0) return admin.app();

        // Ultimate fallback for strict collectors
        return admin.initializeApp({ projectId: "emergency-fallback" });
    }
}

// Use Dynamic Accessors (Getters) for maximum build safety
export const getAdminDb = () => {
    try {
        const app = initializeAdmin();
        return app.firestore();
    } catch (e) {
        console.error("Critical: AdminDB Access Failure");
        return null;
    }
};

export const getAdminAuth = () => {
    try {
        const app = initializeAdmin();
        return app.auth();
    } catch (e) {
        console.error("Critical: AdminAuth Access Failure");
        return null;
    }
};
