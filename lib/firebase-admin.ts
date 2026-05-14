import * as admin from "firebase-admin";

/**
 * RESILIENT FIREBASE ADMIN INITIALIZER
 * Heavy-duty PEM Surgeon version.
 */

function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    let source = "NONE";
    let rawKey = process.env.FIREBASE_PRIVATE_KEY_B64;

    if (rawKey) {
        try {
            rawKey = Buffer.from(rawKey.trim(), 'base64').toString('utf8');
            source = "BASE64";
        } catch (e) {
            source = "BASE64_FAIL";
        }
    }

    if (!rawKey || rawKey === "") {
        rawKey = process.env.FIREBASE_PRIVATE_KEY;
        source = "RAW";
    }

    if (!rawKey) {
        throw new Error("No Private Key found in B64 or RAW environment variables");
    }

    // --- THE PEM SURGERY ---
    // 1. Standardize all escaped newlines (handles \n, \\n, and literal newlines)
    let sanitizedKey = rawKey
        .replace(/\\n/g, '\n')
        .replace(/\\\\n/g, '\n')
        .replace(/\r/g, '')
        .trim();

    // 2. Remove surrounding quotes that might have been baked into the B64 or RAW string
    sanitizedKey = sanitizedKey.replace(/^['"]|['"]$/g, '');

    // 3. Ensure PEM structure is perfect
    if (!sanitizedKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
        sanitizedKey = `-----BEGIN PRIVATE KEY-----\n${sanitizedKey}`;
    }
    if (!sanitizedKey.endsWith("-----END PRIVATE KEY-----")) {
        sanitizedKey = `${sanitizedKey}\n-----END PRIVATE KEY-----`;
    }

    if (projectId && clientEmail && sanitizedKey) {
        try {
            return admin.initializeApp({
                credential: admin.credential.cert({
                    project_id: projectId,
                    client_email: clientEmail,
                    private_key: sanitizedKey,
                } as any),
            });
        } catch (err: any) {
            throw new Error(`[Src:${source}] Credential Error: ${err.message}`);
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
