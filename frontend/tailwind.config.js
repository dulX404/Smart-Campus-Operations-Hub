/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6",
          DEFAULT: "#1d4ed8",
          dark: "#1e3a8a",
        },
        secondary: {
          light: "#ea580c",
          DEFAULT: "#c2410c",
          dark: "#9a3412",
        },
        tertiary: {
          DEFAULT: "#cbd5e1",
          off: "#1e293b",
        },
      },
    },
  },
  plugins: [],
};
