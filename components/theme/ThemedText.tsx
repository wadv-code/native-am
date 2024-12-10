import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { fonts } from "@/constants/fonts";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  color?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  bold?: "regular" | "medium" | "bold" | "heavy";
};

export function ThemedText({
  bold,
  style,
  color,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { theme } = useThemeColor();

  return (
    <Text
      style={[
        { color: color ?? theme.text },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        bold ? fonts[bold] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
    color: "#0a7ea4",
  },
});
