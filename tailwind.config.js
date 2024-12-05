// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounceOnce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        bounceOnce: "bounceOnce 0.5s ease-out",
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "sans-serif"], // Ensure this matches your import
      },
      colors: {
        primary: {
          50: "#D69A00",
          100: "#D69A00",
          200: "#D69A00",
          300: "#D69A00",
          400: "#D69A00",
          500: "#D69A00", // BASE - Gold
          600: "#D69A00",
          700: "#D69A00",
          800: "#D69A00",
          900: "#D69A00",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
