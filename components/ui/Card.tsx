import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glow' | 'neon';
    hover?: boolean;
    icon?: LucideIcon;
    iconColor?: string;
    title?: string;
    description?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            variant = 'default',
            hover = true,
            icon: Icon,
            iconColor = 'primary',
            title,
            description,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles = 'rounded-xl p-6 transition-all duration-300';

        const variantStyles = {
            default: hover ? 'card' : 'glass rounded-xl p-6',
            glow: 'card-glow',
            neon: 'glass neon-border',
        };

        const iconColorStyles = {
            primary: 'bg-gradient-cyber',
            accent: 'bg-gradient-to-br from-accent-600 to-accent-800',
            success: 'bg-gradient-success',
            danger: 'bg-gradient-danger',
            warning: 'bg-gradient-to-br from-warning-600 to-warning-800',
        };

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${className}`}
                {...props}
            >
                {Icon && (
                    <div className={`w-12 h-12 rounded-lg ${iconColorStyles[iconColor as keyof typeof iconColorStyles] || iconColorStyles.primary} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}

                {title && (
                    <h3 className="text-xl font-bold mb-2 text-dark-100">{title}</h3>
                )}

                {description && (
                    <p className="text-dark-400 mb-4">{description}</p>
                )}

                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
