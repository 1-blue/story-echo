import type { Config } from "tailwindcss";

/** DESIGN.md tokens — SSOT for Tailwind theme extension */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F2",
        ink: "#2C2419",
        primary: {
          DEFAULT: "#C4714A",
          foreground: "#FFFFFF",
        },
        echo: {
          DEFAULT: "#4A8B8B",
          soft: "#E3F0F0",
        },
        capsule: {
          DEFAULT: "#7B6BA8",
          soft: "#EDE8F5",
        },
        community: {
          DEFAULT: "#5B8A72",
          soft: "#E5F2EB",
        },
      },
      fontFamily: {
        serif: ["Lora", "Noto Serif KR", "Georgia", "serif"],
        sans: ["Pretendard", "Noto Sans KR", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
    },
  },
};

export default preset;
