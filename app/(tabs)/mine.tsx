import { useState } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { ThemedButton } from "@/components/theme/ThemedButton";

import AudioPlayer from "@/components/AudioPlayer";
import ThemedModal from "@/components/theme/ThemedModal";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function MineScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const mode = useColorScheme();
  const { setColorScheme } = Appearance;

  const closeModal = () => {
    console.log("closeModal");
    setModalVisible(false);
  };

  const openModal = () => {
    console.log("openModal");
    setModalVisible(true);
  };

  const setMode = () => {
    setColorScheme(mode === "dark" ? "light" : "dark");
  };
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">admin-panel-settings</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>

      <AudioPlayer />

      <ThemedButton
        title={mode === "dark" ? "深色模式" : "浅色模式"}
        onPress={setMode}
      />

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
