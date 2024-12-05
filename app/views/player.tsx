import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { storageManager } from "@/storage";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ThemeImageBackground from "@/components/theme/ThemeImageBackground";
import type { GetItemsResItem } from "@/api";

const PlayerScreen = () => {
  const [audioItem, setAudioItem] = useState<GetItemsResItem | null>(null);

  const getAudioItemAsync = async (): Promise<GetItemsResItem | null> => {
    // 当前播放内容
    const audio_item_bar = (await storageManager.get(
      "audio_item_bar"
    )) as GetItemsResItem;
    setAudioItem(audio_item_bar);
    return audio_item_bar;
  };

  useEffect(() => {
    getAudioItemAsync();
  });

  return (
    <ThemedView style={styles.viewContainer}>
      <ThemeImageBackground
        style={styles.backgroundImage}
        src={audioItem?.cover}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="title">PlayerScreen</ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
});

export default PlayerScreen;
