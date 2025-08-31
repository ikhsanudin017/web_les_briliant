import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          DEFAULT: "#2463EB",
          foreground: "#ffffff"
        },
        admin: {
          DEFAULT: "#DC2626", // red-600
          foreground: "#ffffff"
        },
        student: {
          DEFAULT: "#059669", // emerald-600
          foreground: "#ffffff"
        }
      },
      container: {
        center: true,
        padding: "1rem"
      },
      keyframes: {
        enter: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        enter: "enter 0.15s ease-out"
      }
    }
  },
  plugins: [animate]
};

export default config;
