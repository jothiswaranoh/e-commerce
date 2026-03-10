/**
 * Layout Configuration Constants
 * Defines consistent layout dimensions and configurations
 */

export const LAYOUT = {
    // Container Max Widths
    container: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        full: '100%',
    },

    // Header/Navigation
    header: {
        height: '4rem',        // 64px
        heightMobile: '3.5rem', // 56px
    },

    // Footer
    footer: {
        height: 'auto',
        minHeight: '12rem',    // 192px
    },

    // Sidebar (Admin)
    sidebar: {
        width: '16rem',        // 256px
        widthCollapsed: '4rem', // 64px
    },

    // Grid Configurations
    grid: {
        products: {
            mobile: 1,
            tablet: 2,
            desktop: 3,
            wide: 4,
        },

        dashboard: {
            mobile: 1,
            tablet: 2,
            desktop: 3,
            wide: 4,
        },
    },

    // Content Spacing
    section: {
        paddingY: {
            mobile: '3rem',      // 48px
            desktop: '5rem',     // 80px
        },
        paddingX: {
            mobile: '1rem',      // 16px
            desktop: '1.5rem',   // 24px
        },
    },
} as const;

export const ADMIN_LAYOUT = {
    sidebar: {
        width: '16rem',
        widthCollapsed: '4rem',
        transitionDuration: '300ms',
    },

    header: {
        height: '4rem',
    },

    content: {
        padding: '2rem',
        paddingMobile: '1rem',
    },
} as const;
