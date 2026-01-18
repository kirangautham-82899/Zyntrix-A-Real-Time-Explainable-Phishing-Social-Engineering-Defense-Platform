"use client";

import { useState, useEffect } from 'react';
import { testConnection, checkHealth, getAPIInfo, HealthResponse } from '@/lib/api';
import { Card, Badge, Button } from '@/components/ui';
import { Server, CheckCircle2, XCircle, RefreshCw, Database, Zap } from 'lucide-react';

export default function APITestPage() {
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [healthData, setHealthData] = useState<HealthResponse | null>(null);
    const [apiInfo, setApiInfo] = useState<any>(null);
    const [error, setError] = useState<string>('');

    const handleTestConnection = async () => {
        setConnectionStatus('testing');
        setError('');

        try {
            const result = await testConnection();
            if (result.success) {
                setConnectionStatus('success');
            } else {
                setConnectionStatus('error');
                setError('Connection failed');
            }
        } catch (err) {
            setConnectionStatus('error');
            setError(err instanceof Error ? err.message : 'Connection failed');
        }
    };

    const handleCheckHealth = async () => {
        try {
            const health = await checkHealth();
            setHealthData(health);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Health check failed');
        }
    };

    const handleGetAPIInfo = async () => {
        try {
            const info = await getAPIInfo();
            setApiInfo(info);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get API info');
        }
    };

    useEffect(() => {
        // Auto-test connection on mount
        handleTestConnection();
        handleCheckHealth();
        handleGetAPIInfo();
    }, []);

    return (
        <main className="min-h-screen py-20 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="info" size="lg" className="mb-6">API Connection Test</Badge>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="text-gradient-primary">Backend</span>
                        <br />
                        <span className="text-dark-100">Connection Status</span>
                    </h1>
                    <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                        Verify frontend-backend communication and API health
                    </p>
                </div>

                {/* Connection Status */}
                <Card variant="neon" className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Server className="w-6 h-6 text-primary-400" />
                        <h2 className="text-2xl font-bold text-dark-100">Connection Test</h2>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        {connectionStatus === 'idle' && (
                            <div className="flex items-center gap-2 text-dark-400">
                                <div className="w-3 h-3 rounded-full bg-dark-500"></div>
                                <span>Not tested</span>
                            </div>
                        )}
                        {connectionStatus === 'testing' && (
                            <div className="flex items-center gap-2 text-primary-400">
                                <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>
                                <span>Testing connection...</span>
                            </div>
                        )}
                        {connectionStatus === 'success' && (
                            <div className="flex items-center gap-2 text-success-400">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-semibold">Connected Successfully!</span>
                            </div>
                        )}
                        {connectionStatus === 'error' && (
                            <div className="flex items-center gap-2 text-danger-400">
                                <XCircle className="w-5 h-5" />
                                <span className="font-semibold">Connection Failed</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="glass rounded-lg p-4 mb-4 border-l-4 border-danger-500">
                            <p className="text-danger-400 text-sm">{error}</p>
                        </div>
                    )}

                    <Button
                        variant="primary"
                        icon={RefreshCw}
                        onClick={() => {
                            handleTestConnection();
                            handleCheckHealth();
                            handleGetAPIInfo();
                        }}
                    >
                        Refresh All
                    </Button>
                </Card>

                {/* Health Status */}
                {healthData && (
                    <Card variant="glow" className="mb-8 border-success-500/50">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="w-6 h-6 text-success-400" />
                            <h2 className="text-2xl font-bold text-dark-100">Health Check</h2>
                            <Badge variant="success" pulse>Healthy</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="glass rounded-lg p-4">
                                <div className="text-sm text-dark-400 mb-1">Status</div>
                                <div className="text-lg font-bold text-success-400">{healthData.status}</div>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <div className="text-sm text-dark-400 mb-1">Version</div>
                                <div className="text-lg font-bold text-dark-100">{healthData.version}</div>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <div className="text-sm text-dark-400 mb-1">Timestamp</div>
                                <div className="text-sm font-mono text-dark-200">
                                    {new Date(healthData.timestamp).toLocaleString()}
                                </div>
                            </div>
                            <div className="glass rounded-lg p-4">
                                <div className="text-sm text-dark-400 mb-1">Message</div>
                                <div className="text-sm text-dark-200">{healthData.message}</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-dark-100 mb-3 flex items-center gap-2">
                                <Database className="w-5 h-5 text-accent-400" />
                                Services Status
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="glass rounded-lg p-3">
                                    <div className="text-sm text-dark-400 mb-1">MongoDB</div>
                                    <Badge variant={healthData.services.mongodb === 'connected' ? 'success' : 'warning'}>
                                        {healthData.services.mongodb}
                                    </Badge>
                                </div>
                                <div className="glass rounded-lg p-3">
                                    <div className="text-sm text-dark-400 mb-1">Redis</div>
                                    <Badge variant={healthData.services.redis === 'connected' ? 'success' : 'warning'}>
                                        {healthData.services.redis}
                                    </Badge>
                                </div>
                                <div className="glass rounded-lg p-3">
                                    <div className="text-sm text-dark-400 mb-1">ML Engine</div>
                                    <Badge variant="success">{healthData.services.ml_engine}</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* API Info */}
                {apiInfo && (
                    <Card variant="default">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-6 h-6 text-primary-400" />
                            <h2 className="text-2xl font-bold text-dark-100">API Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-dark-400 mb-2">API Name</div>
                                <div className="text-lg font-bold text-dark-100">{apiInfo.api_name}</div>
                            </div>

                            <div>
                                <div className="text-sm text-dark-400 mb-2">Description</div>
                                <div className="text-dark-200">{apiInfo.description}</div>
                            </div>

                            <div>
                                <div className="text-sm text-dark-400 mb-2">Features</div>
                                <div className="flex flex-wrap gap-2">
                                    {apiInfo.features?.map((feature: string, index: number) => (
                                        <Badge key={index} variant="info" size="sm">{feature}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-dark-400 mb-2">Available Endpoints</div>
                                <div className="glass rounded-lg p-4 font-mono text-sm space-y-1">
                                    {Object.entries(apiInfo.endpoints || {}).map(([key, value]) => (
                                        <div key={key} className="text-dark-300">
                                            <span className="text-accent-400">{key}:</span> {value as string}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </main>
    );
}
