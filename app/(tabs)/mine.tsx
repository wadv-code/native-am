import { useState } from "react";
import {
  Alert,
  Appearance,
  StyleSheet,
  ToastAndroid,
  useColorScheme,
} from "react-native";
import { storageManager } from "@/storage";

import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { ThemedButton } from "@/components/theme/ThemedButton";

import ThemedModal from "@/components/theme/ThemedModal";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function MineScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const mode = useColorScheme();

  const { setColorScheme } = Appearance;

  const clearStorage = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          onPress: () => ToastAndroid.show("Cancel Pressed", 1000),
          style: "cancel",
        },
        { text: "OK", onPress: () => storageManager.clear() },
      ],
      { cancelable: false }
    );
  };

  const closeModal = () => {
    console.log("closeModal");
    setModalVisible(false);
  };

  const openModal = () => {
    console.log("openModal");
    setModalVisible(true);
  };

  const setMode = () => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    setColorScheme(colorScheme);
    storageManager.set("color_scheme", colorScheme);
  };
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">admin-panel-settings</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.{mode}
      </ThemedText>

      <ThemedButton
        title={mode === "dark" ? "深色模式" : "浅色模式"}
        onPress={setMode}
      />

      <ThemedButton title="清除缓存" onPress={clearStorage} />

      <ThemedButton title="弹窗" onPress={openModal} />

      <ThemedModal modalVisible={modalVisible} closeModal={closeModal} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
