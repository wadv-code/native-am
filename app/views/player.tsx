import { ThemedView } from "@/components/theme/ThemedView";
import { storageManager } from "@/storage";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { GetItemsResItem } from "@/api";

import ThemeImageBackground from "@/components/theme/ThemeImageBackground";
import { IconSymbol } from "@/components/ui";

const PlayerScreen = () => {
  const [audioItem, setAudioItem] = useState<GetItemsResItem | null>(null);
  const rotateAnimation = useRef(new Animated.Value(0)).current;

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
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    return () => {
      rotateAnimation.stopAnimation();
    };
  }, [rotateAnimation]);

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateStyle = { transform: [{ rotate: spin }] };

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
        <Animated.Image
          src={audioItem?.cover}
          style={[styles.cover, rotateStyle]}
        />
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity>
          <IconSymbol name="arrow-left" size={60} />
        </TouchableOpacity>
        <TouchableOpacity>
          <IconSymbol
            name="play-circle"
            size={60}
            style={{ marginHorizontal: 30 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <IconSymbol name="arrow-right" size={60} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2, // Android上的阴影效果
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },
});

export default PlayerScreen;
