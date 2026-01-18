"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Shield, Zap, Eye, Lock, TrendingUp, Terminal, Activity, Globe, Database, AlertTriangle, CheckCircle, XCircle, Cpu, Network, Code } from 'lucide-react';
import Navbar from '@/components/Navbar';

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
    <div className="min-h-screen bg-[#0A0E1A] text-white overflow-hidden relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] via-[#B026FF] to-[#FF0055] origin-left z-50"
        style={{ scaleX }}
      />

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

      {/* Animated Particles */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 3 === 0 ? '#00F0FF' : i % 3 === 1 ? '#B026FF' : '#00FF41',
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

      {/* Mouse Glow */}
      <motion.div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

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
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 backdrop-blur-sm">
                <Terminal className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-sm font-mono text-[#00F0FF]">SYSTEM ACTIVE</span>
                <div className="flex gap-1 ml-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  <div className="w-2 h-2 rounded-full bg-[#FF0055]" />
                </div>
              </div>

              {/* Glitch Title */}
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                <motion.span
                  className="inline-block bg-gradient-to-r from-[#00F0FF] via-[#B026FF] to-[#FF0055] bg-clip-text text-transparent"
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
                <span className="text-[#00F0FF] font-semibold">phishing</span>,{' '}
                <span className="text-[#B026FF] font-semibold">malware</span>, and{' '}
                <span className="text-[#FF0055] font-semibold">cyber attacks</span> in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,240,255,0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-lg font-bold text-black overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      INITIATE SCAN
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
                    className="px-8 py-4 border-2 border-[#00F0FF] rounded-lg font-bold text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all flex items-center gap-2"
                  >
                    <Activity className="w-5 h-5" />
                    LIVE THREATS
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                {[
                  { value: '99.9%', label: 'Detection Rate' },
                  { value: '<5ms', label: 'Response' },
                  { value: '24/7', label: 'Active' }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[#00F0FF]">{stat.value}</div>
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
                  className="absolute inset-0 rounded-full border-2 border-[#00F0FF]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-8 rounded-full border-2 border-[#B026FF]/30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-16 rounded-full border-2 border-[#FF0055]/30"
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
                    <Shield className="w-32 h-32 text-[#00F0FF]" style={{ filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.8))' }} />
                  </motion.div>
                </div>

                {/* Threat Counter */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#0A0E1A] border border-[#00FF41] rounded-lg backdrop-blur-sm">
                  <div className="text-xs text-gray-400 mb-1">THREATS BLOCKED</div>
                  <div className="text-2xl font-mono font-bold text-[#00FF41]">
                    {threatCount.toString().padStart(6, '0')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                LIVE THREAT MONITOR
              </span>
            </h2>
            <p className="text-xl text-gray-400">Real-time cyber threat detection across the network</p>
          </motion.div>

          {/* Terminal-style threat log */}
          <div className="bg-black/40 backdrop-blur-xl border border-[#00F0FF]/30 rounded-xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <Terminal className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-[#00F0FF]">threat_monitor.log</span>
              <div className="ml-auto flex gap-1">
                <div className="w-3 h-3 rounded-full bg-[#FF0055]" />
                <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
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
                  <span className={`px-2 py-1 rounded ${log.type === 'BLOCKED' ? 'bg-[#FF0055]/20 text-[#FF0055]' :
                    log.type === 'SCANNED' ? 'bg-[#00FF41]/20 text-[#00FF41]' :
                      'bg-[#FFD700]/20 text-[#FFD700]'
                    }`}>
                    {log.type}
                  </span>
                  <span className="text-gray-300 flex-1">{log.threat}</span>
                  <span className="text-[#00F0FF]">{log.ip}</span>
                  <span className={`px-2 py-1 rounded text-xs ${log.severity === 'CRITICAL' ? 'bg-[#FF0055]/20 text-[#FF0055]' :
                    log.severity === 'HIGH' ? 'bg-[#FF6B00]/20 text-[#FF6B00]' :
                      log.severity === 'MEDIUM' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                        'bg-[#00FF41]/20 text-[#00FF41]'
                    }`}>
                    {log.severity}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                DEFENSE SYSTEMS
              </span>
            </h2>
            <p className="text-xl text-gray-400">Multi-layered protection powered by AI</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Real-Time Scanning',
                description: 'Instant threat detection with sub-5ms response time',
                color: '#00F0FF',
                gradient: 'from-[#00F0FF]/20 to-transparent'
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: 'Behavioral Analysis',
                description: 'AI-powered pattern recognition for zero-day threats',
                color: '#B026FF',
                gradient: 'from-[#B026FF]/20 to-transparent'
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: 'End-to-End Encryption',
                description: 'Military-grade security for all data transmissions',
                color: '#FF0055',
                gradient: 'from-[#FF0055]/20 to-transparent'
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: 'Threat Intelligence',
                description: 'Global threat database updated in real-time',
                color: '#00FF41',
                gradient: 'from-[#00FF41]/20 to-transparent'
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: 'Network Protection',
                description: 'Comprehensive monitoring across all endpoints',
                color: '#FFD700',
                gradient: 'from-[#FFD700]/20 to-transparent'
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'ML-Powered Defense',
                description: 'Self-learning algorithms that evolve with threats',
                color: '#00F0FF',
                gradient: 'from-[#00F0FF]/20 to-transparent'
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

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                HOW IT WORKS
              </span>
            </h2>
            <p className="text-xl text-gray-400">Three-step cyber defense protocol</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00F0FF]/50 via-[#B026FF]/50 to-[#FF0055]/50" />

            {[
              {
                step: '01',
                title: 'SCAN',
                description: 'Input URL, email, SMS, or QR code into our AI-powered scanner',
                icon: <Terminal className="w-12 h-12" />,
                color: '#00F0FF'
              },
              {
                step: '02',
                title: 'ANALYZE',
                description: 'Machine learning models process data in milliseconds using threat intelligence',
                icon: <Cpu className="w-12 h-12" />,
                color: '#B026FF'
              },
              {
                step: '03',
                title: 'PROTECT',
                description: 'Receive instant risk assessment with actionable security recommendations',
                icon: <Shield className="w-12 h-12" />,
                color: '#00FF41'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                {/* Step Number Background */}
                <div
                  className="absolute -top-4 -left-4 text-8xl font-bold opacity-5"
                  style={{ color: item.color }}
                >
                  {item.step}
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-2xl p-8 h-full transition-all"
                >
                  {/* Gradient Top Border */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="mb-6 w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center"
                    style={{ color: item.color }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Step Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                    <span className="text-xs font-mono" style={{ color: item.color }}>
                      STEP {item.step}
                    </span>
                  </div>

                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Glow Effect */}
                  <div
                    className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10 rounded-2xl"
                    style={{ background: `${item.color}20` }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}

      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                TRY IT NOW
              </span>
            </h2>
            <p className="text-xl text-gray-400">Experience real-time threat detection</p>
          </motion.div>

          <div className="bg-black/60 backdrop-blur-xl border-2 border-[#00F0FF]/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] via-[#B026FF] to-[#FF0055]" />

            <div className="flex items-center gap-2 mb-6">
              <Code className="w-5 h-5 text-[#00F0FF]" />
              <span className="font-mono text-sm text-[#00F0FF]">scanner_interface.exe</span>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter URL, email, or paste content to scan..."
                className="w-full px-6 py-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#00F0FF] focus:outline-none transition-colors font-mono"
              />

              <div className="grid grid-cols-2 gap-4">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,240,255,0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-lg font-bold text-black flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    ANALYZE THREAT
                  </motion.button>
                </Link>

                <button className="px-6 py-3 border border-white/20 rounded-lg font-bold text-white hover:bg-white/5 transition-colors">
                  CLEAR
                </button>
              </div>
            </div>

            {/* Sample Results */}
            <div className="mt-8 space-y-3">
              <div className="p-4 bg-[#00FF41]/10 border-l-4 border-[#00FF41] rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00FF41] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#00FF41]">SAFE</span>
                      <span className="px-2 py-0.5 bg-[#00FF41]/20 rounded text-xs text-[#00FF41]">Risk: 5/100</span>
                    </div>
                    <p className="text-sm text-gray-400">No malicious patterns detected</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FF0055]/10 border-l-4 border-[#FF0055] rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-[#FF0055] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#FF0055]">DANGEROUS</span>
                      <span className="px-2 py-0.5 bg-[#FF0055]/20 rounded text-xs text-[#FF0055] animate-pulse">Risk: 95/100</span>
                    </div>
                    <p className="text-sm text-gray-400">Phishing attempt detected - Domain mismatch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                className="bg-gradient-to-r from-[#00F0FF] via-[#B026FF] to-[#FF0055] bg-clip-text text-transparent"
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
                className="group relative px-12 py-6 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-xl text-2xl font-bold text-black overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Shield className="w-8 h-8" />
                  START NOW
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
      <footer className="border-t border-white/10 py-12 px-6 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-[#00F0FF]" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
                  ZYNTRIX
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Next-generation cyber defense platform
              </p>
            </div>

            {[
              { title: 'Product', links: ['Scanner', 'Analytics', 'History', 'Extension'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Support', 'Blog'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms', 'Contact'] }
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4 text-[#00F0FF]">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-400 hover:text-[#00F0FF] transition text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 ZYNTRIX. All rights reserved.
              <span className="text-[#00F0FF]"> Secured by AI.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
