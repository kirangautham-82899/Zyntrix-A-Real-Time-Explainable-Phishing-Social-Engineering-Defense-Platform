"use client";

import {
  Shield, Scan, AlertTriangle, CheckCircle2, Zap, Lock,
  Mail, MessageSquare, QrCode, TrendingUp, Users, Clock,
  ArrowRight, Play, Star, Award, Target, Activity
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold text-gradient-primary">ZYNTRIX</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-dark-300 hover:text-primary-400 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-dark-300 hover:text-primary-400 transition-colors">How It Works</Link>
              <Link href="#demo" className="text-dark-300 hover:text-primary-400 transition-colors">Demo</Link>
              <Link href="/demo" className="text-dark-300 hover:text-primary-400 transition-colors">Components</Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button variant="primary" size="sm" icon={Scan}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center cyber-grid overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-slide-down">
            <Badge variant="success" pulse size="sm">Live</Badge>
            <span className="text-sm font-semibold text-accent-400">Real-Time Threat Detection</span>
            <Zap className="w-4 h-4 text-accent-400" />
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up">
            <span className="text-gradient-primary">Protect Yourself</span>
            <br />
            <span className="text-dark-100">From Cyber Threats</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-dark-300 max-w-3xl mx-auto mb-12 animate-fade-in leading-relaxed">
            Advanced AI-powered platform that detects phishing and social engineering attacks
            in real-time across <span className="text-accent-400 font-semibold">URLs, emails, SMS, and QR codes</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
            <Button variant="primary" size="lg" icon={Scan} iconPosition="left">
              Start Free Scan
            </Button>
            <Button variant="ghost" size="lg" icon={Play} iconPosition="left">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-glow text-center group cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-primary-400 group-hover:scale-110 transition-transform" />
                <div className="text-5xl font-bold text-gradient-primary">99.8%</div>
              </div>
              <div className="text-dark-400 font-medium">Detection Accuracy</div>
              <Badge variant="success" size="sm" className="mt-2">Industry Leading</Badge>
            </div>

            <div className="card-glow text-center group cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-accent-400 group-hover:scale-110 transition-transform" />
                <div className="text-5xl font-bold text-gradient-success">&lt;500ms</div>
              </div>
              <div className="text-dark-400 font-medium">Analysis Speed</div>
              <Badge variant="info" size="sm" className="mt-2">Lightning Fast</Badge>
            </div>

            <div className="card-glow text-center group cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-6 h-6 text-success-400 group-hover:scale-110 transition-transform" />
                <div className="text-5xl font-bold text-gradient-primary">24/7</div>
              </div>
              <div className="text-dark-400 font-medium">Real-Time Protection</div>
              <Badge variant="success" size="sm" pulse className="mt-2">Always Active</Badge>
            </div>
          </div>
        </div>

        {/* Scan Line Effect */}
        <div className="scan-line absolute inset-0 pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-dark-900/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge variant="info" size="lg" className="mb-6">Features</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">Advanced Protection</span>
              <br />
              <span className="text-dark-100">For Modern Threats</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-3xl mx-auto">
              Comprehensive threat detection powered by hybrid AI technology and explainable intelligence
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card variant="glow" className="group border-primary-500/30 hover:border-primary-500/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-cyber flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scan className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-100">Multi-Input Detection</h3>
              <p className="text-dark-400 mb-4 leading-relaxed">
                Analyze URLs, emails, SMS messages, and QR codes with advanced pattern recognition and ML algorithms.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info" size="sm">URLs</Badge>
                <Badge variant="info" size="sm">Emails</Badge>
                <Badge variant="info" size="sm">SMS</Badge>
                <Badge variant="info" size="sm">QR Codes</Badge>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card variant="glow" className="group border-accent-500/30 hover:border-accent-500/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-100">Explainable AI</h3>
              <p className="text-dark-400 mb-4 leading-relaxed">
                Understand exactly why content was flagged with transparent risk scoring and detailed feature analysis.
              </p>
              <div className="flex items-center gap-2 text-accent-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">95% User Trust Score</span>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card variant="glow" className="group border-success-500/30 hover:border-success-500/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-success flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-100">Real-Time Alerts</h3>
              <p className="text-dark-400 mb-4 leading-relaxed">
                Instant threat notifications with contextual warnings, action blocking, and secondary verification.
              </p>
              <Badge variant="success" pulse>Active Monitoring</Badge>
            </Card>

            {/* Feature 4 */}
            <Card variant="glow" className="group border-primary-500/30 hover:border-primary-500/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-cyber flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-100">Privacy First</h3>
              <p className="text-dark-400 mb-4 leading-relaxed">
                Session-based processing with no permanent storage of sensitive data. Your privacy is our priority.
              </p>
              <Badge variant="success">Zero Data Retention</Badge>
            </Card>

            {/* Feature 5 */}
            <Card variant="glow" className="group border-warning-500/30 hover:border-warning-500/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning-600 to-warning-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-100">Hybrid Detection</h3>
              <p className="text-dark-400 mb-4 leading-relaxed">
                Combines rule-based heuristics (60%) with machine learning (40%) for maximum accuracy and minimal false positives.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-warning-500 to-success-500"></div>
                </div>
                <span className="text-sm font-semibold text-success-400">95%</span>
              </div>
            </Card>

            {/* Feature 6 */}
            <Card variant="glow" className="group border-accent-500/30 hover:border-accent-500/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-600 to-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-100">Enterprise Ready</h3>
              <p className="text-dark-400 mb-4 leading-relaxed">
                Admin dashboard with analytics, threat trends, team management, and comprehensive reporting.
              </p>
              <Badge variant="info">For Organizations</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="success" size="lg" className="mb-6">How It Works</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-dark-100">Protection in</span>
              <br />
              <span className="text-gradient-primary">Three Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="card text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-cyber flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 text-dark-100">Submit Content</h3>
                <p className="text-dark-400 leading-relaxed">
                  Paste a URL, email, SMS message, or upload a QR code to our secure scanner
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-primary-500" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="card text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 text-dark-100">AI Analysis</h3>
                <p className="text-dark-400 leading-relaxed">
                  Our hybrid AI engine analyzes patterns, keywords, and structures in under 500ms
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-accent-500" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="card text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-success flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-dark-100">Get Results</h3>
              <p className="text-dark-400 leading-relaxed">
                Receive detailed risk score, threat classification, and actionable recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-dark-900/50">
        <div className="max-w-5xl mx-auto">
          <Card variant="neon" className="text-center p-12">
            <Award className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-primary">Ready to Stay Safe?</span>
            </h2>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users protecting themselves from cyber threats with ZYNTRIX
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" icon={Scan}>
                Start Free Scan
              </Button>
              <Button variant="accent" size="lg" icon={Shield}>
                View Pricing
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-dark-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-400" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-400" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-400" />
                <span>Instant Results</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold text-gradient-primary">ZYNTRIX</span>
            </div>

            <div className="flex items-center gap-6 text-dark-400 text-sm">
              <Link href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary-400 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="success" pulse size="sm">IIT Hackathon 2026</Badge>
            </div>
          </div>

          <div className="text-center mt-8 text-dark-500 text-sm">
            © 2026 ZYNTRIX. Advanced Cyber Safety Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
