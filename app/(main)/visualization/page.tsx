"use client";

import { motion } from 'framer-motion';
import { Terminal, Eye, TrendingUp, Shield } from 'lucide-react';

export default function VisualizationPage() {
    const riskScore = 75;

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

            <main className="relative max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-8 h-8 text-[#00F0FF]" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                            RISK VISUALIZATION
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">risk_meter.exe | Interactive threat analysis</p>
                </motion.div>

                {/* Risk Meter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-[#00F0FF]/30 mb-8"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] to-[#B026FF]" />

                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">Risk Score</h3>
                        <div className="text-6xl font-bold bg-gradient-to-r from-[#FF0055] to-[#FFD700] bg-clip-text text-transparent">
                            {riskScore}/100
                        </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-64 h-64 mx-auto mb-8">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="#374151"
                                strokeWidth="16"
                                fill="none"
                            />
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="url(#gradient)"
                                strokeWidth="16"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 120}`}
                                strokeDashoffset={`${2 * Math.PI * 120 * (1 - riskScore / 100)}`}
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00FF41" />
                                    <stop offset="50%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#FF0055" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Shield className="w-20 h-20 text-[#FFD700]" />
                        </div>
                    </div>

                    {/* Risk Levels */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Safe', range: '0-30', color: '#00FF41' },
                            { label: 'Suspicious', range: '31-70', color: '#FFD700' },
                            { label: 'Dangerous', range: '71-100', color: '#FF0055' },
                        ].map((level, i) => (
                            <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: level.color }} />
                                <div className="font-bold" style={{ color: level.color }}>{level.label}</div>
                                <div className="text-xs text-gray-400 font-mono">{level.range}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Info */}
                <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-[#00F0FF]" />
                        Visual Analysis
                    </h4>
                    <p className="text-sm text-gray-400 font-mono">
                        The risk meter provides an intuitive visualization of threat levels. Scores are calculated using multiple factors including URL patterns, content analysis, and behavioral indicators.
                    </p>
                </div>
            </main>
        </div>
    );
}
