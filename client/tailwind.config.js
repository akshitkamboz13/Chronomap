/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gta-dark': '#1a1a1a',
        'gta-primary': '#00ccff',
        'gta-secondary': '#ff00cc',
        'gta-header': '#1a1a1a',
        'gta-title': '#00ccff',
        'gta-heading': '#00ccff',
        'gta-sidebar': '#1a1a1a',
        'gta-modal-header': '#1a1a1a',
        'gta-modal-title': '#00ccff',

        'rdr2-dark': '#40423D',
        'rdr2-primary': '#C8B28D',
        'rdr2-secondary': '#DEC29B',
        'rdr2-header': '#40423D',
        'rdr2-title': '#DEC29B',
        'rdr2-heading': '#DEC29B',
        'rdr2-sidebar': '#40423D',
        'rdr2-modal-header': '#40423D',
        'rdr2-modal-title': '#DEC29B',
        'rdr2-land': '#DEC29B',
        'rdr2-ink': '#40423D',
        'rdr2-water': '#9E9985',
        'rdr2-contours': '#C8B28D',
        'rdr2-pencil': '#716454',

        'rdr-dark': '#2d1300',
        'rdr-primary': '#d2691e',
        'rdr-secondary': '#b8860b',
        'rdr-header': '#2d1300',
        'rdr-title': '#d2691e',
        'rdr-heading': '#d2691e',
        'rdr-sidebar': '#2d1300',
        'rdr-modal-header': '#2d1300',
        'rdr-modal-title': '#d2691e',

        'cyberpunk-dark': '#0d0d1a',
        'cyberpunk-primary': '#ffff00',
        'cyberpunk-secondary': '#ff00ff',
        'cyberpunk-header': '#0d0d1a',
        'cyberpunk-title': '#ffff00',
        'cyberpunk-heading': '#ffff00',
        'cyberpunk-sidebar': '#0d0d1a',
        'cyberpunk-modal-header': '#0d0d1a',
        'cyberpunk-modal-title': '#ffff00',
      },
      fontFamily: {
        'rdr2-state': ['Merriweather', 'serif'],
        'rdr2-city': ['Raleway', 'sans-serif'],
        'rdr2-water-major': ['Noto Serif', 'serif'],
        'rdr2-water-minor': ['Crimson Text', 'serif'],
        'rdr2-station': ['Raleway', 'sans-serif'],
        'rdr2-natural': ['Chau Philomene One', 'sans-serif'],
        'rdr2-viewpoint': ['Homemade Apple', 'cursive'],
        'rdr2-fort': ['Lato', 'sans-serif']
      }
    },
  },
  plugins: [],
} 