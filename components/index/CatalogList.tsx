import { IndexItem } from "@/components/index/IndexItem";
import type { GetItemsResItem } from "@/api";
import type { ThemedViewProps } from "@/components/theme/ThemedView";
import { useTheme } from "@/hooks/useThemeColor";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  VirtualizedList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

type CatalogListProps = ThemedViewProps & {
  path: string;
  total: number;
  loading?: boolean;
  items: GetItemsResItem[];
  onRefresh?: () => void;
  handleItem?: (item: GetItemsResItem) => void;
};

const ITEM_HEIGHT = 50;
const state: Recordable<number> = {};

const CatalogList = (props: CatalogListProps) => {
  const { path = "/", total, loading = false, items } = props;
  const ref = useRef<VirtualizedList<GetItemsResItem>>(null);
  const [refreshing, setRefreshing] = useState(loading);
  const isInitialRender = useRef<boolean>(false);
  const { onRefresh, handleItem } = props;
  const theme = useTheme();

  const click = (item: GetItemsResItem) => {
    handleItem && handleItem(item);
  };

  const onScrollToIndexFailed = () => {
    console.log("onScrollToIndexFailed");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const contentOffset = event.nativeEvent.contentOffset;
    state[path] = contentOffset.y;
  };

  // // 处理滚动事件，更新当前滚动索引
  // const handleScroll = useCallback(({ index }: any) => {
  //   console.log(index);
  //   // setCurrentScrollIndex(index);
  // }, []);

  const renderItem: ListRenderItem<GetItemsResItem> = ({ item }) => {
    return <IndexItem item={item} height={ITEM_HEIGHT} onPress={click} />;
  };

  const getItem = (_data: unknown, index: number) => {
    const item = items[index];
    return item ? item : { id: Math.random().toString(), name: "加载中..." };
  };

  useEffect(() => {
    isInitialRender.current = true;
    if (ref.current && ref.current.scrollToOffset) {
      const offset = state[path] ?? 0;
      console.log("offset", offset);
      ref.current.scrollToOffset({
        offset,
        animated: true,
      });
    }
  }, [items]);

  useEffect(() => {
    setRefreshing(loading);
  }, [loading]);

  if (refreshing) {
    return (
      <ActivityIndicator
        size={50}
        color={theme.primary}
        style={[styles.loading, { backgroundColor: theme.background }]}
      />
    );
  }

  return (
    <VirtualizedList
      ref={ref}
      data={items}
      renderItem={renderItem}
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
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export { CatalogList, CatalogListProps };
