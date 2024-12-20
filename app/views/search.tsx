import type { GetItem, GetSearchParams } from "@/api";
import { GetSearch } from "@/api/api";
import { CatalogAction } from "@/components/catalog/CatalogAction";
import { CatalogList } from "@/components/catalog/CatalogList";
import { HeaderSearchBar } from "@/components/sys/HeaderSearchBar";
import { ThemedView } from "@/components/theme/ThemedView";
import { setStorage } from "@/storage/long";
import type { RootStackParamList } from "@/types";
import { formatPath } from "@/utils/lib";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const default_per_page = 100;
type SearchScreenRouteProp = RouteProp<RootStackParamList, "search">;

const SearchScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<SearchScreenRouteProp>();
  const isInitialRender = useRef<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<GetItem[]>([]);
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
      setStorage("onCatalogChangePath", formatPath(item.parent || "/", item.name));
      onCanBack();
    }
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
      <HeaderSearchBar
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
