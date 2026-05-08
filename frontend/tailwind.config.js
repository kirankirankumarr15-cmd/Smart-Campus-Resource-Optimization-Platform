/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy:      "#1a1f3a",
        orange:    "#e85d26",
        green:     "#4adf9a",
        page:      "#f0f2f8",
        textmute:  "#888888",
        // Room status palette
        statusFreeBg:      "#c0dd97", statusFreeText:      "#27500a",
        statusModBg:       "#fac775", statusModText:       "#633806",
        statusCrowdBg:     "#f09595", statusCrowdText:     "#791f1f",
        statusActiveBg:    "#85b7eb", statusActiveText:    "#0c447c",
        statusIdleBg:      "#e8e8f0", statusIdleText:      "#888888",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "label":  "10px",
        "body":   "12px",
        "nav":    "14px",
        "stat":   "20px",
        "hero":   "22px",
      },
      borderRadius: {
        "pill": "999px",
        "card": "16px",
      },
    },
  },
  plugins: [],
}
