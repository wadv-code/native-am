import { CatalogList } from "@/components/catalog/CatalogList";
import { useEffect, useState } from "react";
import ParallaxView from "../ParallaxView";
import { HeaderBar, type ToolbarSortOrder } from "../sys";
import { CatalogToolbar } from "./CatalogToolbar";
import { Alert, StyleSheet } from "react-native";
import { GetItems } from "@/api/api";
import { storageManager } from "@/storage";
import { formatPath, isAudioFile } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import type { GetItemsParams, GetItemsResItem } from "@/api";

const default_per_page = 1000;

type CatalogViewProps = {
  path?: string;
};

const CatalogView = ({ path = "/" }: CatalogViewProps) => {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
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
      const { data } = await GetItems(params, refresh);
      setTotal(data.total);
      setSortOrderItems(data.content);
      storageManager.set("catalog_view_path", params.path);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setLoading(false);
    }
  };

  const handleItem = (item: GetItemsResItem) => {
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

  const onRefresh = () => {
    if (loading) return;
    params.per_page = default_per_page;
    onFetch(true);
  };

  const toPath = (target: string) => {
    setParams({ ...params, path: target || "/" });
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

  useEffect(() => {
    onFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <ParallaxView style={styles.container}>
      <HeaderBar />
      <CatalogToolbar
        path={params.path}
        toPath={toPath}
        rightText={`${items.length}/${total}`}
        onSortOrder={() => setSortOrderItems(items)}
      />
      <CatalogList
        items={items}
        total={total}
        loading={loading}
        path={params.path}
        handleItem={handleItem}
        onRefresh={onRefresh}
      />
    </ParallaxView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export { CatalogView, CatalogViewProps };
