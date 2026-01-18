import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            icon: Icon,
            iconPosition = 'left',
            fullWidth = true,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
        const widthStyle = fullWidth ? 'w-full' : '';

        return (
            <div className={`${widthStyle}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-semibold text-dark-200 mb-2"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {Icon && iconPosition === 'left' && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={`input ${Icon && iconPosition === 'left' ? 'pl-11' : ''} ${Icon && iconPosition === 'right' ? 'pr-11' : ''} ${error ? 'border-danger-500 focus:ring-danger-500' : ''} ${className}`}
                        {...props}
                    />

                    {Icon && iconPosition === 'right' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-2 text-sm text-danger-400">{error}</p>
                )}

                {helperText && !error && (
                    <p className="mt-2 text-sm text-dark-400">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
