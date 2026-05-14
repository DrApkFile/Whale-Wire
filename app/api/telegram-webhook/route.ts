import { getAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

/**
 * TELEGRAM WEBHOOK HANDLER
 * This route listens for messages from Telegram and syncs Chat IDs to WhaleWire users.
 */
export async function POST(req: Request) {
    let body: any = null;
    try {
        body = await req.json();
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
                    const missing = [];
                    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missing.push("PROJECT_ID");
                    if (!process.env.FIREBASE_CLIENT_EMAIL) missing.push("CLIENT_EMAIL");
                    if (!process.env.FIREBASE_PRIVATE_KEY) missing.push("PRIVATE_KEY");

                    throw new Error(`Admin SDK failed. Missing: ${missing.join(", ") || "Unknown Internal Error"}`);
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

        // Report the error to the user for diagnostic purposes
        try {
            const chatId = body?.message?.chat?.id?.toString();
            if (chatId) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `❌ *TERMINAL ERROR*\n\nReason: \`${e.message}\`\n\n_Please check your Vercel Environment Variables matches your .env.local perfectly._`,
                        parse_mode: 'Markdown'
                    })
                });
            }
        } catch (repErr) { }

        return NextResponse.json({ ok: false, error: e.message }, { status: 200 });
    }
}
