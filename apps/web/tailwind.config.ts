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
        "gradient-shift": "gradientShift 15s ease infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "ripple": "ripple 0.6s ease-out",
        "chart-draw": "chartDraw 2s ease-out forwards",
        "bar-grow": "barGrow 0.8s ease-out forwards",
        "shake": "shake 0.5s ease-in-out",
        "fade-in-scale": "fadeInScale 0.5s ease-out forwards",
        "slide-up-fade": "slideUpFade 0.5s ease-out forwards",
        "spin-gradient": "spinGradient 1s linear infinite",
        "dot-pulse": "dotPulse 1.4s ease-in-out infinite",
        "badge-ping": "badgePing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "success-pop": "successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
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
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(34, 197, 94, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        chartDraw: {
          "0%": { strokeDasharray: "1000", strokeDashoffset: "1000" },
          "100%": { strokeDasharray: "1000", strokeDashoffset: "0" },
        },
        barGrow: {
          "0%": { height: "0" },
          "100%": { height: "100%" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
        fadeInScale: {
          "from": { opacity: "0", transform: "scale(0.95)" },
          "to": { opacity: "1", transform: "scale(1)" },
        },
        slideUpFade: {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        spinGradient: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        dotPulse: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        badgePing: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(1.8)", opacity: "0" },
        },
        successPop: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
