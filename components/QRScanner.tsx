"use client";

import { useState, useRef, useCallback } from 'react';
import { QrCode, Upload, Camera, X, CheckCircle2 } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

export interface QRScannerProps {
    onScan?: (url: string) => void;
    onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
    const [scannedUrl, setScannedUrl] = useState<string>('');
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload
    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            const errorMsg = 'Please upload an image file (JPG, PNG, WebP)';
            setError(errorMsg);
            onError?.(errorMsg);
            return;
        }

        setIsScanning(true);
        setError('');
        setScannedUrl('');

        try {
            // Create image element
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };

            img.onload = async () => {
                try {
                    // Create canvas to process image
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    if (!context) {
                        throw new Error('Could not get canvas context');
                    }

                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);

                    // Get image data
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                    // Use jsQR to decode (we'll import this dynamically)
                    const jsQR = (await import('jsqr')).default;
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code && code.data) {
                        setScannedUrl(code.data);
                        onScan?.(code.data);
                    } else {
                        const errorMsg = 'No QR code found in image. Please try another image.';
                        setError(errorMsg);
                        onError?.(errorMsg);
                    }
                } catch (err) {
                    const errorMsg = 'Failed to decode QR code';
                    setError(errorMsg);
                    onError?.(errorMsg);
                    console.error(err);
                } finally {
                    setIsScanning(false);
                }
            };

            reader.readAsDataURL(file);
        } catch (err) {
            const errorMsg = 'Failed to process image';
            setError(errorMsg);
            onError?.(errorMsg);
            setIsScanning(false);
            console.error(err);
        }
    }, [onScan, onError]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleClear = () => {
        setScannedUrl('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onClick={handleUploadClick}
                className={`glass rounded-lg p-12 text-center border-2 border-dashed transition-all cursor-pointer ${isScanning
                        ? 'border-primary-500 bg-primary-500/5'
                        : error
                            ? 'border-danger-500 bg-danger-500/5 hover:border-danger-400'
                            : scannedUrl
                                ? 'border-success-500 bg-success-500/5'
                                : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-800/50'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />

                {isScanning ? (
                    <>
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-primary-400 font-semibold mb-2">Scanning QR Code...</p>
                        <p className="text-sm text-dark-400">Processing image</p>
                    </>
                ) : scannedUrl ? (
                    <>
                        <CheckCircle2 className="w-16 h-16 text-success-400 mx-auto mb-4" />
                        <p className="text-success-400 font-semibold mb-2">QR Code Scanned!</p>
                        <p className="text-sm text-dark-400">URL extracted successfully</p>
                    </>
                ) : error ? (
                    <>
                        <X className="w-16 h-16 text-danger-400 mx-auto mb-4" />
                        <p className="text-danger-400 font-semibold mb-2">Scan Failed</p>
                        <p className="text-sm text-dark-400">{error}</p>
                    </>
                ) : (
                    <>
                        <QrCode className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                        <p className="text-dark-300 mb-2 font-semibold">Click to upload QR code image</p>
                        <p className="text-sm text-dark-500">Supports JPG, PNG, WebP</p>
                    </>
                )}
            </div>

            {/* Scanned URL Display */}
            {scannedUrl && (
                <Card variant="glow" className="border-success-500/50 animate-slide-up">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-success-400 mb-2">Extracted URL</h4>
                            <div className="glass rounded-lg p-3 mb-3">
                                <p className="text-dark-200 break-all font-mono text-sm">{scannedUrl}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => onScan?.(scannedUrl)}
                                >
                                    Analyze This URL
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleClear}>
                                    Scan Another
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Info */}
            <div className="flex items-center gap-2 text-sm text-dark-400">
                <Upload className="w-4 h-4" />
                <span>Upload a QR code image to extract and analyze the embedded URL</span>
            </div>
        </div>
    );
}
