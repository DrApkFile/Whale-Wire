"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Globe, Shield, Zap, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

export default function LandingContent() {
    const features = [
        {
            title: "Smart Money Feed",
            description: "Real-time tracking of high-performance wallets and their early entries into new tokens.",
            icon: <Wallet className="w-6 h-6 text-brand-primary" />,
        },
        {
            title: "Momentum Signals",
            description: "Detect volume spikes and coordinated accumulation before they trend on social media.",
            icon: <TrendingUp className="w-6 h-6 text-brand-secondary" />,
        },
        {
            title: "Confidence Scoring",
            description: "Proprietary algorithms that rank tokens based on wallet quality and entry velocity.",
            icon: <Shield className="w-6 h-6 text-brand-neon" />,
        },
        {
            title: "Fast execution",
            description: "Built for speed. Get alerts and execute before the retail crowd catches up.",
            icon: <Zap className="w-6 h-6 text-brand-accent" />,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-deep selection:bg-brand-primary/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-white">W</div>
                        <span className="text-xl font-bold tracking-tight neon-glow">WhaleWire</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-medium hover:text-brand-primary transition-colors">Dashboard</Link>
                        <Link href="/alerts" className="text-sm font-medium hover:text-brand-primary transition-colors">Alerts</Link>
                        <button className="px-4 py-2 bg-brand-primary text-white rounded-full text-sm font-semibold hover:bg-brand-primary/80 transition-all">
                            Launch App
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-[120px]" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold mb-6">
                            <Zap className="w-3 h-3" /> BEAT THE CROWD
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                            Follow <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">Smart Money</span> <br />
                            Before It Trends
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            Stop being exit liquidity. WhaleWire surfaces early moves by the most profitable wallets on-chain, giving you the alpha before it's too late.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/dashboard" className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                Start Tracking <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="px-8 py-4 glass text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                                View Signals
                            </button>
                        </div>
                    </motion.div>

                    {/* Mockup Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-20 relative p-4 glass rounded-2xl shadow-2xl border border-white/5"
                    >
                        <div className="aspect-[16/9] w-full rounded-xl bg-background-deep overflow-hidden relative border border-white/10 group">
                            {/* Mock Dashboard UI */}
                            <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col gap-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-24 bg-white/10 rounded" />
                                        <div className="h-6 w-6 rounded bg-white/10" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6 flex-1">
                                    <div className="col-span-2 flex flex-col gap-4">
                                        <div className="h-32 w-full bg-white/5 rounded-xl border border-white/10 p-4">
                                            <div className="h-2 w-20 bg-brand-primary/50 rounded mb-4" />
                                            <div className="grid grid-cols-5 gap-2 items-end h-16">
                                                <div className="h-1/2 bg-brand-primary/20 rounded-sm" />
                                                <div className="h-3/4 bg-brand-primary/40 rounded-sm" />
                                                <div className="h-full bg-brand-primary/60 rounded-sm" />
                                                <div className="h-2/3 bg-brand-primary/30 rounded-sm" />
                                                <div className="h-4/5 bg-brand-primary/50 rounded-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 flex-1">
                                            <div className="bg-white/5 rounded-xl border border-white/10" />
                                            <div className="bg-white/5 rounded-xl border border-white/10" />
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl border border-white/10" />
                                </div>
                            </div>
                            {/* Overlay Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background-deep via-transparent to-transparent opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="px-6 py-3 glass rounded-full text-sm font-bold flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> LIVE TERMINAL PREVIEW
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary/50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-12 border-t border-white/10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center font-bold text-white text-xs">W</div>
                        <span className="font-bold tracking-tight">WhaleWire</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2024 WhaleWire. Built for Birdeye Data Build in Public.</p>
                    <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="#" className="hover:text-white transition-colors">X / Twitter</Link>
                        <Link href="#" className="hover:text-white transition-colors">Telegram</Link>
                        <Link href="#" className="hover:text-white transition-colors">Docs</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
