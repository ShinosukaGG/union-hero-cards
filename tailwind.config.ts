// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // UNION brand
        uc: {
          black: "#000000",
          bg: "#0a0b10",
          panel: "#101217",
          grid: "#1b1f2a",
          text: "#E8ECF1",
          muted: "#A7B0BE",
          teal: "#14D2C5",
          teal2: "#2FE6D9",
          purple: "#7A3CFF",
          cyan: "#A8ECFD",
          common: "#7B8AA3",
          rare: "#18D6B0",
          epic: "#A676FF",
          legend: "#FFE9B3",
          line: "#2a2f3a",
          line2: "#2c3240",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        uc1: "0 10px 30px rgba(0,0,0,0.55)",
        uc2: "0 24px 80px rgba(0,0,0,0.9)",
        "uc-focus": "0 0 0 3px rgba(20,210,197,0.28)",
      },
      backgroundImage: {
        "uc-card": "linear-gradient(180deg, #171b25, #0f131b)",
        "uc-input": "linear-gradient(180deg, #0f1219, #0b0d13)",
        "uc-btn": "linear-gradient(180deg, #1b2230, #141a26)",
      },
      keyframes: {
        shineMove: {
          "0%":   { transform: "rotate(35deg) translate3d(-200%,0,0)" },
          "60%":  { transform: "rotate(35deg) translate3d(80%,0,0)" },
          "100%": { transform: "rotate(35deg) translate3d(120%,0,0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(20,210,197,.6)" },
          "50%":      { boxShadow: "0 0 24px rgba(20,210,197,1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "translateX(0) rotate(0)" },
          "25%":      { transform: "translateX(-2px) rotate(-1.5deg)" },
          "75%":      { transform: "translateX(2px) rotate(1.5deg)" },
        },
        aura: {
          "0%, 100%": { opacity: ".6", transform: "scale(1)" },
          "50%":      { opacity: "1", transform: "scale(1.07)" },
        },
        sparkle: {
          "0%":   { transform: "scale(.5)", opacity: "0" },
          "50%":  { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(.5)", opacity: "0" },
        },
      },
      animation: {
        "shine": "shineMove 3.5s ease-in-out .8s infinite",
        "shimmer": "shimmer 1.2s linear infinite",
        "float": "float 3.5s ease-in-out infinite",
        "glow": "glowPulse 2s ease-in-out infinite",
        "wiggle": "wiggle .4s ease-in-out",
        "aura": "aura 3s ease-in-out infinite",
        "sparkle": "sparkle 1.8s linear infinite",
      },
      borderRadius: {
        card: "22px",
        img: "14px",
      },
    },
  },
  plugins: [
    // Optional: utility for the rarity gradients/glows if you want class-based control
    function ({ addUtilities, theme }) {
      const rarity = {
        ".rarity-common": {
          "--rarity-color": theme("colors.uc.common"),
        },
        ".rarity-rare": {
          "--rarity-color": theme("colors.uc.rare"),
        },
        ".rarity-epic": {
          "--rarity-color": theme("colors.uc.epic"),
        },
        ".rarity-legend": {
          "--rarity-color": theme("colors.uc.legend"),
        },
        ".uc-card-glow": {
          position: "relative",
        },
        ".uc-card-glow::before": {
          content: '""',
          position: "absolute",
          inset: "-1px",
          borderRadius: theme("borderRadius.card"),
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: ".85",
          background:
            "radial-gradient(600px 400px at 30% -10%, color-mix(in srgb, var(--rarity-color) 55%, transparent) 0%, transparent 60%)",
        },
      };
      addUtilities(rarity);
    },
  ],
};

export default config;
