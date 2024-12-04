import React, { useEffect, useRef, useState } from "react";
import { IndexItem, type IndexItemProps } from "@/components/index/IndexItem";
import ParallaxView from "@/components/ParallaxView";
import { formatPath, isAudioFile } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { storageManager } from "@/storage";
import { HeaderToolbar, type ToolbarSortOrder } from "@/components/sys";
import {
  FlatList,
  BackHandler,
  Platform,
  ToastAndroid,
  Alert,
  RefreshControl,
} from "react-native";
import {
  useBaseApi,
  type GetItemsParams,
  type GetItemsResItem,
} from "@/api/api";
import type { HistoryItem } from "@/types";

const { GetItems } = useBaseApi();

const default_per_page = 1000;

export default function HomeScreen() {
  const flatListRef = useRef<FlatList<GetItemsResItem>>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const historyItemsRef = useRef<HistoryItem[]>(historyItems);
  const isInitialRender = useRef<boolean>(false);
  const isScrollIndex = useRef<boolean>(false);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [params, setParams] = useState<GetItemsParams>({
    name: "",
    page: 1,
    password: "",
    path: "/",
    per_page: default_per_page,
    refresh: false,
  });

  const onFetch = async (refresh?: boolean) => {
    try {
      setRefreshing(true);
      const { data } = await GetItems(params, refresh);
      data.content.forEach((item) => {
        item.id = Math.random().toString();
        item.parent = params.path;
      });
      setTotal(data.total);
      setSortOrderItems(data.content);
      refresh && ToastAndroid.show("加载成功。", 1000);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  const onSortOrder = (option: ToolbarSortOrder) => {
    setSortOrderItems(items, option);
  };

  const setSortOrderItems = async (
    list: GetItemsResItem[],
    option?: ToolbarSortOrder
  ) => {
    const sort = (await storageManager.get("sort_string")) ?? "descending";
    const order = (await storageManager.get("order_string")) ?? "time";
    const sortOrder = option ?? { sort, order };

    list.sort((a, b) => {
      if (sortOrder.order === "time") {
        if (sortOrder.sort === "ascending") {
          return (
            new Date(b.modified || Date.now()).getTime() -
            new Date(a.modified || Date.now()).getTime()
          );
        } else {
          return (
            new Date(a.modified || Date.now()).getTime() -
            new Date(b.modified || Date.now()).getTime()
          );
        }
      } else if (sortOrder.order === "size") {
        if (sortOrder.sort === "ascending") {
          return (b.size || 0) - (a.size || 0);
        } else {
          return (a.size || 0) - (b.size || 0);
        }
      } else {
        if (sortOrder.sort === "ascending") {
          return a.name.localeCompare(b.name, "zh-CN");
        } else {
          return b.name.localeCompare(a.name, "zh-CN");
        }
      }
    });

    setItems([...list]);
  };

  // 刷新
  const onRefresh = async () => {
    if (refreshing) return;
    params.per_page = default_per_page;
    const history = historyItems.find((f) => f.path === params.path);
    if (history) history.per_page = params.per_page;
    setHistoryLocal(historyItems);
    onFetch(true);
  };

  const handleItem = async (item: IndexItemProps) => {
    if (refreshing) return;
    setSelectedName(item.name);
    if (item.is_dir) {
      params.name = item.name;
      params.scrollName = item.name;
      params.path = formatPath(params.path, item.name);
      const lastHistory = historyItems[historyItems.length - 1];
      if (lastHistory) lastHistory.scrollName = item.name;
      setHistoryLocal([...historyItems, { ...params }]);
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
    onFetch().catch((error) => {
      console.log(error);
      const list = historyItemsRef.current || [];
      const lastHistory = list[list.length - 2];
      if (lastHistory) toHistory(lastHistory);
    });
    historyItemsRef.current = historyItems;
    isScrollIndex.current = true;
  }, [historyItems]);

  useEffect(() => {
    if (!isScrollIndex.current) return;
    const list = historyItemsRef.current || [];
    const lastHistory = list[list.length - 1];
    if (lastHistory) {
      const index = items.findIndex((f) => f.name === lastHistory.scrollName);
      if (index > -1) {
        flatListRef.current?.scrollToIndex({
          index,
          animated: false,
        });
      }
      isScrollIndex.current = false;
    }
  }, [items]);

  const onScrollToIndexFailed = () => {
    console.log("onScrollToIndexFailed");
  };

  useEffect(() => {
    onFetchHistoryItems();
    // 注册返回事件监听
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const list = historyItemsRef.current || [];
        if (list.length) {
          list.pop();
          setHistoryLocal([...list]);
        }
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
        keyExtractor={(item) => item.id}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={({ item, index }) => (
          <IndexItem {...item} index={index} onPress={handleItem} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
