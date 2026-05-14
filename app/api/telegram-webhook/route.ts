import { getAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

/**
 * TELEGRAM WEBHOOK HANDLER
 * This route listens for messages from Telegram and syncs Chat IDs to WhaleWire users.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Telegram sends updates as 'message' objects
        if (body.message) {
            const chatId = body.message.chat.id.toString();
            const text = body.message.text || "";

            // Check if the message is a "Deep Link" start command: /start [USER_UID]
            if (text.startsWith("/start ")) {
                const userUid = text.split(" ")[1];

                if (userUid) {
                    console.log(`[SYNC] Connecting Telegram Chat ${chatId} to User ${userUid}`);

                    const adminDb = getAdminDb();
                    if (!adminDb) {
                        return NextResponse.json({ ok: true });
                    }

                    // Update user profile in Firestore automatically
                    await adminDb.collection("users").doc(userUid).update({
                        telegramChatId: chatId,
                        telegramConnectedAt: new Date().toISOString()
                    });

                    // Send a confirmation message back via the bot
                    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: "📡 *WHALEWIRE SYNC SUCCESSFUL*\n\nYour account is now linked. You will receive real-time alpha alerts directly in this chat.\n\n_Happy Hunting, Operative._",
                            parse_mode: 'Markdown'
                        })
                    });
                }
            }
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("[WEBHOOK] Sync failure:", e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
