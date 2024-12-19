import React, { useState } from "react";
import { IconSymbol } from "../ui";
import { ThemedView, type ThemedViewProps } from "../theme/ThemedView";
import { useRouter, type Href } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, useTheme } from "@rneui/themed";
import ThemedModal from "../theme/ThemedModal";
import type { GridItem } from "./util";
import {
  Alert,
  Appearance,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { clearStorage, removeStorage, setStorage } from "@/storage/long";

export type MineGridProps = ThemedViewProps & {
  items: GridItem[];
  title?: string;
};

const MineGrid = ({ style, items, title }: MineGridProps) => {
  const { updateTheme } = useTheme();
  const router = useRouter();
  const mode = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  // const [items, setItems] = useState<GridItem[]>();

  const { setColorScheme } = Appearance;

  const openPage = (href: Href) => {
    router.navigate(href);
  };

  const clearStorageAll = (key: "all" | "catalogRes") => {
    Alert.alert(
      "提示",
      "确认要清除缓存吗？",
      [
        {
          text: "取消",
          onPress: () => console.log("取消"),
          style: "cancel",
        },
        {
          text: "确认清除",
          onPress: () => {
            if (key === "catalogRes") {
              removeStorage(key);
            } else {
              clearStorage();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleItem = (item: GridItem) => {
    if (item.href) {
      openPage(item.href);
    } else if (item.type === "clear") {
      clearStorageAll("all");
    } else if (item.type === "catalogRes") {
      clearStorageAll("catalogRes");
    } else if (item.type === "modal") {
      openModal();
    } else if (item.type === "theme") {
      setMode(item);
    }
  };

  const setMode = (item: GridItem) => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    // setIsDark(!isDark);
    item.icon = colorScheme === "dark" ? "dark-mode" : "light-mode";
    item.title = colorScheme === "dark" ? "深色模式" : "浅色模式";
    setColorScheme(colorScheme);
    updateTheme({
      mode: colorScheme,
    });
    setStorage("colorScheme", colorScheme);
  };

  return (
    <ThemedView
      darkColor="rgba(0,0,0,0.3)"
      lightColor="rgba(255,255,255,0.3)"
      style={[styles.grid, style]}
    >
      {title && (
        <Text style={{ paddingHorizontal: 10, fontSize: 18, marginTop: 10 }}>
          {title}
        </Text>
      )}
      <View style={styles.gridContent}>
        {items.map((item, index) => {
          return (
            <TouchableOpacity
              style={styles.gridItem}
              key={index}
              onPress={() => handleItem(item)}
            >
              <IconSymbol name={item.icon} size={35} />
              <Text style={styles.text}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <ThemedModal modalVisible={modalVisible} closeModal={closeModal} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    marginHorizontal: "2%",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  gridContent: {
    flexGrow: 1,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: 5,
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  text: {
    marginTop: 5,
  },
});

export default MineGrid;
