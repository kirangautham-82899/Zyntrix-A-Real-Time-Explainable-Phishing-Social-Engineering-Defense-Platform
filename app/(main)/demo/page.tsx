"use client";

import { motion } from 'framer-motion';
import { Shield, Scan, Mail, MessageSquare, QrCode, AlertTriangle, CheckCircle2, XCircle, Terminal } from "lucide-react";

export default function ComponentDemo() {
    return (
        <div className="min-h-screen bg-[#0A0E1A] text-white">
            {/* Matrix Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(0deg, transparent 24%, rgba(0, 240, 255, 0.05) 25%, rgba(0, 240, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.05) 75%, rgba(0, 240, 255, 0.05) 76%, transparent 77%, transparent),
                        linear-gradient(90deg, transparent 24%, rgba(0, 240, 255, 0.05) 25%, rgba(0, 240, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.05) 75%, rgba(0, 240, 255, 0.05) 76%, transparent 77%, transparent)
                    `,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            <main className="relative max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-8 h-8 text-[#00F0FF]" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                            UI COMPONENTS
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">design_system.exe | Reusable component library</p>
                </motion.div>

                {/* Buttons Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-white">Buttons</h2>
                    <div className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-lg font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                    <Scan className="w-5 h-5" />
                                    Primary
                                </button>
                                <button className="px-6 py-3 bg-gradient-to-r from-[#B026FF] to-[#FF0055] rounded-lg font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Accent
                                </button>
                                <button className="px-6 py-3 bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] rounded-lg font-bold hover:bg-[#00FF41]/30 transition-colors flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Success
                                </button>
                                <button className="px-6 py-3 bg-[#FF0055]/20 border border-[#FF0055] text-[#FF0055] rounded-lg font-bold hover:bg-[#FF0055]/30 transition-colors flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Danger
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cards Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-white">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Scan, title: "URL Scanner", description: "Analyze URLs for threats", color: "#00F0FF" },
                            { icon: Mail, title: "Email Analyzer", description: "Detect malicious emails", color: "#B026FF" },
                            { icon: QrCode, title: "QR Scanner", description: "Verify QR code links", color: "#00FF41" },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${card.color}, transparent)` }} />
                                <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center mb-4" style={{ color: card.color }}>
                                    <card.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: card.color }}>{card.title}</h3>
                                <p className="text-gray-400 text-sm">{card.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Badges Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-white">Badges</h2>
                    <div className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 rounded-full bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] text-sm font-mono">Safe</span>
                            <span className="px-3 py-1 rounded-full bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] text-sm font-mono">Suspicious</span>
                            <span className="px-3 py-1 rounded-full bg-[#FF0055]/20 border border-[#FF0055] text-[#FF0055] text-sm font-mono">Dangerous</span>
                            <span className="px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] text-sm font-mono">Scanning</span>
                        </div>
                    </div>
                </section>

                {/* Combined Example */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-white">Combined Example</h2>
                    <div className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border-2 border-[#00F0FF]/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] via-[#B026FF] to-[#FF0055]" />

                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                            <div className="w-3 h-3 rounded-full bg-[#FF0055]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                            <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
                            <span className="text-sm text-gray-400 ml-auto font-mono">ZYNTRIX Scanner v1.0</span>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter URL, email, or paste message to scan..."
                                className="w-full px-6 py-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#00F0FF] focus:outline-none transition-colors font-mono"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <button className="px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                    <Scan className="w-5 h-5" />
                                    Analyze Threat
                                </button>
                                <button className="px-6 py-3 border border-white/20 rounded-lg font-bold hover:bg-white/5 transition-colors">
                                    Clear
                                </button>
                            </div>

                            {/* Sample Results */}
                            <div className="space-y-3 mt-6">
                                <div className="p-4 bg-[#00FF41]/10 border-l-4 border-[#00FF41] rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#00FF41] flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-[#00FF41]">SAFE</span>
                                                <span className="px-2 py-0.5 bg-[#00FF41]/20 rounded text-xs text-[#00FF41]">Risk: 5/100</span>
                                            </div>
                                            <p className="text-sm text-gray-400">No malicious patterns detected</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-[#FF0055]/10 border-l-4 border-[#FF0055] rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-[#FF0055] flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-[#FF0055]">DANGEROUS</span>
                                                <span className="px-2 py-0.5 bg-[#FF0055]/20 rounded text-xs text-[#FF0055]">Risk: 95/100</span>
                                            </div>
                                            <p className="text-sm text-gray-400">Phishing attempt detected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
