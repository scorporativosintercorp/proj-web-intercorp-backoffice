const defaultTheme = require('tailwindcss/defaultTheme');

whitelist = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
].reduce(
  (result, color) =>
    result.push(`text-${color}-600`, `bg-${color}-600`, `bg-${color}-500`) &&
    result,
  []
);

module.exports = {
  // mode: "jit",
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    'bg-violet',
    'bg-teal',
    // Columnas TinyMCE
    'grid',
    'grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'gap-4',
    'mb-4',
    'p-2',
    'border',
    'border-dashed',
    'border-gray-300',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        violet: '#A480FF',
        teal: '#23DEB8',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
