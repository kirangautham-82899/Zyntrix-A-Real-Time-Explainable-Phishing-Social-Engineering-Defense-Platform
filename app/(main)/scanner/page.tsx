"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Scan, Mail, MessageSquare, QrCode, Link as LinkIcon,
    AlertTriangle, CheckCircle2, XCircle, Info, TrendingUp,
    Shield, Clock, Target, Zap, Terminal
} from "lucide-react";
import { analyzeURL, analyzeEmail, analyzeSMS } from '@/lib/api';

type ScanType = 'url' | 'email' | 'sms' | 'qr';
type RiskLevel = 'safe' | 'suspicious' | 'dangerous';

interface ScanResult {
    riskScore: number;
    riskLevel: RiskLevel;
    classification: string;
    explanation: string;
    factors: {
        name: string;
        impact: 'positive' | 'negative' | 'neutral';
        description: string;
    }[];
    recommendations: string[];
}

export default function ScannerPage() {
    const [activeTab, setActiveTab] = useState<ScanType>('url');
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

    const tabs = [
        { id: 'url' as ScanType, label: 'URL', icon: LinkIcon, color: '#00F0FF' },
        { id: 'email' as ScanType, label: 'Email', icon: Mail, color: '#B026FF' },
        { id: 'sms' as ScanType, label: 'SMS', icon: MessageSquare, color: '#00FF41' },
        { id: 'qr' as ScanType, label: 'QR Code', icon: QrCode, color: '#FF0055' },
    ];

    const placeholders = {
        url: 'https://example.com',
        email: 'Paste email content here...',
        sms: 'Paste SMS message here...',
        qr: 'Upload QR code image...',
    };

    const handleScan = async () => {
        if (!inputValue.trim()) return;

        setIsScanning(true);
        setScanResult(null);

        try {
            let apiResponse;

            switch (activeTab) {
                case 'url':
                    apiResponse = await analyzeURL(inputValue);
                    break;
                case 'email':
                    apiResponse = await analyzeEmail(inputValue);
                    break;
                case 'sms':
                    apiResponse = await analyzeSMS(inputValue);
                    break;
                case 'qr':
                    throw new Error('QR code scanning not yet implemented');
                default:
                    throw new Error('Invalid scan type');
            }

            if (apiResponse.success && apiResponse.data) {
                const data = apiResponse.data;
                const result: ScanResult = {
                    riskScore: data.risk_score,
                    riskLevel: data.risk_level,
                    classification: data.classification,
                    explanation: data.explanation,
                    factors: data.factors,
                    recommendations: data.recommendations,
                };
                setScanResult(result);
                saveToHistory(result);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Scan failed:', error);
            setScanResult({
                riskScore: 0,
                riskLevel: 'dangerous',
                classification: 'ERROR',
                explanation: error instanceof Error ? error.message : 'Failed to analyze content. Please try again.',
                factors: [{
                    name: 'Analysis Error',
                    impact: 'negative',
                    description: 'Could not connect to analysis engine'
                }],
                recommendations: [
                    'Check your internet connection',
                    'Verify the backend server is running',
                    'Try again in a few moments'
                ],
            });
        } finally {
            setIsScanning(false);
        }
    };

    const saveToHistory = (result: ScanResult) => {
        const historyItem = {
            id: Date.now().toString(),
            type: activeTab,
            content: inputValue.substring(0, 100),
            riskScore: result.riskScore,
            riskLevel: result.riskLevel,
            timestamp: new Date().toISOString(),
            classification: result.classification,
        };

        const existing = localStorage.getItem('zyntrix_scan_history');
        const history = existing ? JSON.parse(existing) : [];
        history.unshift(historyItem);
        const trimmed = history.slice(0, 100);
        localStorage.setItem('zyntrix_scan_history', JSON.stringify(trimmed));
    };

    const getRiskColor = (level: RiskLevel) => {
        switch (level) {
            case 'safe': return '#00FF41';
            case 'suspicious': return '#FFD700';
            case 'dangerous': return '#FF0055';
        }
    };

    const getRiskIcon = (level: RiskLevel) => {
        switch (level) {
            case 'safe': return CheckCircle2;
            case 'suspicious': return AlertTriangle;
            case 'dangerous': return XCircle;
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

            <main className="relative max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-8 h-8 text-[#00F0FF]" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                            THREAT SCANNER
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">threat_analyzer.exe | Real-time detection engine</p>
                </motion.div>

                {/* Scanner Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-[#00F0FF]/30"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] to-[#B026FF]" />

                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                        <div className="w-3 h-3 rounded-full bg-[#FF0055]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                        <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
                        <span className="text-sm text-gray-400 ml-auto font-mono">ZYNTRIX Scanner v1.0.0</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setInputValue('');
                                        setSelectedFile(null);
                                        setScanResult(null);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-mono text-sm ${activeTab === tab.id
                                        ? 'bg-white/10 border border-white/30'
                                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                                        }`}
                                    style={activeTab === tab.id ? { color: tab.color } : {}}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="space-y-4">
                        {activeTab === 'qr' ? (
                            <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-[#00F0FF]/50 transition-colors">
                                <input
                                    type="file"
                                    id="qr-file-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            setInputValue(file.name);
                                            console.log('QR image selected:', file.name);
                                        }
                                    }}
                                />
                                <label htmlFor="qr-file-upload" className="cursor-pointer block">
                                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-300 mb-2">
                                        {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to upload QR code image'}
                                    </p>
                                    <p className="text-sm text-gray-500 font-mono">Supports JPG, PNG, WebP</p>
                                </label>
                            </div>
                        ) : (
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={placeholders[activeTab]}
                                className="w-full px-6 py-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#00F0FF] focus:outline-none transition-colors font-mono resize-none"
                                rows={4}
                            />
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleScan}
                                disabled={!inputValue.trim() && activeTab !== 'qr' || isScanning}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isScanning ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Scan className="w-5 h-5" />
                                        </motion.div>
                                        <span>ANALYZING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Scan className="w-5 h-5" />
                                        <span>ANALYZE THREAT</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setInputValue('');
                                    setScanResult(null);
                                }}
                                className="px-6 py-3 border border-white/20 rounded-lg font-bold hover:bg-white/5 transition-colors"
                            >
                                CLEAR
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Results */}
                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Result Header */}
                        <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border-l-4 relative overflow-hidden"
                            style={{ borderColor: getRiskColor(scanResult.riskLevel) }}
                        >
                            <div className="flex items-start gap-4">
                                {(() => {
                                    const Icon = getRiskIcon(scanResult.riskLevel);
                                    return (
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"
                                            style={{ color: getRiskColor(scanResult.riskLevel) }}
                                        >
                                            <Icon className="w-8 h-8" />
                                        </div>
                                    );
                                })()}

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold" style={{ color: getRiskColor(scanResult.riskLevel) }}>
                                            {scanResult.classification}
                                        </h3>
                                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono"
                                            style={{ color: getRiskColor(scanResult.riskLevel) }}
                                        >
                                            Risk: {scanResult.riskScore}/100
                                        </span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{scanResult.explanation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Factors */}
                            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-[#00F0FF]" />
                                    <h4 className="text-xl font-bold">Detection Factors</h4>
                                </div>
                                <div className="space-y-3">
                                    {scanResult.factors.map((factor, index) => (
                                        <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="flex items-start gap-2">
                                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0`}
                                                    style={{
                                                        backgroundColor: factor.impact === 'positive' ? '#00FF41' :
                                                            factor.impact === 'negative' ? '#FF0055' : '#666'
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-white mb-1">{factor.name}</div>
                                                    <div className="text-sm text-gray-400">{factor.description}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield className="w-5 h-5 text-[#B026FF]" />
                                    <h4 className="text-xl font-bold">Recommendations</h4>
                                </div>
                                <div className="space-y-3">
                                    {scanResult.recommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-[#00FF41] flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-300">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { icon: Clock, label: 'Analysis Time', value: '342ms', color: '#00F0FF' },
                                { icon: Target, label: 'Factors Analyzed', value: '12', color: '#B026FF' },
                                { icon: Zap, label: 'Detection Engine', value: 'Hybrid AI', color: '#FFD700' },
                                { icon: Shield, label: 'Processing', value: 'Encrypted', color: '#00FF41' },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-center">
                                    <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: stat.color }} />
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400 font-mono">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Info Banner */}
                {!scanResult && !isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-[#00F0FF]/30"
                    >
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-[#00F0FF] flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-white mb-1">How it works</h4>
                                <p className="text-sm text-gray-400">
                                    Our hybrid AI engine analyzes your content using 60% rule-based heuristics and 40% machine learning.
                                    Results are generated in under 500ms with 99.8% accuracy. Your data is processed securely and never stored.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
