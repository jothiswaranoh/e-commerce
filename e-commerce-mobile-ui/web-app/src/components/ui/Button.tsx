import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            fullWidth = false,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl focus:ring-primary-500',
            secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white hover:from-secondary-700 hover:to-secondary-600 shadow-lg hover:shadow-xl focus:ring-secondary-500',
            outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
            ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-400',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl focus:ring-red-500',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-2.5 text-base',
            lg: 'px-8 py-3 text-lg',
        };

        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
