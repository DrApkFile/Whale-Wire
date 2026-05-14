import { birdeye } from "@/lib/birdeye";
import { sendWhaleAlert, formatTokenAlert } from "@/lib/telegram";
import { getAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

/**
 * PRODUCTION SCANNER DIAGNOSTIC
 * This route forces a scan and provides detailed feedback on why alerts are or aren't firing.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const testUserId = searchParams.get("userId");

        console.log("[DIAGNOSTIC] Starting Pulse Check...");

        // 1. Check Database
        const adminDb = getAdminDb();
        if (!adminDb) return NextResponse.json({ error: "Database Connection Failed" }, { status: 500 });

        // 2. Fetch Market Data (Quietly for logs)
        const tokens = await birdeye.getTrendingTokens(20).catch(() => []);
        const highVolume = tokens.filter(t => t.v24hUSD > 1000000);

        // 3. Find Subscribers
        const subscribersSnapshot = await adminDb.collection("users")
            .where("scannerActive", "==", true)
            .get();

        const subCount = subscribersSnapshot.size;

        // 4. Force a Test Message (Bypassing market filters)
        let testResult = "N/A";
        if (testUserId) {
            const userDoc = await adminDb.collection("users").doc(testUserId).get();
            const userData = userDoc.data();

            if (userData?.telegramChatId) {
                const testMsg = "📡 *WHALEWIRE PULSE CHECK*\n\nYour terminal is online and the connection is healthy. Alpha notifications are active.";
                const sent = await sendWhaleAlert(testMsg, userData.telegramChatId);
                testResult = sent ? "Message Sent" : "Message Failed (Check Bot Token)";
            } else {
                testResult = "User profile found but Telegram is not linked in DB";
            }
        } else {
            testResult = "No userId provided in request";
        }

        return NextResponse.json({
            status: "Scanner Online",
            tokensFound: tokens.length,
            highVolumeCount: highVolume.length,
            activeSubscribers: subCount,
            testAction: testResult
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
