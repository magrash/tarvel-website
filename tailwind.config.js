/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Egyptian Gold palette
                gold: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                // Scarab Teal
                scarab: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                // Papyrus cream
                papyrus: {
                    50: '#fefdfb',
                    100: '#fdf8f0',
                    200: '#f9f0e0',
                    300: '#f3e4c9',
                    400: '#e8d4a8',
                    500: '#dcc287',
                    600: '#c9a962',
                    700: '#a88a4a',
                    800: '#8a6f3b',
                    900: '#725a31',
                },
                // Obsidian dark
                obsidian: {
                    50: '#f8f8f8',
                    100: '#e8e8e8',
                    200: '#d4d4d4',
                    300: '#a3a3a3',
                    400: '#737373',
                    500: '#525252',
                    600: '#404040',
                    700: '#292929',
                    800: '#1a1a1a',
                    900: '#0d0d0d',
                    950: '#050505',
                },
                // Nile blue
                nile: {
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                },
                // Sunset orange
                sunset: {
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                },
            },
            fontFamily: {
                display: ['Cinzel', 'serif'],
                body: ['Inter', 'sans-serif'],
                hieroglyph: ['Noto Sans Egyptian Hieroglyphs', 'serif'],
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'draw-line': 'draw-line 2s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                'particle-float': 'particle-float 15s linear infinite',
                'scarab-crawl': 'scarab-crawl 0.5s ease-out forwards',
                'hologram-flicker': 'hologram-flicker 0.1s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(245, 158, 11, 0.8), 0 0 80px rgba(245, 158, 11, 0.5)'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'draw-line': {
                    '0%': { strokeDashoffset: '1000' },
                    '100%': { strokeDashoffset: '0' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'particle-float': {
                    '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
                },
                'scarab-crawl': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(var(--crawl-distance))' },
                },
                'hologram-flicker': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.95' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.3), transparent)',
                'hologram-gradient': 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(245, 158, 11, 0.1), rgba(20, 184, 166, 0.1))',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
