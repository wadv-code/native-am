import type { GetItemsResItem } from "@/api";
import { FAB, useTheme } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  ViewProps,
  VirtualizedList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { CatalogItem } from "./CatalogItem";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

type CatalogListProps = ViewProps & {
  total: number;
  height?: number;
  path?: string;
  loading?: boolean;
  showParent?: boolean;
  items: GetItemsResItem[];
  onRefresh?: () => void;
  onIconPress?: (item: GetItemsResItem) => void;
  onLeftPress?: (item: GetItemsResItem) => void;
  onRightPress?: (item: GetItemsResItem) => void;
};

const state: Recordable<number> = {};

const CatalogList = (props: CatalogListProps) => {
  const {
    path = "/",
    total,
    loading = false,
    height = 50,
    showParent,
    items,
  } = props;
  const { onRefresh, onIconPress, onLeftPress, onRightPress } = props;
  const ref = useRef<VirtualizedList<GetItemsResItem>>(null);
  const [visible, setVisible] = useState(false);
  const [refreshId, setRefreshId] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(loading);
  const [scrollIndex, setScrollIndex] = useState<number>(0);
  // const scrollYRef = useRef(0);
  const scrollIndexRef = useRef(0);
  const { theme } = useTheme();
  const { audioInfo } = useSelector((state: RootState) => state.audio);

  const onIcon = (item: GetItemsResItem) => {
    setRefreshId(item.id);
    onIconPress && onIconPress(item);
  };

  const click = (item: GetItemsResItem) => {
    if (audioInfo.id !== item.id) {
      // state[path] = scrollYRef.current || 0;
      state[path] = scrollIndexRef.current || 0;
      onLeftPress && onLeftPress(item);
    }
  };

  const onScrollToIndexFailed = () => {
    console.log("onScrollToIndexFailed");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // scrollYRef.current = event.nativeEvent.contentOffset.y;
    const y = event.nativeEvent.contentOffset.y;
    scrollIndexRef.current = Math.round(
      event.nativeEvent.contentOffset.y / height
    );
    if (y >= 200 && !visible) {
      setVisible(true);
    }
  };

  const handleRefresh = () => {
    delete state[path];
    onRefresh && onRefresh();
  };

  const renderItem: ListRenderItem<GetItemsResItem> = ({ item }) => {
    return (
      <CatalogItem
        item={item}
        height={height}
        showParent={showParent}
        refresh={item.id === refreshId}
        onLeftPress={click}
        onIconPress={onIcon}
        onRightPress={onRightPress}
      />
    );
  };

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

  const onBackTop = () => {
    ref.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  useEffect(() => {
    if (loading) {
      // 加载前使用保存的索引开始渲染，达到每一次下钻和返回滚动保持原位的效果。
      const index = state[path] ?? 0;
      setScrollIndex(index);
      setVisible(false);
    }
    setRefreshing(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) {
    return (
      <ActivityIndicator
        size={50}
        color={theme.colors.primary}
        style={[styles.loading, { backgroundColor: theme.colors.background }]}
      />
    );
  }

  return (
    <View style={styles.container}>
      <VirtualizedList
        ref={ref}
        data={items}
        initialScrollIndex={scrollIndex}
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
