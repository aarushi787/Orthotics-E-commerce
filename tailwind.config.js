/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "brand-blue": "#0D47A1",
        "brand-blue-dark": "#0a3a82",
        "brand-accent": "#673AB7",
        "brand-accent-light": "#EDE7F6",
      },
    },
  },
  plugins: [],
};
