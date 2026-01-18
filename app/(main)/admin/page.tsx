'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Shield, TrendingUp, AlertTriangle,
    Activity, Database, Lock, Settings
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/analytics/overview', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            setStats(data.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
                    <p className="text-gray-300">
                        Failed to load dashboard data. Please check if the backend server is running and connected to the database.
                    </p>
                    <button
                        onClick={fetchStats}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        🛡️ ZYNTRIX Admin Dashboard
                    </h1>
                    <p className="text-gray-400">Enterprise Cyber Safety Management</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<Shield className="w-8 h-8" />}
                        title="Total Scans"
                        value={stats?.total_scans || 0}
                        color="cyan"
                    />
                    <StatCard
                        icon={<AlertTriangle className="w-8 h-8" />}
                        title="Threats Blocked"
                        value={stats?.by_risk_level?.dangerous || 0}
                        color="red"
                    />
                    <StatCard
                        icon={<Activity className="w-8 h-8" />}
                        title="Detection Rate"
                        value={`${stats?.metrics?.threat_detection_rate || 0}%`}
                        color="green"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-8 h-8" />}
                        title="Avg Risk Score"
                        value={stats?.metrics?.avg_risk_score || 0}
                        color="yellow"
                    />
                </div>

                {/* Risk Level Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Risk Level Distribution</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <RiskBar
                            label="Safe"
                            count={stats?.by_risk_level?.safe || 0}
                            total={stats?.total_scans || 1}
                            color="bg-green-500"
                        />
                        <RiskBar
                            label="Suspicious"
                            count={stats?.by_risk_level?.suspicious || 0}
                            total={stats?.total_scans || 1}
                            color="bg-yellow-500"
                        />
                        <RiskBar
                            label="Dangerous"
                            count={stats?.by_risk_level?.dangerous || 0}
                            total={stats?.total_scans || 1}
                            color="bg-red-500"
                        />
                    </div>
                </motion.div>

                {/* Scan Types */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Scan Types</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <TypeCard
                            label="URL Scans"
                            count={stats?.by_type?.url || 0}
                            icon="🔗"
                        />
                        <TypeCard
                            label="Email Scans"
                            count={stats?.by_type?.email || 0}
                            icon="📧"
                        />
                        <TypeCard
                            label="SMS Scans"
                            count={stats?.by_type?.sms || 0}
                            icon="📱"
                        />
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <QuickAction icon={<Users />} label="Manage Users" href="/admin/users" />
                    <QuickAction icon={<Database />} label="Threat Intel" href="/admin/threats" />
                    <QuickAction icon={<Lock />} label="Policies" href="/admin/policies" />
                    <QuickAction icon={<Settings />} label="Settings" href="/admin/settings" />
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color }: any) {
    const colors = {
        cyan: 'from-cyan-500 to-blue-500',
        red: 'from-red-500 to-pink-500',
        green: 'from-green-500 to-emerald-500',
        yellow: 'from-yellow-500 to-orange-500'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} p-6 rounded-xl shadow-lg`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="text-white opacity-80">{icon}</div>
            </div>
            <h3 className="text-white text-sm font-medium mb-1">{title}</h3>
            <p className="text-white text-3xl font-bold">{value}</p>
        </motion.div>
    );
}

function RiskBar({ label, count, total, color }: any) {
    const percentage = (count / total) * 100;

    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-gray-300 text-sm">{label}</span>
                <span className="text-gray-400 text-sm">{count}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                    className={`${color} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-gray-500 text-xs mt-1">{percentage.toFixed(1)}%</p>
        </div>
    );
}

function TypeCard({ label, count, icon }: any) {
    return (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">{icon}</div>
            <p className="text-gray-300 text-sm mb-1">{label}</p>
            <p className="text-white text-2xl font-bold">{count}</p>
        </div>
    );
}

function QuickAction({ icon, label, href }: any) {
    return (
        <a
            href={href}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:border-cyan-500"
        >
            <div className="text-cyan-500 mb-2">{icon}</div>
            <span className="text-gray-300 text-sm text-center">{label}</span>
        </a>
    );
}
