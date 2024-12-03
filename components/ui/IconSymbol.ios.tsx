import { useTheme } from "@/hooks/useThemeColor";
import type { MaterialIconsName } from "@/types";
import { SymbolView, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  home: "house.fill",
  send: "paperplane.fill",
  code: "chevron.left.forwardslash.chevron.right",
  "keyboard-arrow-right": "chevron.right",
  "queue-music": "music.note.list",
  "more-vert": "ellipsis",
  folder: "folder.fill",
  photo: "photo",
  "music-note": "music.note",
  "arrow-upward": "arrow.up",
  "arrow-downward": "arrowshape.down.fill",
  "sort-by-alpha": "arrow.up.and.down.text.horizontal",
  "pause-circle-outline": "pause.circle",
  "play-circle-outline": "play.circle",
  "arrow-right": "arrow.right",
  "snippet-folder": "folder.fill.badge.gearshape",
  "file-present": "text.bubble.fill",
} as Partial<
  Record<MaterialIconsName, import("expo-symbols").SymbolViewProps["name"]>
>;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 20,
  color,
  style,
  weight = "regular",
}: {
  name: MaterialIconsName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const theme = useTheme();
  return (
    <SymbolView
      weight={weight}
      tintColor={color ?? theme.icon}
      resizeMode="scaleAspectFit"
      name={MAPPING[name] ?? "0.circle"}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
