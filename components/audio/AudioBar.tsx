import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useThemeColor";
import { IconSymbol } from "../ui/IconSymbol";
import { useState } from "react";

export default function AudioBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useTheme();
  const mode = useColorScheme();

  const onPlay = () => {
    console.log("onPlay");
    setIsPlaying(!isPlaying);
  };

  return (
    <ThemedView
      style={[
        styles.barContainer,
        { borderColor: mode === "dark" ? theme.primary : "transparent" },
      ]}
    >
      <View style={styles.barLeftContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.imageStyle}
        ></Image>
        <View>
          <ThemedText>这是一首简单的小情歌</ThemedText>
          <View>
            <ThemedText style={styles.timeStyle}>00:00/00:00</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.barRightContainer}>
        <Pressable style={styles.button} onPress={onPlay}>
          <IconSymbol
            size={30}
            name={isPlaying ? "motion-photos-pause" : "play-circle-outline"}
          />
        </Pressable>
        <Pressable style={styles.button} onPress={onPlay}>
          <IconSymbol size={30} name="queue-music" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: "absolute",
    bottom: 55,
    left: "3%",
    right: "3%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 5, // 可选：内边距
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Android上的阴影效果
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 0.5,
  },
  barLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  barRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  imageStyle: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  timeStyle: {
    fontSize: 10,
    margin: 0,
    padding: 0,
    height: 10,
    lineHeight: 15,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0,0,0,0.2)",
    marginLeft: 5,
  },
});
