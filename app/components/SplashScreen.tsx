"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    useEffect(() => {
        // Generate random particles
        const newParticles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2
        }));
        setParticles(newParticles);

        // Progress animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + 1.5;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="fixed inset-0 z-50 bg-[#0F172A] flex items-center justify-center overflow-hidden"
            >
                {/* Floating Particles */}
                <div className="absolute inset-0">
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.6, 0.2],
                                scale: [1, 1.5, 1]
                            }}
                            transition={{
                                duration: 3 + particle.delay,
                                repeat: Infinity,
                                delay: particle.delay,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Radial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-transparent" />

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center px-4">

                    {/* Minimalist Shield Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            duration: 1
                        }}
                        className="mb-12 relative"
                    >
                        {/* Pulsing Rings */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 border border-blue-400/20 rounded-full"
                                style={{
                                    width: `${120 + i * 30}px`,
                                    height: `${120 + i * 30}px`,
                                    left: `${-15 - i * 15}px`,
                                    top: `${-15 - i * 15}px`,
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0, 0.3]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.4
                                }}
                            />
                        ))}

                        {/* Shield Icon */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(59, 130, 246, 0.3)',
                                        '0 0 40px rgba(59, 130, 246, 0.6)',
                                        '0 0 20px rgba(59, 130, 246, 0.3)',
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl"
                            />
                            <Shield className="w-16 h-16 md:w-20 md:h-20 text-blue-400 relative z-10" strokeWidth={1.5} />
                        </div>
                    </motion.div>

                    {/* Animated Text - Letter by Letter */}
                    <div className="mb-8 overflow-hidden">
                        <div className="flex gap-1 md:gap-2">
                            {['Z', 'Y', 'N', 'T', 'R', 'I', 'X'].map((letter, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: 0.5 + i * 0.08,
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20
                                    }}
                                    className="text-5xl md:text-7xl font-bold text-slate-100"
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Subtitle with Fade In */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="text-slate-400 text-sm md:text-base tracking-[0.4em] uppercase mb-16"
                    >
                        Cyber Defense
                    </motion.p>

                    {/* Elegant Progress Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5 }}
                        className="w-full max-w-md"
                    >
                        {/* Progress Container */}
                        <div className="relative">
                            {/* Background Track */}
                            <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                                {/* Animated Progress */}
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 relative"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    {/* Moving Shine */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                        animate={{
                                            x: ['-100%', '200%']
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                </motion.div>
                            </div>

                            {/* Percentage Display */}
                            <motion.div
                                className="flex justify-between items-center mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8 }}
                            >
                                <span className="text-xs text-slate-500 font-mono">Loading...</span>
                                <span className="text-sm text-blue-400 font-mono tabular-nums">
                                    {Math.round(progress)}%
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Status Dots */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="flex gap-2 mt-12"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-blue-400"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Minimal Corner Accents */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 w-12 h-12 md:w-16 md:h-16 border-l-2 border-t-2 border-blue-500/30 rounded-tl-lg" />
                <div className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 border-r-2 border-t-2 border-blue-500/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-12 h-12 md:w-16 md:h-16 border-l-2 border-b-2 border-blue-500/30 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-12 h-12 md:w-16 md:h-16 border-r-2 border-b-2 border-blue-500/30 rounded-br-lg" />
            </motion.div>
        </AnimatePresence>
    );
}
