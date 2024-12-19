import { HeaderBar } from "@/components/sys";
import { ThemedView } from "@/components/theme/ThemedView";
import { getCollectItems, getSortOrderItems } from "@/utils/common";
import { useEffect, useState } from "react";
import type { GetItem } from "@/api";
import { CatalogList } from "@/components/catalog/CatalogList";
import { StyleSheet } from "react-native";
import { CatalogAction } from "@/components/catalog/CatalogAction";
import type { ActionSortOrder } from "@/types";
import { useIsFocused } from "@react-navigation/native";

const CollectScreen = () => {
  const [items, setItems] = useState<GetItem[]>([]);
  const isFocused = useIsFocused();

  const onFetch = async () => {
    const collectItems = await getCollectItems();
    const list = await getSortOrderItems(collectItems);
    setItems(list);
  };

  const onSortOrder = async (option: ActionSortOrder) => {
    const list = await getSortOrderItems(items, option);
    setItems(list);
  };

  useEffect(() => {
    if (isFocused) onFetch();
  }, [isFocused]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <HeaderBar />
      <CatalogAction
        title="我的收藏"
        style={styles.action}
        onSortOrder={onSortOrder}
      />
      <CatalogList data={items} onRefresh={onFetch} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  action: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default CollectScreen;
