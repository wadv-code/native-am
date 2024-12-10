import { DarkTheme, DefaultTheme, type Theme } from "@/constants/Colors";
import { storageManager } from "@/storage";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useColorScheme } from "react-native";

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemeColor: (colors: Recordable<string>) => void;
}

// 创建一个上下文对象
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

ThemeContext.displayName = "ThemeContext";

// 创建一个提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const mode = useColorScheme() ?? "light";
  const [theme, setTheme] = useState<Theme | undefined>();

  useEffect(() => {
    (async () => {
      const primary = await storageManager.get("theme_primary");
      const currentTheme = mode === "dark" ? DarkTheme : DefaultTheme;
      if (primary) currentTheme.colors.primary = primary;
      setTheme(currentTheme);
    })();
  }, [mode]);

  if (!theme) return null;

  const setThemeColor = (colors: Recordable<string>) => {
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        ...colors,
      },
    });
    storageManager.set("theme_primary", colors.primary);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
