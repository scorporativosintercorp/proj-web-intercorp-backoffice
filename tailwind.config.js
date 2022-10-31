const defaultTheme = require("tailwindcss/defaultTheme");

whitelist = ["gray", "red", "orange", "yellow", "green", "teal", "blue", "purple", "pink"].reduce((result, color) => result.push(`text-${color}-600`, `bg-${color}-600`, `bg-${color}-500`) && result, []);

module.exports = {
  // mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // options: {
  //   whitelist,
  //   safelist: [/^bg-/, /^text-/],
  // },
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: ["bg-violet", "bg-teal"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        violet: "#A480FF",
        teal: "#23DEB8",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
