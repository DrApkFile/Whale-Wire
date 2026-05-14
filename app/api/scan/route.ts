import { birdeye } from "@/lib/birdeye";
import { sendWhaleAlert, formatTokenAlert } from "@/lib/telegram";
import { getAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

// Keep a session-based cache of sent alerts to prevent spam
const signalCache = new Set<string>();

export async function POST(req: Request) {
    try {
        console.log("[BROADCASTER] Scanning for global alpha...");

        // 1. Check for Vercel Cron header (allows us to differentiate automated runs)
        const isCron = req.headers.get('x-vercel-cron') === 'true';

        // 2. Fetch live market stream
        const tokens = await birdeye.getTrendingTokens(20).catch(() => []);

        // 3. Connect to Database and find active subscribers
        const adminDb = getAdminDb();
        if (!adminDb) return NextResponse.json({ error: "DB Offline" });

        const subscribersSnapshot = await adminDb.collection("users")
            .where("scannerActive", "==", true)
            .get();

        const subscribers = subscribersSnapshot.docs.map(doc => ({
            chatId: doc.data().telegramChatId
        })).filter(s => s.chatId);

        if (subscribers.length === 0) {
            return NextResponse.json({ message: "No active subscribers" });
        }

        // 4. Identify new $1M+ Signals
        const validSignals = tokens.filter(t => t.v24hUSD > 1000000 && !signalCache.has(t.address));

        if (validSignals.length > 0) {
            // DISPATCH ALERTS
            for (const signal of validSignals) {
                const message = formatTokenAlert(signal);
                const dispatch = subscribers.map(s => sendWhaleAlert(message, s.chatId));
                await Promise.all(dispatch);
                signalCache.add(signal.address);

                // Limit to 1 alert per run to prevent noise
                break;
            }
        } else if (isCron || true) {
            // HEARTBEAT: If no signals found, send a "Quiet Seas" status report
            const heartbeatMsg = "🌊 *WHALEWIRE: QUIET SEAS*\n\nMarket scan complete. No new $1M+ high-velocity signals detected in the last window. Scanner remains vigilant.";
            const heartbeats = subscribers.map(s => sendWhaleAlert(heartbeatMsg, s.chatId));
            await Promise.all(heartbeats);
        }

        return NextResponse.json({
            success: true,
            subscribers: subscribers.length,
            signalsFound: validSignals.length
        });
    } catch (e: any) {
        console.error("[BROADCASTER] Failure:", e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
