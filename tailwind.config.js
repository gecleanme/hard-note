/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./public/index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
