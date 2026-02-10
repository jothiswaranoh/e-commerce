export const COLORS = {
    primary: {
        DEFAULT: '#232F3E', // Amazon Navy
        light: '#37475A',
        50: '#F3F5F7',
        100: '#E6E9EE',
        200: '#CCD3DC',
    },
    accent: {
        DEFAULT: '#FF9900', // Amazon Orange
        light: '#FFB84D',
        dark: '#E68A00',
        yellow: '#FFD814', // Amazon Main Button Yellow
    },
    secondary: {
        DEFAULT: '#37475A',
        light: '#485769',
    },
    neutral: {
        0: '#FFFFFF',
        50: '#F7F8F8',
        100: '#F0F2F2',
        200: '#E3E6E6',
        300: '#D5D9D9',
        400: '#888C8C',
        500: '#565959',
        600: '#333333',
        700: '#0F1111', // Amazon Black
        900: '#000000',
    },
    success: {
        DEFAULT: '#007600',
        light: '#E7F3E7',
        dark: '#004B00',
    },
    error: {
        DEFAULT: '#B12704', // Amazon Error Red
        light: '#FFF0ED',
    },
    info: {
        DEFAULT: '#007185', // Amazon Teal/Link Blue
        light: '#E6F7F9',
    },
    warning: {
        DEFAULT: '#C45500',
        light: '#FFF4E5',
    },
};

export const GRADIENTS = {
    primary: ['#232F3E', '#37475A'] as [string, string],
    secondary: ['#37475A', '#485769'] as [string, string],
    accent: ['#FFD814', '#F7CA00'] as [string, string], // Amazon Gold Button
    amazonHeader: ['#84fab0', '#8fd3f4'] as [string, string], // Amazon app-like teal
    headerDark: ['#232F3E', '#37475A'] as [string, string],
};

export const TYPOGRAPHY = {
    size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    weight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    // Compatibility aliases
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
};

export const BORDERS = {
    radius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },
    width: {
        thin: 1,
        medium: 2,
        thick: 3,
    },
};

export const SHADOWS = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    // Compatibility aliases
    primaryGlow: {
        shadowColor: COLORS.primary.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    accentGlow: {
        shadowColor: COLORS.accent.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
};
