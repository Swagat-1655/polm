/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'federal-blue': '#03045e',
        'marian-blue': '#023e8a',
        'honolulu-blue': '#0077b6',
        'blue-green': '#0096c7',
        'pacific-cyan': '#00b4d8',
        'vivid-sky-blue': '#48cae4',
        'non-photo-blue': '#90e0ef',
        'non-photo-blue-2': '#ade8f4',
        'light-cyan': '#caf0f8',
        // Legacy colors for backward compatibility
        'deep-blue': '#03045e',
        'emerald-green': '#0096c7',
        'custom-white': '#FFFFFF'
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #03045e 0%, #023e8a 25%, #0077b6 50%, #0096c7 75%, #00b4d8 100%)',
        'blue-gradient': 'linear-gradient(135deg, #03045e 0%, #0077b6 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #0077b6 0%, #48cae4 100%)',
        'light-gradient': 'linear-gradient(135deg, #48cae4 0%, #90e0ef 100%)',
        'dark-gradient': 'linear-gradient(135deg, #03045e 0%, #023e8a 100%)',
        'mixed-gradient': 'linear-gradient(45deg, #03045e 0%, #0077b6 25%, #00b4d8 50%, #48cae4 75%, #90e0ef 100%)',
        'reverse-gradient': 'linear-gradient(135deg, #90e0ef 0%, #48cae4 25%, #00b4d8 50%, #0077b6 75%, #03045e 100%)',
        'glow-gradient': 'radial-gradient(circle, rgba(72, 202, 228, 0.3) 0%, rgba(0, 119, 182, 0.1) 70%, transparent 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(3, 4, 94, 0.9) 0%, rgba(0, 119, 182, 0.8) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(144, 224, 239, 0.1) 0%, rgba(72, 202, 228, 0.05) 100%)'
      }
    },
  },
  plugins: [],
}
