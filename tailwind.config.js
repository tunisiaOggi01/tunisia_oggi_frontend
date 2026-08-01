export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#930000', dark: '#6B1616' },
        primary: { DEFAULT: '#930000', container: '#c00000', 'on-container': '#ffcdc5' },
        secondary: { DEFAULT: '#5f5e5e', container: '#e2dfde' },
        surface: {
          DEFAULT: '#f9f9f9', dim: '#dadada', bright: '#f9f9f9',
          'container-lowest': '#ffffff', 'container-low': '#f3f3f3',
          'container': '#eeeeee', 'container-high': '#e8e8e8', 'container-highest': '#e2e2e2',
        },
        'on-surface': { DEFAULT: '#1a1c1c', variant: '#5d3f3b' },
        background: '#f9f9f9',
        outline: { DEFAULT: '#926f69', variant: '#e7bdb6' },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        headline: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'headline-lg': ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
