"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Shield, Zap, Eye, Lock, TrendingUp, Terminal, Activity, Globe, Database, AlertTriangle, CheckCircle, XCircle, Cpu, Network, Code } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ThreatMonitor from './components/ThreatMonitor';
import HowItWorks from './components/HowItWorks';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [threatCount, setThreatCount] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animated threat counter
    const interval = setInterval(() => {
      setThreatCount(prev => (prev + 1) % 999999);
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#EF4444] origin-left z-50"
        style={{ scaleX }}
      />

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

      {/* Animated Particles */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#06B6D4' : '#10B981',
                boxShadow: `0 0 10px currentColor`,
              }}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}



      <Navbar />

      {/* Hero Section - Terminal Style */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Terminal Header */}
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 backdrop-blur-sm">
                <Terminal className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-sm font-mono text-[#3B82F6]">SYSTEM ACTIVE</span>
                <div className="flex gap-1 ml-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                </div>
              </div>

              {/* Glitch Title */}
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                <motion.span
                  className="inline-block bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#EF4444] bg-clip-text text-transparent"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(0,240,255,0.5)',
                      '0 0 40px rgba(176,38,255,0.8)',
                      '0 0 20px rgba(0,240,255,0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  CYBER DEFENSE
                </motion.span>
                <br />
                <span className="text-white">PROTOCOL</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                AI-powered threat detection system protecting against{' '}
                <span className="text-[#3B82F6] font-semibold">phishing</span>,{' '}
                <span className="text-[#06B6D4] font-semibold">malware</span>, and{' '}
                <span className="text-[#EF4444] font-semibold">cyber attacks</span> in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,240,255,0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg font-bold text-black overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      GET STARTED
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>

                <Link href="#threat-monitor">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-[#3B82F6] rounded-lg font-bold text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all flex items-center gap-2"
                  >
                    <Activity className="w-5 h-5" />
                    VIEW LIVE MONITOR
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                {[
                  { value: 'ML', label: 'Powered' },
                  { value: 'Fast', label: 'Analysis' },
                  { value: '24/7', label: 'Ready' }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[#3B82F6]">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Interactive Hologram */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Holographic Shield */}
              <div className="relative aspect-square max-w-md mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#3B82F6]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-8 rounded-full border-2 border-[#06B6D4]/30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-16 rounded-full border-2 border-[#EF4444]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotateY: [0, 180, 360],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <Shield className="w-32 h-32 text-[#3B82F6]" style={{ filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.8))' }} />
                  </motion.div>
                </div>

                {/* Threat Counter */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#0F172A] border border-[#10B981] rounded-lg backdrop-blur-sm">
                  <div className="text-xs text-gray-400 mb-1">THREATS BLOCKED</div>
                  <div className="text-2xl font-mono font-bold text-[#10B981]">
                    {threatCount.toString().padStart(6, '0')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>

      {/* Live Threat Monitor */}
      <section id="threat-monitor" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                LIVE THREAT MONITOR
              </span>
            </h2>
            <p className="text-xl text-gray-400">Real-time cyber threat detection across the network</p>
          </motion.div>

          {/* Terminal-style threat log */}
          <div className="bg-black/40 backdrop-blur-xl border border-[#3B82F6]/30 rounded-xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <Terminal className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#3B82F6]">threat_monitor.log</span>
              <div className="ml-auto flex gap-1">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-hidden">
              {[
                { type: 'BLOCKED', threat: 'Phishing attempt detected', ip: '192.168.1.45', severity: 'HIGH', time: '14:23:15' },
                { type: 'SCANNED', threat: 'URL verification complete', ip: '10.0.0.23', severity: 'SAFE', time: '14:23:12' },
                { type: 'BLOCKED', threat: 'Malware signature found', ip: '172.16.0.89', severity: 'CRITICAL', time: '14:23:08' },
                { type: 'ALERT', threat: 'Suspicious email content', ip: '192.168.1.12', severity: 'MEDIUM', time: '14:23:05' },
                { type: 'SCANNED', threat: 'QR code validated', ip: '10.0.0.56', severity: 'SAFE', time: '14:23:01' },
              ].map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 text-xs"
                >
                  <span className="text-gray-500">[{log.time}]</span>
                  <span className={`px-2 py-1 rounded ${log.type === 'BLOCKED' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                    log.type === 'SCANNED' ? 'bg-[#10B981]/20 text-[#10B981]' :
                      'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                    {log.type}
                  </span>
                  <span className="text-gray-300 flex-1">{log.threat}</span>
                  <span className="text-[#3B82F6]">{log.ip}</span>
                  <span className={`px-2 py-1 rounded text-xs ${log.severity === 'CRITICAL' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                    log.severity === 'HIGH' ? 'bg-[#FF6B00]/20 text-[#FF6B00]' :
                      log.severity === 'MEDIUM' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#10B981]/20 text-[#10B981]'
                    }`}>
                    {log.severity}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      {/* Features - 3D Cards */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                DEFENSE SYSTEMS
              </span>
            </h2>
            <p className="text-xl text-gray-400">Multi-layered protection powered by AI</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'URL/Email/SMS Scanning',
                description: 'Analyze URLs, emails, and SMS messages for phishing and malware threats',
                color: '#3B82F6',
                gradient: 'from-[#3B82F6]/20 to-transparent'
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: 'Behavioral Analysis',
                description: 'Isolation Forest ML model for detecting anomalous user patterns',
                color: '#06B6D4',
                gradient: 'from-[#06B6D4]/20 to-transparent'
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: 'Threat Database',
                description: 'MongoDB-powered storage for scan history and threat intelligence',
                color: '#10B981',
                gradient: 'from-[#10B981]/20 to-transparent'
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'ML Risk Scoring',
                description: 'Scikit-learn models provide intelligent risk assessment',
                color: '#3B82F6',
                gradient: 'from-[#3B82F6]/20 to-transparent'
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: 'Real-Time Analysis',
                description: 'FastAPI backend processes threats with instant feedback',
                color: '#F59E0B',
                gradient: 'from-[#F59E0B]/20 to-transparent'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Analytics Dashboard',
                description: 'Track scan history, view statistics, and monitor threat trends',
                color: '#EF4444',
                gradient: 'from-[#EF4444]/20 to-transparent'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  y: -10,
                  rotateY: 5,
                  rotateX: 5,
                }}
                className="group relative p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10">
                  <div
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ color: feature.color }}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>

                <div
                  className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10 rounded-xl"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${feature.color}40, transparent)`
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Section Separator */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
      </div>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-bold mb-6">
              <motion.span
                className="bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#EF4444] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                ACTIVATE PROTECTION
              </motion.span>
            </h2>

            <p className="text-2xl text-gray-400 mb-12">
              Join the cyber defense network today
            </p>

            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,240,255,0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl text-2xl font-bold text-black overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Shield className="w-8 h-8" />
                  LAUNCH PLATFORM
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#3B82F6]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                ZYNTRIX
              </span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              © 2026 ZYNTRIX. All rights reserved.
              <span className="text-[#3B82F6]"> Secured by AI.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
