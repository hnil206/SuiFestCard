import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/@swiss-digital-assets-institute/ui/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ABCDiatype', ...fontFamily.sans],
        serif: ['ABCDiatype', ...fontFamily.serif],
        diatype: ['ABCDiatype', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        light: '300',
        normal: '400',
        medium: '500',
      },
    },
  },
  plugins: [],
};

export default config;
