import React, { useEffect, useRef, useState } from "react";
import { IndexItem } from "@/components/index/IndexItem";
import ParallaxView from "@/components/ParallaxView";
import { emitter } from "@/utils/mitt";
import { storageManager } from "@/storage";
import {
  HeaderBar,
  HeaderToolbar,
  type ToolbarSortOrder,
} from "@/components/sys";
import { GetItems } from "@/api/api";
import type { HistoryItem } from "@/types";
import type { GetItemsParams, GetItemsResItem } from "@/api";
import { useIsFocused } from "@react-navigation/native";
import {
  FlatList,
  BackHandler,
  Platform,
  Alert,
  RefreshControl,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import {
  formatFileSize,
  formatPath,
  formatTimeAgo,
  isAudioFile,
} from "@/utils/lib";

const default_per_page = 1000;

const CatalogScreen = () => {
  const isFocused = useIsFocused();
  const isFocusedRef = useRef<boolean>(false);
  const flatListRef = useRef<FlatList<GetItemsResItem>>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const historyItemsRef = useRef<HistoryItem[]>(historyItems);
  const isInitialRender = useRef<boolean>(false);
  const scrollYRef = useRef<number>(0);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [params, setParams] = useState<GetItemsParams>({
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
        // item.modified = dayjs(item.modified || Date.now()).format(
        //   "YYYY-MM-DD hh:ss"
        // );
        item.modifiedFormat = formatTimeAgo(item.modified);
        item.sizeFormat = formatFileSize(item.size);
      });
      setTotal(data.total);
      setSortOrderItems(data.content);
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

  const handleItem = (item: GetItemsResItem) => {
    if (refreshing) return;
    setSelectedName(item.name);
    if (item.is_dir) {
      params.name = item.name;
      params.path = formatPath(params.path, item.name);
      const lastHistory = historyItems[historyItems.length - 1];
      if (lastHistory) lastHistory.scrollY = scrollYRef.current;
      setHistoryLocal([...historyItems, JSON.parse(JSON.stringify(params))]);
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
      setParams({ ...params });
    }
    setHistoryItems(list);
  };

  const toHistory = (history?: HistoryItem) => {
    if (history) {
      const index = historyItems.findIndex((f) => f.path === history.path);
      if (index > -1) setHistoryLocal([...historyItems.slice(0, index + 1)]);
    } else {
      setHistoryLocal([]);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
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
    onFetch()
      .catch(() => {
        const list = historyItemsRef.current || [];
        const lastHistory = list[list.length - 2];
        if (lastHistory) toHistory(lastHistory);
      })
      .then(() => {
        historyItemsRef.current = historyItems;
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: history ? history.scrollY || 0 : 0,
            animated: false,
          });
        }, 100);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyItems]);

  const onScrollToIndexFailed = () => {
    console.log("onScrollToIndexFailed");
  };

  useEffect(() => {
    onFetchHistoryItems();
    // 注册返回事件监听
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isFocusedRef.current) {
          const list = historyItemsRef.current || [];
          if (list.length) {
            list.pop();
            setHistoryLocal([...list]);
          }
        }
        return isFocusedRef.current;
      }
    );
    // 组件卸载时移除监听
    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isFocusedRef.current = isFocused;
    if (isFocused) {
      (async () => {
        const path = await storageManager.get("parent_search_path");
        if (path) {
          const spPtahs = path.split("/").filter((f: string) => f);
          let parentPath = "";
          const list = spPtahs.map((v: string) => {
            parentPath = formatPath(parentPath, v);
            return { ...params, name: v, path: parentPath };
          });
          await storageManager.remove("parent_search_path");
          setHistoryLocal(list);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <ParallaxView style={{ paddingHorizontal: 10 }}>
      <HeaderBar />
      <HeaderToolbar
        items={historyItems}
        name={selectedName}
        path={params.path}
        synopsis={{ total, pageSize: items.length }}
        onPress={toHistory}
        onRoot={() => toHistory()}
        onSortOrder={onSortOrder}
      />
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={({ item }) => (
          <IndexItem item={item} onPress={handleItem} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={Platform.select({
          ios: {
            paddingBottom: 140,
          },
          default: {
            paddingBottom: 70,
          },
        })}
      />
    </ParallaxView>
  );
};

export default CatalogScreen;
