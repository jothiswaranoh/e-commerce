import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            variant = 'default',
            hoverable = false,
            padding = 'md',
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles = 'rounded-xl transition-all duration-300';

        const variants = {
            default: 'bg-white shadow-md',
            elevated: 'bg-white shadow-lg',
            outlined: 'bg-white border-2 border-neutral-200',
            glass: 'bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg',
        };

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };

        const hoverStyles = hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
