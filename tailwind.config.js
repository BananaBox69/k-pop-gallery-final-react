/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'playfair-display': ['Playfair Display', 'serif'],
      },
      colors: {
        'velvet-black': '#121212',
        'redvelvet': '#FF4757',
        'iu': '#50C878',
        'aespa': '#87CEEB',
        'irene': '#FF99AA',
        'seulgi': '#FFD400',
        'wendy': '#6495ED',
        'joy': '#00C853',
        'yeri': '#BA55D3',
        'iu-member': '#9370DB',
        'karina': '#5F9EA0',
        'giselle': '#FF69B4',
        'winter': '#ADD8E6',
        'ningning': '#C71585',
      },
    },
  },
  plugins: [],
}