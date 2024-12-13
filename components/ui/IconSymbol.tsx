// This file is a fallback for using MaterialIcons on Android and web.
import React from "react";
// import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, StyleProp, type TextStyle } from "react-native";
import type { MaterialIconsName } from "@/types";
import { useTheme } from "@rneui/themed";

export type IconSymbolProps = {
  name: MaterialIconsName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  const { theme } = useTheme();
  return (
    <MaterialIcons
      color={color ?? theme.colors.grey0}
      size={size}
      name={name}
      style={style}
    />
  );
}
