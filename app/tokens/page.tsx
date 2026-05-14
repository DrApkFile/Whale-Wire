import { Sidebar } from "@/components/Sidebar";
import { birdeye, BirdeyeToken } from "@/lib/birdeye";
import Link from "next/link";
import { Search, Coins, ArrowUpRight, SearchSlash } from "lucide-react";

export default async function TokensPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams;
    let tokens: BirdeyeToken[] = [];
    let isSearch = !!q;

    try {
        if (isSearch) {
            // Global On-chain Search
            tokens = await birdeye.searchToken(q as string);
        } else {
            // Default Explorer (Trending)
            tokens = await birdeye.getTrendingTokens(24);
        }
    } catch (e) {
        console.error("Token Explorer sync failed:", e);
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <Sidebar />
            <main className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                                {isSearch ? "Market Search" : "Market Explorer"}
                            </div>
                            <h1 className="text-4xl font-bold uppercase tracking-tight">
                                {isSearch ? `Results for "${q}"` : "Solana Ecosystem"}
                            </h1>
                            <p className="text-slate-500 mt-2">
                                {isSearch ? "On-chain matches found across the Birdeye Protocol index." : "Live directory of trending protocols on Solana."}
                            </p>
                        </div>
                    </div>

                    {tokens.length === 0 ? (
                        <div className="py-24 text-center border border-white/5 rounded-[2rem] bg-white/[0.02]">
                            <SearchSlash size={48} className="mx-auto mb-4 text-slate-700" />
                            <h3 className="text-xl font-bold text-slate-400 mb-2">No Matches Found</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">The asset you are looking for might be too new or indexed under a different symbol.</p>
                            <Link href="/tokens" className="inline-block mt-8 text-blue-400 font-bold hover:underline">Return to Explorer</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {tokens.map(token => (
                                <Link href={`/token/${token.address}`} key={token.address} className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-blue-500/20 transition-all group flex flex-col">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center overflow-hidden border border-white/5">
                                            {token.logoURI ? <img src={token.logoURI} /> : <Coins size={20} className="text-blue-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors uppercase truncate">{token.name}</div>
                                            <div className="text-[10px] text-slate-500 font-bold tracking-widest">${token.symbol}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-600 uppercase font-bold tracking-tighter">Price</span>
                                            <span className="font-mono text-slate-300 font-bold">${token.price ? token.price.toFixed(token.price < 0.01 ? 6 : 4) : "0.00"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-600 uppercase font-bold tracking-tighter">Volume (24h)</span>
                                            <span className="font-mono text-blue-400 font-bold">${(token.v24hUSD / 1000000).toFixed(1)}M</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                                        View Data
                                        <ArrowUpRight size={14} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
