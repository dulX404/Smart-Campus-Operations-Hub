/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#60a5fa",
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        secondary: {
          light: "#fb923c",
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },
        tertiary: {
          DEFAULT: "#ffffff",
          off: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
};
