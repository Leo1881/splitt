import { colors, darkColors } from "./colors";

export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold" as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold" as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600" as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: "normal" as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: "normal" as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: "normal" as const,
      lineHeight: 16,
    },
  },
};

export const darkTheme = {
  ...theme,
  colors: darkColors,
};
