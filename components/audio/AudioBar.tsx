// import {
//   Image,
//   Pressable,
//   StyleSheet,
//   useColorScheme,
//   View,
// } from "react-native";
// import { ThemedText } from "../theme/ThemedText";
// import { ThemedView } from "../theme/ThemedView";
// import { useTheme } from "@/hooks/useThemeColor";
// import { IconSymbol } from "../ui/IconSymbol";
// import { useEffect, useState } from "react";
// import { Audio } from "expo-av";
// import { formatMilliseconds } from "@/utils";

// const AudioBar = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const theme = useTheme();
//   const mode = useColorScheme();
//   const [duration, setDuration] = useState("00:00");
//   const [current, setCurrent] = useState("00:00");
//   const [soundObject, setSoundObject] = useState(new Audio.Sound());
//   const sound =
//     "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3";
//   useEffect(() => {
//     (async () => {
//       // // 请求通知栏权限
//       // const { status } = await Notifications.getPermissionsAsync();
//       // if (status !== "granted") {
//       //   await Notifications.requestPermissionsAsync();
//       // }
//       // 卸载音乐
//       await soundObject.unloadAsync();
//       // 重新加载
//       await soundObject.loadAsync({
//         // 这里的 sound 应该是一个音频文件的URL
//         uri: sound,
//       });

//       soundObject.setOnPlaybackStatusUpdate((playbackStatus) => {
//         if (!playbackStatus.isLoaded) {
//           console.log("isLoaded");
//           // Update your UI for the unloaded state
//           if (playbackStatus.error) {
//             console.log(
//               `Encountered a fatal error during playback: ${playbackStatus.error}`
//             );
//             // Send Expo team the error on Slack or the forums so we can help you debug!
//           }
//         } else {
//           // Update your UI for the loaded state

//           if (playbackStatus.isPlaying) {
//             setDuration(formatMilliseconds(playbackStatus.durationMillis));
//             setCurrent(formatMilliseconds(playbackStatus.positionMillis));
//             // Update your UI for the playing state
//           } else {
//             // Update your UI for the paused state
//           }

//           if (playbackStatus.isBuffering) {
//             console.log("isBuffering");
//             // Update your UI for the buffering state
//           }

//           if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
//             console.log("didJustFinish");
//             setIsPlaying(false);
//             // The player has just finished playing and will stop. Maybe you want to play something else?
//           }
//         }
//       });
//     })();
//   }, [sound]);

//   const playSound = async () => {
//     await soundObject.playAsync();
//     setIsPlaying(true);
//   };

//   const pauseSound = async () => {
//     await soundObject.pauseAsync();
//     setIsPlaying(false);
//   };

//   return (
//     <ThemedView
//       style={[
//         styles.barContainer,
//         { borderColor: mode === "dark" ? theme.primary : "transparent" },
//       ]}
//     >
//       <View style={styles.barLeftContainer}>
//         <Image
//           source={require("@/assets/images/logo.png")}
//           style={styles.imageStyle}
//         ></Image>
//         <View>
//           <ThemedText style={{ fontSize: 12 }}>稻香 - 周杰伦</ThemedText>
//           <View>
//             <ThemedText style={styles.timeStyle}>
//               {current}/{duration}
//             </ThemedText>
//           </View>
//         </View>
//       </View>
//       <View style={styles.barRightContainer}>
//         <Pressable
//           style={styles.button}
//           onPress={isPlaying ? pauseSound : playSound}
//         >
//           <IconSymbol
//             size={28}
//             name={isPlaying ? "pause.circle" : "play.circle"}
//           />
//         </Pressable>
//         <Pressable
//           style={styles.button}
//           onPress={isPlaying ? pauseSound : playSound}
//         >
//           <IconSymbol size={28} name="music.note.list" />
//         </Pressable>
//       </View>
//     </ThemedView>
//   );
// };

// const styles = StyleSheet.create({
//   barContainer: {
//     position: "absolute",
//     // bottom: 55,
//     bottom: 90,
//     left: "3%",
//     right: "3%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     // padding: 5, // 可选：内边距
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2, // Android上的阴影效果
//     borderBottomRightRadius: 20,
//     borderTopRightRadius: 20,
//     borderTopLeftRadius: 10,
//     borderBottomLeftRadius: 10,
//     borderWidth: 0.5,
//   },
//   barLeftContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   barRightContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   imageStyle: {
//     width: 40,
//     height: 40,
//     marginRight: 10,
//   },
//   timeStyle: {
//     fontSize: 12,
//     margin: 0,
//     padding: 0,
//     height: 12,
//     lineHeight: 14,
//   },
//   button: {
//     alignItems: "center",
//     justifyContent: "center",
//     // backgroundColor: "rgba(0,0,0,0.2)",
//     marginLeft: 10,
//   },
// });

