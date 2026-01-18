"use client";

import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Shield, Info } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export interface ThreatFactor {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
    weight?: number;
}

export interface ThreatExplanationProps {
    riskScore: number;
    riskLevel: 'safe' | 'suspicious' | 'dangerous';
    classification: string;
    explanation: string;
    factors: ThreatFactor[];
    recommendations: string[];
    analysisTime?: number;
    factorsAnalyzed?: number;
}

export default function ThreatExplanation({
    riskScore,
    riskLevel,
    classification,
    explanation,
    factors,
    recommendations,
    analysisTime = 0,
    factorsAnalyzed = 0
}: ThreatExplanationProps) {

    const getRiskIcon = () => {
        switch (riskLevel) {
            case 'safe': return CheckCircle2;
            case 'suspicious': return AlertTriangle;
            case 'dangerous': return XCircle;
        }
    };

    const getRiskColor = () => {
        switch (riskLevel) {
            case 'safe': return {
                icon: 'text-success-400',
                bg: 'bg-success-500/20',
                border: 'border-success-500',
                text: 'text-success-400',
                badge: 'success' as const
            };
            case 'suspicious': return {
                icon: 'text-warning-400',
                bg: 'bg-warning-500/20',
                border: 'border-warning-500',
                text: 'text-warning-400',
                badge: 'warning' as const
            };
            case 'dangerous': return {
                icon: 'text-danger-400',
                bg: 'bg-danger-500/20',
                border: 'border-danger-500',
                text: 'text-danger-400',
                badge: 'danger' as const
            };
        }
    };

    const RiskIcon = getRiskIcon();
    const colors = getRiskColor();

    return (
        <div className="space-y-6">
            {/* Main Result Card */}
            <Card variant="glow" className={`border-l-4 ${colors.border}`}>
                <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <RiskIcon className={`w-8 h-8 ${colors.icon}`} />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className={`text-2xl font-bold ${colors.text}`}>
                                {classification}
                            </h3>
                            <Badge
                                variant={colors.badge}
                                size="lg"
                                pulse={riskLevel !== 'safe'}
                            >
                                Risk Score: {riskScore}/100
                            </Badge>
                        </div>
                        <p className="text-dark-300 leading-relaxed">{explanation}</p>
                    </div>
                </div>
            </Card>

            {/* Analysis Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detection Factors */}
                <Card variant="default">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary-400" />
                        <h4 className="text-xl font-bold text-dark-100">Detection Factors</h4>
                        {factorsAnalyzed > 0 && (
                            <Badge variant="info" size="sm">{factorsAnalyzed} analyzed</Badge>
                        )}
                    </div>

                    <div className="space-y-3">
                        {factors.map((factor, index) => (
                            <div key={index} className="glass rounded-lg p-3 hover:bg-dark-800/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${factor.impact === 'positive' ? 'bg-success-500' :
                                        factor.impact === 'negative' ? 'bg-danger-500' :
                                            'bg-dark-500'
                                        }`}></div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-dark-200">{factor.name}</span>
                                            {factor.weight && (
                                                <span className="text-xs text-dark-500">
                                                    ({factor.weight}% weight)
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-dark-400">{factor.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recommendations */}
                <Card variant="default">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-accent-400" />
                        <h4 className="text-xl font-bold text-dark-100">Recommendations</h4>
                    </div>

                    <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                                <p className="text-dark-300 leading-relaxed">{rec}</p>
                            </div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    {analysisTime > 0 && (
                        <div className="mt-6 pt-4 border-t border-dark-700">
                            <div className="flex items-center gap-2 text-sm text-dark-400">
                                <Info className="w-4 h-4" />
                                <span>Analysis completed in {analysisTime}ms</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Factor Impact Summary */}
            <Card variant="default" className="border-primary-500/30">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-dark-200 mb-2">Understanding the Analysis</h4>
                        <p className="text-sm text-dark-400 leading-relaxed">
                            Our hybrid AI engine analyzed {factorsAnalyzed || factors.length} different factors using both
                            rule-based heuristics (60%) and machine learning models (40%). Each factor contributes to the
                            final risk score based on its weight and impact. Positive factors decrease risk, while negative
                            factors increase it.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
