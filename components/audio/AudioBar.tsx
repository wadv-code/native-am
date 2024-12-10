import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setPlaying } from "@/store/slices/audioSlice";
import {
  View,
  Platform,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import ThemeImage from "../theme/ThemeImage";
import type { ModalPlayerType } from "./ModalPlayer";

// const sound =
//   "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3";

type AudioBarProps = {
  onPress?: (type: ModalPlayerType) => void;
};

const AudioBar = ({ onPress }: AudioBarProps) => {
  const { theme } = useThemeColor();
  const dispatch = useDispatch();
  const audioState = useSelector((state: RootState) => state.audio);
  const { audioInfo, loading, playing, durationFormat, currentFormat } =
    audioState;

  const togglePlaying = () => {
    if (loading) return;
    dispatch(setPlaying(!playing));
  };

  return (
    <View
      style={[
        styles.barContainer,
        Platform.select({
          ios: {
            bottom: 90,
          },
          default: {
            bottom: 58,
          },
        }),
      ]}
    >
      <ThemedView style={styles.imageContainer}>
        <ImageBackground
          style={styles.backgroundImage}
          src={audioInfo?.cover}
          source={audioInfo?.cover ? require("@/assets/images/logo.png") : null}
          resizeMode="cover"
        />
      </ThemedView>
      <TouchableOpacity
        style={styles.barLeftContainer}
        onPress={() => onPress && onPress("view")}
      >
        {loading ? (
          <ActivityIndicator
            size={30}
            color={theme.primary}
            style={[styles.imageStyle]}
          />
        ) : (
          <ThemeImage src={audioInfo?.cover} style={styles.imageStyle} />
        )}
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 16 }} numberOfLines={1}>
            {audioInfo?.name ?? "没有音乐可播放"}
          </ThemedText>
          <View>
            <ThemedText style={styles.timeStyle}>
              {currentFormat}/{durationFormat}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.barRightContainer}>
        <TouchableOpacity style={styles.button} onPress={togglePlaying}>
          <IconSymbol
            size={28}
            name={playing ? "pause-circle-outline" : "play-circle-outline"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onPress && onPress("list")}
        >
          <IconSymbol size={28} name="queue-music" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    position: "absolute",
    bottom: 55,
    left: "3%",
    right: "2%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 5, // 可选：内边距
    // borderWidth: 0.5,
    // overflow: "hidden",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2, // Android上的阴影效果
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
  },
  backgroundImage: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    resizeMode: "cover", // 让图片覆盖整个容器
    opacity: 0.2,
    backgroundSize: "100%",
  },
  barLeftContainer: {
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
  },
  barRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    gap: 10,
  },
  imageStyle: {
    width: 45,
    height: 45,
    borderRadius: 3,
    marginRight: 10,
    flexShrink: 0,
    transform: [{ scale: 1.2 }],
  },
  timeStyle: {
    margin: 0,
    padding: 0,
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0,0,0,0.2)",
  },
});

export { AudioBar };
