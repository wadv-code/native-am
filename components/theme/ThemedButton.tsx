import { Button, type TextProps } from "react-native";

import { useTheme } from "@/hooks/useThemeColor";

export type ThemedButtonProps = TextProps & {
  title: string;
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedButton({
  style,
  title,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedButtonProps) {
  const theme = useTheme();

  return <Button title={title} color={theme.primary} {...rest} />;
}

// const styles = StyleSheet.create({
//   default: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   defaultSemiBold: {
//     fontSize: 16,
//     lineHeight: 24,
//     fontWeight: "600",
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     lineHeight: 32,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   link: {
//     lineHeight: 30,
//     fontSize: 16,
//     color: "#0a7ea4",
//   },
// });
