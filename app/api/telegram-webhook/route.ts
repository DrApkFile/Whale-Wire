import { adminDb } from "@/lib/firebase-admin";
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

                    // Update user profile in Firestore automatically
                    await adminDb.collection("users").doc(userUid).update({
                        telegramChatId: chatId,
                        telegramConnectedAt: new Date().toISOString()
                    });

                    // Optional: Send a confirmation message back via the bot
                    // (We can use our existing sendWhaleAlert logic here)
                }
            }
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("[WEBHOOK] Sync failure:", e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
