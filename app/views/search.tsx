import type { GetItem, GetSearchParams } from "@/api";
import { GetSearch } from "@/api/api";
import { CatalogAction } from "@/components/catalog/CatalogAction";
import { CatalogList } from "@/components/catalog/CatalogList";
import { HeaderSearchBar } from "@/components/sys/HeaderSearchBar";
import { ThemedView } from "@/components/theme/ThemedView";
import { setStorage } from "@/storage/long";
import { CATALOG_CHANGE_PATH } from "@/storage/storage-keys";
import type { RootStackParamList } from "@/types";
import { formatPath, sleep } from "@/utils/lib";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const default_per_page = 1000;
type SearchScreenRouteProp = RouteProp<RootStackParamList, "search">;

const SearchScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<SearchScreenRouteProp>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<GetItem[]>([]);
  const [params, setParams] = useState<GetSearchParams>({
    keywords: "",
    page: 1,
    parent: route.params.path ?? "/asmr",
    per_page: default_per_page,
    refresh: false,
  });

  const updateParam = useCallback(
    (key: keyof GetSearchParams, value: any) => {
      setParams({ ...params, [key]: value });
    },
    [params]
  );

  const onFetch = useCallback(async () => {
    if (!params.keywords) return Promise.resolve(true);
    try {
      setLoading(true);
      const { data } = await GetSearch(params);
      setTotal(data.total);
      setItems(data.content);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const onRefresh = async (keywords?: string) => {
    if (loading) return;
    setLoading(true);
    setItems([]);
    await sleep(300);
    updateParam("keywords", keywords ?? params.keywords ?? "");
  };

  const onCanBack = () => {
    const isBack = router.canGoBack();
    if (isBack) {
      router.back();
    } else {
      router.replace("/catalog");
    }
  };

  const onLeftPress = async (item: GetItem) => {
    if (item.is_dir) {
      setStorage(
        CATALOG_CHANGE_PATH,
        formatPath(item.parent || "/", item.name)
      );
      onCanBack();
    }
  };

  useEffect(() => {
    if (params.keywords) onFetch();
    else setLoading(false);
  }, [onFetch, params.keywords, route, updateParam]);
  return (
    <ThemedView style={styles.container}>
      <HeaderSearchBar
        backIcon="chevron-left"
        keywords={params.keywords}
        loading={loading}
        onSearch={onRefresh}
      />
      <Text style={styles.parent}>{params.parent}</Text>
      <CatalogAction
        title="搜索结果"
        rightText={`${items.length}/${total}`}
        style={styles.action}
        onSortOrder={() => onRefresh()}
      />
      {loading ? (
        <ActivityIndicator
          size={50}
          color={theme.colors.primary}
          style={styles.loading}
        />
      ) : (
        <CatalogList
          data={items}
          height={60}
          showParent={true}
          onRefresh={onFetch}
          onLeftPress={onLeftPress}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parent: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: "SpaceMono",
  },
  action: {
    paddingHorizontal: 10,
  },
  loading: {
    flex: 1,
  },
});

export default SearchScreen;
