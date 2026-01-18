"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Search, Filter, Trash2, Terminal, Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ScanHistoryItem {
    id: string;
    type: string;
    content: string;
    riskScore: number;
    riskLevel: string;
    timestamp: string;
    classification: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const stored = localStorage.getItem('zyntrix_scan_history');
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    };

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all scan history?')) {
            localStorage.removeItem('zyntrix_scan_history');
            setHistory([]);
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesType;
    });

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'safe': return '#00FF41';
            case 'suspicious': return '#FFD700';
            case 'dangerous': return '#FF0055';
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
                            SCAN HISTORY
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">scan_archive.exe | Complete scan records</p>
                </motion.div>

                {/* Controls */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#00F0FF] focus:outline-none transition-colors font-mono"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'url', 'email', 'sms'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-3 rounded-lg font-mono text-sm transition-all ${filterType === type
                                        ? 'bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF]'
                                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {type.toUpperCase()}
                            </button>
                        ))}
                        <button
                            onClick={clearHistory}
                            className="px-4 py-3 bg-[#FF0055]/20 border border-[#FF0055] rounded-lg hover:bg-[#FF0055]/30 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            CLEAR
                        </button>
                    </div>
                </div>

                {/* History List */}
                {filteredHistory.length === 0 ? (
                    <div className="p-12 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-center">
                        <HistoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 font-mono">No scan history found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((item, index) => {
                            const Icon = getRiskIcon(item.riskLevel);
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border-l-4 relative overflow-hidden hover:bg-black/60 transition-colors"
                                    style={{ borderColor: getRiskColor(item.riskLevel) }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"
                                            style={{ color: getRiskColor(item.riskLevel) }}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-2 py-1 rounded bg-white/10 text-xs font-mono uppercase">{item.type}</span>
                                                <span className="text-sm text-gray-400 font-mono">
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </span>
                                                <span className="px-2 py-1 rounded text-xs font-mono" style={{ color: getRiskColor(item.riskLevel), backgroundColor: `${getRiskColor(item.riskLevel)}20` }}>
                                                    {item.riskScore}/100
                                                </span>
                                            </div>
                                            <p className="text-white font-semibold mb-1">{item.classification}</p>
                                            <p className="text-gray-400 text-sm font-mono truncate">{item.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
