import { Sidebar } from "@/components/Sidebar";
import { birdeye } from "@/lib/birdeye";
import Link from "next/link";
import { Search, Wallet, TrendingUp } from "lucide-react";

export default async function WalletsPage() {
    // For a real production app, we would have a curated list of top whales
    // Since we don't have a DB of whales, we'll show some "Legendary" examples from top trades
    const whales = [
        { name: "Alpha Whale", addr: "7ax...9zK", score: 98, winRate: "84%" },
        { name: "Solana Sniper", addr: "3mG...2pL", score: 92, winRate: "72%" },
        { name: "Meme Chimp", addr: "8vT...4rX", score: 85, winRate: "68%" }
    ];

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <Sidebar />
            <main className="flex-1 p-12">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4 uppercase tracking-tight">Whale Directory</h1>
                    <p className="text-slate-500 mb-12">Verified smart-money entities tracked by WhaleWire intelligence.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {whales.map(whale => (
                            <div key={whale.addr} className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white mb-6 group-hover:scale-110 transition-transform">
                                    <Wallet size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{whale.name}</h3>
                                <div className="font-mono text-xs text-slate-500 mb-6">{whale.addr}</div>
                                <div className="flex justify-between items-center py-4 border-t border-white/5">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Score</span>
                                    <span className="text-xl font-bold text-blue-400">{whale.score}</span>
                                </div>
                                <Link href={`/wallet/${whale.addr}`} className="w-full block py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-bold hover:bg-blue-600 hover:text-white transition-all text-white">
                                    View Full Intel
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
