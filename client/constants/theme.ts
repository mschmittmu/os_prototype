import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#6B7280",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#E31837",
    link: "#E31837",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F9FAFB",
    backgroundSecondary: "#F3F4F6",
    backgroundTertiary: "#E5E7EB",
    accent: "#E31837",
    accentLight: "#F43F5E",
    navy: "#1E3A8A",
    navyLight: "#2563EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#E31837",
    border: "#E5E7EB",
    cardGradientStart: "#FFFFFF",
    cardGradientEnd: "#F9FAFB",
    star: "#FFFFFF",
    glass: "rgba(255, 255, 255, 0.8)",
    glassLight: "rgba(255, 255, 255, 0.6)",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7280",
    tabIconSelected: "#E31837",
    link: "#F43F5E",
    backgroundRoot: "#0A0A0A",
    backgroundDefault: "#171717",
    backgroundSecondary: "#262626",
    backgroundTertiary: "#404040",
    accent: "#E31837",
    accentLight: "#F43F5E",
    navy: "#3B82F6",
    navyLight: "#60A5FA",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    border: "#374151",
    cardGradientStart: "#171717",
    cardGradientEnd: "#262626",
    star: "#F59E0B",
    glass: "rgba(23, 23, 23, 0.85)",
    glassLight: "rgba(38, 38, 38, 0.75)",
  },
};

export type ThemeMode = "light" | "dark" | "system";

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fab: {
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glass: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};
