import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080808',
        foreground: '#ffffff',
        card: 'rgba(255, 255, 255, 0.045)',
        'card-foreground': '#ffffff',
        muted: 'rgba(255, 255, 255, 0.05)',
        'muted-foreground': '#b5b5b5',
        border: 'rgba(255, 255, 255, 0.08)',
        gold: {
          50: '#fffbf0',
          100: '#fff8e7',
          200: '#ffefd5',
          300: '#ffe4b5',
          400: '#ffd700',
          500: '#d4af37',
          600: '#c19a3a',
          700: '#8c6b1f',
          800: '#5c4813',
          900: '#3d2f0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      animation: {
        'border-rotate': 'border-rotate 6s linear infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'drift': 'drift 18s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        'border-rotate': {
          'to': { '--angle': '360deg' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'drift': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-30px, 20px) scale(0.96)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
