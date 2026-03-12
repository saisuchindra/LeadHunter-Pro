/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mint: "#00FFB2",
        coral: "#FF4D6D",
        violet: "#7B61FF",
        dark: "#0A0A0F",
        card: "rgba(255,255,255,0.03)",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      animation: {
        "pulse-mint": "pulseMint 2s ease-in-out infinite",
        scan: "scan 2s linear infinite",
        glow: "glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        pulseMint: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,255,178,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(0,255,178,0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glow: {
          from: { textShadow: "0 0 10px #00FFB2" },
          to: { textShadow: "0 0 20px #00FFB2, 0 0 30px #00FFB2" },
        },
      },
    },
  },
  plugins: [],
}
