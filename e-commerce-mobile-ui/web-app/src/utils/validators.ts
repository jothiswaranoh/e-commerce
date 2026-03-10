// Email validation
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation (supports various formats)
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password strength calculation
export interface PasswordStrength {
    score: number; // 0-4
    label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
    color: string;
    requirements: {
        minLength: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasNumber: boolean;
        hasSpecial: boolean;
    };
}

export const getPasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;

    let score = 0;
    let label: PasswordStrength['label'] = 'Weak';
    let color = '#ef4444'; // red

    if (metRequirements === 5 && password.length >= 12) {
        score = 4;
        label = 'Very Strong';
        color = '#10b981'; // green
    } else if (metRequirements >= 4) {
        score = 3;
        label = 'Strong';
        color = '#10b981'; // green
    } else if (metRequirements >= 3) {
        score = 2;
        label = 'Good';
        color = '#f59e0b'; // yellow
    } else if (metRequirements >= 2) {
        score = 1;
        label = 'Fair';
        color = '#f59e0b'; // yellow
    }

    return { score, label, color, requirements };
};

// Validate password meets minimum requirements
export const validatePassword = (password: string): boolean => {
    const strength = getPasswordStrength(password);
    return strength.score >= 2; // At least "Good"
};

// Name validation
export const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
};

// Generic required field validation
export const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
};
