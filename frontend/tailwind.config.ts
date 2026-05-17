import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors.js";

const config: Config = {
  content: [
    "./src/**/*.{html,css,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Core App Colors
        background: colors.gray[700],
        foreground: colors.gray[200],

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
        "accent-foreground": colors.blue[50],

        // Status Colors
        success: colors.emerald[500],
        "success-foreground": colors.emerald[50],
        warning: colors.amber[500],
        "warning-foreground": colors.amber[50],
        danger: colors.red[500],
        "danger-foreground": colors.red[50],
        info: colors.sky[500],
        "info-foreground": colors.sky[50],

        // Inputs Colors
        input: colors.zinc[900],
        "input-border": colors.zinc[800],
        "input-ring": colors.blue[500],

        // Sidebar Colors
        sidebar: colors.gray[900],
        "sidebar-foreground": colors.gray[100],
        "sidebar-border": colors.gray[800],

        // Card Colors
        card: colors.zinc[900],
        "card-foreground": colors.zinc[100],

        // Chart Colors
        chart1: colors.blue[500],
        chart2: colors.emerald[500],
        chart3: colors.amber[500],
        chart4: colors.violet[500],
        chart5: colors.rose[500],
      },

      borderRadius: {
        sm: "0.375rem", // 6px
        md: "0.5rem",   // 8px
        lg: "0.75rem",  // 12px
        xl: "1rem",     // 16px
       "2xl": "1.5rem", // 24px
      },

      boxShadow: {
        subtle: "0 1px 2px rgba(0, 0, 0, 0.2)",

        card: `
          0 1px 2px rgba(0, 0, 0, 0.2),
          0 4px 12px rgba(0,0,0,0.15)
        `,

        overlay: `
          0 10px 30px rgba(0,0,0,0.35)
        `,
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

export default config;
