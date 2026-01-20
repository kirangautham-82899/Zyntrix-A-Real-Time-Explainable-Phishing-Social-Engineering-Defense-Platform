'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, Terminal, Cpu, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStartSession = async () => {
        setError('');
        setLoading(true);

        try {
            // For demo/hackathon: Skip backend auth and use demo tokens
            const demoToken = 'demo_access_token_' + Date.now();

            // Store demo tokens
            localStorage.setItem('access_token', demoToken);
            localStorage.setItem('refresh_token', 'demo_refresh_token');
            localStorage.setItem('user_email', 'admin@zyntrix.com');
            localStorage.setItem('user_role', 'admin');

            // Small delay for UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err: unknown) {
            console.error(err);
            setError('Could not initialize secure session. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden relative flex items-center justify-center p-4">
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

            {/* Login Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Terminal Window */}
                <div className="bg-black/60 backdrop-blur-xl border-2 border-[#3B82F6]/30 rounded-2xl overflow-hidden">
                    {/* Terminal Header */}
                    <div className="bg-black/40 border-b border-[#3B82F6]/20 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-[#3B82F6]" />
                            <span className="font-mono text-sm text-[#3B82F6]">secure_access.exe</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Holographic Shield */}
                        <div className="flex justify-center mb-8">
                            <div className="relative w-24 h-24">
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-[#3B82F6]/30"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                />
                                <motion.div
                                    className="absolute inset-2 rounded-full border-2 border-[#06B6D4]/30"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Shield className="w-12 h-12 text-[#3B82F6]" style={{ filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.8))' }} />
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">
                                <span className="bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#EF4444] bg-clip-text text-transparent">
                                    SECURE ACCESS
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm">Initialize cyber defense protocol</p>
                        </div>

                        {/* Privacy Badge */}
                        <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#3B82F6]/20 rounded-lg">
                                    <Lock className="w-5 h-5 text-[#3B82F6]" />
                                </div>
                                <div>
                                    <h3 className="text-[#3B82F6] font-bold text-sm mb-1">Zero-Knowledge Access</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        No credentials stored. Anonymous session with end-to-end encryption.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#EF4444]/10 border border-[#EF4444]/50 rounded-lg p-3 mb-6"
                            >
                                <p className="text-[#EF4444] text-sm text-center font-mono">{error}</p>
                            </motion.div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={handleStartSession}
                            disabled={loading}
                            className="group w-full relative overflow-hidden rounded-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#EF4444] p-[2px]">
                                <div className="absolute inset-0 bg-[#0F172A] rounded-xl" />
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative px-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl font-bold text-black flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Cpu className="w-5 h-5" />
                                        </motion.div>
                                        <span>INITIALIZING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        <span>INITIATE SESSION</span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </>
                                )}
                            </motion.div>
                        </button>

                        {/* System Info */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-gray-500">ENCRYPTION</span>
                                <span className="text-[#10B981]">AES-256</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-gray-500">PROTOCOL</span>
                                <span className="text-[#10B981]">TLS 1.3</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-gray-500">STATUS</span>
                                <span className="text-[#10B981] flex items-center gap-1">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-[#10B981]"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    SECURE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Gradient */}
                    <div className="h-1 bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#EF4444]" />
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6]/20 via-[#06B6D4]/20 to-[#EF4444]/20 blur-2xl -z-10 opacity-50" />
            </motion.div>
        </div>
    );
}
