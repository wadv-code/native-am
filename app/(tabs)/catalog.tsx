import { BackHandler, StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { TabView } from "@rneui/themed";
import { ThemedView } from "@/components/theme/ThemedView";
import { HeaderBar } from "@/components/sys";
import type { CatalogCrumbItem } from "@/components/catalog/CatalogCrumbs";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { useIsFocused } from "@react-navigation/native";
import type { GetItem } from "@/api";
import { formatPath } from "@/utils/lib";
import { getStorage, removeStorage, setStorage } from "@/storage/long";
import { CATALOG_CHANGE_PATH, CATALOG_PATH } from "@/storage/storage-keys";
import {
  CatalogList,
  type CatalogListHandle,
} from "@/components/catalog/CatalogList";

const CatalogScreen = () => {
  const isFocused = useIsFocused();
  const catalogListRef = useRef<CatalogListHandle | null>(null);
  const isFocusedRef = useRef<boolean>(false);
  const itemsRef = useRef<CatalogCrumbItem[]>([]);
  const [items, setItems] = useState<CatalogCrumbItem[]>([]);
  const [value, setValue] = useState<number>(items.length - 1);

  const onChange = (index: number) => {
    setValue(index);
  };

  const onLeftPress = useCallback(
    (item: GetItem) => {
      updateItem(item.parent ?? "/", "selectedName", item.name);
      if (item.is_dir) {
        setTimeout(() => {
          const option = {
            name: item.name,
            path: formatPath(item.parent ?? "/", item.name),
          };
          const list = [...itemsRef.current.slice(0, value + 1), option];
          setItems(list);
          setValue(list.length - 1);
        }, 100);
      }
    },
    [value]
  );

  const onChangeView = (index: number, list?: CatalogCrumbItem[]) => {
    const result = [...(list || items).slice(0, index + 1)];
    setItems(result);
  };

  const onSortOrder = () => {
    catalogListRef.current?.onFetch();
  };

  const updateItem = (
    path: string,
    key: keyof CatalogCrumbItem,
    value: any
  ) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.path === path) {
          return { ...item, [key]: value };
        }
        return item;
      });
    });
  };

  const setRightText = (text: string) => {
    const item = items[value];
    updateItem(item.path, "text", text);
  };

  const onActionPress = () => {
    catalogListRef.current?.scrollItem();
  };

  const formatPathToItems = (path: string) => {
    const spPaths = path.split("/").filter((f: string) => f);
    const list: CatalogCrumbItem[] = spPaths.map((v, index) => {
      return {
        name: v,
        path: "/" + spPaths.slice(0, index + 1).join("/"),
      };
    });
    list.unshift({ name: "", path: "/" });
    return list;
  };

  useEffect(() => {
    itemsRef.current = [...items];
    setValue(items.length - 1);
    if (items.length) {
      const item = items[items.length - 1];
      setStorage(CATALOG_PATH, item ? item.path : "/");
    }
  }, [items]);

  useEffect(() => {
    isFocusedRef.current = isFocused;
    if (isFocused) {
      (async () => {
        const path = await getStorage<string>(CATALOG_CHANGE_PATH, "");
        if (path) {
          setItems(formatPathToItems(path));
          await removeStorage(CATALOG_CHANGE_PATH);
        } else if (!itemsRef.current.length) {
          const path = await getStorage(CATALOG_PATH, "/");
          setItems(formatPathToItems(path));
        }
      })();
    }
  }, [isFocused]);

  useEffect(() => {
    // 注册返回事件监听
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isFocusedRef.current) {
          if (itemsRef.current.length > 1) {
            onChangeView(itemsRef.current.length - 2, itemsRef.current);
          }
          return true;
        } else {
          return false;
        }
      }
    );
    // 组件卸载时移除监听
    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <CatalogToolbar
        items={items}
        search={true}
        item={items[value]}
        onChangeView={onChangeView}
        onSortOrder={onSortOrder}
        onLeftPress={onActionPress}
      />
      <TabView
        value={value}
        onChange={onChange}
        disableSwipe={true}
        containerStyle={styles.tabView}
      >
        {items.map((v, index) => {
          return (
            <TabView.Item key={v.path} style={styles.tabViewItem}>
              <CatalogList
                ref={(ref) =>
                  v.path === items[value]?.path &&
                  (catalogListRef.current = ref)
                }
                index={index}
                value={value}
                path={v.path}
                onRightText={setRightText}
                onLeftPress={onLeftPress}
              />
            </TabView.Item>
          );
        })}
      </TabView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    backgroundColor: "transparent",
  },
  tabViewItem: {
    width: "100%",
  },
});

export default CatalogScreen;
