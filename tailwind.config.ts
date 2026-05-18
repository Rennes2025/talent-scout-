import type { Config } from "tailwindcss";

// En Tailwind v4, les tokens (couleurs, typo, spacing) sont définis
// directement dans globals.css via @theme. Ce fichier reste minimal.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
