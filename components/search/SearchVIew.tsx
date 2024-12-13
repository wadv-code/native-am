import { GetSearch } from "@/api/api";
import { HeaderSearchBar } from "@/components/sys/HeaderSearchBar";
import { useEffect, useRef, useState } from "react";
import type { GetItemsResItem, GetSearchParams } from "@/api";
import { emitter } from "@/utils/mitt";
import { SearchItem } from "../search/SearchItem";
import { useRouter } from "expo-router";
import { useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/types";
import { IconSymbol } from "../ui";
import { storageManager } from "@/storage";
import { Text } from "@rneui/themed";
import { ThemedView } from "../theme/ThemedView";
import {
  formatFileSize,
  formatPath,
  formatTimeAgo,
  isAudioFile,
} from "@/utils/lib";
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

const default_per_page = 30;

type SearchViewProps = ViewProps & {};
type SearchScreenRouteProp = RouteProp<RootStackParamList, "search">;

const SearchView = ({ style }: SearchViewProps) => {
  const router = useRouter();
  const route = useRoute<SearchScreenRouteProp>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isInitialRender = useRef<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [params, setParams] = useState<GetSearchParams>({
    keywords: "",
    page: 1,
    parent: "/asmr",
    per_page: default_per_page,
    refresh: false,
  });

  const onFetch = async () => {
    if (!params.keywords) return;
    try {
      setRefreshing(true);
      const { data } = await GetSearch(params);
      data.content.forEach((item) => {
        item.id = Math.random().toString();
        // item.parent = params.path;
        // item.modified = dayjs(item.modified || Date.now()).format(
        //   "YYYY-MM-DD hh:ss"
        // );
        item.modifiedFormat = formatTimeAgo(item.modified);
        item.sizeFormat = formatFileSize(item.size);
      });
      setTotal(data.total);
      setItems([...items, ...data.content]);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  const onCanBack = () => {
    const isBack = router.canGoBack();
    if (isBack) {
      router.back();
    } else {
      router.replace("/catalog");
    }
  };

  const handleItem = async (item: GetItemsResItem) => {
    if (refreshing) return;
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

  const onEndReached = () => {
    if (refreshing || items.length >= total) return;
    setParams({ ...params, page: params.page + 1 });
  };

  // 刷新
  const onRefresh = async (keywords?: string) => {
    if (refreshing) return;
    setRefreshing(true);
    setItems([]);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setParams({
      ...params,
      page: 1,
      keywords: keywords ?? params.keywords ?? "",
    });
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
    else setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // useEffect(() => {
  //   onFetch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <ThemedView style={[styles.container, style]}>
      <HeaderSearchBar keywords={params.keywords} onSeatch={onRefresh} />
      <View style={styles.toolbar}>
        <IconSymbol size={22} name="snippet-folder" />
        <Animated.ScrollView
          scrollEventThrottle={16}
          style={{ height: 40 }}
          horizontal={true}
          contentContainerStyle={styles.scrollView}
        >
          <Text> {params.parent}</Text>
        </Animated.ScrollView>
        <Text style={styles.total}>
          {items.length}/{total}
        </Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchItem item={item} onPress={handleItem} />
        )}
        onEndReached={onEndReached}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={Platform.select({
          ios: {
            paddingBottom: 80,
          },
          default: {
            paddingBottom: 10,
          },
        })}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  total: {
    paddingLeft: 5,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
  },
  scrollView: {
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SearchView;
