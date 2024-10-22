/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        label: "var(--label)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        onBackground: "var(--foreground)",
        foreground: "var(--foreground)",
        onForeground: "var(--background)",
        backgroundText: "var(--neutral-1000)",
        secondaryButton: "var(--primary-800)",
        secondaryButtonText: "var(--primary-900)",
        tertiary: "var(--neutral-200)",
        tertiaryButton: "var(--neutral-800)",
        onTertiary: "var(--neutral-1000)",
        inputFieldStroke: "var(--primary-800)",
        star: "var(--star)",
        primary: {
          DEFAULT: "var(--primary)",
          200: "var(--primary-200)"
        },
        error: {
          DEFAULT: "var(--error-500)",
          0: "var(--error-0)",
          50: "var(--error-50)",
          100: "var(--error-100)",
          150: "var(--error-150)",
          200: "var(--error-200)",
          300: "var(--error-300)",
          400: "var(--error-400)",
          500: "var(--error-500)",
          600: "var(--error-600)",
          700: "var(--error-700)",
          800: "var(--error-800)",
          850: "var(--error-850)",
          900: "var(--error-900)",
          950: "var(--error-950)",
          1000: "var(--error-1000)",
        },
        success: {
          DEFAULT: "var(--success-500)",
          0: "var(--success-0)",
          50: "var(--success-50)",
          100: "var(--success-100)",
          150: "var(--success-150)",
          200: "var(--success-200)",
          300: "var(--success-300)",
          400: "var(--success-400)",
          500: "var(--success-500)",
          600: "var(--success-600)",
          700: "var(--success-700)",
          800: "var(--success-800)",
          850: "var(--success-850)",
          900: "var(--success-900)",
          950: "var(--success-950)",
          1000: "var(--success-1000)",
        },
        info: {
          DEFAULT: "var(--info-500)",
          0: "var(--info-0)",
          50: "var(--info-50)",
          100: "var(--info-100)",
          150: "var(--info-150)",
          200: "var(--info-200)",
          300: "var(--info-300)",
          400: "var(--info-400)",
          500: "var(--info-500)",
          600: "var(--info-600)",
          700: "var(--info-700)",
          800: "var(--info-800)",
          850: "var(--info-850)",
          900: "var(--info-900)",
          950: "var(--info-950)",
          1000: "var(--info-1000)",
        },
        neutral: {
          DEFAULT: "var(--neutral-500)",
          0: "var(--neutral-0)",
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          150: "var(--neutral-150)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          850: "var(--neutral-850)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
          1000: "var(--neutral-1000)",
        },
        // Other variables
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        expand: {
          "0%": { width: "4rem" }, // Sidebar collapsed width
          "100%": { width: "16rem" }, // Sidebar expanded width
        },
        collapse: {
          "0%": { width: "16rem" },
          "100%": { width: "4rem" },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        slide: {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        expand: "expand 0.15s ease-in-out forwards", // Smooth expanding animation
        collapse: "collapse 0.15s ease-in-out forwards", // Smooth collapsing animation
        slide: "slide var(--speed) ease-in-out infinite alternate",
      },
      boxShadow: {
        "app-bar":
          "0px 0px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 4px 0px rgba(0, 0, 0, 0.12), 0px 1px 5px 0px rgba(0, 0, 0, 0.2)",
      },
      backgroundColor: {
        input: "var(--background-input)",
        foreground: "var(--foreground)",
      },
    },
  },
}
