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
// import type { AVPlaybackStatusSuccess } from "expo-av";
import { storageManager } from "@/storage";
import { Link } from "expo-router";

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

  const onUpdate = (playbackStatus: any) => {
    setDuration(formatMilliseconds(playbackStatus.durationMillis));
    setCurrent(formatMilliseconds(playbackStatus.positionMillis));
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
    await storageManager.set("audio_item_bar", audioItem);
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
            bottom: 52,
          },
        }),
      ]}
    >
      <View style={styles.barLeftContainer}>
        <Link
          href={{
            pathname: "/views/search",
            params: { id: "bacon" },
          }}
          style={styles.imageStyle}
        >
          <Image source={require("@/assets/images/logo.png")}></Image>
        </Link>
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
            name={playing ? "pause-circle-outline" : "play-circle-outline"}
          />
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={playing ? pauseSound : playSound}
        >
          <IconSymbol size={28} name="queue-music" />
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2, // Android上的阴影效果
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
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
    width: 45,
    height: 45,
    marginRight: 5,
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
