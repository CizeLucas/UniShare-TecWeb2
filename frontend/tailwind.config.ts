import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3525cd',
        'on-primary': '#ffffff',
        'primary-container': '#4f46e5',
        'on-primary-container': '#dad7ff',
        'primary-fixed': '#e2dfff',
        'primary-fixed-dim': '#c3c0ff',
        tertiary: '#7e3000',
        'tertiary-container': '#a44100',
        error: '#ba1a1a',
        background: '#fcf8ff',
        'on-background': '#1b1b24',
        surface: '#fcf8ff',
        'on-surface': '#1b1b24',
        'surface-variant': '#e4e1ee',
        'on-surface-variant': '#464555',
        outline: '#777587',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f2ff',
        'surface-container': '#f0ecf9',
        'surface-container-highest': '#e4e1ee',
      },
      spacing: {
        unit: '4px',
        xs: '4px',
        sm: '8px',
        gutter: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        'container-padding': '20px',
      },
      fontFamily: {
        'body-main': ['Inter'],
        'body-metadata': ['Inter'],
        'display-title': ['Inter'],
        'card-title': ['Inter'],
        'currency-lg': ['Space Grotesk'],
        'currency-sm': ['Space Grotesk'],
      },
      fontSize: {
        'body-main': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-metadata': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'display-title': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'card-title': ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'currency-lg': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'currency-sm': ['16px', { lineHeight: '20px', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};

export default config;