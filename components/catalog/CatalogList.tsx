import type { GetItem } from "@/api";
import { FAB, useTheme } from "@rneui/themed";
import { GetItems } from "@/api/api";
import { getSortOrderItems, toggleCollect } from "@/utils/common";
import { CatalogItem } from "./CatalogItem";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  VirtualizedList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewProps,
} from "react-native";

type CatalogListProps = ViewProps & {
  path?: string;
  data?: GetItem[];
  height?: number;
  value?: number;
  index?: number;
  showParent?: boolean;
  onRefresh?: () => void;
  onChangeText?: (text: string) => void;
  onLeftPress?: (item: GetItem) => void;
  onRightPress?: (item: GetItem) => void;
};

type CatalogListHandle = {
  onFetch: () => void;
};

const default_per_page = 1000;

const CatalogList = forwardRef<CatalogListHandle, CatalogListProps>(
  (props, ref) => {
    const { path, value, index, height = 50, data, showParent } = props;
    const { onLeftPress, onRightPress, onChangeText, onRefresh } = props;
    const { theme } = useTheme();
    const virtualizedRef = useRef<VirtualizedList<GetItem>>(null);
    const currentPath = useRef<string>("");
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [items, setItems] = useState<GetItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [refreshId, setRefreshId] = useState("");

    const getItem = (_data: GetItem, index: number) => {
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

    const updateItem = (id: string, key: keyof GetItem, value: any) => {
      setItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === id) {
            return { ...item, [key]: value };
          }
          return item;
        });
      });
    };

    const onIconPress = async (item: GetItem) => {
      setRefreshId(item.id);
      const is_collect = await toggleCollect(item);
      item.is_collect = is_collect;
      updateItem(item.id, "is_collect", is_collect);
      // 由于React.memo的特殊性，id不变不会刷新，这里强制刷新item一次后并恢复。
      setTimeout(() => {
        setRefreshId("");
      }, 300);
    };

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
      virtualizedRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    };

    const onScrollToIndexFailed = () => {
      console.log("onScrollToIndexFailed");
    };

    const onFetch = useCallback(
      async (refresh?: boolean) => {
        if (data) {
          setItems([...data]);
          setTotal(data.length);
        } else {
          try {
            setRefreshing(true);
            const params = {
              page: 1,
              password: "",
              path: path ?? "/",
              per_page: default_per_page,
              refresh: false,
            };
            await new Promise((resolve) => setTimeout(resolve, 300));
            const { data } = await GetItems(params, refresh);
            const list = await getSortOrderItems(data.content);
            setItems(list);
            setTotal(data.total);
            onChangeText && onChangeText(`${list.length}/${data.total}`);
            currentPath.current = params.path;
          } catch {
            return Promise.reject("onFetch Request Error");
          } finally {
            setRefreshing(false);
          }
        }
      },
      [data, onChangeText, path]
    );

    const onPullRefresh = () => {
      onFetch(true);
      onRefresh && onRefresh();
    };

    // 只刷新当前视图，其他视图进入不加载数据，优化性能
    useEffect(() => {
      if (
        (index !== undefined && value === index && !currentPath.current) ||
        (currentPath.current && currentPath.current !== path)
      ) {
        onFetch();
      }
    }, [path, value, index, onFetch]);

    useEffect(() => {
      if (data) onFetch();
    }, [data, onFetch]);

    useImperativeHandle(ref, () => ({ onFetch }), [onFetch]);

    if (refreshing)
      return (
        <ActivityIndicator
          size={50}
          color={theme.colors.primary}
          style={styles.loading}
        />
      );

    return (
      <View style={styles.container}>
        <VirtualizedList
          ref={virtualizedRef}
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
            <RefreshControl refreshing={refreshing} onRefresh={onPullRefresh} />
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
  }
);

CatalogList.displayName = "CatalogList";

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

export { CatalogList, CatalogListProps, CatalogListHandle };
