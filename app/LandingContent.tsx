"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Target, BarChart3, Radio } from "lucide-react";

interface LandingContentProps {
    initialTokens: any[];
}

export default function LandingContent({ initialTokens }: LandingContentProps) {
    return (
        <div className="bg-[#020617]">
            <Navbar />

            <main>
                {/* Hero section with specialized branding */}
                <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                    {/* Atmospheric effects */}
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cyber-dust.png')] opacity-20 pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-[0.2em] uppercase mb-8 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                                <Radio size={14} className="animate-pulse" />
                                Live Intelligence Stream
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-[0.85] uppercase">
                                Follow the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 underline decoration-blue-500/30">Whales</span> <br />
                                <span className="text-white opacity-90">Harvest the alpha</span>
                            </h1>

                            <p className="text-slate-400 text-xl font-medium mb-12 max-w-xl leading-relaxed">
                                Stop trading against the market. WhaleWire exposes deep-chain entry clusters from the 1% most profitable Solana traders in real-time.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link href="/auth" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg transition-all shadow-[0_0_60px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group border border-white/10 uppercase italic tracking-tighter">
                                    Initialize Terminal
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all text-center uppercase tracking-tighter italic">
                                    Public Stream
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-8 text-slate-500">
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-2xl tracking-tighter">24/7</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Monitoring</span>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-2xl tracking-tighter">0ms</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Latency</span>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-2xl tracking-tighter">$1.2B+</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Volume Scanned</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-10 p-2 rounded-[3.5rem] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-2xl shadow-2xl">
                                <img src="/logo.png" alt="WhaleWire Premium" className="w-full rounded-[3rem] shadow-2xl border border-white/5" />

                                {/* Orbiting stats */}
                                <div className="absolute -top-10 -right-10 p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl animate-bounce duration-[3000ms]">
                                    <div className="text-[10px] font-bold text-blue-400 mb-1">PROFITABILITY</div>
                                    <div className="text-2xl font-black text-white">+842%</div>
                                </div>
                                <div className="absolute -bottom-10 -left-10 p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
                                    <div className="text-[10px] font-bold text-emerald-400 mb-1">CONFIDENCE</div>
                                    <div className="text-2xl font-black text-white">ELITE</div>
                                </div>
                            </div>

                            {/* Decorative Blur */}
                            <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full -z-10" />
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "Cluster Analysis",
                                    desc: "Identifies groups of high-accuracy wallets entering the same asset simultaneously.",
                                    icon: Target,
                                    color: "text-blue-500"
                                },
                                {
                                    title: "Node-Direct Sync",
                                    desc: "Connected directly to Birdeye Pro API for millisecond-perfect timing.",
                                    icon: Zap,
                                    color: "text-yellow-500"
                                },
                                {
                                    title: "Integrity Checks",
                                    desc: "Every signal is filtered through a 12-point integrity check to avoid launch traps.",
                                    icon: Shield,
                                    color: "text-emerald-500"
                                }
                            ].map((f, i) => (
                                <div key={i} className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-blue-500/20 transition-all group hover:-translate-y-2 duration-500">
                                    <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-8 ${f.color} group-hover:scale-110 transition-transform`}>
                                        <f.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">{f.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-32 px-6">
                    <div className="max-w-5xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[4rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative p-20 rounded-[4rem] bg-slate-900 border border-white/10 text-center overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <BarChart3 size={200} />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 italic uppercase tracking-tighter leading-tight">Ready for <br /><span className="text-blue-500">Terminal Access?</span></h2>
                            <p className="text-slate-400 text-lg font-medium mb-12 max-w-xl mx-auto">Join the private network of elite traders who stopped guessing and started monitoring.</p>
                            <Link href="/auth" className="inline-block px-12 py-6 rounded-2xl bg-white text-blue-600 text-xl font-black transition-all hover:scale-105 active:scale-95 uppercase italic tracking-tighter">
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
