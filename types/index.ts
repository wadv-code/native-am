import type { GetItemsParams } from "@/api";
import type { orders, sorts } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import type { ThemeMode } from "@rneui/themed";

export type MaterialIconsName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

interface HistoryItemType extends GetItemsParams {
  scrollY?: number;
}

export type HistoryItem = HistoryItemType;

export type ServerType = "image" | "video";

export type RootStackParamList = {
  search: { path: string };
  video: { path: string };
  viewer: { path: string };
  server: { type: ServerType };
  "server-edit": { id?: string; type: ServerType };
  "web-view": { url: string; title: string };
};

export type ActionOrder = (typeof orders)[number];

export type ActionSort = (typeof sorts)[number];

export type ActionSortOrder = {
  sort: ActionSort;
  order: ActionOrder;
};

type AnimationStyle = any;

type Position = "top" | "center" | "bottom" | undefined;

export interface ThemedToastProps {
  positionValue: number;
  width: number | "auto";
  duration: number;
  end: number;
  animationIn?: any;
  animationOut?: any;
  backdropTransitionOutTiming: number;
  backdropTransitionInTiming: number;
  animationInTiming: number;
  animationOutTiming: number;
  backdropColor: string;
  backdropOpacity: number;
  hasBackdrop: boolean;
  height: number | "auto";
  style: any;
  textStyle: any;
  theme: ThemeMode;
  animationStyle?: AnimationStyle;
  position?: Position;
  showCloseIcon: boolean;
  showProgressBar: boolean;
}

export interface ThemedToastState {
  isShow: boolean;
  text: string;
  opacityValue: any;
  barWidth: any;
  barColor: string;
  icon: MaterialIconsName;
  position: Position;
  duration?: number;
  oldDuration?: number;
  animationStyle: Record<
    AnimationStyle,
    {
      animationIn: string;
      animationOut: string;
    }
  >;
}
