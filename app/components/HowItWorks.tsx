"use client";

import { motion } from 'framer-motion';
import { Terminal, Cpu, Shield, Zap, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const steps = [
    {
        step: '01',
        title: 'SCAN',
        description: 'Input URL, email, SMS, or QR code into our AI-powered scanner',
        icon: Terminal,
        color: '#3B82F6',
        details: ['Multi-format support', 'Instant processing', 'Secure upload']
    },
    {
        step: '02',
        title: 'ANALYZE',
        description: 'Machine learning models process data in milliseconds using threat intelligence',
        icon: Cpu,
        color: '#06B6D4',
        details: ['ML algorithms', 'Pattern matching', 'Threat database']
    },
    {
        step: '03',
        title: 'PROTECT',
        description: 'Receive instant risk assessment with actionable security recommendations',
        icon: Shield,
        color: '#10B981',
        details: ['Risk scoring', 'Detailed reports', 'Action steps']
    }
];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState<number | null>(null);

    return (
        <section id="how-it-works" className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                                        radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`,
                        backgroundSize: '100% 100%'
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            HOW IT WORKS
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400">Three-step cyber defense protocol</p>
                </motion.div>

                {/* Mobile: Vertical Stack, Desktop: Grid with Connection Line */}
                <div className="relative">
                    {/* Connection Line - Desktop Only */}
                    <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-green-500/50" />

                    {/* Connection Arrows - Mobile Only */}
                    <div className="md:hidden flex flex-col items-center">
                        {steps.map((item, i) => (
                            <div key={i} className="w-full">
                                {/* Step Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    onTouchStart={() => setActiveStep(i)}
                                    onTouchEnd={() => setActiveStep(null)}
                                    className="relative mb-6"
                                >
                                    {/* Step Number Background */}
                                    <motion.div
                                        className="absolute -top-2 -left-2 text-6xl font-bold opacity-5"
                                        style={{ color: item.color }}
                                    >
                                        {item.step}
                                    </motion.div>

                                    {/* Card */}
                                    <div
                                        className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                                        style={{
                                            borderColor: activeStep === i ? `${item.color}40` : undefined
                                        }}
                                    >
                                        {/* Gradient Top Border */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                            style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }}
                                        />

                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div
                                                className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"
                                                style={{ color: item.color }}
                                            >
                                                <item.icon className="w-7 h-7" />
                                            </div>

                                            <div className="flex-1">
                                                {/* Step Badge */}
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                                                    <Zap className="w-3 h-3" style={{ color: item.color }} />
                                                    <span className="text-xs font-mono" style={{ color: item.color }}>
                                                        STEP {item.step}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3
                                                    className="text-xl font-bold mb-2"
                                                    style={{ color: item.color }}
                                                >
                                                    {item.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                                    {item.description}
                                                </p>

                                                {/* Details */}
                                                <div className="space-y-1">
                                                    {item.details.map((detail, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                                                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                                                            {detail}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Arrow Between Steps - Mobile */}
                                {i < steps.length - 1 && (
                                    <div className="flex justify-center my-4">
                                        <ArrowRight className="w-6 h-6 text-blue-400 rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid md:grid-cols-3 gap-8">
                        {steps.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative"
                                onMouseEnter={() => setActiveStep(i)}
                                onMouseLeave={() => setActiveStep(null)}
                            >
                                {/* Step Number Background */}
                                <motion.div
                                    className="absolute -top-4 -left-4 text-8xl font-bold opacity-5"
                                    style={{ color: item.color }}
                                    animate={activeStep === i ? { scale: 1.1 } : { scale: 1 }}
                                >
                                    {item.step}
                                </motion.div>

                                {/* Card */}
                                <motion.div
                                    whileHover={{
                                        y: -10,
                                        rotateY: 5,
                                        rotateX: 5,
                                    }}
                                    animate={activeStep === i ? {
                                        boxShadow: `0 0 40px ${item.color}40`
                                    } : {}}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="relative bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-2xl p-8 h-full transition-all cursor-pointer"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px'
                                    }}
                                >
                                    {/* Gradient Top Border */}
                                    <motion.div
                                        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                        style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }}
                                        animate={activeStep === i ? {
                                            scaleX: [1, 1.2, 1],
                                            opacity: [0.5, 1, 0.5]
                                        } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />

                                    {/* Icon */}
                                    <motion.div
                                        className="mb-6 w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center relative"
                                        style={{ color: item.color }}
                                        animate={activeStep === i ? {
                                            rotate: 360,
                                            scale: [1, 1.1, 1]
                                        } : {}}
                                        transition={{
                                            rotate: { duration: 0.6 },
                                            scale: { duration: 1, repeat: Infinity }
                                        }}
                                    >
                                        {/* Icon Glow */}
                                        <motion.div
                                            className="absolute inset-0 rounded-xl blur-xl"
                                            style={{ backgroundColor: item.color }}
                                            animate={activeStep === i ? { opacity: [0.2, 0.4, 0.2] } : { opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                        <item.icon className="w-10 h-10 relative z-10" />
                                    </motion.div>

                                    {/* Step Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                                        <Zap className="w-3 h-3" style={{ color: item.color }} />
                                        <span className="text-xs font-mono" style={{ color: item.color }}>
                                            STEP {item.step}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-2xl font-bold mb-3"
                                        style={{ color: item.color }}
                                    >
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 leading-relaxed mb-4">
                                        {item.description}
                                    </p>

                                    {/* Details - Show on hover */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={activeStep === i ? {
                                            opacity: 1,
                                            height: 'auto'
                                        } : {
                                            opacity: 0,
                                            height: 0
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 border-t border-white/10 space-y-2">
                                            {item.details.map((detail, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={activeStep === i ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center gap-2 text-sm text-gray-500"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                    {detail}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Floating Particles */}
                                    {activeStep === i && (
                                        <>
                                            {[...Array(3)].map((_, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className="absolute w-1 h-1 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                    initial={{
                                                        x: Math.random() * 100 - 50,
                                                        y: Math.random() * 100 - 50,
                                                        opacity: 0
                                                    }}
                                                    animate={{
                                                        y: [null, -100],
                                                        opacity: [0, 1, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: idx * 0.3
                                                    }}
                                                />
                                            ))}
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
