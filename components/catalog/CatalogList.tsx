import type { GetItemsResItem } from "@/api";
import { FAB, useTheme } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import { CatalogItem } from "./CatalogItem";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  ViewProps,
  VirtualizedList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

type CatalogListProps = ViewProps & {
  total: number;
  height?: number;
  loading?: boolean;
  showParent?: boolean;
  scrollIndex?: number;
  items: GetItemsResItem[];
  onRefresh?: () => void;
  onIconPress?: (item: GetItemsResItem) => void;
  onLeftPress?: (item: GetItemsResItem) => void;
  onRightPress?: (item: GetItemsResItem) => void;
  onScrollIndex?: (index: number) => void;
};

const CatalogList = (props: CatalogListProps) => {
  const {
    total,
    loading = false,
    height = 50,
    showParent,
    scrollIndex,
    items,
  } = props;
  const { onRefresh, onIconPress, onLeftPress, onRightPress, onScrollIndex } =
    props;
  const ref = useRef<VirtualizedList<GetItemsResItem>>(null);
  const [visible, setVisible] = useState(false);
  const [refreshId, setRefreshId] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(loading);
  const scrollIndexRef = useRef(0);
  const { theme } = useTheme();

  const onIcon = (item: GetItemsResItem) => {
    setRefreshId(item.id);
    onIconPress && onIconPress(item);
    setTimeout(() => {
      setRefreshId("");
    }, 300);
  };

  const onClick = (item: GetItemsResItem) => {
    onScrollIndex && onScrollIndex(scrollIndexRef.current || 0);
    onLeftPress && onLeftPress(item);
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
    } else if (y <= 200 && visible) {
      setVisible(false);
    }
  };

  const handleRefresh = () => {
    onRefresh && onRefresh();
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
  };

  useEffect(() => {
    if (!loading) scrollIndexRef.current = 0;
    setRefreshing(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (refreshing) {
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
        renderItem={({ item }) => (
          <CatalogItem
            item={item}
            height={height}
            showParent={showParent}
            refreshId={refreshId}
            onLeftPress={onClick}
            onIconPress={onIcon}
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
