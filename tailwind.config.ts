import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal / Bloomberg-dark palette
        ink: {
          950: "#070a0f",
          900: "#0b1018",
          800: "#111927",
          700: "#1a2436",
          600: "#27344b",
        },
        line: "#22304a",
        text: "#e8eef7",
        fog: "#8da2c0",
        ghost: "#5b6b85",
        // Ownership badges
        state: "#ef4444", // red — state
        jv: "#f59e0b", // amber — joint venture
        private: "#22c55e", // green — private
        // Legal / status
        invest: "#22c55e",
        atlas: "#38bdf8",
        risk: "#f97316", // Title III risk
        sdn: "#dc2626", // SDN / restricted
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose2: "70ch",
      },
    },
  },
  plugins: [],
};

export default config;
