/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // keep your existing screens
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["DM Serif Display", "Georgia", "serif"],
      },
      colors: {
        ink: "#0B0F19",
        primary: { DEFAULT: "#2563EB", 600: "#2563EB", 700: "#1D4ED8" },
        sale: "#F59E0B",
        success: "#10B981",
        danger: "#EF4444",
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.08)",
        hover: "0 12px 28px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
