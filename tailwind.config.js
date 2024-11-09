/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'restro-green-light': "#ECF1EB",
        'restro-green': "#70B56A",
        'restro-green-dark': "#243922",
        'restro-border-green-light': "#DCE7DB",
        'restro-superadmin-widget-bg': "#BEDC74",
        'restro-superadmin-text-green': "#387F39",
        'restro-superadmin-text-black': "#444444"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "light",
  }
}

