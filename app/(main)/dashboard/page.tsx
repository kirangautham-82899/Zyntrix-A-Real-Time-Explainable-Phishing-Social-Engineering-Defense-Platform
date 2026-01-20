"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Shield, Scan, BarChart3, History, QrCode, Eye,
    Zap, Database, Lock, TrendingUp, Activity,
    Chrome, Terminal
} from 'lucide-react';

export default function DashboardPage() {
    const features = [
        {
            title: "Threat Scanner",
            description: "Real-time URL, email, SMS, and QR code analysis",
            icon: <Scan className="w-8 h-8" />,
            href: "/scanner",
            color: "#3B82F6",
            stats: "AI Detection"
        },
        {
            title: "Analytics",
            description: "Visual threat statistics and trend analysis",
            icon: <BarChart3 className="w-8 h-8" />,
            href: "/analytics",
            color: "#06B6D4",
            stats: "Data Insights"
        },
        {
            title: "Scan History",
            description: "Browse and filter all previous scans",
            icon: <History className="w-8 h-8" />,
            href: "/history",
            color: "#10B981",
            stats: "Full Archive"
        },
        {
            title: "QR Scanner",
            description: "Upload and analyze QR codes for threats",
            icon: <QrCode className="w-8 h-8" />,
            href: "/qr-scanner",
            color: "#EF4444",
            stats: "Image Analysis"
        },
        {
            title: "Risk Visualization",
            description: "Interactive threat meters and explanations",
            icon: <Eye className="w-8 h-8" />,
            href: "/visualization",
            color: "#F59E0B",
            stats: "Visual Feedback"
        },
        {
            title: "Live Monitor",
            description: "Real-time threat feed with WebSocket updates",
            icon: <Activity className="w-8 h-8" />,
            href: "/live-monitor",
            color: "#8B5CF6",
            stats: "Live Feed"
        },
        {
            title: "API Testing",
            description: "Backend connectivity and health monitoring",
            icon: <Terminal className="w-8 h-8" />,
            href: "/api-test",
            color: "#3B82F6",
            stats: "System Check"
        },
    ];

    const quickStats = [
        { label: "Total Scans", value: "1,234", icon: <Scan className="w-6 h-6" />, color: "#3B82F6" },
        { label: "Threats Blocked", value: "89", icon: <Shield className="w-6 h-6" />, color: "#EF4444" },
        { label: "Safe URLs", value: "1,145", icon: <Lock className="w-6 h-6" />, color: "#10B981" },
        { label: "Accuracy", value: "99.9%", icon: <TrendingUp className="w-6 h-6" />, color: "#06B6D4" }
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            {/* Matrix Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent),
                        linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent)
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
                        <Terminal className="w-8 h-8 text-[#3B82F6]" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#EF4444] bg-clip-text text-transparent">
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
                    className="mb-12 p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-[#10B981]/30"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-[#10B981]/10">
                                <Database className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#10B981] font-mono">SYSTEM STATUS</h3>
                                <p className="text-gray-400 text-sm">All services operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 font-mono text-sm">
                            <div className="text-center">
                                <div className="text-[#10B981] font-bold">✓</div>
                                <div className="text-gray-500 text-xs">API</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[#10B981] font-bold">✓</div>
                                <div className="text-gray-500 text-xs">DB</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[#10B981] font-bold">✓</div>
                                <div className="text-gray-500 text-xs">CACHE</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-[#10B981]"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-[#10B981]">LIVE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 font-mono">
                        <Zap className="w-6 h-6 text-[#3B82F6]" />
                        <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
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


            </main>
        </div>
    );
}
