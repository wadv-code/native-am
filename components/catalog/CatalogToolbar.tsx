import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  BackHandler,
} from "react-native";
import { IconSymbol } from "../ui";
import React, { useEffect, useRef, useState } from "react";
import { storageManager } from "@/storage";
import { useRouter } from "expo-router";
import type { MaterialIconsName } from "@/types";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "@rneui/themed";
import { globalStyles } from "@/styles";

// 排序方式
const orders = ["name", "time", "size"] as const;
// 排序
const sorts = ["descending", "ascending"] as const;

// type ToolbarSynopsis = {
//   total: number;
//   pageSize: number;
// };

type ToolbarOrder = (typeof orders)[number];

type ToolbarSort = (typeof sorts)[number];

type ToolbarSortOrder = {
  sort: ToolbarSort;
  order: ToolbarOrder;
};

type ToolbarProps = {
  rightText: string;
  path?: string;
  toPath?: (path: string) => void;
  onSortOrder?: (order: ToolbarSortOrder) => void;
};

type HistoryItem = {
  name: string;
  parent: string;
};

const CatalogToolbar: React.FC<ToolbarProps> = (props) => {
  const { rightText, path = "/" } = props;
  const { toPath, onSortOrder } = props;
  const isFocused = useIsFocused();
  const isFocusedRef = useRef<boolean>(false);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const itemsRef = useRef<HistoryItem[]>(items);
  const [sort, setSort] = useState<ToolbarSort>("descending");
  const [order, setOrder] = useState<ToolbarOrder>("time");
  const isInitialRender = useRef<boolean>(false);
  const router = useRouter();

  const onRoot = () => {
    setItems([]);
    toPath && toPath("/");
  };

  const handleItem = (item: HistoryItem, index: number) => {
    setItems([...items.slice(0, index + 1)]);
    toPath && toPath(item.parent);
  };

  const openSearch = () => {
    router.navigate({
      pathname: "/views/search",
      params: {
        path: path ?? "/",
      },
    });
  };

  const onOrder = () => {
    const index = orders.findIndex((f) => f === order);
    const orderString = orders[index + 1];
    const value = orderString ?? orders[0];
    setOrder(value);
    storageManager.set("order_string", value);
  };

  const onSort = () => {
    const index = sorts.findIndex((f) => f === sort);
    const sortString = sorts[index + 1];
    const value = sortString ?? sorts[0];
    setSort(value);
    storageManager.set("sort_string", value);
  };

  const getOrderIcon: () => MaterialIconsName = () => {
    const icons: Record<ToolbarSort, MaterialIconsName> = {
      ascending: "arrow-upward",
      descending: "arrow-downward",
    };
    return icons[sort];
  };

  const getName = () => {
    const item = items[items.length - 1];
    return item ? item.name : "精选";
  };

  const splitToItems = (splitPath?: string) => {
    const p = splitPath || "/";
    const split = p.split("/").filter((f) => f);
    let parent: string[] = [];
    const result = split.map((v) => {
      parent.push(v);
      return {
        parent: "/" + parent.join("/"),
        name: v,
      };
    });
    const list = [...result];
    itemsRef.current = list;
    setItems(list);
    return list;
  };

  const toCurrentPath = () => {
    if (isFocusedRef.current) {
      const list = itemsRef.current || [];
      const backItem = list[list.length - 2];
      if (backItem) {
        handleItem(backItem, list.length - 2);
      } else {
        onRoot();
      }
    }
    return isFocusedRef.current;
  };

  useEffect(() => {
    isFocusedRef.current = isFocused;
    if (isFocused) {
      (async () => {
        const path = await storageManager.get("parent_search_path");
        if (path) {
          await storageManager.remove("parent_search_path");
          splitToItems(path);
          toPath && toPath(path);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (!isInitialRender.current) {
      isInitialRender.current = true;
      return;
    }
    onSortOrder && onSortOrder({ sort, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, order]);

  useEffect(() => {
    // 注册返回事件监听
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      toCurrentPath
    );
    // 组件卸载时移除监听
    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    splitToItems(path);
  }, [path]);

  return (
    <View style={styles.container}>
      <View style={globalStyles.row}>
        <TouchableOpacity onPress={onRoot}>
          <IconSymbol size={24} name="snippet-folder" />
        </TouchableOpacity>
        <Animated.ScrollView
          scrollEventThrottle={16}
          style={{ height: 40 }}
          horizontal={true}
          contentContainerStyle={styles.scrollView}
        >
          {items.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.breadcrumb}
                onPress={() => handleItem(item, index)}
              >
                <IconSymbol
                  size={16}
                  style={{ marginHorizontal: 3 }}
                  name="arrow-right"
                />
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
        <TouchableOpacity style={styles.searchIcon} onPress={openSearch}>
          <Text style={{ fontSize: 16 }}>🔍搜索</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.rowBetween}>
        <Text
          style={[styles.smallText, { width: "63%" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {getName()}
        </Text>
        <View style={styles.toolbar}>
          <Text style={styles.smallText}>{rightText}</Text>
          <TouchableOpacity style={globalStyles.row} onPress={onOrder}>
            <IconSymbol
              style={{ marginRight: 3 }}
              size={16}
              name="sort-by-alpha"
            />
            <Text style={styles.smallText}>{order}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSort}>
            <IconSymbol size={18} name={getOrderIcon()} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  icon: {
    marginLeft: 5,
    marginRight: 5,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbar: {
    width: "22%",
    gap: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  searchIcon: {
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  scrollView: {
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export { CatalogToolbar, ToolbarSortOrder, ToolbarOrder, ToolbarSort };
