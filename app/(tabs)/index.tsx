import React, { useEffect, useRef, useState } from "react";
import { IndexItem, type IndexItemProps } from "@/components/index/IndexItem";
import ParallaxView from "@/components/ParallaxView";
import { formatPath, isAudioFile } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { storageManager } from "@/storage";
import { ThemedText } from "@/components/theme/ThemedText";
import { HeaderToolbar, type ToolbarSortOrder } from "@/components/sys";
import {
  FlatList,
  BackHandler,
  Platform,
  RefreshControl,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  useBaseApi,
  type GetItemsParams,
  type GetItemsResItem,
} from "@/api/api";
import type { HistoryItem } from "@/types";

const { GetItems } = useBaseApi();

export default function HomeScreen() {
  const flatListRef = useRef<FlatList<GetItemsResItem>>(null);
  const [scrollY, setScrollY] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const historyItemsRef = useRef(historyItems);
  const isInitialRender = useRef(false);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [params, setParams] = useState<GetItemsParams>({
    name: "",
    page: 1,
    password: "",
    path: "/",
    per_page: 30,
    refresh: false,
  });

  const onFetch = async (refresh?: boolean) => {
    try {
      setRefreshing(true);
      const { data } = await GetItems(params, refresh);
      data.content.forEach((item) => {
        item.parent = params.path;
      });
      setTotal(data.total);
      setItems(data.content);
      refresh && ToastAndroid.show("加载成功。", 1000);
    } catch {
      console.log("Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToOffset({
      offset: getOffset(),
      animated: false,
    });
  }, [items]);

  const getOffset = () => {
    return Math.floor(historyItems[historyItems.length - 1]?.scrollY ?? 0);
  };

  // 刷新
  const onRefresh = async () => {
    if (refreshing) return;
    params.per_page = 30;
    const history = historyItems.find((f) => f.path === params.path);
    if (history) history.per_page = params.per_page;
    setHistoryLocal(historyItems);
    onFetch(true);
  };

  const onFetchMore = () => {
    if (refreshing) return;
    params.per_page += 30;
    const history = historyItems.find((f) => f.path === params.path);
    if (history) history.per_page = params.per_page;
    setHistoryLocal(historyItems);
    onFetch(true);
  };

  const onSortOrder = (option: ToolbarSortOrder) => {
    console.log(option.order);
  };

  const handleItem = async (item: IndexItemProps) => {
    setSelectedName(item.name);
    if (item.is_dir) {
      params.name = item.name;
      params.path = formatPath(params.path, item.name);
      if (historyItems.length) {
        historyItems[historyItems.length - 1].scrollY = scrollY;
      }
      setHistoryLocal([...historyItems, { ...params, scrollY: 0 }]);
    } else if (isAudioFile(item.name)) {
      emitter.emit("onAudioChange", item);
    } else {
      Alert.prompt("还未处理的文件格式。");
    }
  };

  const setHistoryLocal = (items?: GetItemsParams[]) => {
    const list = items ?? historyItems;
    setHistoryItems(list);
    storageManager.set("history_items", list);
  };

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    setScrollY(nativeEvent.contentOffset.y);
  };

  const onFetchHistoryItems = async () => {
    const list = (await storageManager.get("history_items")) || [];
    const lastParams = list[list.length - 1];
    if (lastParams) {
      params.path = lastParams.path;
      params.name = lastParams.name;
      setParams({ ...lastParams });
    }
    setHistoryItems(list);
    onFetch();
  };

  const toHistory = (history?: HistoryItem) => {
    if (history) {
      const index = historyItems.findIndex((f) => f.path === history.path);
      if (index > -1) setHistoryLocal([...historyItems.slice(0, index + 1)]);
    } else {
      setHistoryLocal([]);
    }
  };

  useEffect(() => {
    if (!isInitialRender.current) {
      isInitialRender.current = true;
      return;
    }
    const history = historyItems[historyItems.length - 1];
    if (history) {
      params.path = history ? history.path : "/";
      params.name = history.name;
    } else {
      params.path = "/";
    }
    onFetch();
    historyItemsRef.current = historyItems;
  }, [historyItems]);

  useEffect(() => {
    onFetchHistoryItems();
    // 注册返回事件监听
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const list = historyItemsRef.current || [];
        list.pop();
        setHistoryLocal([...list]);
        return true;
      }
    );
    // 组件卸载时移除监听
    return () => backHandler.remove();
  }, []);

  return (
    <ParallaxView>
      <HeaderToolbar
        items={historyItems}
        name={selectedName}
        synopsis={{ total, pageSize: items.length }}
        onPress={toHistory}
        onRoot={() => toHistory()}
        onSortOrder={onSortOrder}
      />
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={({ item, index }) => (
          <IndexItem {...item} index={index} onPress={handleItem} />
        )}
        keyExtractor={(item) => item.name}
        extraData={selectedName}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        ListFooterComponent={() =>
          items.length < total ? (
            <TouchableOpacity
              onPress={onFetchMore}
              style={styles.moreTouchable}
            >
              <ThemedText>··· 点我加载更多 ···</ThemedText>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={Platform.select({
          ios: {
            paddingBottom: 120,
          },
          default: {
            paddingBottom: 60,
          },
        })}
      />
    </ParallaxView>
  );
}

const styles = StyleSheet.create({
  moreTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
