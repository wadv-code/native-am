import { type TextInputProps, TextInput } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  color?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  bold?: boolean;
};

export function ThemedInput({ ...rest }: ThemedInputProps) {
  const { theme } = useThemeColor();

  return (
    <TextInput
      {...rest}
      style={{ color: theme.text, fontSize: 18 }}
      placeholderTextColor={theme.text}
    />
  );
}
