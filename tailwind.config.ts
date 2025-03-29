import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", ".dark"],
  important: true,
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Chart colors
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
        // Sidebar colors
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        "shimmer": "shimmer 6s infinite linear",
        "pulse-slow": "pulse 4s infinite cubic-bezier(0.4, 0, 0.6, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateY(-25%) translateX(-25%) rotate(25deg)" },
          "100%": { transform: "translateY(25%) translateX(25%) rotate(25deg)" },
        },
      },
      backgroundImage: {
        "blockchain-gradient": "linear-gradient(130deg, rgba(81, 56, 238, 0.03) 0%, rgba(111, 78, 255, 0.05) 25%, rgba(255, 86, 246, 0.04) 50%, rgba(255, 176, 109, 0.03) 100%)",
        "hero-glow": "radial-gradient(circle at 10% 25%, rgba(126, 78, 255, 0.18) 0%, transparent 25%), radial-gradient(circle at 85% 80%, rgba(238, 56, 199, 0.12) 0%, transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config; 