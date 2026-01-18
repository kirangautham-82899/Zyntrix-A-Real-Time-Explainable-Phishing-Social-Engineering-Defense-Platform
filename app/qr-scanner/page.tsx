"use client";

import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import { Card, Badge, Button } from '@/components/ui';
import { QrCode, Download, AlertTriangle } from 'lucide-react';

export default function QRScannerDemo() {
    const [extractedUrl, setExtractedUrl] = useState<string>('');
    const [scanCount, setScanCount] = useState(0);

    const handleScan = (url: string) => {
        setExtractedUrl(url);
        setScanCount(prev => prev + 1);
        console.log('Scanned URL:', url);
    };

    const handleError = (error: string) => {
        console.error('Scan error:', error);
    };

    // Generate sample QR code URL
    const generateSampleQR = (text: string) => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    };

    const sampleURLs = [
        'https://example.com',
        'https://phishing-test.example.com/verify-account',
        'https://192.168.1.1/login',
    ];

    return (
        <main className="min-h-screen py-20 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="info" size="lg" className="mb-6">QR Code Scanner</Badge>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="text-gradient-primary">QR Code</span>
                        <br />
                        <span className="text-dark-100">Threat Detection</span>
                    </h1>
                    <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                        Upload QR code images to extract and analyze embedded URLs for phishing threats
                    </p>
                </div>

                {/* Scanner */}
                <Card variant="neon" className="mb-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-700">
                        <div className="w-3 h-3 rounded-full bg-danger-500 pulse-glow"></div>
                        <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                        <div className="w-3 h-3 rounded-full bg-success-500"></div>
                        <span className="text-sm text-dark-400 ml-auto font-mono">QR Scanner v1.0</span>
                    </div>

                    <QRScanner onScan={handleScan} onError={handleError} />
                </Card>

                {/* Stats */}
                {scanCount > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card variant="default" className="text-center">
                            <div className="text-3xl font-bold text-primary-400 mb-1">{scanCount}</div>
                            <div className="text-sm text-dark-400">QR Codes Scanned</div>
                        </Card>
                        <Card variant="default" className="text-center">
                            <div className="text-3xl font-bold text-success-400 mb-1">100%</div>
                            <div className="text-sm text-dark-400">Success Rate</div>
                        </Card>
                        <Card variant="default" className="text-center">
                            <div className="text-3xl font-bold text-accent-400 mb-1">&lt;2s</div>
                            <div className="text-sm text-dark-400">Avg Scan Time</div>
                        </Card>
                    </div>
                )}

                {/* Sample QR Codes */}
                <Card variant="default">
                    <div className="flex items-center gap-2 mb-6">
                        <Download className="w-5 h-5 text-primary-400" />
                        <h3 className="text-xl font-bold text-dark-100">Test QR Codes</h3>
                        <Badge variant="info" size="sm">For Testing</Badge>
                    </div>

                    <p className="text-dark-400 mb-6">
                        Download these sample QR codes to test the scanner:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sampleURLs.map((url, index) => (
                            <div key={index} className="glass rounded-lg p-4 text-center">
                                <div className="bg-white p-3 rounded-lg mb-3 inline-block">
                                    <img
                                        src={generateSampleQR(url)}
                                        alt={`QR Code ${index + 1}`}
                                        className="w-40 h-40"
                                    />
                                </div>
                                <p className="text-xs text-dark-400 break-all mb-2">{url}</p>
                                <Badge
                                    variant={index === 0 ? 'success' : index === 1 ? 'warning' : 'danger'}
                                    size="sm"
                                >
                                    {index === 0 ? 'Safe' : index === 1 ? 'Suspicious' : 'Dangerous'}
                                </Badge>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 glass rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-warning-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-warning-400 mb-1">How to Test</h4>
                                <ol className="text-sm text-dark-400 space-y-1 list-decimal list-inside">
                                    <li>Right-click on any QR code above and save the image</li>
                                    <li>Click the upload area above</li>
                                    <li>Select the saved QR code image</li>
                                    <li>The URL will be automatically extracted</li>
                                    <li>Click "Analyze This URL" to scan for threats</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card variant="default">
                        <QrCode className="w-8 h-8 text-primary-400 mb-3" />
                        <h4 className="font-bold text-dark-100 mb-2">Instant Extraction</h4>
                        <p className="text-sm text-dark-400">
                            Automatically extracts URLs from QR codes in under 2 seconds using advanced image processing
                        </p>
                    </Card>

                    <Card variant="default">
                        <AlertTriangle className="w-8 h-8 text-accent-400 mb-3" />
                        <h4 className="font-bold text-dark-100 mb-2">Threat Analysis</h4>
                        <p className="text-sm text-dark-400">
                            Extracted URLs are automatically analyzed for phishing and malicious content
                        </p>
                    </Card>
                </div>
            </div>
        </main>
    );
}
