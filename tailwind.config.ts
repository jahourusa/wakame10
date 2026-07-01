import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- existing wakame10 palette (kept for backward compat) ----
        gold: "#BF933A",
        "gold-light": "#F0BF61",
        "gold-dark": "#8A6A2A",
        dark: "#060E0B",
        "dark-2": "#0A1612",
        "dark-3": "#0F1F19",
        "dark-4": "#142822",
        "dark-5": "#1A322B",
        cream: "#F5F0E8",
        // ---- new redesign palette (kuro / washi / refined gold) ----
        kuro: "#07100c",
        "kuro-2": "#0c1a13",
        "kuro-3": "#122620",
        "gold-bright": "#e9cd8b",
        "gold-dim": "#8a6f3c",
        washi: "#f4eddd",
        "washi-2": "#ece1c8",
        "washi-3": "#e2d4b4",
        ink: "#22302a",
        "ink-soft": "#5a6660",
        hanko: "#b23a2a",
      },
      fontFamily: {
        // ---- existing (Playfair + Inter) ----
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        // ---- new redesign fonts ----
        mincho: ["var(--font-mincho)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        jost: ["var(--font-jost)", "sans-serif"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
        elegant: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "400": "400ms",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "grain-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-4%, 3%)" },
          "40%": { transform: "translate(3%, -4%)" },
          "60%": { transform: "translate(-3%, -2%)" },
          "80%": { transform: "translate(4%, 4%)" },
        },
        "gold-breathe": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 0 rgba(201, 164, 92, 0.35), 0 8px 30px -8px rgba(201, 164, 92, 0.45)",
          },
          "50%": {
            boxShadow:
              "0 0 0 7px rgba(201, 164, 92, 0), 0 8px 42px -4px rgba(201, 164, 92, 0.65)",
          },
        },
        "steam-rise": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translateY(-70px) scale(1.25)", opacity: "0.9" },
        },
      },
      animation: {
        fadeUp: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) forwards",
        marquee: "marquee 30s linear infinite",
        "gold-breathe": "gold-breathe 3.2s ease-in-out infinite",
        "steam-rise": "steam-rise 12s ease-in-out infinite",
      },
      boxShadow: {
        gold: "0 4px 20px rgba(191,147,58,0.25)",
        "gold-hover": "0 8px 40px rgba(191,147,58,0.4)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};

export default config;
