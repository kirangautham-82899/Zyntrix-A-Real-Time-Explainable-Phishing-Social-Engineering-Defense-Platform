"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Shield, AlertTriangle, TrendingUp, Users,
    Wifi, WifiOff, Terminal, CheckCircle2, XCircle
} from 'lucide-react';

interface ThreatItem {
    id: string;
    timestamp: string;
    risk_level: 'safe' | 'suspicious' | 'dangerous';
    risk_score: number;
    url?: string;
    domain?: string;
    type: string;
}

interface ThreatStats {
    total: number;
    dangerous: number;
    suspicious: number;
    safe: number;
}

export default function LiveMonitorPage() {
    const [connected, setConnected] = useState(false);
    const [threats, setThreats] = useState<ThreatItem[]>([]);
    const [stats, setStats] = useState<ThreatStats>({ total: 0, dangerous: 0, suspicious: 0, safe: 0 });
    const [connections, setConnections] = useState(0);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Fetch initial threat feed
        fetchThreatFeed();

        // Connect to WebSocket
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const fetchThreatFeed = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/threats/feed?limit=50');
            const data = await response.json();

            if (data.success) {
                setThreats(data.data.threats);
                setStats(data.data.stats);
                setConnections(data.data.connections);
            }
        } catch (error) {
            console.error('Failed to fetch threat feed:', error);
        }
    };

    const connectWebSocket = () => {
        try {
            const ws = new WebSocket('ws://localhost:8000/api/ws/threats');

            ws.onopen = () => {
                console.log('✅ WebSocket connected to threat feed');
                setConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    switch (message.type) {
                        case 'connection_established':
                            console.log('Connection established:', message.message);
                            break;

                        case 'initial_feed':
                            setThreats(message.data);
                            break;

                        case 'threat_alert':
                            // Add new threat to feed
                            setThreats(prev => [message.data, ...prev].slice(0, 50));
                            break;

                        case 'scan_complete':
                            // Add scan result to feed
                            setThreats(prev => [message.data, ...prev].slice(0, 50));
                            break;

                        case 'stats_update':
                            setStats(message.data);
                            break;

                        case 'heartbeat':
                            // Heartbeat received, connection is alive
                            break;

                        default:
                            console.log('Unknown message type:', message.type);
                    }
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                }
            };

            ws.onclose = (event) => {
                console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason || 'No reason provided');
                setConnected(false);

                // Attempt to reconnect after 5 seconds
                console.log('Attempting to reconnect in 5 seconds...');
                setTimeout(connectWebSocket, 5000);
            };

            ws.onerror = (error) => {
                console.warn('⚠️ WebSocket connection issue (this is normal during initial connection)');
                // Don't log the error object itself as it's usually empty
                setConnected(false);
            };

            wsRef.current = ws;
        } catch (err) {
            console.error('Failed to create WebSocket connection:', err);
            setConnected(false);
            // Retry after 5 seconds
            setTimeout(connectWebSocket, 5000);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'safe': return '#10B981';
            case 'suspicious': return '#F59E0B';
            case 'dangerous': return '#EF4444';
            default: return '#666';
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'safe': return CheckCircle2;
            case 'suspicious': return AlertTriangle;
            case 'dangerous': return XCircle;
            default: return Shield;
        }
    };

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
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-8 h-8 text-[#3B82F6]" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                                LIVE THREAT MONITOR
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            {connected ? (
                                <>
                                    <Wifi className="w-5 h-5 text-[#10B981]" />
                                    <span className="text-[#10B981] font-mono text-sm">CONNECTED</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-5 h-5 text-[#EF4444]" />
                                    <span className="text-[#EF4444] font-mono text-sm">DISCONNECTED</span>
                                </>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">live_monitor.exe | Real-time threat detection feed</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { icon: Activity, label: 'Total Threats', value: stats.total, color: '#3B82F6' },
                        { icon: XCircle, label: 'Dangerous', value: stats.dangerous, color: '#EF4444' },
                        { icon: AlertTriangle, label: 'Suspicious', value: stats.suspicious, color: '#F59E0B' },
                        { icon: CheckCircle2, label: 'Safe', value: stats.safe, color: '#10B981' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                            </div>
                            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="text-gray-400 text-sm font-mono">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Active Connections */}
                <div className="mb-8 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#06B6D4]" />
                        <span className="text-gray-300 font-mono text-sm">Active Connections:</span>
                    </div>
                    <span className="text-[#06B6D4] font-bold font-mono">{connections}</span>
                </div>

                {/* Threat Feed */}
                <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                        <h2 className="text-2xl font-bold">Live Threat Feed</h2>
                    </div>

                    {threats.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 font-mono">No threats detected yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {threats.map((threat, index) => {
                                const Icon = getRiskIcon(threat.risk_level);
                                return (
                                    <motion.div
                                        key={threat.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 rounded-lg bg-white/5 border-l-4 hover:bg-white/10 transition-colors"
                                        style={{ borderColor: getRiskColor(threat.risk_level) }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"
                                                style={{ color: getRiskColor(threat.risk_level) }}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-1 rounded bg-white/10 text-xs font-mono uppercase">
                                                        {threat.type}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {new Date(threat.timestamp).toLocaleTimeString()}
                                                    </span>
                                                    <span className="px-2 py-1 rounded text-xs font-mono"
                                                        style={{
                                                            color: getRiskColor(threat.risk_level),
                                                            backgroundColor: `${getRiskColor(threat.risk_level)}20`
                                                        }}
                                                    >
                                                        {threat.risk_score}/100
                                                    </span>
                                                </div>
                                                <p className="text-white font-semibold mb-1">{threat.risk_level.toUpperCase()}</p>
                                                {threat.url && (
                                                    <p className="text-gray-400 text-sm font-mono truncate">{threat.url}</p>
                                                )}
                                                {threat.domain && (
                                                    <p className="text-gray-500 text-xs font-mono">Domain: {threat.domain}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}</div>
                    )}
                </div>
            </main>
        </div>
    );
}
