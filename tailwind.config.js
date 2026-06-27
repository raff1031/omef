/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        omef: {
          forest: '#152E20',
          earth:  '#1E3A18',
          olive:  '#3D6B2A',
          sage:   '#7A9E50',
          bark:   '#C4924A',
          light:  '#EEF2E8',
          paper:  '#F6F4F0',
          muted:  '#5A6A5C',
        },
      },
    },
  },
  plugins: [],
}
