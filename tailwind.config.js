module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      caretColor: {
        transparent: 'transparent',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
