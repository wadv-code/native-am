import { useEffect, useState } from "react";
import { HeaderBar } from "../sys";
import { CatalogToolbar } from "./CatalogToolbar";
import { Alert, StyleSheet } from "react-native";
import { GetItems } from "@/api/api";
import { storageManager } from "@/storage";
import { formatPath, isAudioFile } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { ThemedView } from "@/components/theme/ThemedView";
import type { GetItemsParams, GetItemsResItem } from "@/api";
import { CatalogList } from "./CatalogList";
import { CatalogOverlay } from "./CatalogOverlay";
import { getSortOrderItems, toggleCollect } from "@/utils/common";
import type { ActionSortOrder } from "@/types";

const default_per_page = 1000;

type CatalogViewProps = {
  path?: string;
};

const state: Recordable<number> = {};

const CatalogView = ({ path = "/" }: CatalogViewProps) => {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [scrollIndex, setScrollIndex] = useState<number>(0);
  const [params, setParams] = useState<GetItemsParams>({
    page: 1,
    password: "",
    path,
    per_page: default_per_page,
    refresh: false,
  });

  const onFetch = async (refresh?: boolean) => {
    try {
      setLoading(true);
      setItems([]);
      // 请求
      // 由于目录是特殊的树结构，传统的memo下钻太快可能更新负荷过大，所以每次都重新渲染当前屏幕已显示的数据。
      // 接口有缓存机制，太快，这里延迟一会儿，等待清理列表。
      await new Promise((resolve) => setTimeout(resolve, 150));
      const index = state[params.path] ?? 0;
      setScrollIndex(index);
      await new Promise((resolve) => setTimeout(resolve, 150));
      const { data } = await GetItems(params, refresh);
      const list = await getSortOrderItems(data.content);
      setTotal(data.total);
      setItems(list);
      storageManager.set("catalog_view_path", params.path);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (id: string, key: keyof GetItemsResItem, value: any) => {
    setItems((prevItems) => {
      // 创建一个新数组来避免直接修改状态
      return prevItems.map((item) => {
        // 如果找到匹配的id，则返回一个新的对象来更新它
        if (item.id === id) {
          return { ...item, [key]: value };
        }
        // 否则返回原始对象
        return item;
      });
    });
  };

  const onScrollIndex = (index: number) => {
    state[params.path] = index;
  };

  const onLeftPress = (item: GetItemsResItem) => {
    if (loading) return;
    if (item.is_dir) {
      const currentPath = formatPath(params.path, item.name);
      setParams({
        ...params,
        name: item.name,
        path: currentPath,
      });
    } else if (isAudioFile(item.name)) {
      emitter.emit("onAudioChange", item);
    } else {
      Alert.prompt("还未处理的文件格式。");
    }
  };

  const onIconPress = async (item: GetItemsResItem) => {
    const is_collect = await toggleCollect(item);
    item.is_collect = is_collect;
    updateItem(item.id, "is_collect", is_collect);
  };

  const onRightPress = (item: GetItemsResItem) => {
    // if (item.is_dir) onLeftPress(item);
    // else {
    //   setIsVisible(true);
    // }
  };

  const onRefresh = () => {
    if (loading) return;
    params.per_page = default_per_page;
    onFetch(true);
  };

  const toPath = (target: string) => {
    setParams({ ...params, path: target || "/" });
  };

  const onSortOrder = async (option: ActionSortOrder) => {
    const list = await getSortOrderItems(items, option);
    setItems(list);
  };

  useEffect(() => {
    onFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <CatalogToolbar
        path={params.path}
        toPath={toPath}
        loading={loading}
        rightText={`${items.length}/${total}`}
        onSortOrder={onSortOrder}
        enableTouchBack={true}
        showOpenSearch={true}
      />
      <CatalogList
        items={items}
        total={total}
        loading={loading}
        scrollIndex={scrollIndex}
        onIconPress={onIconPress}
        onLeftPress={onLeftPress}
        onRightPress={onRightPress}
        onScrollIndex={onScrollIndex}
        onRefresh={onRefresh}
      />
      <CatalogOverlay
        isVisible={isVisible}
        closeSheet={() => setIsVisible(false)}
      />
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
  },
});

export { CatalogView, CatalogViewProps };
