"use client";

import { useState, useEffect } from 'react';
import { Card, Badge } from '@/components/ui';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, Shield, Activity, Users,
    Calendar, Download, RefreshCw
} from 'lucide-react';

interface AnalyticsData {
    totalScans: number;
    safeCount: number;
    suspiciousCount: number;
    dangerousCount: number;
    byType: {
        url: number;
        email: number;
        sms: number;
    };
    timeline: Array<{
        date: string;
        scans: number;
        threats: number;
    }>;
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

        // Calculate statistics
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
            const dayScans = scans.filter((s: any) =>
                s.timestamp.startsWith(date)
            );
            const threats = dayScans.filter((s: any) =>
                s.riskLevel === 'suspicious' || s.riskLevel === 'dangerous'
            );

            return {
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                scans: dayScans.length,
                threats: threats.length
            };
        });
    };

    // Chart data
    const riskDistribution = [
        { name: 'Safe', value: analytics.safeCount, color: '#10b981' },
        { name: 'Suspicious', value: analytics.suspiciousCount, color: '#f59e0b' },
        { name: 'Dangerous', value: analytics.dangerousCount, color: '#ef4444' }
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
        <main className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Badge variant="info" size="lg" className="mb-4">Analytics Dashboard</Badge>
                        <h1 className="text-5xl font-bold mb-2">
                            <span className="text-gradient-primary">Analytics</span>
                        </h1>
                        <p className="text-dark-300">
                            Comprehensive threat detection insights and trends
                        </p>
                    </div>
                    <button
                        onClick={loadAnalytics}
                        className="glass px-4 py-2 rounded-lg hover:bg-primary-500/10 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card variant="glow" className="border-primary-500/30">
                        <div className="flex items-center justify-between mb-2">
                            <Shield className="w-8 h-8 text-primary-400" />
                            <TrendingUp className="w-5 h-5 text-success-400" />
                        </div>
                        <div className="text-3xl font-bold text-dark-100 mb-1">
                            {analytics.totalScans.toLocaleString()}
                        </div>
                        <div className="text-dark-400">Total Scans</div>
                    </Card>

                    <Card variant="default" className="border-danger-500/30">
                        <div className="flex items-center justify-between mb-2">
                            <Activity className="w-8 h-8 text-danger-400" />
                            <span className="text-sm text-danger-400 font-semibold">{threatRate}%</span>
                        </div>
                        <div className="text-3xl font-bold text-danger-400 mb-1">
                            {(analytics.suspiciousCount + analytics.dangerousCount).toLocaleString()}
                        </div>
                        <div className="text-dark-400">Threats Detected</div>
                    </Card>

                    <Card variant="default" className="border-success-500/30">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-8 h-8 text-success-400" />
                            <span className="text-sm text-success-400 font-semibold">
                                {analytics.totalScans > 0 ? (analytics.safeCount / analytics.totalScans * 100).toFixed(0) : 0}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-success-400 mb-1">
                            {analytics.safeCount.toLocaleString()}
                        </div>
                        <div className="text-dark-400">Safe Content</div>
                    </Card>

                    <Card variant="default" className="border-accent-500/30">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-accent-400" />
                            <Download className="w-5 h-5 text-dark-500" />
                        </div>
                        <div className="text-3xl font-bold text-accent-400 mb-1">
                            {analytics.timeline.reduce((sum, day) => sum + day.scans, 0)}
                        </div>
                        <div className="text-dark-400">Last 7 Days</div>
                    </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Timeline Chart */}
                    <Card variant="neon">
                        <h3 className="text-xl font-bold text-dark-100 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            Scan Activity (7 Days)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.timeline}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="scans"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name="Total Scans"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="threats"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    name="Threats"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Risk Distribution Pie */}
                    <Card variant="neon">
                        <h3 className="text-xl font-bold text-dark-100 mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary-400" />
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
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Type Distribution Bar */}
                    <Card variant="neon">
                        <h3 className="text-xl font-bold text-dark-100 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-400" />
                            Scan Types
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={typeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Summary Stats */}
                    <Card variant="neon">
                        <h3 className="text-xl font-bold text-dark-100 mb-6">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="glass rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-dark-300">Threat Detection Rate</span>
                                    <span className="text-2xl font-bold text-danger-400">{threatRate}%</span>
                                </div>
                                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-danger-500 to-warning-500"
                                        style={{ width: `${threatRate}%` }}
                                    />
                                </div>
                            </div>

                            <div className="glass rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-dark-300">Safe Content Rate</span>
                                    <span className="text-2xl font-bold text-success-400">
                                        {analytics.totalScans > 0 ? (analytics.safeCount / analytics.totalScans * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-success-500"
                                        style={{ width: `${analytics.totalScans > 0 ? (analytics.safeCount / analytics.totalScans * 100) : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="glass rounded-lg p-4">
                                <div className="text-dark-300 mb-2">Most Scanned Type</div>
                                <div className="text-2xl font-bold text-primary-400">
                                    {analytics.byType.url >= analytics.byType.email && analytics.byType.url >= analytics.byType.sms ? 'URL' :
                                        analytics.byType.email >= analytics.byType.sms ? 'Email' : 'SMS'}
                                </div>
                            </div>

                            <div className="glass rounded-lg p-4">
                                <div className="text-dark-300 mb-2">Average Daily Scans</div>
                                <div className="text-2xl font-bold text-accent-400">
                                    {(analytics.timeline.reduce((sum, day) => sum + day.scans, 0) / 7).toFixed(1)}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
