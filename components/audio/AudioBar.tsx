import { ThemedView } from "../theme/ThemedView";
import { IconSymbol } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setPlaying } from "@/store/slices/audioSlice";
import type { ModalPlayerType } from "./ModalPlayer";
import { Image, Text, useTheme } from "@rneui/themed";
import {
  View,
  Platform,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "@/styles";
import { Circle } from "react-native-progress";

// const sound =
//   "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3";

type AudioBarProps = {
  onPress?: (type: ModalPlayerType) => void;
};

const AudioBar = ({ onPress }: AudioBarProps) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const audioState = useSelector((state: RootState) => state.audio);
  const {
    audioInfo,
    progress,
    loading,
    playing,
    durationFormat,
    currentFormat,
  } = audioState;

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
            color={theme.colors.primary}
            style={[styles.imageStyle]}
          />
        ) : (
          <Image src={audioInfo?.cover} containerStyle={styles.imageStyle} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {audioInfo?.name ?? "没有音乐可播放"}
          </Text>
          <Text style={styles.timeStyle}>
            {currentFormat} / {durationFormat}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.barRightContainer}>
        {audioInfo.parent && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPress && onPress("list")}
          >
            <IconSymbol size={28} name="queue-music" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[globalStyles.rowCenter, { position: "relative" }]}
          onPress={togglePlaying}
        >
          <Circle
            size={25}
            progress={progress}
            color={theme.colors.grey0}
            unfilledColor={theme.colors.grey4}
            borderWidth={0}
            thickness={2}
            style={{ position: "absolute" }}
          />
          <IconSymbol
            name={playing ? "pause-circle" : "play-circle"}
            color={theme.colors.grey0}
            size={22}
          />
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
    height: 38,
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
    borderBottomRightRadius: 19,
    borderTopRightRadius: 19,
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
    marginRight: 15,
    flexShrink: 0,
    transform: [{ scale: 1.15 }],
  },
  name: {
    fontSize: 16,
  },
  timeStyle: {
    margin: 0,
    padding: 0,
    fontSize: 16,
    fontFamily: "FontNumber",
    marginTop: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0,0,0,0.2)",
  },
});

export { AudioBar };
