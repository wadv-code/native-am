import { View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const mode = useColorScheme();
  const { theme } = useThemeColor();
  const backgroundColor = mode === "dark" ? darkColor : lightColor;
  return (
    <View
      style={[{ backgroundColor: backgroundColor || theme.background }, style]}
      {...otherProps}
    />
  );
}
