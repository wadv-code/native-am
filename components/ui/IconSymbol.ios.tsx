import type { MaterialIconsName } from "@/types";
import { useTheme } from "@rneui/themed";
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
  "music-note": "house.fill",
  "arrow-upward": "arrow.up",
  "arrow-downward": "arrow.down",
  "sort-by-alpha": "arrow.up.and.down.text.horizontal",
  "pause-circle-outline": "pause.circle",
  "play-circle-outline": "play.circle",
  "play-circle": "play.fill",
  "pause-circle": "pause.fill",
  "arrow-right": "chevron.right",
  "arrow-left": "chevron.left",
  "snippet-folder": "folder.fill.badge.gearshape",
  "file-present": "text.bubble.fill",
  "keyboard-arrow-down": "chevron.down",
  "light-mode": "sun.rain.fill",
  "dark-mode": "moon.stars.fill",
  settings: "gearshape.fill",
  "chevron-left": "chevron.left",
  "chevron-right": "chevron.right",
  "qr-code-scanner": "qrcode.viewfinder",
  "delete-sweep": "trash.circle",
  "photo-library": "photo.on.rectangle",
  "developer-board": "livephoto",
  "table-view": "macwindow.on.rectangle",
  "account-circle": "person.crop.circle",
  palette: "paintpalette",
  refresh: "arrow.clockwise",
  "supervisor-account": "person.2.badge.key.fill",
  "keyboard-double-arrow-right": "chevron.right.2",
  "keyboard-double-arrow-left": "chevron.left.2",
  delete: "delete.backward",
  star: "star.fill",
  "star-border": "star",
  "video-collection": "video",
  whatshot: "personalhotspot.circle",
  "wifi-tethering": "link",
  image: "photo.artframe",
} as Partial<
  Record<MaterialIconsName, import("expo-symbols").SymbolViewProps["name"]>
>;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
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
  const { theme } = useTheme();
  return (
    <SymbolView
      weight={weight}
      tintColor={color ?? theme.colors.grey0}
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
