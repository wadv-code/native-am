/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { ThemeContext } from "@/components/theme/ThemeContext";
import { DefaultTheme } from "@/constants/Colors";
import { useContext } from "react";

export function useThemeColor() {
  const context = useContext(ThemeContext);
  if (context) {
    return {
      theme: context.theme.colors,
      setTheme: context.setTheme,
      setThemeColor: context.setThemeColor,
    };
  } else {
    return {
      theme: DefaultTheme.colors,
      setTheme: () => {},
      setThemeColor: () => {},
    };
  }
}
