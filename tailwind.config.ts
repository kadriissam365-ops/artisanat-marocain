import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Artisanat Marocain - Design System
        terracotta: {
          50: '#fdf4f0',
          100: '#fbe8de',
          200: '#f5ccb8',
          300: '#edaa8a',
          400: '#e28a5e',
          500: '#C1694F',
          600: '#a85539',
          700: '#8a4330',
          800: '#6d3527',
          900: '#5a2d22',
        },
        majorelle: {
          50: '#eff1fe',
          100: '#e2e5fd',
          200: '#cbcffb',
          300: '#abb0f7',
          400: '#8b8af1',
          500: '#6C63FF',
          600: '#5A4FE0',
          700: '#4B3FC4',
          800: '#3E359E',
          900: '#332D7D',
        },
        sand: {
          50: '#fdfcf9',
          100: '#faf5ec',
          200: '#f3e8d2',
          300: '#e8d5ae',
          400: '#d9bc82',
          500: '#C9A96E',
          600: '#b0904f',
          700: '#907440',
          800: '#755d36',
          900: '#604d2f',
        },
        zellige: {
          green: '#1B5E3B',
          blue: '#1E3A5F',
        },
        primary: {
          DEFAULT: '#C1694F',
          dark: '#a85539',
          light: '#e28a5e',
          foreground: '#ffffff',
        },
        moroccan: {
          green: '#1B5E3B',
          red: '#C1272D',
          gold: '#C9A96E',
        },
        // Couleurs système
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        arabic: ['Noto Sans Arabic', 'Tahoma', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
    },
  },
  plugins: [typography],
};

export default config;
