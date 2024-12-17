import type { GetItemsParams } from "@/api";
import type { orders, sorts } from "@/utils";
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

export type ActionOrder = (typeof orders)[number];

export type ActionSort = (typeof sorts)[number];

export type ActionSortOrder = {
  sort: ActionSort;
  order: ActionOrder;
};
