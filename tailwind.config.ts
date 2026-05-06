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
        gold: "#BF933A",
        "gold-light": "#F0BF61",
        "gold-dark": "#8A6A2A",
        dark: "#060E0B",
        "dark-2": "#0A1612",
        "dark-3": "#0F1F19",
        "dark-4": "#142822",
        "dark-5": "#1A322B",
        cream: "#F5F0E8",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
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
      },
      animation: {
        fadeUp: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) forwards",
        marquee: "marquee 30s linear infinite",
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
