import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f8ff',
          100: '#dbeeff',
          500: '#2563eb',
          600: '#1d4ed8',
          900: '#172554',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

