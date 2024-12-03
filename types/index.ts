import type { GetItemsParams } from "@/api/api";
import { MaterialIcons } from "@expo/vector-icons";

export type MaterialIconsName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

interface HistoryItemType extends GetItemsParams {
  scrollY?: number;
}

export type HistoryItem = HistoryItemType;
