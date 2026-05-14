import { getAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

/**
 * TELEGRAM WEBHOOK HANDLER - PRODUCTION GRADE
 * This route listens for messages from Telegram and syncs Chat IDs to WhaleWire users.
 */
export async function POST(req: Request) {
    let body: any = null;
    try {
        body = await req.json();

        if (!body.message) {
            return NextResponse.json({ ok: true });
        }

        const chatId = body.message.chat.id.toString();
        const text = body.message.text || "";

        // Handle the /start [USER_UID] command from Dashboard deep-links
        if (text.includes("/start")) {
            const parts = text.split(" ");
            const userUid = parts.length > 1 ? parts[1] : null;

            if (userUid) {
                // 1. Initial greeting
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "📡 *CONNECTION ESTABLISHED*\n\nInitializing secure link to WhaleWire Terminal...",
                        parse_mode: 'Markdown'
                    })
                });

                // 2. Connect and Update
                const adminDb = getAdminDb();
                if (!adminDb) throw new Error("Database offline");

                await adminDb.collection("users").doc(userUid).set({
                    telegramChatId: chatId,
                    telegramConnectedAt: new Date().toISOString(),
                    lastBotActivity: new Date().toISOString()
                }, { merge: true });

                // 3. Final Success confirmation
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "✅ *WHALEWIRE SYNCED*\n\nYour account is now linked to the global alpha stream. You will receive high-conviction alerts based on your dashboard settings.\n\n_Good luck, Operative._",
                        parse_mode: 'Markdown'
                    })
                });
            } else {
                // Friendly help for users who find the bot manually
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ *EXTERNAL ACCESS DETECTED*\n\nTo link your account, please log in to whale-wire.vercel.app and click the **Connect Telegram** button in your Dashboard.",
                        parse_mode: 'Markdown'
                    })
                });
            }
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error("[WEBHOOK] Critical failure:", e.message);
        // Silently handle errors in production to keep bot response clean
        return NextResponse.json({ ok: true });
    }
}
