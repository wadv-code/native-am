import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { TabView } from "@rneui/themed";
import { ThemedView } from "@/components/theme/ThemedView";
import { HeaderBar } from "@/components/sys";
import { CatalogList } from "@/components/catalog-test/CatalogList";
import type { CatalogCrumbItem } from "@/components/catalog-test/CatalogCrumbs";
import { CatalogToolbar } from "@/components/catalog-test/CatalogToolbar";

const HomeScreen = () => {
  const [items, setItems] = useState<CatalogCrumbItem[]>([
    { name: "", path: "/" },
    { name: "asmr", path: "/asmr" },
    { name: "中文音声", path: "/asmr/中文音声" },
  ]);
  const [value, setValue] = useState<number>(0);

  const onChange = (index: number) => {
    console.log(index);
  };

  const insertItem = () => {
    setItems([...items, { name: "中文音声", path: "/asmr/中文音声" }]);
    setValue(items.length);
  };

  useEffect(() => {
    console.log(items.length);
  }, [items]);

  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <CatalogToolbar items={items} rightText="我知道了" />
      <TabView
        value={value}
        onChange={onChange}
        containerStyle={styles.tabView}
      >
        {items.map((v, index) => {
          return (
            <TabView.Item key={index} style={styles.tabViewItem}>
              <CatalogList path={v.path} />
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

export default HomeScreen;
