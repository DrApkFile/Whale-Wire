import { sendWhaleAlert, formatTokenAlert } from "@/lib/telegram";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { chatId } = body;

        if (!chatId) {
            return NextResponse.json({ error: "No Chat ID provided" }, { status: 400 });
        }

        const testToken = {
            name: "Solana",
            symbol: "SOL",
            address: "So11111111111111111111111111111111111111112",
            price: 145.20
        };

        const message = formatTokenAlert(testToken);
        const result = await sendWhaleAlert(message, chatId);

        if (!result) {
            return NextResponse.json({ error: "Failed to send alert. Check logs." }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
