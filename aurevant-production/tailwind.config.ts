import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        museum: {
          DEFAULT: '#101113', // Primary deep museum dark ground
          dark: '#0B0D0C',    // Hero background deepest floor
          surface: '#151817', // Elevated card / plaque surface
          translucent: 'rgba(16, 17, 19, 0.85)', // Header translucent backdrop
        },
        ivory: {
          DEFAULT: '#F4F0E8', // Primary body text / Warm Ivory
          porcelain: '#FAF8F5', // Brand wordmark highlight
          subtle: '#EDE7DC',   // Subdued card fill
        },
        gold: {
          DEFAULT: '#C5A059', // Antique gold accent (headline line 2, active selector 01, primary CTAs)
          hover: '#D8B26A',   // Primary CTA hover state
          subtle: 'rgba(197, 160, 89, 0.22)', // Hairline borders & dividers
          glow: 'rgba(197, 160, 89, 0.12)',   // Curatorial focus rings
          hairline: 'rgba(197, 160, 89, 0.35)', // Active element borders
        },
        stone: {
          DEFAULT: '#D8D0C2', // Curatorial Stone hairline & secondary text
          muted: '#A7A39A',   // Supporting paragraph copy, inactive selectors
          smoke: '#6E6A63',   // Search placeholder & subtle captions
          hairline: 'rgba(216, 208, 194, 0.15)', // Hairline dividers
        },
      },
      fontFamily: {
        serif: [
          'var(--font-instrument-serif)',
          'Georgia',
          'Cambria',
          "'Times New Roman'",
          'Times',
          'serif',
        ],
        sans: [
          'var(--font-manrope)',
          '-apple-system',
          'BlinkMacSystemFont',
          "'Segoe UI'",
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'var(--font-ibm-plex-mono)',
          "'SFMono-Regular'",
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      letterSpacing: {
        curatorial: '0.25em',
        'curatorial-wide': '0.30em',
        subtle: '0.12em',
      },
      boxShadow: {
        plaque: '0 12px 32px rgba(0, 0, 0, 0.60)',
        curatorial: '0 4px 20px rgba(0, 0, 0, 0.40)',
        'gold-glow': '0 0 24px rgba(197, 160, 89, 0.15)',
      },
      transitionTimingFunction: {
        curatorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
        tactile: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        hover: '180ms',
        menu: '320ms',
        reveal: '800ms',
      },
    },
  },
  plugins: [],
};

export default config;
