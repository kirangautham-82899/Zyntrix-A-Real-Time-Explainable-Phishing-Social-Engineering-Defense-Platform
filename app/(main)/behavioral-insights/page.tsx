'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, UserCheck, TrendingUp } from 'lucide-react';

export default function BehavioralInsights() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch for behavioral insights
        // In real app, this would fetch from /api/admin/behavioral-stats
        setTimeout(() => {
            setStats({
                avgRiskScore: 35,
                anomaliesDetected: 12,
                activeProfiles: 154,
                riskTrend: [
                    { day: 'Mon', score: 20 },
                    { day: 'Tue', score: 25 },
                    { day: 'Wed', score: 45 }, // Anomaly spike
                    { day: 'Thu', score: 30 },
                    { day: 'Fri', score: 35 },
                ],
                recentAnomalies: [
                    { id: 1, user: 'user@example.com', type: 'Unusual Login Location', time: '2 mins ago', severity: 'high' },
                    { id: 2, user: 'dev@company.com', type: 'Rapid Scan Burst', time: '1 hour ago', severity: 'medium' },
                    { id: 3, user: 'admin@zyntrix.com', type: 'Failed Login Spree', time: '3 hours ago', severity: 'critical' },
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Activity className="text-cyan-500" size={32} />
                        Behavioral Analysis Engine
                    </h1>
                    <p className="text-gray-400">Real-time user behavior profiling and anomaly detection using Isolation Forest ML.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={<TrendingUp size={24} />}
                        title="Avg Organization Risk"
                        value={stats.avgRiskScore}
                        color="cyan"
                        subtext="+5% from last week"
                    />
                    <StatCard
                        icon={<ShieldAlert size={24} />}
                        title="Anomalies Detected"
                        value={stats.anomaliesDetected}
                        color="red"
                        subtext="Last 24 hours"
                    />
                    <StatCard
                        icon={<UserCheck size={24} />}
                        title="Active Monitored Profiles"
                        value={stats.activeProfiles}
                        color="green"
                        subtext="All systems normal"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Anomaly Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <ShieldAlert className="text-red-400" size={20} />
                            Recent Anomalies
                        </h2>
                        <div className="space-y-4">
                            {stats.recentAnomalies.map((anomaly: any) => (
                                <div key={anomaly.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between border-l-4 border-red-500">
                                    <div>
                                        <p className="text-white font-medium">{anomaly.type}</p>
                                        <p className="text-sm text-gray-400">{anomaly.user}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-1 rounded-full ${anomaly.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                                                anomaly.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                                    'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                            {anomaly.severity.toUpperCase()}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{anomaly.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* How it Works / Model Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">ML Model Status</h2>
                        <div className="space-y-6">
                            <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/30">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-cyan-300 font-bold">Algorithm</span>
                                    <span className="text-gray-400 text-sm">v1.2.0</span>
                                </div>
                                <p className="text-white text-lg">Isolation Forest (Unsupervised)</p>
                            </div>

                            <div>
                                <h3 className="text-gray-300 font-medium mb-3">Model Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Login Frequency', 'Scan Burst Rate', 'Time of Day', 'Geo-Velocity', 'Avg Risk Score'].map((feature) => (
                                        <span key={feature} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-gray-300 font-medium mb-3">Training Status</h3>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <p className="text-right text-xs text-green-400 mt-1">Model Active & Learning</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color, subtext }: any) {
    const colors = {
        cyan: 'from-cyan-500 to-blue-500',
        red: 'from-red-500 to-pink-500',
        green: 'from-green-500 to-emerald-500'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} p-6 rounded-xl shadow-lg`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="text-white opacity-80">{icon}</div>
            </div>
            <h3 className="text-white text-sm font-medium mb-1">{title}</h3>
            <p className="text-white text-3xl font-bold mb-2">{value}</p>
            <p className="text-white/70 text-xs">{subtext}</p>
        </motion.div>
    );
}
