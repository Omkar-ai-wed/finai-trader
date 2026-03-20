import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#06060f",
        cyber: {
          cyan:   "#00f5ff",
          violet: "#a855f7",
          green:  "#10ffd1",
          red:    "#ff3d6e",
          amber:  "#fbbf24",
          pink:   "#ec4899",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.04)",
          hover:   "rgba(255,255,255,0.08)",
          border:  "rgba(255,255,255,0.10)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-cyan":   "0 0 20px rgba(0,245,255,0.4),  0 0 60px rgba(0,245,255,0.12)",
        "glow-violet": "0 0 20px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.12)",
        "glow-green":  "0 0 20px rgba(16,255,209,0.4), 0 0 60px rgba(16,255,209,0.12)",
        "glow-red":    "0 0 20px rgba(255,61,110,0.4), 0 0 60px rgba(255,61,110,0.12)",
        "glow-amber":  "0 0 20px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.12)",
        "glass":       "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
        "glass-lg":    "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.09)",
      },
      backdropBlur: {
        glass: "24px",
        sidebar: "32px",
      },
      animation: {
        "fade-in":     "fadeIn 0.4s ease forwards",
        "fade-in-up":  "fadeInUp 0.5s ease forwards",
        "pulse-dot":   "pulse-dot 1.5s ease infinite",
        "ticker":      "ticker 25s linear infinite",
        "float":       "float 4s ease-in-out infinite",
        "glow-pulse":  "glow-pulse 2.5s ease infinite",
        "shimmer":     "shimmer 1.8s ease infinite",
        "scan-line":   "scan-line 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1",   transform: "scale(1)" },
          "50%":     { opacity: "0.4", transform: "scale(1.6)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.6" },
          "50%":     { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scan-line": {
          "0%":   { transform: "translateY(-100%)", opacity: "0" },
          "10%":  { opacity: "1" },
          "90%":  { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
