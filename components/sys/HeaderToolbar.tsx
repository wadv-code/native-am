import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../theme/ThemedView";
import { IconSymbol } from "../ui";
import { ThemedText } from "../theme/ThemedText";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import type { GetItemsParams } from "@/api";
import type { MaterialIconsName } from "@/types";
import { storageManager } from "@/storage";

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
  items: GetItemsParams[];
  synopsis?: ToolbarSynopsis;
  onPress?: (item: GetItemsParams) => void;
  onRoot?: () => void;
  onSortOrder?: (order: ToolbarSortOrder) => void;
};

const HeaderToolbar: React.FC<ToolbarProps> = (props) => {
  const { name, items, synopsis } = props;
  const { onPress, onRoot, onSortOrder } = props;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [sort, setSort] = useState<ToolbarSort>("descending");
  const [order, setOrder] = useState<ToolbarOrder>("time");
  const [loading, setLoading] = useState<boolean>(false);
  const isInitialRender = useRef<boolean>(false);

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
    <ThemedView>
      {/* <View>面包屑</View> */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.rootIcon} onPress={onRoot}>
          <IconSymbol size={24} name="snippet-folder" />
        </TouchableOpacity>
        <Animated.ScrollView
          ref={scrollRef}
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
                  size={14}
                  style={{ marginHorizontal: 3 }}
                  name="arrow-right"
                />
                <ThemedText style={styles.text}>{item.name}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      </View>
      <View style={styles.filterContainer}>
        <ThemedText
          style={[styles.smallText, { width: "63%" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name ?? "精选"}
        </ThemedText>
        <View style={styles.toolbar}>
          <ThemedText style={styles.smallText}>
            {synopsis?.pageSize}/{synopsis?.total}
          </ThemedText>
          <TouchableOpacity style={styles.row} onPress={onOrder}>
            <IconSymbol
              style={{ marginRight: 3 }}
              size={16}
              name="sort-by-alpha"
            />
            <ThemedText style={styles.smallText}>{order}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSort}>
            <IconSymbol size={18} name={getOrderIcon()} />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
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
  rootIcon: {
    flexDirection: "row",
    justifyContent: "center",
  },
  scrollView: {
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export { HeaderToolbar };
