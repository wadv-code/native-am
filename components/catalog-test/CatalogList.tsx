import type { GetItemsParams, GetItemsResItem } from "@/api";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  VirtualizedList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewProps,
} from "react-native";
import { CatalogItem } from "../catalog/CatalogItem";
import { FAB, useTheme } from "@rneui/themed";
import { GetItems } from "@/api/api";
import { getSortOrderItems } from "@/utils/common";

type CatalogListProps = ViewProps & {
  path: string;
};

const default_per_page = 1000;

const CatalogList = ({ path }: CatalogListProps) => {
  const { theme } = useTheme();
  const ref = useRef<VirtualizedList<GetItemsResItem>>(null);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const params: GetItemsParams = {
    page: 1,
    password: "",
    path,
    per_page: default_per_page,
    refresh: false,
  };
  const height = 50;
  const showParent = false;
  const refreshId = "";

  const getItem = (_data: GetItemsResItem, index: number) => {
    const item = items[index];
    if (item) {
      return item;
    } else {
      return {
        id: Math.random().toString(),
        name: "加载中...",
        sizeFormat: "0 Bytes",
        modifiedFormat: "1年前",
      };
    }
  };

  const onLeftPress = () => {};
  const onIconPress = () => {};
  const onRightPress = () => {};

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // scrollYRef.current = event.nativeEvent.contentOffset.y;
    const y = event.nativeEvent.contentOffset.y;
    if (y >= 200 && !visible) {
      setVisible(true);
    } else if (y <= 200 && visible) {
      setVisible(false);
    }
  };

  const onBackTop = () => {
    ref.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const onScrollToIndexFailed = () => {
    console.log("onScrollToIndexFailed");
  };

  const onFetch = async (refresh?: boolean) => {
    try {
      setRefreshing(true);
      const { data } = await GetItems(params, refresh);
      console.log(data.total);
      const list = await getSortOrderItems(data.content);
      setTotal(data.total);
      setItems(list);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (path) onFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <View>
      <VirtualizedList
        ref={ref}
        data={items}
        renderItem={({ item }) => (
          <CatalogItem
            item={item}
            height={height}
            showParent={showParent}
            refreshId={refreshId}
            onLeftPress={onLeftPress}
            onIconPress={onIconPress}
            onRightPress={onRightPress}
          />
        )}
        keyExtractor={(item) => item.id}
        getItemCount={() => total}
        initialNumToRender={16}
        windowSize={10}
        maxToRenderPerBatch={10}
        getItem={getItem}
        onScroll={handleScroll}
        onScrollToIndexFailed={onScrollToIndexFailed}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onFetch(true)}
          />
        }
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        contentContainerStyle={Platform.select({
          ios: {
            paddingBottom: 140,
          },
          default: {
            paddingBottom: 70,
          },
        })}
      />
      <FAB
        visible={visible}
        icon={{ name: "keyboard-arrow-up", color: "white" }}
        size="small"
        color={theme.colors.primary}
        style={styles.floatBtn}
        onPress={onBackTop}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  floatBtn: {
    position: "absolute",
    right: 15,
    bottom: 60,
    borderRadius: 24,
  },
});

export { CatalogList, CatalogListProps };
