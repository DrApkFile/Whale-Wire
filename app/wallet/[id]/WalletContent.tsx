"use client";

import {
    ArrowUpRight,
    ArrowDownRight,
    Copy,
    ExternalLink,
    ShieldCheck,
    TrendingUp,
    Calendar,
    Layers,
    Zap,
    Award,
    Activity,
    AlertCircle
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const chartData = [
    { day: "Mon", roi: 10 },
    { day: "Tue", roi: 25 },
    { day: "Wed", roi: 15 },
    { day: "Thu", roi: 45 },
    { day: "Fri", roi: 38 },
    { day: "Sat", roi: 65 },
    { day: "Sun", roi: 84 },
];

interface WalletContentProps {
    id: string;
    activity: any[];
    score: number;
    error: string | null;
}

export default function WalletContent({ id, activity, score, error }: WalletContentProps) {
    if (error) {
        return (
            <div className="p-8 h-full flex items-center justify-center">
                <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center max-w-md">
                    <AlertCircle size={48} className="mx-auto mb-4 text-rose-500" />
                    <h2 className="text-xl font-bold text-white mb-2">Sync Failure</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 rounded-xl bg-slate-900 border border-white/5 text-sm font-bold text-white hover:bg-white/5"
                    >
                        Retry Address Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Breadcrumbs */}
            <div className="text-xs text-slate-500 mb-8 flex items-center gap-2">
                <span>Dashboard</span>
                <span>/</span>
                <span>Wallets</span>
                <span>/</span>
                <span className="text-blue-400 font-mono">{id}</span>
            </div>

            {/* Wallet Header Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/10 to-slate-900 border border-white/10 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-3xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                            {id.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight">Whale Entity</h1>
                                <div className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                                    <ShieldCheck size={12} />
                                    ON-CHAIN VERIFIED
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="font-mono text-slate-400 text-sm flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5">
                                    {id.slice(0, 8)}...{id.slice(-8)}
                                    <Copy size={14} className="cursor-pointer hover:text-white transition-colors" />
                                </div>
                                <button className="p-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-white transition-colors">
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">WhaleWire Score</div>
                            <div className="text-2xl font-bold text-blue-400">{score}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                            <div className="text-2xl font-bold text-emerald-400">ACTIVE</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Performance */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Recent Intensity", val: activity.length > 0 ? "High" : "Low", icon: TrendingUp, color: "text-emerald-400" },
                            { label: "Alpha Confidence", val: score > 70 ? "Legendary" : "Standard", icon: Award, color: "text-purple-400" },
                            { label: "Data Integrity", val: "100%", icon: Calendar, color: "text-blue-400" },
                        ].map((m, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg bg-white/5 ${m.color}`}>
                                        <m.icon size={18} />
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium uppercase">{m.label}</span>
                                </div>
                                <div className="text-2xl font-bold">{m.val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Performance Chart */}
                    <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Activity size={20} className="text-blue-400" />
                                Momentum Index
                            </h3>
                        </div>

                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                                    <Area type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRoi)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile Info & Recent Activity */}
                <div className="space-y-8">
                    {/* Profile Details */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
                        <h3 className="text-lg font-bold mb-6">Wallet Intelligence</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-sm text-slate-500">Live Trades (Sync)</span>
                                <span className="text-sm font-bold text-blue-400">{activity.length} Trades</span>
                            </div>
                            <div className="pt-2">
                                <div className="text-xs text-slate-500 mb-3 uppercase font-bold tracking-widest">Calculated Tags</div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 rounded bg-blue-600/10 text-blue-400 text-[10px] font-bold border border-blue-600/20">LIVE_ENTRIES</span>
                                    <span className="px-2 py-1 rounded bg-blue-600/10 text-blue-400 text-[10px] font-bold border border-blue-600/20">SMART_MONEY</span>
                                    {score > 80 && <span className="px-2 py-1 rounded bg-emerald-600/10 text-emerald-400 text-[10px] font-bold border border-emerald-600/20">LEGENDARY</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Entries */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Zap size={18} className="text-blue-400" />
                            Activity Stream
                        </h3>
                        <div className="space-y-4 text-xs">
                            {activity.slice(0, 8).map((tx, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 uppercase">
                                            {tx.to.symbol?.[0] || tx.from.symbol?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold group-hover:text-blue-400 transition-colors uppercase">{tx.to.symbol || tx.from.symbol || "SOL"}</div>
                                            <div className="text-slate-500">{(tx.from.uiAmount || 0).toFixed(2)} {tx.from.symbol}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-400">ENTRY</div>
                                        <div className="text-slate-500 font-mono text-[9px]">{new Date(tx.blockUnixTime * 1000).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            ))}
                            {activity.length === 0 && (
                                <div className="py-8 text-center text-slate-600">
                                    No recent transactions found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
