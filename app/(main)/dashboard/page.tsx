"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Shield, Scan, BarChart3, History, QrCode, Eye,
    Zap, Globe, Database, Lock, TrendingUp, Activity,
    Chrome, Terminal, Cpu, Network, AlertTriangle
} from 'lucide-react';

export default function DashboardPage() {
    const features = [
        {
            title: "Threat Scanner",
            description: "Real-time URL, email, SMS, and QR code analysis",
            icon: <Scan className="w-8 h-8" />,
            href: "/scanner",
            color: "#00F0FF",
            stats: "AI Detection"
        },
        {
            title: "Analytics",
            description: "Visual threat statistics and trend analysis",
            icon: <BarChart3 className="w-8 h-8" />,
            href: "/analytics",
            color: "#B026FF",
            stats: "Data Insights"
        },
        {
            title: "Scan History",
            description: "Browse and filter all previous scans",
            icon: <History className="w-8 h-8" />,
            href: "/history",
            color: "#00FF41",
            stats: "Full Archive"
        },
        {
            title: "QR Scanner",
            description: "Upload and analyze QR codes for threats",
            icon: <QrCode className="w-8 h-8" />,
            href: "/qr-scanner",
            color: "#FF0055",
            stats: "Image Analysis"
        },
        {
            title: "Risk Visualization",
            description: "Interactive threat meters and explanations",
            icon: <Eye className="w-8 h-8" />,
            href: "/visualization",
            color: "#FFD700",
            stats: "Visual Feedback"
        },
        {
            title: "API Testing",
            description: "Backend connectivity and health monitoring",
            icon: <Activity className="w-8 h-8" />,
            href: "/api-test",
            color: "#00F0FF",
            stats: "System Check"
        },
    ];

    const quickStats = [
        { label: "Total Scans", value: "1,234", icon: <Scan className="w-6 h-6" />, color: "#00F0FF" },
        { label: "Threats Blocked", value: "89", icon: <Shield className="w-6 h-6" />, color: "#FF0055" },
        { label: "Safe URLs", value: "1,145", icon: <Lock className="w-6 h-6" />, color: "#00FF41" },
        { label: "Accuracy", value: "99.9%", icon: <TrendingUp className="w-6 h-6" />, color: "#B026FF" }
    ];

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
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F0FF] via-[#B026FF] to-[#FF0055] bg-clip-text text-transparent">
                            COMMAND CENTER
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">system_dashboard.exe | All defense protocols active</p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {quickStats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="relative p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all overflow-hidden group"
                        >
                            {/* Gradient Top Border */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1"
                                style={{ background: `linear-gradient(to right, ${stat.color}, transparent)` }}
                            />

                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className="p-3 rounded-lg bg-white/5"
                                    style={{ color: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                            </div>

                            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                                {stat.value}
                            </div>
                            <div className="text-gray-400 text-sm font-mono">{stat.label}</div>

                            {/* Glow Effect */}
                            <div
                                className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10"
                                style={{ background: `${stat.color}20` }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* System Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12 p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-[#00FF41]/30"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-[#00FF41]/10">
                                <Database className="w-6 h-6 text-[#00FF41]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#00FF41] font-mono">SYSTEM STATUS</h3>
                                <p className="text-gray-400 text-sm">All services operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 font-mono text-sm">
                            <div className="text-center">
                                <div className="text-[#00FF41] font-bold">✓</div>
                                <div className="text-gray-500 text-xs">API</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[#00FF41] font-bold">✓</div>
                                <div className="text-gray-500 text-xs">DB</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[#00FF41] font-bold">✓</div>
                                <div className="text-gray-500 text-xs">CACHE</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-[#00FF41]"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-[#00FF41]">LIVE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 font-mono">
                        <Zap className="w-6 h-6 text-[#00F0FF]" />
                        <span className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                            DEFENSE MODULES
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <Link key={index} href={feature.href}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group relative p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all cursor-pointer overflow-hidden h-full"
                            >
                                {/* Gradient Top Border */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-1"
                                    style={{ background: `linear-gradient(to right, ${feature.color}, transparent)` }}
                                />

                                {/* Icon */}
                                <motion.div
                                    className="mb-4 w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center"
                                    style={{ color: feature.color }}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {feature.icon}
                                </motion.div>

                                {/* Title */}
                                <h3
                                    className="text-xl font-bold mb-2"
                                    style={{ color: feature.color }}
                                >
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Stats Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                                    <span style={{ color: feature.color }}>●</span>
                                    <span className="text-gray-400">{feature.stats}</span>
                                </div>

                                {/* Glow Effect */}
                                <div
                                    className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10 rounded-xl"
                                    style={{ background: `${feature.color}20` }}
                                />
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Browser Extension */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-[#FF0055]/30 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF0055] to-[#B026FF]" />

                    <div className="flex items-start gap-6">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#FF0055]/20 to-[#B026FF]/20">
                            <Chrome className="w-12 h-12 text-[#FF0055]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#FF0055] to-[#B026FF] bg-clip-text text-transparent">
                                BROWSER EXTENSION
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Real-time protection while browsing. Install the ZYNTRIX extension for continuous threat monitoring.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-6 font-mono text-sm">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-[#00F0FF] font-bold mb-1">STEP 1</div>
                                    <div className="text-gray-400 text-xs">Open chrome://extensions/</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-[#B026FF] font-bold mb-1">STEP 2</div>
                                    <div className="text-gray-400 text-xs">Enable Developer mode</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-[#00FF41] font-bold mb-1">STEP 3</div>
                                    <div className="text-gray-400 text-xs">Load extension folder</div>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-gradient-to-r from-[#FF0055] to-[#B026FF] rounded-lg font-bold hover:scale-105 transition-transform">
                                View Documentation
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
