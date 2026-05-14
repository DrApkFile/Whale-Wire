"use client";

import {
    TrendingUp,
    Activity,
    ShieldAlert,
    Layers,
    Clock,
    Zap,
    Info,
    DollarSign,
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
    { time: "00:00", price: 100 },
    { time: "04:00", price: 120 },
    { time: "08:00", price: 110 },
    { time: "12:00", price: 140 },
    { time: "16:00", price: 130 },
    { time: "20:00", price: 160 },
    { time: "24:00", price: 155 },
];

interface TokenContentProps {
    id: string;
    token: any;
    security: any;
    score: number;
    label: string;
    error: string | null;
}

export default function TokenContent({ id, token, security, score, label, error }: TokenContentProps) {
    if (error) {
        return (
            <div className="p-8 h-full flex items-center justify-center">
                <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center max-w-md">
                    <AlertCircle size={48} className="mx-auto mb-4 text-rose-500" />
                    <h2 className="text-xl font-bold text-white mb-2">Protocol Error</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 rounded-xl bg-slate-900 border border-white/5 text-sm font-bold text-white hover:bg-white/5"
                    >
                        Retry Intel Sync
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
                <span>Tokens</span>
                <span>/</span>
                <span className="text-blue-400 font-mono">{id}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                {/* Token Main Header */}
                <div className="lg:col-span-3 p-8 rounded-3xl bg-gradient-to-br from-blue-900/10 to-slate-900 border border-white/10 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-2xl shadow-[0_0_25px_rgba(37,99,235,0.3)] overflow-hidden">
                                {token?.logoURI ? <img src={token.logoURI} className="w-full h-full object-cover" /> : token?.symbol?.[0]}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">{token?.name || "Unknown Asset"}</h1>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/5 font-mono text-sm text-slate-400">${token?.symbol || "N/A"}</span>
                                    <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
                                        <TrendingUp size={16} />
                                        LIVE READY
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Live Price</div>
                            <div className="text-4xl font-bold tracking-tighter text-white">${token?.price?.toFixed(6) || "0.00"}</div>
                        </div>
                    </div>

                    {/* Snapshot Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        {[
                            { label: "Market Cap", val: `$${((token?.mc || 0) / 1000000).toFixed(1)}M`, icon: Layers },
                            { label: "24h Volume", val: `$${((token?.v24hUSD || 0) / 1000000).toFixed(1)}M`, icon: Activity },
                            { label: "Stability", val: security?.isTop10Holders ? "Balanced" : "Volatile", icon: Info },
                            { label: "Liquidity", val: "LIVE", icon: DollarSign },
                        ].map((s, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold uppercase text-[9px]">
                                    <s.icon size={12} />
                                    {s.label}
                                </div>
                                <div className="text-lg font-bold text-slate-200">{s.val}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Score Card */}
                <div className="lg:col-span-1 p-8 rounded-3xl bg-blue-600 h-full flex flex-col justify-center items-center text-center shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                    <div className="text-[10px] text-blue-200 uppercase font-bold mb-4 tracking-widest">WhaleWire Score</div>
                    <div className="relative mb-6">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                            <circle
                                cx="64" cy="64" r="56"
                                stroke="white"
                                strokeWidth="12"
                                strokeDasharray={351}
                                strokeDashoffset={351 - (score / 100) * 351}
                                strokeLinecap="round"
                                fill="none"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white">
                            {score}
                        </div>
                    </div>
                    <div className="text-xl font-bold text-white mb-2 tracking-tight">{label}</div>
                    <p className="text-blue-100/70 text-[10px] uppercase font-bold tracking-widest">Real-time Analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Momentum Analytics */}
                    <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">Protocol Performance</h3>
                            <div className="px-4 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                                MARKET VIEW
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Columns: Security & Risk */}
                <div className="space-y-8">
                    {/* Security Audit */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.05)]">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Zap size={20} className="text-blue-400" />
                            Market Summary
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs py-3 border-b border-white/5">
                                <span className="text-slate-500">Contract Immutable</span>
                                <span className={`font-bold ${!security ? "text-slate-500" : security.isMutable ? "text-rose-400" : "text-emerald-400"}`}>
                                    {!security ? "PRO INTEL" : security.isMutable ? "NO" : "YES"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-3 border-b border-white/5">
                                <span className="text-slate-500">Concentrated Supply</span>
                                <span className={`font-bold ${!security ? "text-slate-500" : security.isTop10Holders ? "text-rose-400" : "text-emerald-400"}`}>
                                    {!security ? "PRO INTEL" : security.isTop10Holders ? "YES (RISK)" : "NO (SAFE)"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-3">
                                <span className="text-slate-500">Creation Date</span>
                                <span className="font-bold text-white">
                                    {token?.creationTime ? new Date(token.creationTime * 1000).toLocaleDateString() : "RECENT"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Risk Management */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/10">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-200">
                            <ShieldAlert size={20} className="text-rose-500" />
                            Market Advisory
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-950 border border-white/5">
                                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                    "Live analysis indicates {token?.symbol} is currently in a high-velocity phase. Use tight stop-losses if following whale entries detected in the last 60 minutes."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}