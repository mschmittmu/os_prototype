import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, ThemeMode } from "@/constants/theme";

const THEME_STORAGE_KEY = "@operator_theme_mode";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
  theme: typeof Colors.light;
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        setThemeModeState(stored as ThemeMode);
      }
    } catch (error) {
      console.error("Error loading theme mode:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  };

  const colorScheme: ColorScheme = useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      colorScheme,
      isDark,
      setThemeMode,
    }),
    [theme, themeMode, colorScheme, isDark]
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
