/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 500: "#FF9900", 600: "#e58a00" },
        ink: { 900: "#0f172a", 800: "#1e293b", 700: "#334155" },
      },
    },
  },
  plugins: [],
};
