/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  corePlugins: {
    preflight: false,
  },
  theme: {
    theme: {
      extend: {
        keyframes: {
          "gradient-move": {
            "0%, 100%": { "background-position": "0% 50%" },
            "50%": { "background-position": "100% 50%" },
          },
        },
        animation: {
          "gradient-x": "gradient-move 6s ease infinite",
        },
      },
    },
  },
  plugins: [],
};
