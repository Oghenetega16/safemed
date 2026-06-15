import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT: "#F5F6FB",
          surface: "#FFFFFF",
          subtle: "#F0F2F9",
        },
        ink: {
          DEFAULT: "#171A2B",
          muted: "#8B90A8",
          faint: "#C2C5D6",
        },
        border: {
          DEFAULT: "#ECEEF6",
        },
        brand: {
          DEFAULT: "#3E6BFF",
          50: "#EEF2FF",
          100: "#DDE5FF",
          500: "#3E6BFF",
          600: "#2F54E0",
        },
        rose: {
          soft: "#FFE3E8",
          DEFAULT: "#FF6B81",
        },
        mint: {
          soft: "#DDF6EC",
          DEFAULT: "#1FCB8F",
        },
        amber: {
          soft: "#FFF3DA",
          DEFAULT: "#FFB648",
        },
        violet: {
          soft: "#EAE6FF",
          DEFAULT: "#8C6CFF",
        },
        sky: {
          soft: "#E2F0FF",
          DEFAULT: "#3EA8FF",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.5rem",
      },
      boxShadow: {
        card: "0 2px 24px -8px rgba(23, 26, 43, 0.06)",
        soft: "0 8px 32px -12px rgba(62, 107, 255, 0.18)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
