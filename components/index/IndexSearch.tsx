import { GetSearch } from "@/api/api";
import { IndexItem } from "@/components/index/IndexItem";
import ParallaxView from "@/components/ParallaxView";
import { HeaderSearchBar } from "@/components/sys/HeaderSearchBar";
import { formatFileSize, formatTimeAgo, isAudioFile } from "@/utils/lib";
import { useEffect, useRef, useState } from "react";
import type { GetItemsResItem } from "@/api";
import { emitter } from "@/utils/mitt";
import { ThemedText } from "@/components/theme/ThemedText";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

const default_per_page = 50;

type IndexSearchProps = ViewProps & {};

const IndexSearch = ({ style }: IndexSearchProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [items, setItems] = useState<GetItemsResItem[]>([]);

  const flatListRef = useRef<FlatList<GetItemsResItem>>(null);
  const params = {
    keywords: "地铁",
    page: 1,
    parent: "/asmr",
    per_page: default_per_page,
    refresh: false,
  };

  const onNotKeywords = () => {
    Alert.alert(
      "提示",
      "搜索关键字是必填项。",
      [
        {
          text: "关闭",
          style: "cancel",
        },
        // { text: "OK", onPress: () => storageManager.clear() },
      ],
      { cancelable: false }
    );
  };

  const onFetch = async () => {
    if (!params.keywords) {
      onNotKeywords();
      return;
    }
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
      setItems(data.content);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  // 刷新
  const onRefresh = async () => {
    if (refreshing) return;
    params.per_page = default_per_page;
    // const history = historyItems.find((f) => f.path === params.path);
    // if (history) history.per_page = params.per_page;
    // setHistoryLocal(historyItems);
    onFetch();
  };

  const handleItem = (item: GetItemsResItem) => {
    if (refreshing) return;
    if (item.is_dir) {
      // console.log("文件夹");
      // setHistoryLocal([...historyItems, JSON.parse(JSON.stringify(params))]);
    } else if (isAudioFile(item.name)) {
      emitter.emit("onAudioChange", item);
    } else {
      Alert.prompt("还未处理的文件格式。");
    }
  };

  const onSeatch = (keywords?: string) => {
    params.keywords = keywords ?? "";
    onFetch();
  };

  useEffect(() => {
    onFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ParallaxView style={[styles.container, style]}>
      <HeaderSearchBar keywords={params.keywords} onSeatch={onSeatch} />
      <View style={styles.toolbar}>
        <ThemedText>
          {items.length}/{total}
        </ThemedText>
      </View>
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IndexItem item={item} onPress={handleItem} />
        )}
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
    </ParallaxView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  toolbar: {
    padding: 5,
  },
});

export default IndexSearch;
