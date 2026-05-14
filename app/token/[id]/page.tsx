import { Sidebar } from "@/components/Sidebar";
import { birdeye } from "@/lib/birdeye";
import { calculateTokenScore, getConfidenceLabel } from "@/lib/scoring";
import TokenContent from "./TokenContent";

export default async function TokenPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let tokenData: any = null;
    let securityData: any = null;
    let error: string | null = null;

    try {
        // Multi-endpoint fetch to maximize data recovery on restricted API keys
        const [overview, security, priceData] = await Promise.all([
            birdeye.getTokenOverview(id),
            birdeye.getTokenSecurity(id),
            birdeye.getTokenPrice(id)
        ]);

        tokenData = overview || {};
        securityData = security;

        // Fallback: If overview failed but price worked, inject price
        if (!tokenData.price && priceData?.value) {
            tokenData.price = priceData.value;
        }

        // Emergency fallback: If we still have no basic info, use search to find the name
        if (!tokenData.name) {
            const searchMatches = await birdeye.searchToken(id);
            if (searchMatches.length > 0) {
                const match = searchMatches[0];
                tokenData.name = match.name;
                tokenData.symbol = match.symbol;
                tokenData.logoURI = match.logoURI;
                if (!tokenData.price) tokenData.price = match.price;
            }
        }
    } catch (e) {
        console.error("Failed to fetch token data:", e);
        error = "Critical sync failure. The Birdeye infrastructure for this asset is temporarily unresponsive.";
    }

    if (!tokenData?.name && !error) {
        // One last check: If we have an address but no name, it's just a raw address view
        tokenData = {
            name: "Unknown Asset",
            symbol: id.slice(0, 4),
            price: 0,
            address: id
        };
    }

    const confidenceScore = tokenData ? calculateTokenScore(tokenData, securityData) : 0;
    const confidenceLabel = getConfidenceLabel(confidenceScore);

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <TokenContent
                    id={id}
                    token={tokenData}
                    security={securityData}
                    score={confidenceScore}
                    label={confidenceLabel}
                    error={error}
                />
            </main>
        </div>
    );
}
