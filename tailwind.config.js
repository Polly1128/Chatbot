/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Siemens Primary Colors ===
        'light-sand': '#f3f3f0',
        'siemens-petrol': '#009999',
        'siemens-petrol-dark': '#007a7a',
        'light-petrol': '#00c1b6',
        'bold-green': '#00ffb9',
        'soft-green': '#00d7a0',
        'bold-blue': '#00e6dc',

        // === Siemens Secondary Colors ===
        'dark-sand': '#aaaa96',
        'soft-sand': '#c5c5b8',
        'bright-sand': '#dfdfd9',

        'dark-yellow': '#f7c600',
        'yellow': '#ffd732',
        'soft-yellow': '#ffe270',

        'dark-green': '#00646e',
        'green': '#00af8e',

        'dark-blue': '#00557c',

        'dark-purple': '#553ba3',
        'purple': '#805cff',
        'soft-purple': '#b4a8ff',

        'deep-blue-80': '#333353',
        'deep-blue-60': '#66667e',
        'deep-blue-40': '#9999a9',
        'deep-blue-20': '#ccccd4',
        'deep-blue-10': '#e5e5e9',

        'red': '#ef0137',
        'red-dark': '#c40028',
        'red-light': '#ffecef',
        'dark-orange': '#ec6602',
        'orange': '#ff9000',

        // === Semantic alias for easy usage ===
        // 品牌主色：Siemens Petrol
        'brand-petrol': '#009999',
        'brand-petrol-dark': '#007a7a',
        'brand-petrol-light': '#00c1b6',
        'brand-green': '#00d7a0',
        'brand-bold-green': '#00ffb9',

        // 替代 Tailwind 默认 blue 的语义色
        primary: '#009999',
        'primary-dark': '#007a7a',
        'primary-light': '#00c1b6',
        'primary-soft': '#e6f7f5',
        'primary-50': '#f0faf8',
        'primary-100': '#e0f4f2',
        'primary-200': '#b3e4df',
        'primary-300': '#66c9c1',
        'primary-400': '#00b3a7',
        'primary-500': '#009999',
        'primary-600': '#007a7a',
        'primary-700': '#005c5c',
        'primary-800': '#003d3d',

        'secondary': '#66667e',
        'secondary-light': '#9999a9',
        'secondary-dark': '#333353',

        'content-bg': '#f3f3f0',
        'sidebar-bg': '#ffffff',
        'sidebar-active': '#e6f7f5',
        'border-light': '#e5e5e9',
        'border-base': '#ccccd4',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(51, 51, 83, 0.05), 0 1px 3px rgba(51, 51, 83, 0.08)',
        'card': '0 2px 4px rgba(51, 51, 83, 0.04), 0 1px 2px rgba(51, 51, 83, 0.06)',
      },
      width: {
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
      },
      height: {
        'topbar': '56px',
      },
      backgroundImage: {
        'gradient-petrol-bold': 'linear-gradient(135deg, #00ffb9 0%, #00e6dc 100%)',
        'gradient-petrol-soft': 'linear-gradient(135deg, #00d7a0 0%, #00bedc 100%)',
      },
    },
  },
  plugins: [],
}
