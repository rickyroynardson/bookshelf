/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html, js}", "./assets/js/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', "sans-serif"]
      }
    },
  },
  plugins: [],
};
