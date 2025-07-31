/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B4FF0",
        secondary: "#1A1B3A",
        accent: "#00D4AA",
        success: "#00C48C",
        warning: "#FFB800",
        error: "#FF3B30",
        info: "#0084FF",
        background: "#F7F8FC",
        surface: "#FFFFFF"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}