import { StyleSheet, TouchableOpacity, View, Animated } from "react-native";
import { IconSymbol } from "../ui";
import React, { useEffect, useRef, useState } from "react";
import { storageManager } from "@/storage";
import { useRouter } from "expo-router";
import type { GetItemsParams } from "@/api";
import type { MaterialIconsName } from "@/types";
import { Text } from "@rneui/themed";

// 排序方式
const orders = ["name", "time", "size"] as const;
// 排序
const sorts = ["descending", "ascending"] as const;

export type ToolbarSynopsis = {
  total: number;
  pageSize: number;
};

export type ToolbarOrder = (typeof orders)[number];

export type ToolbarSort = (typeof sorts)[number];

export type ToolbarSortOrder = {
  sort: ToolbarSort;
  order: ToolbarOrder;
};

export type ToolbarProps = {
  name?: string;
  path?: string;
  items: GetItemsParams[];
  synopsis?: ToolbarSynopsis;
  onPress?: (item: GetItemsParams) => void;
  onRoot?: () => void;
  onSortOrder?: (order: ToolbarSortOrder) => void;
};

const HeaderToolbar: React.FC<ToolbarProps> = (props) => {
  const { name, path, items, synopsis } = props;
  const { onPress, onRoot, onSortOrder } = props;
  const [sort, setSort] = useState<ToolbarSort>("descending");
  const [order, setOrder] = useState<ToolbarOrder>("time");
  const [loading, setLoading] = useState<boolean>(false);
  const isInitialRender = useRef<boolean>(false);
  const router = useRouter();

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
      ascending: "arrow-downward",
      descending: "arrow-upward",
    };
    return icons[sort];
  };

  const openSearch = () => {
    router.navigate({
      pathname: "/views/search",
      params: {
        path: path ?? "/",
      },
    });
  };

  useEffect(() => {
    if (!isInitialRender.current) {
      isInitialRender.current = true;
      return;
    }
    onSortOrder && onSortOrder({ sort, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, order]);

  useEffect(() => {
    const init = async () => {
      const sortValue = (await storageManager.get("sort_string")) ?? sort;
      const orderValue = (await storageManager.get("order_string")) ?? order;
      setOrder(sortValue);
      setOrder(orderValue);
      setLoading(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading) return null;

  return (
    <View>
      <View style={styles.row}>
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
                onPress={() => onPress && onPress(item)}
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
          <Text style={{ fontSize: 18 }}>🔍搜索</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <Text
          style={[styles.smallText, { width: "63%" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name ?? "精选"}
        </Text>
        <View style={styles.toolbar}>
          <Text style={styles.smallText}>
            {synopsis?.pageSize}/{synopsis?.total}
          </Text>
          <TouchableOpacity style={styles.row} onPress={onOrder}>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export { HeaderToolbar };
