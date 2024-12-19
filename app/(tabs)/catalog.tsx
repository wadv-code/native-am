import { BackHandler, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { TabView } from "@rneui/themed";
import { ThemedView } from "@/components/theme/ThemedView";
import { HeaderBar } from "@/components/sys";
import type { CatalogCrumbItem } from "@/components/catalog/CatalogCrumbs";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { useIsFocused } from "@react-navigation/native";
import type { GetItem } from "@/api";
import { formatPath } from "@/utils/lib";
import {
  CatalogList,
  type CatalogListHandle,
} from "@/components/catalog/CatalogList";
import { getStorage, removeStorage } from "@/storage/long";

const defaultPaths = () => [
  { name: "", path: "/" },
  { name: "asmr", path: "/asmr" },
  { name: "中文音声", path: "/asmr/中文音声" },
  { name: "圈圈", path: "/asmr/中文音声/圈圈" },
];

const CatalogScreen = () => {
  const isFocused = useIsFocused();
  const catalogListRef = useRef<CatalogListHandle | null>(null);
  const isFocusedRef = useRef<boolean>(false);
  // const [rightText, setRightText] = useState("");
  const itemsRef = useRef<CatalogCrumbItem[]>(defaultPaths());
  const [items, setItems] = useState<CatalogCrumbItem[]>(defaultPaths());
  const [value, setValue] = useState<number>(items.length - 1);

  const onChange = (index: number) => {
    setValue(index);
  };

  const onLeftPress = (item: GetItem) => {
    const option = {
      name: item.name,
      path: formatPath(item.parent || "/", item.name),
    };
    const list = [...itemsRef.current.slice(0, value + 1), option];
    setItems(list);
    setValue(list.length - 1);
  };

  const onChangeView = (index: number, list?: CatalogCrumbItem[]) => {
    const result = [...(list || items).slice(0, index + 1)];
    setItems(result);
  };

  const onSortOrder = () => {
    catalogListRef.current?.onFetch();
  };

  const setRightText = (text: string) => {
    const item = items[value];
    item.text = text;
    setItems([...items]);
  };

  useEffect(() => {
    itemsRef.current = [...items];
    setValue(items.length - 1);
  }, [items]);

  useEffect(() => {
    isFocusedRef.current = isFocused;
    if (isFocused) {
      (async () => {
        const path = await getStorage<string>("parentSearchPath", "");
        if (path) {
          const spPaths = path.split("/").filter((f: string) => f);
          const list: CatalogCrumbItem[] = spPaths.map((v, index) => {
            return {
              name: v,
              path: "/" + spPaths.slice(0, index + 1).join("/"),
            };
          });
          list.unshift({ name: "", path: "/" });
          setItems(list);
          await removeStorage("parentSearchPath");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      />
      <TabView
        value={value}
        onChange={onChange}
        disableSwipe={true}
        containerStyle={styles.tabView}
      >
        {items.map((v, index) => {
          return (
            <TabView.Item key={index} style={styles.tabViewItem}>
              <CatalogList
                ref={(ref) =>
                  v.path === items[value]?.path &&
                  (catalogListRef.current = ref)
                }
                index={index}
                value={value}
                path={v.path}
                onChangeText={setRightText}
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
