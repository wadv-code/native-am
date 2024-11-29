// This file is a fallback for using MaterialIcons on Android and web.

import { useTheme } from "@/hooks/useThemeColor";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

// // Add your SFSymbol to MaterialIcons mappings here.
// const MAPPING = {
//   // See MaterialIcons here: https://icons.expo.fyi
//   // See SF Symbols in the SF Symbols app on Mac.
//   "house.fill": "home",
//   "paperplane.fill": "send",
//   "chevron.left.forwardslash.chevron.right": "code",
//   "chevron.right": "chevron-right",
// } as Partial<
//   Record<
//     import("expo-symbols").SymbolViewProps["name"],
//     React.ComponentProps<typeof MaterialIcons>["name"]
//   >
// >;

// export type IconSymbolName = keyof typeof MAPPING;

export type IconSymbolProps = {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  // weight?: SymbolWeight;
};

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  const theme = useTheme();

  return (
    <MaterialIcons
      color={color ?? theme.icon}
      size={size}
      name={name}
      style={style}
    />
  );
}
