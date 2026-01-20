"use client";

import { motion } from 'framer-motion';
import { Terminal, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

const threatData = [
    { type: 'BLOCKED', threat: 'Phishing attempt detected', ip: '192.168.1.45', severity: 'HIGH' },
    { type: 'SCANNED', threat: 'URL verification complete', ip: '10.0.0.23', severity: 'SAFE' },
    { type: 'BLOCKED', threat: 'Malware signature found', ip: '172.16.0.89', severity: 'CRITICAL' },
    { type: 'ALERT', threat: 'Suspicious email content', ip: '192.168.1.12', severity: 'MEDIUM' },
    { type: 'SCANNED', threat: 'QR code validated', ip: '10.0.0.56', severity: 'SAFE' },
    { type: 'BLOCKED', threat: 'SQL injection blocked', ip: '10.5.3.21', severity: 'CRITICAL' },
    { type: 'ALERT', threat: 'Unusual login pattern', ip: '172.20.1.99', severity: 'MEDIUM' },
    { type: 'SCANNED', threat: 'File scan completed', ip: '192.168.5.10', severity: 'SAFE' },
];

export default function ThreatMonitor() {
    const [threats, setThreats] = useState(threatData.slice(0, 5));
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update time every second
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Add new threat every 3 seconds
        const threatInterval = setInterval(() => {
            setThreats(prev => {
                const newThreat = threatData[Math.floor(Math.random() * threatData.length)];
                const updated = [newThreat, ...prev];
                return updated.slice(0, 8); // Keep only last 8
            });
        }, 3000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(threatInterval);
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour12: false });
    };

    return (
        <section id="threat-monitor" className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            LIVE THREAT MONITOR
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400">Real-time cyber threat detection across the network</p>
                </motion.div>

                {/* Terminal-style threat log */}
                <div className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 font-mono text-sm relative overflow-hidden">
                    {/* Scanning line effect */}
                    <motion.div
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                        animate={{ y: [0, 400] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">threat_monitor.log</span>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="ml-2 flex items-center gap-1 text-xs text-green-400"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            LIVE
                        </motion.div>
                        <div className="ml-auto flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-hidden">
                        {threats.map((log, i) => (
                            <motion.div
                                key={`${log.ip}-${i}`}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                    transition: { duration: 0.2 }
                                }}
                                className="flex items-center gap-4 text-xs p-2 rounded cursor-pointer border border-transparent hover:border-blue-500/30"
                            >
                                <span className="text-gray-500 w-20">[{formatTime(currentTime)}]</span>
                                <span className={`px-2 py-1 rounded font-semibold ${log.type === 'BLOCKED' ? 'bg-red-500/20 text-red-400' :
                                        log.type === 'SCANNED' ? 'bg-green-500/20 text-green-400' :
                                            'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {log.type}
                                </span>
                                <span className="text-gray-300 flex-1">{log.threat}</span>
                                <span className="text-blue-400 font-mono">{log.ip}</span>
                                <motion.span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                            log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                log.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-green-500/20 text-green-400'
                                        }`}
                                    animate={log.severity === 'CRITICAL' ? {
                                        boxShadow: ['0 0 0px rgba(239, 68, 68, 0)', '0 0 10px rgba(239, 68, 68, 0.5)', '0 0 0px rgba(239, 68, 68, 0)']
                                    } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    {log.severity}
                                </motion.span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-500">Total Scans: <span className="text-blue-400 font-semibold">1,234</span></span>
                            <span className="text-gray-500">Threats Blocked: <span className="text-red-400 font-semibold">89</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Auto-updating every 3s</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
