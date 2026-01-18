"use client";

import { useState } from "react";
import RiskMeter from "@/components/RiskMeter";
import ThreatExplanation from "@/components/ThreatExplanation";
import { Button, Card, Badge } from "@/components/ui";
import { Scan, RefreshCw } from "lucide-react";

export default function VisualizationDemo() {
    const [currentExample, setCurrentExample] = useState<'safe' | 'suspicious' | 'dangerous'>('safe');

    const examples = {
        safe: {
            riskScore: 15,
            riskLevel: 'safe' as const,
            classification: 'SAFE',
            explanation: 'No malicious patterns detected. The content appears legitimate with valid structure and trusted domain reputation.',
            factors: [
                { name: 'Domain Reputation', impact: 'positive' as const, description: 'Domain has excellent reputation score', weight: 25 },
                { name: 'SSL Certificate', impact: 'positive' as const, description: 'Valid SSL certificate detected', weight: 20 },
                { name: 'Content Analysis', impact: 'positive' as const, description: 'No suspicious keywords found', weight: 30 },
                { name: 'URL Structure', impact: 'positive' as const, description: 'Clean URL structure', weight: 25 },
            ],
            recommendations: [
                'Content appears safe to interact with',
                'Always verify sender identity for sensitive actions',
                'Keep your security software updated',
            ],
            analysisTime: 342,
            factorsAnalyzed: 12,
        },
        suspicious: {
            riskScore: 65,
            riskLevel: 'suspicious' as const,
            classification: 'SUSPICIOUS',
            explanation: 'Several warning signs detected. The content shows characteristics commonly associated with phishing attempts. Proceed with extreme caution.',
            factors: [
                { name: 'Urgency Language', impact: 'negative' as const, description: 'Contains urgent action phrases', weight: 30 },
                { name: 'Domain Age', impact: 'negative' as const, description: 'Recently registered domain', weight: 20 },
                { name: 'Suspicious Keywords', impact: 'negative' as const, description: 'Found common scam keywords', weight: 25 },
                { name: 'SSL Certificate', impact: 'positive' as const, description: 'Valid SSL certificate', weight: 15 },
                { name: 'Grammar Issues', impact: 'negative' as const, description: 'Poor grammar and spelling', weight: 10 },
            ],
            recommendations: [
                'Do not click any links or provide personal information',
                'Verify the sender through official channels',
                'Report this content to relevant authorities',
                'Delete this message if unsolicited',
            ],
            analysisTime: 428,
            factorsAnalyzed: 15,
        },
        dangerous: {
            riskScore: 92,
            riskLevel: 'dangerous' as const,
            classification: 'DANGEROUS',
            explanation: 'High-confidence phishing attempt detected. Multiple red flags indicate this is a malicious threat designed to steal your information or credentials.',
            factors: [
                { name: 'Known Phishing Pattern', impact: 'negative' as const, description: 'Matches known phishing templates', weight: 30 },
                { name: 'Obfuscated URL', impact: 'negative' as const, description: 'URL uses obfuscation techniques', weight: 25 },
                { name: 'Urgency + Fear Tactics', impact: 'negative' as const, description: 'Uses psychological manipulation', weight: 20 },
                { name: 'Fake Brand Impersonation', impact: 'negative' as const, description: 'Impersonating trusted brand', weight: 15 },
                { name: 'IP-based URL', impact: 'negative' as const, description: 'Uses IP address instead of domain', weight: 10 },
            ],
            recommendations: [
                'DO NOT interact with this content under any circumstances',
                'DO NOT provide any personal or financial information',
                'Report to your IT department or security team immediately',
                'Delete this message and block the sender',
                'Run a security scan on your device',
            ],
            analysisTime: 512,
            factorsAnalyzed: 18,
        },
    };

    const example = examples[currentExample];

    return (
        <main className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="info" size="lg" className="mb-6">Risk Visualization Demo</Badge>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="text-gradient-primary">Risk Meter</span>
                        <br />
                        <span className="text-dark-100">Components</span>
                    </h1>
                    <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                        Interactive visualization components for threat analysis results
                    </p>
                </div>

                {/* Example Selector */}
                <div className="flex justify-center gap-3 mb-12">
                    <Button
                        variant={currentExample === 'safe' ? 'success' : 'ghost'}
                        onClick={() => setCurrentExample('safe')}
                    >
                        Safe Example
                    </Button>
                    <Button
                        variant={currentExample === 'suspicious' ? 'ghost' : 'ghost'}
                        onClick={() => setCurrentExample('suspicious')}
                    >
                        Suspicious Example
                    </Button>
                    <Button
                        variant={currentExample === 'dangerous' ? 'danger' : 'ghost'}
                        onClick={() => setCurrentExample('dangerous')}
                    >
                        Dangerous Example
                    </Button>
                </div>

                {/* Risk Meter Showcase */}
                <Card variant="neon" className="mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-center text-dark-100">Risk Meter Sizes</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Small */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Small</h3>
                            <div className="flex justify-center">
                                <RiskMeter score={example.riskScore} size="sm" />
                            </div>
                        </div>

                        {/* Medium */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Medium</h3>
                            <div className="flex justify-center">
                                <RiskMeter score={example.riskScore} size="md" />
                            </div>
                        </div>

                        {/* Large */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4 text-dark-200">Large</h3>
                            <div className="flex justify-center">
                                <RiskMeter score={example.riskScore} size="lg" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Threat Explanation */}
                <ThreatExplanation {...example} />

                {/* Usage Example */}
                <Card variant="default" className="mt-12 border-primary-500/30">
                    <h3 className="text-xl font-bold mb-4 text-dark-100">Component Usage</h3>
                    <div className="glass rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre className="text-dark-300">
                            {`import RiskMeter from '@/components/RiskMeter';
import ThreatExplanation from '@/components/ThreatExplanation';

// Risk Meter
<RiskMeter 
  score={${example.riskScore}} 
  size="md" 
  animated={true}
  showLabel={true}
/>

// Threat Explanation
<ThreatExplanation
  riskScore={${example.riskScore}}
  riskLevel="${example.riskLevel}"
  classification="${example.classification}"
  explanation="..."
  factors={[...]}
  recommendations={[...]}
  analysisTime={${example.analysisTime}}
  factorsAnalyzed={${example.factorsAnalyzed}}
/>`}
                        </pre>
                    </div>
                </Card>
            </div>
        </main>
    );
}
