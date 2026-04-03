import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Startup Premium Palette
        "brand-primary": "#16a34a", // Startup Green
        "brand-secondary": "#2563eb", // Startup Blue
        "brand-accent": "#0ea5e9", // Sky Blue
        
        // Neutral Scale
        "neut-50": "#f9fafb",
        "neut-100": "#f3f4f6",
        "neut-200": "#e5e7eb",
        "neut-300": "#d1d5db",
        "neut-400": "#9ca3af",
        "neut-500": "#6b7280",
        "neut-600": "#4b5563",
        "neut-700": "#374151",
        "neut-800": "#1f2937",
        "neut-900": "#111827",

        // Semantic Colors
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#ef4444",
        "info": "#3b82f6",

        // Backgrounds & Overlays
        "glass-surface": "rgba(255, 255, 255, 0.7)",
        "glass-border": "rgba(255, 255, 255, 0.4)",
        "app-bg": "#ffffff",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"], // Poppins
        sans: ["var(--font-sans)", "sans-serif"], // Inter
      },
      boxShadow: {
        "startup-soft": "0 10px 30px rgba(0, 0, 0, 0.04)",
        "startup-medium": "0 20px 50px rgba(0, 0, 0, 0.08)",
        "glass": "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 20px 40px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "startup-gradient": "linear-gradient(135deg, #16a34a 0%, #2563eb 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 100%)",
      },
      borderRadius: {
        "startup-xl": "1.5rem",
        "startup-2xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
