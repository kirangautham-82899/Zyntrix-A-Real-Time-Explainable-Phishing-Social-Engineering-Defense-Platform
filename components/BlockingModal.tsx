"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle, Shield, X, CheckCircle } from 'lucide-react';

interface BlockingModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'block' | 'warn' | 'allow';
    riskLevel: 'safe' | 'suspicious' | 'dangerous';
    riskScore: number;
    reason: string;
    url?: string;
    domain?: string;
    factors?: Array<{
        name: string;
        description: string;
        impact: string;
    }>;
    recommendations?: string[];
    onProceed?: () => void;
    onBlock?: () => void;
}

export default function BlockingModal({
    isOpen,
    onClose,
    action,
    riskLevel,
    riskScore,
    reason,
    url,
    domain,
    factors = [],
    recommendations = [],
    onProceed,
    onBlock
}: BlockingModalProps) {

    const getConfig = () => {
        switch (action) {
            case 'block':
                return {
                    icon: XCircle,
                    color: '#EF4444',
                    title: 'CONTENT BLOCKED',
                    message: 'This content has been blocked due to high security risk.',
                    showProceed: true,
                    proceedLabel: 'Proceed Anyway (Not Recommended)',
                    proceedDangerous: true
                };
            case 'warn':
                return {
                    icon: AlertTriangle,
                    color: '#F59E0B',
                    title: 'SECURITY WARNING',
                    message: 'This content shows suspicious characteristics.',
                    showProceed: true,
                    proceedLabel: 'Proceed with Caution',
                    proceedDangerous: false
                };
            default:
                return {
                    icon: CheckCircle,
                    color: '#10B981',
                    title: 'CONTENT SAFE',
                    message: 'This content appears safe to access.',
                    showProceed: false,
                    proceedLabel: '',
                    proceedDangerous: false
                };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#1E293B] rounded-xl border-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            style={{ borderColor: config.color }}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 relative">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${config.color}20`, color: config.color }}
                                    >
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-2" style={{ color: config.color }}>
                                            {config.title}
                                        </h2>
                                        <p className="text-gray-300">{config.message}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Risk Score */}
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-300 font-semibold">Risk Score</span>
                                        <span className="text-2xl font-bold" style={{ color: config.color }}>
                                            {riskScore}/100
                                        </span>
                                    </div>
                                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{
                                                width: `${riskScore}%`,
                                                backgroundColor: config.color
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Detection Reason
                                    </h3>
                                    <p className="text-gray-300 text-sm">{reason}</p>
                                </div>

                                {/* URL/Domain Info */}
                                {(url || domain) && (
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        {url && (
                                            <div className="mb-2">
                                                <span className="text-gray-400 text-xs">URL:</span>
                                                <p className="text-white font-mono text-sm break-all">{url}</p>
                                            </div>
                                        )}
                                        {domain && (
                                            <div>
                                                <span className="text-gray-400 text-xs">Domain:</span>
                                                <p className="text-white font-mono text-sm">{domain}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Detection Factors */}
                                {factors.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Detection Factors</h3>
                                        <div className="space-y-2">
                                            {factors.slice(0, 5).map((factor, index) => (
                                                <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <div className="flex items-start gap-2">
                                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0`}
                                                            style={{
                                                                backgroundColor: factor.impact === 'negative' ? '#EF4444' : '#666'
                                                            }}
                                                        />
                                                        <div>
                                                            <div className="font-semibold text-white text-sm">{factor.name}</div>
                                                            <div className="text-xs text-gray-400">{factor.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {recommendations.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Security Recommendations</h3>
                                        <div className="space-y-2">
                                            {recommendations.map((rec, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2 flex-shrink-0" />
                                                    <p className="text-gray-300 text-sm">{rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/10 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border border-white/20 rounded-lg font-bold hover:bg-white/5 transition-colors"
                                >
                                    CLOSE
                                </button>
                                {config.showProceed && onProceed && (
                                    <button
                                        onClick={() => {
                                            onProceed();
                                            onClose();
                                        }}
                                        className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${config.proceedDangerous
                                                ? 'bg-[#EF4444]/20 border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/30'
                                                : 'bg-[#F59E0B]/20 border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/30'
                                            }`}
                                    >
                                        {config.proceedLabel}
                                    </button>
                                )}
                                {action === 'block' && onBlock && (
                                    <button
                                        onClick={() => {
                                            onBlock();
                                            onClose();
                                        }}
                                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-bold hover:bg-white/20 transition-colors"
                                    >
                                        KEEP BLOCKED
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
