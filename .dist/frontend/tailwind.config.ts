import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        neonBlue: "#00e5ff",
        finGreen: "#00ff7f",
        danger:   "#ff4444",
        card:     "rgba(5,8,22,0.85)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-blue":  "0 0 12px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.1)",
        "glow-green": "0 0 12px rgba(0,255,127,0.4), 0 0 40px rgba(0,255,127,0.1)",
        "glow-red":   "0 0 12px rgba(255,68,68,0.4), 0 0 40px rgba(255,68,68,0.1)",
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease forwards",
        "pulse-dot":"pulse-dot 1.5s ease infinite",
        "ticker":   "ticker 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%":     { opacity: "0.5", transform: "scale(1.5)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
