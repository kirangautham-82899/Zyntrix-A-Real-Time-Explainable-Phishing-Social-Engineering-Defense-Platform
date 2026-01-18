"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, Terminal, Scan } from 'lucide-react';

export default function QRScannerPage() {
    const [isScanning, setIsScanning] = useState(false);

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

            <main className="relative max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-8 h-8 text-[#00F0FF]" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                            QR CODE SCANNER
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">qr_analyzer.exe | Image-based threat detection</p>
                </motion.div>

                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-[#00F0FF]/30 mb-8"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] to-[#B026FF]" />

                    <div className="border-2 border-dashed border-white/20 rounded-lg p-16 text-center hover:border-[#00F0FF]/50 transition-colors">
                        <input
                            type="file"
                            id="qr-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    console.log('QR image selected:', file.name);
                                    // TODO: Implement QR code scanning logic
                                }
                            }}
                        />
                        <label htmlFor="qr-upload" className="cursor-pointer block">
                            <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold mb-2">Upload QR Code</h3>
                            <p className="text-gray-400 mb-6 font-mono">Drag and drop or click to select</p>
                            <div className="px-8 py-3 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-lg font-bold hover:scale-105 transition-transform inline-flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                SELECT IMAGE
                            </div>
                            <p className="text-sm text-gray-500 mt-4 font-mono">Supports JPG, PNG, WebP</p>
                        </label>
                    </div>
                </motion.div>

                {/* Info */}
                <div className="p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Scan className="w-5 h-5 text-[#00F0FF]" />
                        How it works
                    </h4>
                    <p className="text-sm text-gray-400 font-mono">
                        Upload a QR code image and our AI will extract the URL, then analyze it for phishing attempts, malware, and other threats. Results are instant and secure.
                    </p>
                </div>
            </main>
        </div>
    );
}
