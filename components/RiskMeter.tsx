"use client";

import { useEffect, useState } from 'react';

export interface RiskMeterProps {
    score: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
    showLabel?: boolean;
}

export default function RiskMeter({
    score,
    size = 'md',
    animated = true,
    showLabel = true
}: RiskMeterProps) {
    const [displayScore, setDisplayScore] = useState(0);

    // Animate score counting up
    useEffect(() => {
        if (!animated) {
            setDisplayScore(score);
            return;
        }

        let start = 0;
        const duration = 1500; // 1.5 seconds
        const increment = score / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= score) {
                setDisplayScore(score);
                clearInterval(timer);
            } else {
                setDisplayScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [score, animated]);

    // Determine risk level and colors
    const getRiskLevel = (s: number): { level: string; color: string; bgColor: string; textColor: string } => {
        if (s <= 30) {
            return {
                level: 'SAFE',
                color: '#00ff00',
                bgColor: 'rgba(0, 255, 0, 0.1)',
                textColor: 'rgb(51, 255, 51)'
            };
        } else if (s <= 70) {
            return {
                level: 'SUSPICIOUS',
                color: '#ffaa00',
                bgColor: 'rgba(255, 170, 0, 0.1)',
                textColor: 'rgb(255, 191, 51)'
            };
        } else {
            return {
                level: 'DANGEROUS',
                color: '#ff0000',
                bgColor: 'rgba(255, 0, 0, 0.1)',
                textColor: 'rgb(255, 51, 51)'
            };
        }
    };

    const risk = getRiskLevel(displayScore);

    // Size configurations
    const sizes = {
        sm: { width: 120, strokeWidth: 8, fontSize: '1.5rem', labelSize: '0.75rem' },
        md: { width: 200, strokeWidth: 12, fontSize: '3rem', labelSize: '1rem' },
        lg: { width: 280, strokeWidth: 16, fontSize: '4rem', labelSize: '1.25rem' },
    };

    const config = sizes[size];
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Circular Progress */}
            <div className="relative" style={{ width: config.width, height: config.width }}>
                {/* Background Circle */}
                <svg
                    width={config.width}
                    height={config.width}
                    className="transform -rotate-90"
                >
                    {/* Background track */}
                    <circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(72, 72, 74, 0.3)"
                        strokeWidth={config.strokeWidth}
                    />

                    {/* Progress circle */}
                    <circle
                        cx={config.width / 2}
                        cy={config.width / 2}
                        r={radius}
                        fill="none"
                        stroke={risk.color}
                        strokeWidth={config.strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{
                            filter: `drop-shadow(0 0 8px ${risk.color})`
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ backgroundColor: risk.bgColor, borderRadius: '50%', margin: config.strokeWidth }}
                >
                    <div
                        className="font-bold tabular-nums"
                        style={{ fontSize: config.fontSize, color: risk.textColor }}
                    >
                        {displayScore}
                    </div>
                    <div className="text-dark-400 text-sm font-semibold">/ 100</div>
                </div>
            </div>

            {/* Label */}
            {showLabel && (
                <div className="text-center">
                    <div
                        className="font-bold mb-1"
                        style={{ fontSize: config.labelSize, color: risk.textColor }}
                    >
                        {risk.level}
                    </div>
                    <div className="text-dark-400 text-sm">Risk Level</div>
                </div>
            )}
        </div>
    );
}
