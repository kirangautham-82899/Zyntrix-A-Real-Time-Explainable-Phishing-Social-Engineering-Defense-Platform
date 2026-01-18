"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, Shield, Activity, Calendar, RefreshCw, Terminal
} from 'lucide-react';

interface AnalyticsData {
    totalScans: number;
    safeCount: number;
    suspiciousCount: number;
    dangerousCount: number;
    byType: { url: number; email: number; sms: number };
    timeline: Array<{ date: string; scans: number; threats: number }>;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalScans: 0,
        safeCount: 0,
        suspiciousCount: 0,
        dangerousCount: 0,
        byType: { url: 0, email: 0, sms: 0 },
        timeline: []
    });

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = () => {
        const history = localStorage.getItem('zyntrix_scan_history');
        if (!history) return;

        const scans = JSON.parse(history);

        const stats: AnalyticsData = {
            totalScans: scans.length,
            safeCount: scans.filter((s: any) => s.riskLevel === 'safe').length,
            suspiciousCount: scans.filter((s: any) => s.riskLevel === 'suspicious').length,
            dangerousCount: scans.filter((s: any) => s.riskLevel === 'dangerous').length,
            byType: {
                url: scans.filter((s: any) => s.type === 'url').length,
                email: scans.filter((s: any) => s.type === 'email').length,
                sms: scans.filter((s: any) => s.type === 'sms').length,
            },
            timeline: generateTimeline(scans)
        };

        setAnalytics(stats);
    };

    const generateTimeline = (scans: any[]) => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const dayScans = scans.filter((s: any) => s.timestamp.startsWith(date));
            const threats = dayScans.filter((s: any) => s.riskLevel === 'suspicious' || s.riskLevel === 'dangerous');

            return {
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                scans: dayScans.length,
                threats: threats.length
            };
        });
    };

    const riskDistribution = [
        { name: 'Safe', value: analytics.safeCount, color: '#00FF41' },
        { name: 'Suspicious', value: analytics.suspiciousCount, color: '#FFD700' },
        { name: 'Dangerous', value: analytics.dangerousCount, color: '#FF0055' }
    ];

    const typeDistribution = [
        { name: 'URL', count: analytics.byType.url },
        { name: 'Email', count: analytics.byType.email },
        { name: 'SMS', count: analytics.byType.sms }
    ];

    const threatRate = analytics.totalScans > 0
        ? ((analytics.suspiciousCount + analytics.dangerousCount) / analytics.totalScans * 100).toFixed(1)
        : '0.0';

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
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Terminal className="w-8 h-8 text-[#00F0FF]" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                                ANALYTICS
                            </h1>
                        </div>
                        <p className="text-gray-400 font-mono text-sm">data_insights.exe | Threat detection trends</p>
                    </div>
                    <button
                        onClick={loadAnalytics}
                        className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 font-mono"
                    >
                        <RefreshCw className="w-4 h-4" />
                        REFRESH
                    </button>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { icon: Shield, label: 'Total Scans', value: analytics.totalScans.toLocaleString(), color: '#00F0FF' },
                        { icon: Activity, label: 'Threats Detected', value: (analytics.suspiciousCount + analytics.dangerousCount).toLocaleString(), color: '#FF0055', badge: `${threatRate}%` },
                        { icon: Shield, label: 'Safe Content', value: analytics.safeCount.toLocaleString(), color: '#00FF41', badge: `${analytics.totalScans > 0 ? (analytics.safeCount / analytics.totalScans * 100).toFixed(0) : 0}%` },
                        { icon: Calendar, label: 'Last 7 Days', value: analytics.timeline.reduce((sum, day) => sum + day.scans, 0).toString(), color: '#B026FF' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${stat.color}, transparent)` }} />
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                                {stat.badge && <span className="text-sm font-mono" style={{ color: stat.color }}>{stat.badge}</span>}
                            </div>
                            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="text-gray-400 text-sm font-mono">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Timeline Chart */}
                    <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#00F0FF]" />
                            Scan Activity (7 Days)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.timeline}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                                <Legend />
                                <Line type="monotone" dataKey="scans" stroke="#00F0FF" strokeWidth={2} name="Total Scans" />
                                <Line type="monotone" dataKey="threats" stroke="#FF0055" strokeWidth={2} name="Threats" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Risk Distribution */}
                    <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#B026FF]" />
                            Risk Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Type Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#00F0FF]" />
                            Scan Types
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={typeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#00F0FF" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 font-mono text-sm">Threat Detection Rate</span>
                                    <span className="text-2xl font-bold text-[#FF0055]">{threatRate}%</span>
                                </div>
                                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#FF0055] to-[#FFD700]" style={{ width: `${threatRate}%` }} />
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 font-mono text-sm">Safe Content Rate</span>
                                    <span className="text-2xl font-bold text-[#00FF41]">
                                        {analytics.totalScans > 0 ? (analytics.safeCount / analytics.totalScans * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00FF41]" style={{ width: `${analytics.totalScans > 0 ? (analytics.safeCount / analytics.totalScans * 100) : 0}%` }} />
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-gray-300 mb-2 font-mono text-sm">Most Scanned Type</div>
                                <div className="text-2xl font-bold text-[#00F0FF]">
                                    {analytics.byType.url >= analytics.byType.email && analytics.byType.url >= analytics.byType.sms ? 'URL' :
                                        analytics.byType.email >= analytics.byType.sms ? 'Email' : 'SMS'}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-gray-300 mb-2 font-mono text-sm">Average Daily Scans</div>
                                <div className="text-2xl font-bold text-[#B026FF]">
                                    {(analytics.timeline.reduce((sum, day) => sum + day.scans, 0) / 7).toFixed(1)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
