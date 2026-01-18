"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, CheckCircle2, XCircle, Database, Zap } from 'lucide-react';

export default function APITestPage() {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState<any>(null);

    const testAPI = async () => {
        setTesting(true);
        try {
            const response = await fetch('http://localhost:8000/api/health');
            const data = await response.json();
            setResults({ success: true, data });
        } catch (error) {
            setResults({ success: false, error: 'Connection failed' });
        } finally {
            setTesting(false);
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
                            API TESTING
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">system_diagnostics.exe | Backend connectivity check</p>
                </motion.div>

                {/* Test Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-[#00F0FF]/30 mb-8"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] to-[#B026FF]" />

                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">Backend Health Check</h3>
                        <p className="text-gray-400 font-mono text-sm">Test connection to http://localhost:8000</p>
                    </div>

                    <button
                        onClick={testAPI}
                        disabled={testing}
                        className="w-full px-6 py-4 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {testing ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Activity className="w-5 h-5" />
                                </motion.div>
                                <span>TESTING...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                <span>RUN TEST</span>
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Results */}
                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-xl bg-black/40 backdrop-blur-xl border-l-4 ${results.success ? 'border-[#00FF41]' : 'border-[#FF0055]'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${results.success ? 'text-[#00FF41]' : 'text-[#FF0055]'
                                }`}>
                                {results.success ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-xl font-bold mb-2 ${results.success ? 'text-[#00FF41]' : 'text-[#FF0055]'}`}>
                                    {results.success ? 'CONNECTION SUCCESSFUL' : 'CONNECTION FAILED'}
                                </h4>
                                <pre className="text-sm text-gray-400 font-mono bg-black/40 p-4 rounded-lg overflow-x-auto">
                                    {JSON.stringify(results.success ? results.data : { error: results.error }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* System Info */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                        { label: 'API Endpoint', value: ':8000', icon: Database, color: '#00F0FF' },
                        { label: 'Protocol', value: 'HTTP', icon: Activity, color: '#B026FF' },
                        { label: 'Status', value: results?.success ? 'ONLINE' : 'UNKNOWN', icon: Zap, color: results?.success ? '#00FF41' : '#666' },
                    ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-center">
                            <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                            <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="text-xs text-gray-400 font-mono">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
