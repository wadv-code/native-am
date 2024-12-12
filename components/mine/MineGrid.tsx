import React, { useState } from "react";
import { IconSymbol } from "../ui";
import { ThemedText } from "../theme/ThemedText";
import { ThemedView, type ThemedViewProps } from "../theme/ThemedView";
import { useRouter, type Href } from "expo-router";
import { storageManager } from "@/storage";
import ThemedModal from "../theme/ThemedModal";
import type { GridItem } from "./util";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Alert,
  Appearance,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export type MineGridProps = ThemedViewProps & {
  items: GridItem[];
  title?: string;
};

const MineGrid = ({ style, items, title }: MineGridProps) => {
  const router = useRouter();
  const mode = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  // const [items, setItems] = useState<GridItem[]>();

  const { setColorScheme } = Appearance;

  const openPage = (herf: Href) => {
    router.navigate(herf);
  };

  const clearStorage = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => storageManager.clear() },
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
      clearStorage();
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
    storageManager.set("color_scheme", colorScheme);
  };

  return (
    <ThemedView
      darkColor="rgba(0,0,0,0.5)"
      lightColor="rgba(255,255,255,0.5)"
      style={[styles.grid, style]}
    >
      {title && (
        <ThemedText type="subtitle" style={{ paddingHorizontal: 10 }}>
          {title}
        </ThemedText>
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
              <ThemedText bold="bold">{item.title}</ThemedText>
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
});

export default MineGrid;
