import { useState } from "react";
import { useRouter } from "expo-router";
import { storageManager } from "@/storage";
import { Alert, Appearance, StyleSheet, useColorScheme } from "react-native";

import { ThemedButton } from "@/components/theme/ThemedButton";

import ThemedModal from "@/components/theme/ThemedModal";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/theme/ThemedText";
// import MusicNotifications from "@/components/audio/MusicNotifications";

export default function MineScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const mode = useColorScheme();
  const router = useRouter();

  const { setColorScheme } = Appearance;

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
    console.log("closeModal");
    setModalVisible(false);
  };

  const openModal = () => {
    console.log("openModal");
    setModalVisible(true);
  };

  const openSearch = () => {
    router.navigate("/views/search");
  };

  const openViewer = () => {
    router.navigate("/views/viewer");
  };

  const setMode = () => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    setColorScheme(colorScheme);
    storageManager.set("color_scheme", colorScheme);
  };
  return (
    <ParallaxScrollView style={styles.container}>
      <ThemedText
        type="title"
        style={{ textAlign: "center", paddingVertical: 10 }}
      >
        Title
      </ThemedText>
      <ThemedButton
        title={mode === "dark" ? "深色模式" : "浅色模式"}
        onPress={setMode}
      />

      <ThemedButton title="清除缓存" onPress={clearStorage} />

      <ThemedButton title="弹窗" onPress={openModal} />

      <ThemedButton title="搜索页面" onPress={openSearch} />

      <ThemedButton title="愉悦心情" onPress={openViewer} />

      <ThemedModal modalVisible={modalVisible} closeModal={closeModal} />

      {/* <MusicNotifications /> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    gap: 10,
  },
});
