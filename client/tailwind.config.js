/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chili: "#E3170A",
        leaf: {
          200: "#A9E5BB",
          300: "#91DEA8",
          400: "#72D58F",
          500: "#52CB77",
          600: "#38BC60",
          700: "#2F9D50",
          800: "#267E40",
        },
        vanilla: "#FCF6B1",
        goldenrod: "#F7B32B",
        azul: {
          300: "5999D9",
          400: "#3785D2",
          500: "#296EB4",
          600: "#225C96",
          700: "#1A4774",
          800: "#133353",
        },
        frenchblue: {
          100: "#C3E0FE",
          200: "#9BCCFD",
          300: "#72B8FD",
          400: "#4AA3FC",
          500: "#1789FC",
        },
        tahiti: {
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
      },
    },
  },
  plugins: [],
};
