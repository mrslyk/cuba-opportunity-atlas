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
        // Light "daylight terminal" surfaces
        bg: "#f4f7fb",
        surface: "#ffffff",
        surface2: "#eef2f8",
        line: "#e2e8f1",
        // Ink / type
        text: "#0e1828",
        fog: "#46586f",
        ghost: "#8493a8",
        // Ownership
        state: "#dc2626", // red — state
        jv: "#d97706", // amber — joint venture
        private: "#059669", // emerald — private
        // Legal / status
        invest: "#059669",
        atlas: "#0284c7",
        risk: "#ea580c", // Title III risk
        sdn: "#dc2626", // SDN / restricted
        // Brand gradient stops
        brand1: "#10b981",
        brand2: "#06b6d4",
        brand3: "#3b82f6",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)",
        cardhover: "0 4px 12px rgba(16,24,40,.08), 0 2px 6px rgba(16,24,40,.05)",
        glow: "0 8px 30px rgba(6,182,212,.18)",
      },
      maxWidth: {
        prose2: "70ch",
      },
      backgroundImage: {
        brand: "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
