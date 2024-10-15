import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./App.tsx', './src/components/**/*.tsx'],
  theme: {
    extend: {},
  },
  presets: [require('nativewind/preset')],
  plugins: [],
};

export default config;
