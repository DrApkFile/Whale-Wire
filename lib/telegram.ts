const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Sends a high-priority alert to a specific Telegram chat ID.
 */
export async function sendWhaleAlert(message: string, chatId: string) {
    if (!TELEGRAM_BOT_TOKEN || !chatId) {
        console.warn("[TELEGRAM] Missing Bot Token or Chat ID. Alert suppressed.");
        return null;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
                disable_web_page_preview: false,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`[TELEGRAM] API Error (Chat: ${chatId}): ${error}`);
            return null;
        }

        return await response.json();
    } catch (e) {
        console.error("[TELEGRAM] Network failure:", e);
        return null;
    }
}

/**
 * Formats a token alert for professional telegram display.
 */
export function formatTokenAlert(token: { name: string, symbol: string, address: string, price: number }) {
    return `
🚨 <b>WHALEWIRE ALPHA ALERT</b> 🚨
    
<b>Asset:</b> ${token.name} ($${token.symbol})
<b>Current Price:</b> $${token.price.toFixed(6)}
<b>Action:</b> Whale Entry Detected 🐋
    
<a href="https://whale-wire.vercel.app/token/${token.address}">View Market Analytics →</a>
    
<i>#Solana #WhaleWire #SaaS</i>
    `.trim();
}
