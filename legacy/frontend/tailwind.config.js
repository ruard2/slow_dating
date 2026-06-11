/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night:    '#0d0d14',
        velvet:   '#1a0a2e',
        wine:     '#2d0a1f',
        rose:     '#8b1a4a',
        blush:    '#c45a8a',
        gold:     '#d4af37',
        'gold-light': '#f0d060',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'dice-spin': 'diceSpin 0.6s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-token': 'bounceToken 0.5s ease-out',
      },
      keyframes: {
        diceSpin: {
          '0%':   { transform: 'rotateY(0deg) rotateX(0deg) scale(1)' },
          '50%':  { transform: 'rotateY(180deg) rotateX(180deg) scale(1.2)' },
          '100%': { transform: 'rotateY(360deg) rotateX(360deg) scale(1)' },
        },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #d4af37' },
          '50%':       { boxShadow: '0 0 20px #d4af37, 0 0 40px #d4af3766' },
        },
        bounceToken: {
          '0%':   { transform: 'scale(1) translateY(0)' },
          '40%':  { transform: 'scale(1.3) translateY(-8px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
