import * as admin from "firebase-admin";

/**
 * RESILIENT FIREBASE ADMIN INITIALIZER
 * Diagnostic version: Reports the source of the key to the error handler.
 */

function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    let source = "NONE";
    let privateKey = process.env.FIREBASE_PRIVATE_KEY_B64;

    if (privateKey) {
        try {
            privateKey = Buffer.from(privateKey.trim(), 'base64').toString('utf8');
            source = "BASE64";
        } catch (e) {
            console.error("Base64 decoding failed");
        }
    }

    if (!privateKey || privateKey === "") {
        privateKey = process.env.FIREBASE_PRIVATE_KEY;
        source = "RAW";
    }

    // PEM normalization
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
            // WE EMBED THE SOURCE IN THE ERROR MESSAGE
            throw new Error(`[Source:${source}] Credential Error: ${err.message}`);
        }
    }

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
