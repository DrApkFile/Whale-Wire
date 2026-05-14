import { birdeye } from "@/lib/birdeye";
import { sendWhaleAlert, formatTokenAlert } from "@/lib/telegram";
import { getAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

// We still keep a global signal deduplicator in memory for efficiency
const signalCache = new Set<string>();

export async function POST() {
    try {
        console.log("[BROADCASTER] Scanning for global alpha...");

        // 1. Fetch live market stream
        const tokens = await birdeye.getTrendingTokens(20);

        if (!tokens || tokens.length === 0) {
            return NextResponse.json({ message: "No trending data" });
        }

        // 2. Identify new signals
        const validSignals = tokens.filter(t => t.v24hUSD > 1000000 && !signalCache.has(t.address));

        if (validSignals.length === 0) {
            return NextResponse.json({ message: "No new high-velocity signals" });
        }

        // 3. Query all subscribers with active scanners
        const adminDb = getAdminDb();
        if (!adminDb) {
            return NextResponse.json({ message: "Admin offline - Configuration missing" });
        }

        const subscribersSnapshot = await adminDb.collection("users")
            .where("scannerActive", "==", true)
            .get();

        const subscribers = subscribersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as any[];

        console.log(`[BROADCASTER] Sending ${validSignals.length} signals to ${subscribers.length} subscribers.`);

        // 4. Dispatch Alerts
        for (const signal of validSignals) {
            const message = formatTokenAlert(signal);

            // Broadcast to each subscriber's unique telegram
            const dispatchPromises = subscribers
                .filter(s => s.telegramChatId)
                .map(s => sendWhaleAlert(message, s.telegramChatId));

            await Promise.all(dispatchPromises);

            signalCache.add(signal.address);

            // Safety: Only broadcast 1 top signal per run to maintain SaaS platform health
            break;
        }

        return NextResponse.json({
            success: true,
            broadcastingTo: subscribers.length,
            signalsFound: validSignals.length
        });
    } catch (e) {
        console.error("[BROADCASTER] Delivery failure:", e);
        return NextResponse.json({ error: "Broadcast failed" }, { status: 500 });
    }
}