// export { AudioBar };

import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";
import { useTheme } from "@/hooks/useThemeColor";
import { IconSymbol } from "../ui";
import { useEffect, useState } from "react";
import { formatMilliseconds, formatPath } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { MusicPlayer } from "./MusicPlayer";
import {
  useBaseApi,
  type GetDetailParams,
  type GetItemsResItem,
} from "@/api/api";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import type { AVPlaybackStatusSuccess } from "expo-av";
import { storageManager } from "@/storage";

const { GetDetail } = useBaseApi();

interface RawUrlItemType {
  key: string;
  value: string;
}

// const sound =
//   "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3";

const AudioBar = () => {
  const [playing, setPlaying] = useState(false);
  const theme = useTheme();
  const mode = useColorScheme();
  const [currentTrack, setCurrentTrack] = useState("");
  const [duration, setDuration] = useState("00:00");
  const [current, setCurrent] = useState("00:00");
  const [audioItem, setAudioItem] = useState<GetItemsResItem | null>(null);
  const [rawUrlItems, setRawUrlItems] = useState<RawUrlItemType[]>([]);
  const [params, setParams] = useState<GetDetailParams>({
    password: "",
    path: "",
  });

  const onFetchRawUrl = async () => {
    if (audioItem) {
      params.path = formatPath(audioItem.parent || "/", audioItem.name);
      const item = rawUrlItems.find((f) => f.key === params.path);
      if (item) {
        console.log("rawUrlItem => ", item);
        setCurrentTrack(item.value);
      } else {
        const { data } = await GetDetail(params);
        setCurrentTrack(data.raw_url);
        await handleRawUrlItems({ key: params.path, value: data.raw_url });
        await setAudioItemAsync();
      }
    } else {
      console.log("is not audioItem");
    }
  };

  const handleRawUrlItems = async ({ value, key }: RawUrlItemType) => {
    if (!rawUrlItems.some((s) => s.key === key)) {
      const list = [...rawUrlItems, { value, key }];
      setRawUrlItems(list);
      await storageManager.set("raw_url_items", list);
    } else {
      console.log("raw_url 已经存在");
    }
  };

  const onUpdate = (playbackStatus: AVPlaybackStatusSuccess) => {
    setDuration(formatMilliseconds(playbackStatus.durationMillis));
    setCurrent(formatMilliseconds(playbackStatus.positionMillis));
    console.log("onUpdate", playbackStatus.positionMillis);
  };

  const onFinish = () => {
    console.log("onFinish");
  };

  const getStorageAsync = async () => {
    const raw_url_items = await storageManager.get("raw_url_items");
    setRawUrlItems(raw_url_items || []);
    const audio_item_bar = await storageManager.get("audio_item_bar");
    setAudioItem(audio_item_bar);
  };

  const setAudioItemAsync = async () => {
    console.log("setAudioItemAsync", audioItem);
    await storageManager.set("audio_item_bar", audioItem);
    console.log("storage success");
  };

  useEffect(() => {
    if (audioItem) onFetchRawUrl();
  }, [audioItem]);

  useEffect(() => {
    getStorageAsync();
    emitter.on("onAudioChange", setAudioItem);
  }, []);

  const playSound = async () => {
    setPlaying(true);
  };

  const pauseSound = async () => {
    setPlaying(false);
  };

  return (
    <ThemedView
      style={[
        styles.barContainer,
        { borderColor: mode === "dark" ? theme.primary : "transparent" },
        Platform.select({
          ios: {
            bottom: 90,
          },
          default: {
            bottom: 55,
          },
        }),
      ]}
    >
      <View style={styles.barLeftContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.imageStyle}
        ></Image>
        <View style={{ width: "100%" }}>
          <ThemedText style={{ fontSize: 16 }} numberOfLines={1}>
            {audioItem?.name ?? "没有音乐可播放"}
          </ThemedText>
          <View>
            <ThemedText style={styles.timeStyle}>
              {current}/{duration}
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.barRightContainer}>
        <Pressable
          style={styles.button}
          onPress={playing ? pauseSound : playSound}
        >
          <IconSymbol
            size={28}
            name={playing ? "pause.circle" : "play.circle"}
          />
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={playing ? pauseSound : playSound}
        >
          <IconSymbol size={28} name="music.note.list" />
        </Pressable>
      </View>
      <MusicPlayer
        uri={currentTrack}
        playing={playing}
        onFinish={onFinish}
        onUpdate={onUpdate}
        onPlaying={setPlaying}
      />
    </ThemedView>
  );
};

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
    shadowOffset: { width: 0, height: 1 },
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
    width: "65%",
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
    margin: 0,
    padding: 0,
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0,0,0,0.2)",
    marginLeft: 5,
  },
});

export { AudioBar };
