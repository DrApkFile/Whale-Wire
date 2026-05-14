import { Sidebar } from "@/components/Sidebar";
import { birdeye } from "@/lib/birdeye";
import { calculateWalletScore } from "@/lib/scoring";
import WalletContent from "./WalletContent";

export default async function WalletPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let activity = [];
    let error = null;

    try {
        activity = await birdeye.getWalletActivity(id);
    } catch (e) {
        console.error("Failed to fetch wallet activity:", e);
        error = "Could not sync wallet activity. The address may be invalid or inactive.";
    }

    const score = calculateWalletScore(activity);

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <WalletContent
                    id={id}
                    activity={activity}
                    score={score}
                    error={error}
                />
            </main>
        </div>
    );
}
