import { IndexItem } from "@/components/index/IndexItem";
import type { GetItemsResItem } from "@/api";
import type { ThemedViewProps } from "@/components/theme/ThemedView";
import { useTheme } from "@/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
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
  const scrollYRef = useRef(0);
  const { onRefresh, handleItem } = props;
  const theme = useTheme();

  const click = (item: GetItemsResItem) => {
    state[path] = scrollYRef.current || 0;
    handleItem && handleItem(item);
  };

  const onScrollToIndexFailed = () => {
    console.log("onScrollToIndexFailed");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
  };

  const handleRefresh = () => {
    delete state[path];
    onRefresh && onRefresh();
  };

  const renderItem: ListRenderItem<GetItemsResItem> = ({ item }) => {
    return <IndexItem item={item} height={ITEM_HEIGHT} onPress={click} />;
  };

  const getItem = (_data: unknown, index: number) => {
    const item = items[index];
    return item ? item : { id: Math.random().toString(), name: "加载中..." };
  };

  useEffect(() => {
    if (ref.current && ref.current.scrollToOffset) {
      const offset = state[path] ?? 0;
      ref.current?.scrollToOffset({
        offset,
        animated: false,
      });
      delete state[path];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    setRefreshing(loading);
  }, [loading]);

  if (!items.length) {
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
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
