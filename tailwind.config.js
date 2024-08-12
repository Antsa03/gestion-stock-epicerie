/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#F4F4F4",
        },
      },
      backgroundColor: {
        light: {
          50: "#FFFFFF",
          100: "#F4F4F4",
          200: "#F5F5F5",
        },
        primary: {
          50: "#EFEAF5",
          100: "#8E6CEF",
        },
        custom: {
          gray: "#939393",
          violet: "#8E6CEF",
          green: "#4CAF50",
        },
      },
      textColor: {
        custom: {
          black: "#272727",
          gray: "#939393",
          green: "#4CAF50",
        },
      },

      borderColor: {
        custom: {
          gray: "#E0E0E0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
