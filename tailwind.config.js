/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette  -  KUDOS (only these + white/black/neutral grays)
        orange: '#FB6C00',
        redOrange: '#E73F1E',
        maroon: '#7F2020',
        maroonDark: '#5C1616',
        ink: '#1A1A1A',
        paper: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FB6C00 0%, #E73F1E 100%)',
        'brand-gradient-dark': 'linear-gradient(135deg, #E73F1E 0%, #7F2020 100%)',
        'hero-gradient':
          'radial-gradient(1200px 600px at 80% -10%, rgba(251,108,0,0.14), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(231,63,30,0.10), transparent 55%)',
      },
      boxShadow: {
        nav: '0 8px 30px rgba(127, 32, 32, 0.08)',
        card: '0 10px 30px rgba(127, 32, 32, 0.10)',
        glow: '0 10px 40px rgba(251, 108, 0, 0.35)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};