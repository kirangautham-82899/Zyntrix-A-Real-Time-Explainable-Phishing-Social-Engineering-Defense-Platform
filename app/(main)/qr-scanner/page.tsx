"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, Terminal, Scan, CheckCircle2, AlertTriangle, XCircle, Shield, TrendingUp } from 'lucide-react';

type RiskLevel = 'safe' | 'suspicious' | 'dangerous';

interface QRResult {
    qrDetected: boolean;
    qrData: string;
    urlFound: boolean;
    extractedUrl?: string;
    url?: string;
    domain?: string;
    riskScore: number;
    riskLevel: RiskLevel;
    classification: string;
    explanation?: string;
    factors?: Array<{
        name: string;
        impact: 'positive' | 'negative' | 'neutral';
        description: string;
    }>;
    recommendations?: string[];
}

export default function QRScannerPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<QRResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
            setScanResult(null);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScan = async () => {
        if (!selectedFile) return;

        setIsScanning(true);
        setError(null);
        setScanResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('http://localhost:8000/api/analyze/qr', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'QR code analysis failed');
            }

            if (data.success && data.data) {
                const result: QRResult = {
                    qrDetected: data.data.qr_detected,
                    qrData: data.data.qr_data,
                    urlFound: data.data.url_found,
                    extractedUrl: data.data.extracted_url,
                    url: data.data.url,
                    domain: data.data.domain,
                    riskScore: data.data.risk_score,
                    riskLevel: data.data.risk_level,
                    classification: data.data.classification,
                    explanation: data.data.explanation,
                    factors: data.data.factors,
                    recommendations: data.data.recommendations,
                };
                setScanResult(result);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze QR code');
        } finally {
            setIsScanning(false);
        }
    };

    const getRiskColor = (level: RiskLevel) => {
        switch (level) {
            case 'safe': return '#10B981';
            case 'suspicious': return '#F59E0B';
            case 'dangerous': return '#EF4444';
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

            <main className="relative max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-8 h-8 text-[#3B82F6]" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                            QR CODE SCANNER
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">qr_analyzer.exe | Image-based threat detection</p>
                </motion.div>

                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-[#3B82F6]/30 mb-8"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]" />

                    {previewUrl ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center">
                                <img src={previewUrl} alt="QR Code Preview" className="max-w-md max-h-96 rounded-lg border-2 border-white/20" />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                                            <span>ANALYZE QR CODE</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                        setScanResult(null);
                                        setError(null);
                                    }}
                                    className="px-6 py-3 border border-white/20 rounded-lg font-bold hover:bg-white/5 transition-colors"
                                >
                                    CLEAR
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-16 text-center hover:border-[#3B82F6]/50 transition-colors">
                            <input
                                type="file"
                                id="qr-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                            <label htmlFor="qr-upload" className="cursor-pointer block">
                                <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold mb-2">Upload QR Code</h3>
                                <p className="text-gray-400 mb-6 font-mono">Drag and drop or click to select</p>
                                <div className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg font-bold hover:scale-105 transition-transform inline-flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    SELECT IMAGE
                                </div>
                                <p className="text-sm text-gray-500 mt-4 font-mono">Supports JPG, PNG, WebP</p>
                            </label>
                        </div>
                    )}
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-xl bg-[#EF4444]/10 border border-[#EF4444] mb-8"
                    >
                        <div className="flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-[#EF4444]" />
                            <p className="text-white font-semibold">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Results */}
                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* QR Data Info */}
                        <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <QrCode className="w-5 h-5 text-[#3B82F6]" />
                                QR Code Data
                            </h3>
                            <div className="bg-white/5 rounded-lg p-4 font-mono text-sm break-all">
                                {scanResult.qrData}
                            </div>
                            {scanResult.urlFound && (
                                <div className="mt-4">
                                    <p className="text-gray-400 text-sm mb-2">Extracted URL:</p>
                                    <div className="bg-white/5 rounded-lg p-4 font-mono text-sm break-all text-[#3B82F6]">
                                        {scanResult.extractedUrl}
                                    </div>
                                </div>
                            )}
                        </div>

                        {scanResult.urlFound && scanResult.explanation && (
                            <>
                                {/* Risk Assessment */}
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
                                    {scanResult.factors && scanResult.factors.length > 0 && (
                                        <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                                                <h4 className="text-xl font-bold">Detection Factors</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {scanResult.factors.map((factor, index) => (
                                                    <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                        <div className="flex items-start gap-2">
                                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0`}
                                                                style={{
                                                                    backgroundColor: factor.impact === 'positive' ? '#10B981' :
                                                                        factor.impact === 'negative' ? '#EF4444' : '#666'
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
                                    )}

                                    {/* Recommendations */}
                                    {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                                        <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Shield className="w-5 h-5 text-[#06B6D4]" />
                                                <h4 className="text-xl font-bold">Recommendations</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {scanResult.recommendations.map((rec, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                                                        <p className="text-gray-300">{rec}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {/* Info */}
                {!scanResult && !error && (
                    <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Scan className="w-5 h-5 text-[#3B82F6]" />
                            How it works
                        </h4>
                        <p className="text-sm text-gray-400 font-mono">
                            Upload a QR code image and our AI will extract the URL, then analyze it for phishing attempts, malware, and other threats. Results are instant and secure.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
