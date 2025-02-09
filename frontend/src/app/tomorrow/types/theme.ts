export type Theme = "light" | "dark" | "spring" | "summer";

export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
}

export const themeColors: Record<Theme, ThemeColors> = {
  light: {
    background: "bg-white",
    text: "text-gray-900",
    primary: "bg-[#8BC34A]",
    secondary: "bg-gray-100",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-white",
    primary: "bg-[#689F38]",
    secondary: "bg-gray-800",
  },
  spring: {
    background: "bg-green-50",
    text: "text-gray-900",
    primary: "bg-[#4CAF50]",
    secondary: "bg-[#C8E6C9]",
  },
  summer: {
    background: "bg-yellow-50",
    text: "text-gray-900",
    primary: "bg-[#FF9800]",
    secondary: "bg-[#FFE0B2]",
  },
};
