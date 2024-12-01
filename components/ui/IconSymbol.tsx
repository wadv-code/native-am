// This file is a fallback for using MaterialIcons on Android and web.

import { useTheme } from "@/hooks/useThemeColor";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, type TextStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "keyboard-arrow-right",
  "music.note.list": "queue-music",
  ellipsis: "more-vert",
  folder: "folder",
  "folder.fill": "folder",
  photo: "photo",
  "music.note": "music-note",
  "text.document": "file-present",
  "arrowtriangle.right.fill": "arrow-right",
  "arrow.up": "arrow-upward",
  "arrowshape.up.fill": "upload",
  "arrowshape.down.fill": "download",
  "arrow.up.and.down.text.horizontal": "arrow-forward-ios",
} as Partial<
  Record<
    import("expo-symbols").SymbolViewProps["name"],
    React.ComponentProps<typeof MaterialIcons>["name"]
  >
>;

export type IconSymbolName = keyof typeof MAPPING;
export type IconSymbolProps = {
  name: IconSymbolName;
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
  const theme = useTheme();
  return (
    <MaterialIcons
      color={color ?? theme.icon}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
