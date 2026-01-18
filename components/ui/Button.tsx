import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'accent' | 'success' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            icon: Icon,
            iconPosition = 'left',
            loading = false,
            fullWidth = false,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'btn inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary: 'btn-primary',
            accent: 'btn-accent',
            success: 'bg-gradient-to-r from-success-600 to-success-500 text-dark-950 hover:from-success-500 hover:to-success-400 hover:shadow-lg hover:glow-success focus:ring-success-500',
            danger: 'bg-gradient-to-r from-danger-600 to-danger-500 text-white hover:from-danger-500 hover:to-danger-400 hover:shadow-lg hover:glow-danger focus:ring-danger-500',
            ghost: 'btn-ghost',
        };

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm rounded-md',
            md: 'px-6 py-3 text-base rounded-lg',
            lg: 'px-8 py-4 text-lg rounded-xl',
        };

        const widthStyle = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
                        {children}
                        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
