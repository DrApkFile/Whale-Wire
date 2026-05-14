"use client";

import { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user) {
                    router.push("/dashboard");
                }
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // 1. Create user profile in Firestore (Await this fully to avoid hung state)
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    email: userCredential.user.email,
                    scannerActive: false,
                    telegramChatId: "",
                    createdAt: new Date().toISOString()
                }, { merge: true });

                // 2. Send Verification Email
                await sendEmailVerification(userCredential.user);

                setVerificationSent(true);
                setLoading(false);
                // We stay on the page to show the "Verify Email" state
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message.replace("Firebase: ", ""));
            setLoading(false);
        }
    };

    if (verificationSent) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 bg-[url('/grid.svg')]">
                <div className="w-full max-w-md p-10 rounded-[3rem] bg-slate-900/60 border border-emerald-500/20 backdrop-blur-3xl text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-500" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Check Your Inbox</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        We've sent a secure verification link to <span className="text-emerald-400 font-bold">{email}</span>.
                        Please verify your email to activate your terminal access.
                    </p>
                    <button
                        onClick={() => {
                            setVerificationSent(false);
                            setIsLogin(true);
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md p-10 rounded-[3rem] bg-slate-950/40 border border-white/5 backdrop-blur-3xl shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="WhaleWire" className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2 italic">
                        WHALE<span className="text-blue-500">WIRE</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase opacity-60">
                        {isLogin ? "Digital Intelligence Access" : "Create Intelligence Profile"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-3">
                        <Shield size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="Terminal Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Security Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-14 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-5 flex items-center text-slate-600 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group border border-white/10 uppercase"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "INITIALIZE ACCESS" : "CREATE DISPATCH PROFILE")}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-white/5 pt-8">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-slate-500 hover:text-blue-400 transition-all font-bold tracking-widest uppercase"
                    >
                        {isLogin ? "Need a terminal account?" : "Existing operative? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}
