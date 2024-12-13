import { View, type ViewProps } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTheme } from "@rneui/themed";

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
  const { theme } = useTheme();
  const backgroundColor = mode === "dark" ? darkColor : lightColor;
  return (
    <View
      style={[
        { backgroundColor: backgroundColor || theme.colors.background },
        style,
      ]}
      {...otherProps}
    />
  );
}
