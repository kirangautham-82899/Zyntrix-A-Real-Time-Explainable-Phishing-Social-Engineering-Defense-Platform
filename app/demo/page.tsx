"use client";

import { Shield, Scan, Mail, MessageSquare, QrCode, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button, Card, Input, Badge } from "@/components/ui";

export default function ComponentDemo() {
    return (
        <main className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="text-gradient-primary">UI Components Demo</span>
                    </h1>
                    <p className="text-xl text-dark-300">
                        Reusable components built with the ZYNTRIX design system
                    </p>
                </div>

                {/* Buttons Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-dark-100">Buttons</h2>

                    <div className="glass rounded-xl p-8 space-y-6">
                        {/* Variants */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary" icon={Scan}>Primary</Button>
                                <Button variant="accent" icon={Shield}>Accent</Button>
                                <Button variant="success" icon={CheckCircle2}>Success</Button>
                                <Button variant="danger" icon={XCircle}>Danger</Button>
                                <Button variant="ghost" icon={AlertTriangle}>Ghost</Button>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="sm" variant="primary">Small</Button>
                                <Button size="md" variant="primary">Medium</Button>
                                <Button size="lg" variant="primary">Large</Button>
                            </div>
                        </div>

                        {/* States */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">States</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary" loading>Loading</Button>
                                <Button variant="primary" disabled>Disabled</Button>
                                <Button variant="primary" fullWidth>Full Width</Button>
                            </div>
                        </div>

                        {/* Icon Positions */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Icon Positions</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary" icon={Scan} iconPosition="left">Icon Left</Button>
                                <Button variant="accent" icon={Shield} iconPosition="right">Icon Right</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cards Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-dark-100">Cards</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Default Card */}
                        <Card variant="default" icon={Scan} iconColor="primary" title="URL Scanner" description="Analyze URLs for phishing attempts">
                            <Button variant="primary" size="sm" fullWidth>Scan Now</Button>
                        </Card>

                        {/* Glow Card */}
                        <Card variant="glow" icon={Mail} iconColor="accent" title="Email Analyzer" description="Detect malicious email content">
                            <Button variant="accent" size="sm" fullWidth>Analyze</Button>
                        </Card>

                        {/* Neon Card */}
                        <Card variant="neon" icon={QrCode} iconColor="success" title="QR Code Scanner" description="Extract and verify QR code links">
                            <Button variant="success" size="sm" fullWidth>Upload QR</Button>
                        </Card>

                        {/* Custom Card */}
                        <Card variant="default" className="group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-danger flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-danger-400 mb-1">High Risk Detected</h4>
                                    <p className="text-sm text-dark-400">Suspicious patterns found in the content</p>
                                    <Badge variant="danger" className="mt-2">Risk Score: 85/100</Badge>
                                </div>
                            </div>
                        </Card>

                        {/* SMS Card */}
                        <Card variant="default" icon={MessageSquare} iconColor="warning" title="SMS Analyzer" description="Detect scam messages and fraud">
                            <Button variant="ghost" size="sm" fullWidth>Check Message</Button>
                        </Card>

                        {/* Success Card */}
                        <Card variant="glow" className="border-success-500/50">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-success-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-success-400 mb-1">Safe Content</h4>
                                    <p className="text-sm text-dark-400">No threats detected in this URL</p>
                                    <Badge variant="success" className="mt-2">Risk Score: 5/100</Badge>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Inputs Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-dark-100">Input Fields</h2>

                    <div className="glass rounded-xl p-8 space-y-6 max-w-2xl">
                        <Input
                            label="URL to Scan"
                            placeholder="https://example.com"
                            icon={Scan}
                            helperText="Enter a URL to check for phishing attempts"
                        />

                        <Input
                            label="Email Content"
                            placeholder="Paste email content here..."
                            icon={Mail}
                            iconPosition="right"
                        />

                        <Input
                            label="Phone Number"
                            placeholder="+1 (555) 123-4567"
                            icon={MessageSquare}
                            error="Invalid phone number format"
                        />

                        <Input
                            type="password"
                            label="API Key"
                            placeholder="Enter your API key"
                            helperText="Your API key is encrypted and secure"
                        />
                    </div>
                </section>

                {/* Badges Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-dark-100">Badges</h2>

                    <div className="glass rounded-xl p-8 space-y-6">
                        {/* Variants */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Variants</h3>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="success">Safe</Badge>
                                <Badge variant="warning">Suspicious</Badge>
                                <Badge variant="danger">Dangerous</Badge>
                                <Badge variant="info">Scanning</Badge>
                                <Badge variant="default">Unknown</Badge>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="success" size="sm">Small</Badge>
                                <Badge variant="success" size="md">Medium</Badge>
                                <Badge variant="success" size="lg">Large</Badge>
                            </div>
                        </div>

                        {/* With Pulse */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">With Pulse Animation</h3>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="success" pulse>Live Monitoring</Badge>
                                <Badge variant="danger" pulse>Active Threat</Badge>
                                <Badge variant="warning" pulse>Analyzing</Badge>
                            </div>
                        </div>

                        {/* Risk Scores */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Risk Scores</h3>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="success">Risk: 0-30</Badge>
                                <Badge variant="warning">Risk: 31-70</Badge>
                                <Badge variant="danger">Risk: 71-100</Badge>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Combined Example */}
                <section>
                    <h2 className="text-3xl font-bold mb-8 text-dark-100">Combined Example</h2>

                    <Card variant="neon" className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-danger-500 pulse-glow"></div>
                            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                            <div className="w-3 h-3 rounded-full bg-success-500"></div>
                            <span className="text-sm text-dark-400 ml-auto font-mono">ZYNTRIX Scanner v1.0</span>
                        </div>

                        <div className="space-y-4">
                            <Input
                                placeholder="Enter URL, email, or paste message to scan..."
                                icon={Scan}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="primary" icon={Scan} fullWidth>
                                    Analyze Threat
                                </Button>
                                <Button variant="ghost" fullWidth>
                                    Clear
                                </Button>
                            </div>

                            {/* Sample Results */}
                            <div className="space-y-3 mt-6">
                                <div className="glass rounded-lg p-4 border-l-4 border-success-500">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-success-400">SAFE</span>
                                                <Badge variant="success" size="sm">Risk: 12/100</Badge>
                                            </div>
                                            <p className="text-sm text-dark-300">No malicious patterns detected</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-lg p-4 border-l-4 border-danger-500">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-danger-400">DANGEROUS</span>
                                                <Badge variant="danger" size="sm" pulse>Risk: 92/100</Badge>
                                            </div>
                                            <p className="text-sm text-dark-300">Phishing attempt detected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </main>
    );
}
