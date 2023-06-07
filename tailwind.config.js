/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{html,js,ejs}',
  ],
  theme: {
    extend: {
      "blue": "#14163c",
    },
    fontSize: {
      xs: "10px",
      "2xl": "26px"
    }
  },
  plugins: [],
}
