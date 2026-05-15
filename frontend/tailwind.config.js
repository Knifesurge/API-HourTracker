const colors = require("tailwindcss/colors");

export default {
  content: [
    "./src/**/*.{html,css,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Core App Colors
        background: colors.zinc[950],
        foreground: colors.zinc[50],

        // Surface Colors
        surface: colors.zinc[900],
        "surface-elevated": colors.zinc[800],
        "surface-hover": colors.zinc[700],
        "surface-active": colors.zinc[600],

        // Text Colors
        primary: colors.zinc[100],
        secondary: colors.zinc[300],
        muted: colors.zinc[400],
        disabled: colors.zinc[500],
        inverse: colors.zinc[950],

        // Border Colors
        border: colors.zinc[800],
        "border-strong": colors.zinc[700],
        "border-subtle": colors.zinc[900],

        // Brand/Accent Colors
        accent: colors.blue[500],
        "accent-hover": colors.blue[600],
        "accent-foreground": "#eff6ff",

        // Status Colors
        success: colors.emerald[500],
        "success-foreground": "#ecfdf5",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
