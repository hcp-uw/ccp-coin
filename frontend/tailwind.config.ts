import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "rgb(var(--color-obsidian) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / 1)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        up: "rgb(var(--color-up) / <alpha-value>)",
        down: "rgb(var(--color-down) / <alpha-value>)",
        xp: "rgb(var(--color-xp) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-mono)", "monospace"], // Defaulting everything to mono for the terminal feel
        display: ["var(--font-arcade)", "monospace"], // Arcade font for headers
        mono: ["var(--font-mono)", "monospace"],
        arcade: ["var(--font-arcade)", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,240,255,1), 4px 4px 0px 0px rgba(0,240,255,0.4)", // Hard Arcade glow
        block: "4px 4px 0px 0px"
      },
      animation: {
        blink: "blink 1s step-end infinite",
        scanline: "scanline 8s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
