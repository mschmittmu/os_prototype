import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#FFFFFF",
    textSecondary: "#94A3B8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#64748B",
    tabIconSelected: "#E31837",
    link: "#E31837",
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#334155",
    backgroundTertiary: "#475569",
    accent: "#E31837",
    accentLight: "#F43F5E",
    navy: "#1E3A8A",
    navyLight: "#2563EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#E31837",
    border: "#334155",
    cardGradientStart: "#1E293B",
    cardGradientEnd: "#0F172A",
    star: "#FFFFFF",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#94A3B8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#64748B",
    tabIconSelected: "#E31837",
    link: "#E31837",
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#334155",
    backgroundTertiary: "#475569",
    accent: "#E31837",
    accentLight: "#F43F5E",
    navy: "#1E3A8A",
    navyLight: "#2563EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#E31837",
    border: "#334155",
    cardGradientStart: "#1E293B",
    cardGradientEnd: "#0F172A",
    star: "#FFFFFF",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "800" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  stat: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: Platform.select({
      ios: "ui-monospace",
      android: "monospace",
      default: "monospace",
    }),
  },
  statSmall: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: Platform.select({
      ios: "ui-monospace",
      android: "monospace",
      default: "monospace",
    }),
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  fab: {
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
};
