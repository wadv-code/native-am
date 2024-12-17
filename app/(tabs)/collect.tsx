import { HeaderBar } from "@/components/sys";
import { ThemedView } from "@/components/theme/ThemedView";
import {
  getCollectItems,
  getSortOrderItems,
  toggleCollect,
} from "@/utils/common";
import { useEffect, useState } from "react";
import type { GetItemsResItem } from "@/api";
import { CatalogList } from "@/components/catalog/CatalogList";
import { Alert, StyleSheet } from "react-native";
import { CatalogAction } from "@/components/catalog/CatalogAction";
import type { ActionSortOrder } from "@/types";
import { useIsFocused } from "@react-navigation/native";
import { storageManager } from "@/storage";
import { formatPath, isAudioFile } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { router } from "expo-router";

const CollectScreen = () => {
  const [items, setItems] = useState<GetItemsResItem[]>([]);
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

  const onIconPress = async (item: GetItemsResItem) => {
    const is_collect = await toggleCollect(item);
    if (!is_collect) onFetch();
  };

  const onLeftPress = async (item: GetItemsResItem) => {
    if (item.is_dir) {
      await storageManager.set(
        "parent_search_path",
        formatPath(item.parent || "/", item.name)
      );
      router.replace("/(tabs)/catalog");
    } else if (isAudioFile(item.name)) {
      emitter.emit("onAudioChange", item);
    } else {
      Alert.prompt("还未处理的文件格式。");
    }
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
      <CatalogList
        items={items}
        total={items.length}
        onRefresh={onFetch}
        onIconPress={onIconPress}
        onLeftPress={onLeftPress}
      />
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
