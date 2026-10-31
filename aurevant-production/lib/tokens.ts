/**
 * AUREVANT AUCTION HOUSE — Curatorial Design System Tokens
 * Defines color palettes, typography stacks, easing curves, and layout constants.
 */

export const COLORS = {
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
} as const;

export const TYPOGRAPHY = {
  fonts: {
    serif: 'var(--font-instrument-serif)',
    sans: 'var(--font-manrope)',
    mono: 'var(--font-ibm-plex-mono)',
  },
  letterSpacing: {
    curatorial: '0.25em',
    curatorialWide: '0.30em',
    subtle: '0.12em',
  },
} as const;

export const MOTION = {
  easing: {
    curatorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
    tactile: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  duration: {
    hover: 180,
    menu: 320,
    reveal: 800,
  },
} as const;

export const LIGHTING = {
  keyLight: {
    color: '#FFF8EE',
    intensity: 1.8,
    position: [2.5, 3.2, 2.8] as [number, number, number],
  },
  fillLight: {
    color: '#7C8B9E',
    intensity: 0.6,
    position: [-2.2, 1.4, 2.0] as [number, number, number],
  },
  rimLight: {
    color: '#EAD8B0',
    intensity: 1.0,
    position: [0.0, 3.0, -2.5] as [number, number, number],
  },
  ambient: {
    color: '#2F2318',
    intensity: 0.35,
  },
} as const;

export type ColorPalette = typeof COLORS;
export type TypographyTokens = typeof TYPOGRAPHY;
export type MotionTokens = typeof MOTION;
export type LightingTokens = typeof LIGHTING;
