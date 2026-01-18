"use client";

import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import {
    History, Clock, Shield, TrendingUp, Filter,
    Search, Calendar, Link as LinkIcon, Mail, MessageSquare,
    AlertTriangle, CheckCircle2, XCircle, Download, Trash2
} from 'lucide-react';

type ScanType = 'url' | 'email' | 'sms' | 'all';
type RiskLevel = 'safe' | 'suspicious' | 'dangerous' | 'all';

interface HistoryItem {
    id: string;
    type: ScanType;
    content: string;
    riskScore: number;
    riskLevel: 'safe' | 'suspicious' | 'dangerous';
    timestamp: Date;
    classification: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
    const [typeFilter, setTypeFilter] = useState<ScanType>('all');
    const [riskFilter, setRiskFilter] = useState<RiskLevel>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('zyntrix_scan_history');
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            // Convert timestamp strings back to Date objects
            const withDates = parsed.map((item: any) => ({
                ...item,
                timestamp: new Date(item.timestamp)
            }));
            setHistory(withDates);
            setFilteredHistory(withDates);
        }
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = history;

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(item => item.type === typeFilter);
        }

        // Risk filter
        if (riskFilter !== 'all') {
            filtered = filtered.filter(item => item.riskLevel === riskFilter);
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.classification.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredHistory(filtered);
    }, [typeFilter, riskFilter, searchQuery, history]);

    // Calculate statistics
    const stats = {
        total: history.length,
        safe: history.filter(h => h.riskLevel === 'safe').length,
        suspicious: history.filter(h => h.riskLevel === 'suspicious').length,
        dangerous: history.filter(h => h.riskLevel === 'dangerous').length,
        byType: {
            url: history.filter(h => h.type === 'url').length,
            email: history.filter(h => h.type === 'email').length,
            sms: history.filter(h => h.type === 'sms').length,
        }
    };

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all scan history?')) {
            localStorage.removeItem('zyntrix_scan_history');
            setHistory([]);
            setFilteredHistory([]);
        }
    };

    const exportHistory = () => {
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `zyntrix-history-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'safe': return 'success';
            case 'suspicious': return 'warning';
            case 'dangerous': return 'danger';
            default: return 'default';
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'url': return LinkIcon;
            case 'email': return Mail;
            case 'sms': return MessageSquare;
            default: return Shield;
        }
    };

    return (
        <main className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="info" size="lg" className="mb-6">Detection History</Badge>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="text-gradient-primary">Scan History</span>
                        <br />
                        <span className="text-dark-100">& Analytics</span>
                    </h1>
                    <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                        Track all your threat scans and view detailed analytics
                    </p>
                </div>

                {/* Statistics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card variant="glow" className="text-center">
                        <Shield className="w-12 h-12 text-primary-400 mx-auto mb-3" />
                        <div className="text-4xl font-bold text-dark-100 mb-1">{stats.total}</div>
                        <div className="text-dark-400">Total Scans</div>
                    </Card>

                    <Card variant="default" className="text-center border-success-500/30">
                        <CheckCircle2 className="w-12 h-12 text-success-400 mx-auto mb-3" />
                        <div className="text-4xl font-bold text-success-400 mb-1">{stats.safe}</div>
                        <div className="text-dark-400">Safe</div>
                    </Card>

                    <Card variant="default" className="text-center border-warning-500/30">
                        <AlertTriangle className="w-12 h-12 text-warning-400 mx-auto mb-3" />
                        <div className="text-4xl font-bold text-warning-400 mb-1">{stats.suspicious}</div>
                        <div className="text-dark-400">Suspicious</div>
                    </Card>

                    <Card variant="default" className="text-center border-danger-500/30">
                        <XCircle className="w-12 h-12 text-danger-400 mx-auto mb-3" />
                        <div className="text-4xl font-bold text-danger-400 mb-1">{stats.dangerous}</div>
                        <div className="text-dark-400">Dangerous</div>
                    </Card>
                </div>

                {/* Filters and Actions */}
                <Card variant="neon" className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="text"
                                    placeholder="Search scans..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input pl-10 w-full"
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as ScanType)}
                            className="input min-w-[150px]"
                        >
                            <option value="all">All Types</option>
                            <option value="url">URL</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                        </select>

                        {/* Risk Filter */}
                        <select
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value as RiskLevel)}
                            className="input min-w-[150px]"
                        >
                            <option value="all">All Risks</option>
                            <option value="safe">Safe</option>
                            <option value="suspicious">Suspicious</option>
                            <option value="dangerous">Dangerous</option>
                        </select>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button variant="ghost" icon={Download} onClick={exportHistory}>
                                Export
                            </Button>
                            <Button variant="ghost" icon={Trash2} onClick={clearHistory}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* History List */}
                {filteredHistory.length === 0 ? (
                    <Card variant="default" className="text-center py-12">
                        <History className="w-16 h-16 text-dark-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-dark-200 mb-2">No Scan History</h3>
                        <p className="text-dark-400 mb-6">
                            {history.length === 0
                                ? "Start scanning URLs, emails, or SMS messages to build your history"
                                : "No scans match your current filters"}
                        </p>
                        {history.length === 0 && (
                            <Button variant="primary" onClick={() => window.location.href = '/scanner'}>
                                Start Scanning
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((item) => {
                            const RiskIcon = getRiskIcon(item.riskLevel);
                            const TypeIcon = getTypeIcon(item.type);

                            return (
                                <Card key={item.id} variant="default" className="hover:border-primary-500/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        {/* Risk Indicator */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${item.riskLevel === 'safe' ? 'bg-success-500/20 text-success-400' :
                                                item.riskLevel === 'suspicious' ? 'bg-warning-500/20 text-warning-400' :
                                                    'bg-danger-500/20 text-danger-400'
                                            }`}>
                                            <RiskIcon className="w-6 h-6" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TypeIcon className="w-4 h-4 text-dark-400" />
                                                <Badge variant={getRiskColor(item.riskLevel)} size="sm">
                                                    {item.classification}
                                                </Badge>
                                                <Badge variant="default" size="sm">
                                                    {item.type.toUpperCase()}
                                                </Badge>
                                                <span className="text-sm text-dark-500 ml-auto">
                                                    {item.riskScore}/100
                                                </span>
                                            </div>

                                            <p className="text-dark-200 font-mono text-sm mb-2 truncate">
                                                {item.content}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-dark-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {item.timestamp.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Type Breakdown */}
                {history.length > 0 && (
                    <Card variant="default" className="mt-8">
                        <h3 className="text-xl font-bold text-dark-100 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            Scan Breakdown
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="glass rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <LinkIcon className="w-4 h-4 text-primary-400" />
                                    <span className="text-dark-300">URL Scans</span>
                                </div>
                                <div className="text-2xl font-bold text-dark-100">{stats.byType.url}</div>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-accent-400" />
                                    <span className="text-dark-300">Email Scans</span>
                                </div>
                                <div className="text-2xl font-bold text-dark-100">{stats.byType.email}</div>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-warning-400" />
                                    <span className="text-dark-300">SMS Scans</span>
                                </div>
                                <div className="text-2xl font-bold text-dark-100">{stats.byType.sms}</div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </main>
    );
}
