"use client";

import { BirdeyeToken } from "@/lib/birdeye";
import {
    Search,
    ArrowUpRight,
    Filter,
    Flame,
    TrendingUp,
    Activity,
    Zap,
    Bell,
    AlertCircle,
    User as UserIcon,
    Send
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
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const chartData = [
    { time: "00:00", value: 4200 },
    { time: "04:00", value: 3800 },
    { time: "08:00", value: 5200 },
    { time: "12:00", value: 4800 },
    { time: "16:00", value: 6500 },
    { time: "20:00", value: 5800 },
    { time: "24:00", value: 7200 },
];

interface DashboardContentProps {
    initialTokens: BirdeyeToken[];
    error: string | null;
}

export default function DashboardContent({ initialTokens, error }: DashboardContentProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [profile, setProfile] = useState<{ telegramChatId: string, scannerActive: boolean } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Guard Protection
    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    // 2. Load User Profile from Firestore
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as any;
                    setProfile({
                        telegramChatId: data.telegramChatId || "",
                        scannerActive: data.scannerActive || false
                    });
                }
            };
            fetchProfile();

            // Optional: Set up a real-time listener here if you want "Instant Connect" feedback
        }
    }, [user]);

    const updateProfile = async (updates: Partial<{ telegramChatId: string, scannerActive: boolean }>) => {
        if (!user) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, updates);
            setProfile(prev => prev ? { ...prev, ...updates } : null);
        } catch (err) {
            console.error("Update failed", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = search.trim();
        if (query.length >= 32 && query.length <= 44) router.push(`/token/${query}`);
        else if (query.length > 0) router.push(`/tokens?q=${encodeURIComponent(query)}`);
    };

    const filteredTokens = useMemo(() => {
        return initialTokens.filter(t =>
            t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.symbol?.toLowerCase().includes(search.toLowerCase())
        );
    }, [initialTokens, search]);

    if (loading || !user) return null;

    return (
        <>
            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-40">
                <div className="flex items-center gap-4 flex-1">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Terminal search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </form>
                </div>

                <div className="flex items-center gap-6">
                    {/* One-Click Telegram Connect */}
                    {!profile?.telegramChatId ? (
                        <a
                            href={`https://t.me/WhaleWireAlphaBot?start=${user.uid}`}
                            target="_blank"
                            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] text-xs font-bold hover:bg-[#229ED9] hover:text-white transition-all animate-pulse shadow-[0_0_20px_rgba(34,158,217,0.2)]"
                        >
                            <Send size={16} />
                            CONNECT TELEGRAM
                        </a>
                    ) : (
                        <div className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            BOT LINKED
                        </div>
                    )}

                    <button
                        onClick={() => updateProfile({ scannerActive: !profile?.scannerActive })}
                        disabled={!profile?.telegramChatId || isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl border transition-all text-sm font-bold ${profile?.scannerActive
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-blue-400 disabled:opacity-50"
                            }`}
                    >
                        <Activity size={16} className={profile?.scannerActive ? "animate-pulse" : ""} />
                        {profile?.scannerActive ? "SCANNER ACTIVE" : "START GLOBAL SCAN"}
                    </button>

                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 overflow-hidden">
                        {user.photoURL ? <img src={user.photoURL} alt="User" /> : <UserIcon size={20} />}
                    </div>
                </div>
            </header>

            <div className="flex-1 p-8 overflow-y-auto">
                {!profile?.telegramChatId && (
                    <div className="mb-8 p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">Alpha Stream Disconnected</h4>
                                <p className="text-xs opacity-80">Sync your account with the WhaleWire Bot to start receiving high-velocity notifications.</p>
                            </div>
                        </div>
                        <a
                            href={`https://t.me/WhaleWireAlphaBot?start=${user.uid}`}
                            target="_blank"
                            className="px-6 py-3 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all uppercase"
                        >
                            Connect in 5 Seconds
                        </a>
                    </div>
                )}

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Market Status", val: "Predictive", icon: Zap, color: "text-blue-400", change: "SECURED" },
                        { label: "Detected Signals", val: "14", icon: TrendingUp, color: "text-purple-400", change: "24H" },
                        { label: "Scan Velocity", val: profile?.scannerActive ? "30s" : "IDLE", icon: Activity, color: "text-emerald-400", change: "LIVE" },
                        { label: "Account Tier", val: "LIFETIME", icon: UserIcon, color: "text-blue-400", change: "VIP" },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all transition-transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <div className="text-[10px] font-bold text-white/50 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-2xl font-bold text-white tracking-tight">{stat.val}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold">Signal Concentration</h3>
                                <p className="text-xs text-slate-500 tracking-wide uppercase">Whale entry momentum index</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/10 flex flex-col">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Bell size={20} className="text-blue-400" />
                            Global Alpha
                        </h3>
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {initialTokens.slice(0, 6).map((token) => (
                                <div key={token.address} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group hover:bg-white/[0.08]">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">WHALE DETECTED</span>
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-100 mb-1">New Accumulation: {token.symbol}</div>
                                    <div className="text-[11px] text-slate-500">Signal price confirmed at ${token.price.toFixed(4)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
