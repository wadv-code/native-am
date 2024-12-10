import { Button, type ButtonProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedButtonProps = ButtonProps & {
  title: string;
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedButton({
  title,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedButtonProps) {
  const { theme } = useThemeColor();

  return <Button title={title} color={theme.primary} {...rest} />;
}
