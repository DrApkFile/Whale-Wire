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

        // 2. Fetch Market Data
        const tokens = await birdeye.getTrendingTokens(20);
        const highVolume = tokens.filter(t => t.v24hUSD > 1000000);

        // 3. Find Subscribers
        const subscribersSnapshot = await adminDb.collection("users")
            .where("scannerActive", "==", true)
            .get();

        const subCount = subscribersSnapshot.size;

        // 4. If a test ID is provided, force an alert to THAT user only
        let testResult = "N/A";
        if (testUserId && highVolume.length > 0) {
            const userDoc = await adminDb.collection("users").doc(testUserId).get();
            const userData = userDoc.data();

            if (userData?.telegramChatId) {
                const testMsg = "📡 *PULSE CHECK SUCCESSFUL*\n\nYour WhaleWire scanner is operational and talking to the database. You are officially in the Alpha Stream.";
                const sent = await sendWhaleAlert(testMsg, userData.telegramChatId);
                testResult = sent ? "Message Sent" : "Message Failed (Check Bot Token)";
            } else {
                testResult = "User found but no Telegram linked";
            }
        }

        return NextResponse.json({
            status: "Scanner Online",
            tokensFound: tokens.length,
            highVolumeCount: highVolume.length,
            activeSubscribers: subCount,
            testAction: testResult,
            sampleToken: highVolume[0]?.symbol || "None above $1M volume"
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
