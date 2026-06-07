import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container": "#e5eeff",
        "error-container": "#ffdad6",
        "primary": "#00236f",
        "on-primary-fixed": "#00164e",
        "secondary": "#1b6b51",
        "surface-container-low": "#eff4ff",
        "on-primary-fixed-variant": "#264191",
        "tertiary-container": "#6e2c00",
        "secondary-container": "#a6f2d1",
        "secondary-fixed": "#a6f2d1",
        "tertiary-fixed": "#ffdbcb",
        "on-tertiary-fixed-variant": "#773205",
        "outline": "#757682",
        "on-tertiary-container": "#f39461",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "on-secondary": "#ffffff",
        "surface-dim": "#cbdbf5",
        "on-background": "#0b1c30",
        "primary-fixed-dim": "#b6c4ff",
        "on-error": "#ffffff",
        "on-secondary-container": "#237157",
        "surface-tint": "#4059aa",
        "on-surface-variant": "#444651",
        "primary-fixed": "#dce1ff",
        "surface-container-lowest": "#ffffff",
        "inverse-on-surface": "#eaf1ff",
        "primary-container": "#1e3a8a",
        "surface": "#f8f9ff",
        "on-tertiary-fixed": "#341100",
        "error": "#ba1a1a",
        "secondary-fixed-dim": "#8bd6b6",
        "inverse-surface": "#213145",
        "on-primary-container": "#90a8ff",
        "on-primary": "#ffffff",
        "background": "#f8f9ff",
        "outline-variant": "#c5c5d3",
        "on-secondary-fixed-variant": "#00513b",
        "surface-bright": "#f8f9ff",
        "on-surface": "#0b1c30",
        "surface-variant": "#d3e4fe",
        "inverse-primary": "#b6c4ff",
        "surface-container-high": "#dce9ff",
        "tertiary-fixed-dim": "#ffb691",
        "on-secondary-fixed": "#002116",
        "surface-container-highest": "#d3e4fe",
        "tertiary": "#4b1c00"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "9999px"
      },
      spacing: {
        "stack-sm": "0.5rem",
        "container-max": "1200px",
        "section-gap": "2.5rem",
        "stack-md": "1rem",
        "gutter": "1.5rem",
        "margin-mobile": "1rem"
      },
      fontFamily: {
        "data-mono": ["Inter", "monospace"],
        "headline-md-mobile": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "section-header": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "data-mono": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500" }],
        "headline-md-mobile": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "display-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "label-sm": ["14px", { "lineHeight": "20px", "fontWeight": "600" }],
        "section-header": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "700" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }]
      }
    },
  },
  plugins: [
    forms
  ],
}
