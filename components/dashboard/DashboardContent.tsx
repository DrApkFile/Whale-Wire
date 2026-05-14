"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    Wallet,
    Bell,
    Search,
    Filter,
    LayoutDashboard,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Mock Data
const MOCK_TRENDING_TOKENS = [
    { id: 1, name: "WhaleCoin", symbol: "WHALE", price: 1.24, change: 12.5, confidence: 94, buys: 42 },
    { id: 2, name: "AlphaNode", symbol: "ALPHA", price: 0.85, change: -2.1, confidence: 88, buys: 28 },
    { id: 3, name: "SmartFlow", symbol: "FLOW", price: 2.12, change: 45.8, confidence: 91, buys: 35 },
    { id: 4, name: "NeonTrade", symbol: "NEON", price: 0.05, change: 8.2, confidence: 76, buys: 12 },
];

const MOCK_ALERTS = [
    { id: 1, type: "Coordinated Buy", token: "WHALE", wallets: 5, time: "2m ago", size: "$52,000" },
    { id: 2, type: "Smart Money Entry", token: "FLOW", wallets: 1, time: "15m ago", size: "$120,400" },
    { id: 3, type: "Volume Spike", token: "ALPHA", wallets: 8, time: "45m ago", size: "$2.4M" },
];

export default function DashboardContent() {
    const [search, setSearch] = useState("");

    return (
        <div className="flex min-h-screen bg-background-deep text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-background-deep/50 flex flex-col fixed h-full z-40">
                <div className="p-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center font-bold text-white">W</div>
                    <span className="text-xl font-bold tracking-tight neon-glow">WhaleWire</span>
                </div>

                <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
                    <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
                    <NavItem icon={<Activity className="w-5 h-5" />} label="Market Feed" />
                    <NavItem icon={<Wallet className="w-5 h-5" />} label="Smart Wallets" />
                    <NavItem icon={<Bell className="w-5 h-5" />} label="Alerts" count={3} />
                    <NavItem icon={<Target className="w-5 h-5" />} label="Watchlist" />
                </nav>

                <div className="p-4 mt-auto">
                    <div className="p-4 rounded-xl glass border border-white/10">
                        <p className="text-xs font-bold text-brand-primary mb-2">PRO PLAN</p>
                        <p className="text-sm font-medium mb-4 text-muted-foreground">Access all smart money signals and AI alerts.</p>
                        <button className="w-full py-2 bg-brand-primary rounded-lg text-sm font-bold hover:bg-brand-primary/80 transition-all">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 gap-8">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tokens, wallets, or addresses..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-brand-primary transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
                            <span className="text-sm font-bold">SOL: $142.42</span>
                        </div>
                        <button className="p-2 glass rounded-xl border border-white/10 relative">
                            <Bell className="w-5 h-5" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-background-deep" />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent p-[1px]">
                            <div className="w-full h-full rounded-[11px] bg-background-deep flex items-center justify-center font-bold text-xs">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Total Vol (24h)" value="$1.2B" change={+12.4} icon={<TrendingUp className="text-brand-neon" />} />
                    <StatCard label="Smart Money Flow" value="+$42.5M" change={+8.1} icon={<Wallet className="text-brand-primary" />} />
                    <StatCard label="Active Alerts" value="242" change={-2.4} icon={<Bell className="text-brand-accent" />} />
                    <StatCard label="Tokens Tracked" value="4,812" change={+14.5} icon={<BarChart3 className="text-brand-secondary" />} />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Trending Tokens */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="p-6 rounded-2xl glass border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                                    Trending Smart Money Buys
                                </h2>
                                <button className="text-sm font-medium text-brand-primary hover:underline">View All</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-white/10">
                                            <th className="pb-4 px-2">Token</th>
                                            <th className="pb-4 px-2">Price</th>
                                            <th className="pb-4 px-2">24h Change</th>
                                            <th className="pb-4 px-2">Conf. Score</th>
                                            <th className="pb-4 px-2 text-right">Buys</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {MOCK_TRENDING_TOKENS.map((token) => (
                                            <tr key={token.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white/10" />
                                                        <div>
                                                            <p className="font-bold">{token.symbol}</p>
                                                            <p className="text-xs text-muted-foreground">{token.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 font-mono">${token.price}</td>
                                                <td className="py-4 px-2">
                                                    <span className={token.change > 0 ? "text-brand-neon" : "text-red-500"}>
                                                        {token.change > 0 ? "+" : ""}{token.change}%
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full max-w-[80px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-brand-primary" style={{ width: `${token.confidence}%` }} />
                                                        </div>
                                                        <span className="text-xs font-bold">{token.confidence}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-right font-mono text-brand-primary font-bold">
                                                    {token.buys}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Confidence Leaderboard Mock */}
                        <div className="p-6 rounded-2xl glass border border-white/5 h-64 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-brand-secondary" />
                            </div>
                            <h3 className="font-bold mb-2">Confidence Momentum Chart</h3>
                            <p className="text-sm text-muted-foreground max-w-xs">AI-driven confidence scores showing where the smart money is concentrating right now.</p>
                        </div>
                    </div>

                    {/* Sidebar Grid */}
                    <div className="flex flex-col gap-8">
                        {/* Recent Alerts */}
                        <div className="p-6 rounded-2xl glass border border-white/5">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-brand-accent" />
                                Live Smart Alerts
                            </h2>
                            <div className="flex flex-col gap-4">
                                {MOCK_ALERTS.map((alert) => (
                                    <div key={alert.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-accent/50 transition-all cursor-pointer">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-brand-accent uppercase tracking-tighter">{alert.type}</span>
                                            <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                                        </div>
                                        <p className="font-bold mb-1">{alert.wallets} smart wallets entering <span className="text-brand-primary">{alert.token}</span></p>
                                        <p className="text-xs text-muted-foreground">Estimated size: <span className="text-white">{alert.size}</span></p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
                                View All Signals
                            </button>
                        </div>

                        {/* Top Wallets */}
                        <div className="p-6 rounded-2xl glass border border-white/5">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-brand-secondary" />
                                Top Wallets (24h)
                            </h2>
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-primary opacity-50" />
                                        <div className="flex-1">
                                            <p className="text-xs font-mono">0x72...{i}f2e</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-brand-neon font-bold">82% Win</span>
                                                <span className="text-[10px] text-muted-foreground">ROI 4.2x</span>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, count }: { icon: React.ReactNode, label: string, active?: boolean, count?: number }) {
    return (
        <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group
      ${active ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}
    `}>
            {icon}
            <span className="font-semibold text-sm">{label}</span>
            {count && (
                <span className="ml-auto bg-brand-accent text-[10px] px-1.5 py-0.5 rounded-md font-bold text-white">
                    {count}
                </span>
            )}
        </div>
    );
}

function StatCard({ label, value, change, icon }: { label: string, value: string, change: number, icon: React.ReactNode }) {
    return (
        <div className="p-6 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${change > 0 ? "text-brand-neon" : "text-red-500"}`}>
                    {change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(change)}%
                </span>
            </div>
            <p className="text-muted-foreground text-xs font-bold mb-1 h-4">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
    );
}
