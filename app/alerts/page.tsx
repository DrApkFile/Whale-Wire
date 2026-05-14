import { Sidebar } from "@/components/Sidebar";
import { birdeye } from "@/lib/birdeye";
import AlertFeed from "./AlertFeed";

export default async function AlertsPage() {
    let trendingTokens = [];
    let initialAlerts = [];

    try {
        // Production logic: Find tokens with high activity velocity
        trendingTokens = await birdeye.getTrendingTokens(10);

        // Map trending tokens to some simulated alert data based on real volume
        initialAlerts = trendingTokens.filter(t => (t.v24hUSD || 0) > 1000000).map(token => ({
            id: token.address,
            type: "VOLUME_SPIKE",
            title: `${token.symbol} Velocity Spike`,
            description: `Unusual volume acceleration detected on ${token.name}. 24h Volume now at $${(token.v24hUSD / 1000000).toFixed(1)}M.`,
            severity: (token.v24hUSD || 0) > 10000000 ? "high" : "medium",
            token: token.symbol,
            address: token.address,
            timestamp: new Date().toISOString()
        }));
    } catch (e) {
        console.error("Alerts sync failed:", e);
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <AlertFeed initialAlerts={initialAlerts} />
            </main>
        </div>
    );
}
