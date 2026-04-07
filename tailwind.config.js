/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B3C5D',
        accent: '#F97316',
        ink: '#0f172a',
        mist: '#eef4f8',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 25px 60px rgba(11, 60, 93, 0.16)',
        soft: '0 18px 40px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(249, 115, 22, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(11, 60, 93, 0.22), transparent 32%), linear-gradient(135deg, #041822 0%, #0B3C5D 55%, #09283f 100%)',
      },
    },
  },
  plugins: [],
}
