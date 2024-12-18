import { StyleSheet } from "react-native";
import { useState } from "react";
import { Button, TabView, Text, useTheme } from "@rneui/themed";
import { ThemedView } from "@/components/theme/ThemedView";
import { View } from "react-native";
import { HeaderBar } from "@/components/sys";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { CatalogList } from "@/components/catalog-test/CatalogList";

const HomeScreen = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState<string[]>(["/", "/asmr"]);
  const [value, setValue] = useState<number>(0);

  const onChange = (index: number) => {
    console.log(index);
  };

  const add = () => {
    setItems([...items, `我是${items.length}`]);
    setValue(items.length);
  };

  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <CatalogToolbar
        showOpenSearch={true}
        enableTouchBack={true}
        rightText="我知道了"
      />
      {/* <Button onPress={add}>添加TabView</Button> */}
      <TabView
        value={value}
        onChange={onChange}
        containerStyle={styles.tabView}
      >
        {items.map((v, index) => {
          return (
            <TabView.Item key={index} style={styles.tabViewItem}>
              <CatalogList path={v} />
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
