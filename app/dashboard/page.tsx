import { Sidebar } from "@/components/Sidebar";
import { birdeye, BirdeyeToken } from "@/lib/birdeye";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
    // Production Grade: Fetch real data server-side
    let trendingTokens: BirdeyeToken[] = [];
    let error = null;

    try {
        trendingTokens = await birdeye.getTrendingTokens(15);
    } catch (e) {
        console.error("Failed to fetch trending tokens:", e);
        error = "Failed to load live market data. Please check your API key.";
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <Sidebar />

            <main className="flex-1 flex flex-col">
                <DashboardContent initialTokens={trendingTokens} error={error} />
            </main>
        </div>
    );
}
