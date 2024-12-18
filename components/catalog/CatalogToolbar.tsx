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
import { useIsFocused } from "@react-navigation/native";
import { Text } from "@rneui/themed";
import { globalStyles } from "@/styles";
import { CatalogAction } from "./CatalogAction";
import type { ActionSortOrder } from "@/types";

type ToolbarProps = {
  rightText: string;
  loading?: boolean;
  path?: string;
  toPath?: (path: string) => void;
  onSortOrder?: (order: ActionSortOrder) => void;
  enableTouchBack?: boolean;
  showOpenSearch?: boolean;
};

type HistoryItem = {
  name: string;
  parent: string;
};

const CatalogToolbar = (props: ToolbarProps) => {
  const {
    rightText,
    loading,
    path = "/",
    enableTouchBack = false,
    showOpenSearch = false,
  } = props;
  const { toPath, onSortOrder } = props;
  const isFocused = useIsFocused();
  const isFocusedRef = useRef<boolean>(false);
  const isLoadingRef = useRef<boolean>(false);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const itemsRef = useRef<HistoryItem[]>(items);
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
    if (isLoadingRef.current) return true;
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
    isLoadingRef.current = !!loading;
  }, [loading]);

  useEffect(() => {
    if (!enableTouchBack) return;
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
        {showOpenSearch && (
          <TouchableOpacity style={styles.searchIcon} onPress={openSearch}>
            <Text style={{ fontSize: 16 }}>🔍搜索</Text>
          </TouchableOpacity>
        )}
      </View>
      <CatalogAction
        rightText={rightText}
        title={getName()}
        onSortOrder={onSortOrder}
      />
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

export { CatalogToolbar };
