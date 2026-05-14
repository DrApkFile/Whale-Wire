"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-7xl backdrop-blur-2xl bg-slate-900/40 border border-white/5 rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="WhaleWire" className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                    <div>
                        <div className="text-xl font-black italic tracking-tighter text-white">
                            WHALE<span className="text-blue-500">WIRE</span>
                        </div>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="/tokens" className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Screener</Link>
                    <Link href="/alerts" className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Alpha Feed</Link>
                    <Link href="/wallets" className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Radars</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/auth" className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                        Operative Login
                    </Link>
                    <Link href="/auth" className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-xs font-black text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] uppercase tracking-widest border border-white/10">
                        Get Alpha
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </motion.div>
        </nav>
    );
};
