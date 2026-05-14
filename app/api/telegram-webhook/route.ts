import { getAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

/**
 * TELEGRAM WEBHOOK HANDLER
 * This route listens for messages from Telegram and syncs Chat IDs to WhaleWire users.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[WEBHOOK] Received Update:", JSON.stringify(body));

        if (!body.message) {
            return NextResponse.json({ ok: true, note: "No message object" });
        }

        const chatId = body.message.chat.id.toString();
        const text = body.message.text || "";

        // Handle the /start [USER_UID] command
        if (text.includes("/start")) {
            const parts = text.split(" ");
            const userUid = parts.length > 1 ? parts[1] : null;

            if (userUid) {
                console.log(`[SYNC] Command Detected: /start for User ${userUid} (Chat: ${chatId})`);

                // 1. GREET THE USER IMMEDIATELY (Confirmation of Bot Life)
                try {
                    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: "📡 *OPERATIVE IDENTIFIED*\n\nSyncing your secure terminal link now... One moment.",
                            parse_mode: 'Markdown'
                        })
                    });
                } catch (msgErr) {
                    console.error("[WEBHOOK] Failed to send greeting:", msgErr);
                }

                // 2. CONNECT TO FIRESTORE
                const adminDb = getAdminDb();
                if (!adminDb) {
                    throw new Error("Firestore Admin SDK failed to initialize - check Project ID and Private Key");
                }

                // 3. SECURE THE PROFILE
                await adminDb.collection("users").doc(userUid).update({
                    telegramChatId: chatId,
                    telegramConnectedAt: new Date().toISOString(),
                    lastBotActivity: new Date().toISOString()
                });

                console.log(`[SYNC] Successfully linked ${userUid} to ${chatId}`);

                // 4. FINAL SUCCESS MESSAGE
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "✅ *SYNC SUCCESSFUL*\n\nYour WhaleWire terminal is now broadcasting to this account. You are ready to hunt.",
                        parse_mode: 'Markdown'
                        // No reply_markup needed, just a clean confirmation
                    })
                });
            } else {
                // User just typed /start without a deep link code
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ *LINK REQUIRED*\n\nPlease click the 'Connect Telegram' button inside your WhaleWire Dashboard to link your account.",
                        parse_mode: 'Markdown'
                    })
                });
            }
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error("[WEBHOOK] CRITICAL FAILURE:", e.message);
        // We return 200 even on error to stop Telegram from retrying 500s indefinitely
        // while we debug, but we log the 500 locally.
        return NextResponse.json({ ok: false, error: e.message }, { status: 200 });
    }
}
