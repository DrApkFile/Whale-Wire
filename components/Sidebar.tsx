"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Bell,
    Wallet,
    Coins,
    Settings,
    LogOut,
    ChevronRight,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import { auth } from "@/lib/firebase";

export const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Alpha Feed", icon: Bell, href: "/alerts" },
        { name: "Whale Radar", icon: Wallet, href: "/wallets" },
        { name: "Screener", icon: Coins, href: "/tokens" },
        { name: "Hot Pairs", icon: TrendingUp, href: "/trending" },
    ];

    return (
        <div className="w-72 bg-[#020617] border-r border-white/5 h-screen sticky top-0 flex flex-col hidden lg:flex shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
            <div className="p-8">
                <Link href="/" className="flex flex-col items-center gap-4 text-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img src="/logo.png" alt="WhaleWire Logo" className="relative w-16 h-16 rounded-2xl border border-white/10 shadow-2xl" />
                    </div>
                    <div>
                        <div className="text-xl font-black tracking-tighter text-white italic">
                            WHALE<span className="text-blue-500">WIRE</span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase opacity-60">
                            Digital Intelligence
                        </div>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-6 mt-6">
                <div className="mb-4 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Operations</div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl mb-2 transition-all duration-300 ${isActive
                                ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                                : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03] border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-sm tracking-wide ${isActive ? "font-black" : "font-semibold"}`}>{item.name}</span>
                            </div>
                            {isActive ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                            ) : (
                                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto">
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 mb-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck size={48} className="text-blue-500" />
                    </div>
                    <div className="text-[10px] uppercase font-black text-blue-500 mb-1 tracking-tighter">Verified Operative</div>
                    <div className="text-sm font-bold text-white mb-2 italic">Standard Plan</div>
                    <div className="w-full bg-slate-800 h-1 rounded-full mb-4">
                        <div className="bg-blue-600 h-1 rounded-full w-full shadow-[0_0_10px_#2563eb]" />
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-300 tracking-widest uppercase transition-all border border-white/5">
                        Tier Details
                    </button>
                </div>

                <div className="px-2">
                    <button
                        onClick={() => auth.signOut()}
                        className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-rose-400 font-bold text-sm transition-all w-full group"
                    >
                        <div className="p-2 rounded-lg bg-rose-500/0 group-hover:bg-rose-500/10 transition-all">
                            <LogOut size={20} />
                        </div>
                        <span className="tracking-wide">Terminal Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
