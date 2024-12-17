import type { GetItemsResItem, GetSearchParams } from "@/api";
import { GetSearch } from "@/api/api";
import { CatalogList } from "@/components/catalog/CatalogList";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { HeaderSearchBar } from "@/components/sys/HeaderSearchBar";
import { ThemedView } from "@/components/theme/ThemedView";
import { storageManager } from "@/storage";
import type { ActionSortOrder, RootStackParamList } from "@/types";
import { getSortOrderItems, toggleCollect } from "@/utils/common";
import { formatPath, isAudioFile } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";

const default_per_page = 100;
type SearchScreenRouteProp = RouteProp<RootStackParamList, "search">;

const SearchScreen = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const isInitialRender = useRef<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [params, setParams] = useState<GetSearchParams>({
    keywords: "",
    page: 1,
    parent: "/asmr",
    per_page: default_per_page,
    refresh: false,
  });

  const onFetch = async () => {
    try {
      setLoading(true);
      const { data } = await GetSearch(params);
      setTotal(data.total);
      setItems([...items, ...data.content]);
    } finally {
      setLoading(false);
    }
  };

  const onSortOrder = async (option: ActionSortOrder) => {
    const list = await getSortOrderItems(items, option);
    setItems(list);
  };

  const onIconPress = async (item: GetItemsResItem) => {
    const is_collect = await toggleCollect(item);
    if (!is_collect) onFetch();
  };

  const onCanBack = () => {
    const isBack = router.canGoBack();
    if (isBack) {
      router.back();
    } else {
      router.replace("/catalog");
    }
  };

  const onLeftPress = async (item: GetItemsResItem) => {
    if (item.is_dir) {
      await storageManager.set(
        "parent_search_path",
        formatPath(item.parent || "/", item.name)
      );
      onCanBack();
    } else if (isAudioFile(item.name)) {
      emitter.emit("onAudioChange", item);
    } else {
      Alert.prompt("还未处理的文件格式。");
    }
  };

  // 刷新
  const onRefresh = async (keywords?: string) => {
    if (loading) return;
    setLoading(true);
    setItems([]);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setParams({
      ...params,
      page: 1,
      keywords: keywords ?? params.keywords ?? "",
    });
  };

  const toPath = (target: string) => {
    setParams({ ...params, parent: target || "/" });
  };

  useEffect(() => {
    if (!isInitialRender.current) {
      isInitialRender.current = true;
      if (route && route.params) {
        params.parent = route.params.path;
        setParams({ ...params });
      }
      return;
    }
    if (params.keywords) onFetch();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return (
    <ThemedView style={styles.container}>
      <HeaderSearchBar keywords={params.keywords} onSearch={onRefresh} />
      <CatalogToolbar
        path={params.parent}
        toPath={toPath}
        rightText={`${items.length}/${total}`}
        onSortOrder={onSortOrder}
        showOpenSearch={false}
      />
      <CatalogList
        items={items}
        loading={loading}
        path={params.parent}
        total={total}
        showParent={true}
        onRefresh={onFetch}
        onIconPress={onIconPress}
        onLeftPress={onLeftPress}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  action: {
    paddingHorizontal: 10,
  },
});

export default SearchScreen;
