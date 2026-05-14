import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                            W
                        </div>
                        <span className="text-xl font-bold tracking-tighter">
                            WHALE<span className="text-blue-500">WIRE</span>
                        </span>
                    </Link>
                    <p className="text-slate-400 max-w-sm mb-6">
                        The premium intelligence layer for Solana traders.
                        Stop being exit liquidity and start following the smart money.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholder */}
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-all cursor-pointer">𝕏</div>
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-all cursor-pointer">✈️</div>
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-all cursor-pointer">👾</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Product</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
                        <li><Link href="/alerts" className="hover:text-blue-400 transition-colors">Live Signals</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Scoring Engine</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">API Access</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Resources</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Trading Guide</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                <p>© 2026 WhaleWire Protocol. All rights reserved.</p>
                <p>Data provided by Birdeye. Not financial advice.</p>
            </div>
        </footer>
    );
};
