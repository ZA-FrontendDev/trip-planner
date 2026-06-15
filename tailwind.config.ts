import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D7C6E",
        accent: "#F59E0B",
        surface: "#F8FAFC",
        ink: "#0F172A"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.08)",
        card: "0 8px 30px rgba(15, 23, 42, 0.06)"
      },
      borderRadius: {
        card: "12px"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(13, 124, 110, 0.14), transparent 28%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.14), transparent 25%), linear-gradient(180deg, #fcfdfd 0%, #f5f7fb 100%)"
      }
    }
  },
  plugins: []
};

export default config;
