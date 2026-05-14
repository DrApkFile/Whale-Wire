"use client";

import {
    Bell,
    Zap,
    Activity,
    TrendingUp,
    Flame,
    Search,
    Filter,
    ChevronRight,
    Target,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

interface AlertFeedProps {
    initialAlerts: any[];
}

export default function AlertFeed({ initialAlerts }: AlertFeedProps) {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Production Feed ACTIVE
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">Protocol Signals</h1>
                    <p className="text-slate-500 text-sm">On-chain intelligence streamed directly from Birdeye Protocol nodes.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        Sync Real-time
                    </button>
                </div>
            </div>

            {!initialAlerts || initialAlerts.length === 0 ? (
                <div className="py-20 text-center border border-white/5 rounded-3xl bg-white/[0.02]">
                    <Activity size={48} className="mx-auto mb-4 text-slate-700 animate-pulse" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">No High Intensity Signals</h3>
                    <p className="text-slate-500 text-sm">Market is currently within standard volatility range.</p>
                </div>
            ) : (
                <div className="space-y-6 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[27px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-blue-600/50 via-slate-800 to-transparent" />

                    {/* Alert Items */}
                    {initialAlerts.map((alert, i) => (
                        <div key={alert.id} className="relative pl-14 group">
                            {/* Timeline Dot */}
                            <div className={`absolute left-0 top-1 w-14 flex justify-center`}>
                                <div className={`w-3.5 h-3.5 rounded-full border-4 border-[#020617] group-hover:scale-125 transition-transform z-10 ${alert.severity === "high" ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"}`} />
                            </div>

                            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:bg-slate-900 transition-all hover:border-white/20 cursor-pointer shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${alert.type === "COORDINATED_BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>
                                            {alert.type === "COORDINATED_BUY" ? <Target size={18} /> : <TrendingUp size={18} />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{alert.type.replace("_", " ")}</div>
                                            <div className="text-xl font-bold group-hover:text-blue-400 transition-colors uppercase">${alert.token} • {alert.title}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 mb-1">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                                        <div className="text-[10px] font-mono text-emerald-500 font-bold tracking-widest">LIVE DATA</div>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                                    "{alert.description}"
                                </p>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(j => (
                                                <div key={j} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-400">
                                                    W
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs">
                                            <div className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Analysis Engine</div>
                                            <div className="font-bold text-emerald-400 uppercase tracking-tighter">Velocity Triggered</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Link href={`/token/${alert.address}`} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all">
                                            In-Depth Analysis
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination/Load More */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 rounded-xl border border-white/10 text-slate-500 hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
                >
                    Refresh Intelligence Feed
                </button>
            </div>
        </div>
    );
}
