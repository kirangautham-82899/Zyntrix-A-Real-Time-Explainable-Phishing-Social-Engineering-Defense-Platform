import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    size?: 'sm' | 'md' | 'lg';
    pulse?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    (
        {
            children,
            variant = 'default',
            size = 'md',
            pulse = false,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles = 'badge inline-flex items-center gap-1.5';

        const variantStyles = {
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger',
            info: 'bg-primary-500/20 text-primary-400 border border-primary-500/50',
            default: 'bg-dark-700/50 text-dark-300 border border-dark-600/50',
        };

        const sizeStyles = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-3 py-1 text-sm',
            lg: 'px-4 py-1.5 text-base',
        };

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${pulse ? 'pulse-glow' : ''} ${className}`}
                {...props}
            >
                {pulse && (
                    <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant === 'success' ? 'bg-success-400' :
                                variant === 'warning' ? 'bg-warning-400' :
                                    variant === 'danger' ? 'bg-danger-400' :
                                        variant === 'info' ? 'bg-primary-400' :
                                            'bg-dark-400'
                            }`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${variant === 'success' ? 'bg-success-500' :
                                variant === 'warning' ? 'bg-warning-500' :
                                    variant === 'danger' ? 'bg-danger-500' :
                                        variant === 'info' ? 'bg-primary-500' :
                                            'bg-dark-500'
                            }`}></span>
                    </span>
                )}
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

export default Badge;
