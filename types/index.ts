import type { GetItemsParams } from "@/api";
import { MaterialIcons } from "@expo/vector-icons";

export type MaterialIconsName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

interface HistoryItemType extends GetItemsParams {
  scrollY?: number;
}

export type HistoryItem = HistoryItemType;

export type RootStackParamList = {
  search: { path: string };
};
