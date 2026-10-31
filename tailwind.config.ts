import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F4F0E8",
          dark: "#EDE7DC",
        },
        forest: {
          DEFAULT: "#182720",
          hover: "#24382E",
          subtle: "#2A4237",
        },
        lime: {
          DEFAULT: "#D7E65A",
          hover: "#E2F06B",
          glow: "rgba(215, 230, 90, 0.25)",
        },
        stone: {
          hairline: "#D8D0C2",
          surface: "#EDE7DC",
          muted: "#9E9689",
        },
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      aspectRatio: {
        "4/5": "4 / 5",
      },
      boxShadow: {
        tactile: "0 2px 4px rgba(24, 39, 32, 0.04), 0 1px 2px rgba(24, 39, 32, 0.06)",
        "tactile-hover": "0 8px 16px rgba(24, 39, 32, 0.08), 0 2px 4px rgba(24, 39, 32, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
