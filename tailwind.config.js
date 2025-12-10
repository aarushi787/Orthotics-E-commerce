/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        palette: {
          0: "#197D86",    // Primary teal
          1: "#0F6A74",    // Dark teal
          2: "#4ED2D3",    // Cyan
          3: "#5AC7D7",    // Light cyan
          4: "#E3F8FF",    // Very light cyan
        },
        pacificCyan: {
          50: "hsl(185.7 84% 95.1%)",
          100: "hsl(187 84.3% 90%)",
          200: "hsl(185.7 82.4% 80%)",
          300: "hsl(186.1 83% 70%)",
          400: "hsl(186 83.3% 60%)",
          500: "hsl(186 82.7% 50%)",
          600: "hsl(186 83.3% 40%)",
          700: "hsl(186.1 83% 30%)",
          800: "hsl(185.7 82.4% 20%)",
          900: "hsl(187 84.3% 10%)",
          950: "hsl(186 83.3% 7.1%)",
        },
        darkTeal: {
          50: "hsl(190.9 84.6% 94.9%)",
          100: "hsl(189.8 84.3% 90%)",
          200: "hsl(189.8 84.3% 80%)",
          300: "hsl(190.1 85.6% 70%)",
          400: "hsl(190 85.3% 60%)",
          500: "hsl(190 85.1% 50%)",
          600: "hsl(190 85.3% 40%)",
          700: "hsl(190.1 85.6% 30%)",
          800: "hsl(189.8 84.3% 20%)",
          900: "hsl(189.8 84.3% 10%)",
          950: "hsl(190 83.3% 7.1%)",
        },
        stormyTeal: {
          50: "hsl(191.2 61.5% 94.9%)",
          100: "hsl(189.7 60.8% 90%)",
          200: "hsl(189.7 60.8% 80%)",
          300: "hsl(189.7 60.8% 70%)",
          400: "hsl(190.2 60.8% 60%)",
          500: "hsl(190.1 60.8% 50%)",
          600: "hsl(190.2 60.8% 40%)",
          700: "hsl(189.7 60.8% 30%)",
          800: "hsl(189.7 60.8% 20%)",
          900: "hsl(189.7 60.8% 10%)",
          950: "hsl(190.9 61.1% 7.1%)",
        },
        "brand-primary": "#03A688",      // Deep Teal
        "brand-secondary": "#04BFBF",    // Aqua Teal
        "brand-highlight": "#05C7F2",    // Bright Cyan (CTA)
        "brand-success": "#03A64A",      // Green (Badge)
        "brand-dark": "#0D0D0D",         // Black (Neutral)
        "brand-blue": "#03A688",
        "brand-blue-dark": "#03A688",
        "brand-accent": "#04BFBF",
        "brand-accent-light": "#05C7F2",
        "brand-light-cyan": "#E3F8FF",
      },
    },
  },
  plugins: [],
};
