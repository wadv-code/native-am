import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";
import { useTheme } from "@/hooks/useThemeColor";
import { IconSymbol } from "../ui";
import { useEffect, useState } from "react";
import { formatMilliseconds, formatPath } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { MusicPlayer } from "./MusicPlayer";
import { useBaseApi } from "@/api/api";
import { storageManager } from "@/storage";
import type { GetDetailParams, GetItemsResItem } from "@/api";
import {
  View,
  Platform,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import ThemeImage from "../theme/ThemeImage";
import { Link, useRouter } from "expo-router";

const { GetDetail, GetCover } = useBaseApi();

interface OptionType {
  key: string;
  value: string;
}

// const sound =
//   "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3";

const AudioBar = () => {
  const theme = useTheme();
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("");
  const [duration, setDuration] = useState("00:00");
  const [current, setCurrent] = useState("00:00");
  const [audioItem, setAudioItem] = useState<GetItemsResItem | null>(null);
  const [params, setParams] = useState<GetDetailParams>({
    password: "",
    path: "",
  });

  const onFetchRawUrl = async (currentAudio?: GetItemsResItem) => {
    const { rawUrlItems, coverItems } = await getStorageAsync();
    const audio = currentAudio || audioItem || (await getAudioItemAsync());
    if (audio) {
      setLoading(true);
      params.path = formatPath(audio.parent || "/", audio.name);
      const item = rawUrlItems.find((f) => f.key === params.path);
      const coverItem = coverItems.find((f) => f.key === params.path);
      let raw_url = audio.raw_url;
      let cover = audio.cover;
      if (item) {
        raw_url = item.value;
        setCurrentTrack(item.value);
      } else {
        const { data } = await GetDetail(params);
        raw_url = data.raw_url;
        await handleRawUrlItems({ key: params.path, value: data.raw_url });
      }
      if (coverItem) {
        cover = coverItem.value;
      } else {
        const { url } = await GetCover({ type: "json", mode: 8 });
        if (url) {
          cover = url;
          await handleCoverItems({ key: params.path, value: url });
        }
      }
      if (raw_url) setCurrentTrack(raw_url);
      await setAudioItemAsync({ ...audio, cover, raw_url });
      setLoading(false);
    } else {
      console.log("is not audio");
    }
  };

  const handleRawUrlItems = async ({ value, key }: OptionType) => {
    const { rawUrlItems } = await getStorageAsync();
    if (!rawUrlItems.some((s) => s.key === key)) {
      const list = [...rawUrlItems, { value, key }];
      await storageManager.set("raw_url_items", list);
    } else {
      console.log("raw_url 已经存在");
    }
  };

  const handleCoverItems = async ({ value, key }: OptionType) => {
    const { coverItems } = await getStorageAsync();
    if (!coverItems.some((s) => s.key === key)) {
      const list = [...coverItems, { value, key }];
      await storageManager.set("cover_items", list);
    } else {
      console.log("cover 已经存在");
    }
  };

  const onUpdate = (playbackStatus: any) => {
    setDuration(formatMilliseconds(playbackStatus.durationMillis));
    setCurrent(formatMilliseconds(playbackStatus.positionMillis));
  };

  interface GetStorageAsync {
    rawUrlItems: OptionType[];
    coverItems: OptionType[];
  }

  const getStorageAsync = async (): Promise<GetStorageAsync> => {
    // 源集
    const rawUrlItems = ((await storageManager.get("raw_url_items")) ||
      []) as OptionType[];
    // 封面集
    const coverItems = ((await storageManager.get("cover_items")) ||
      []) as OptionType[];

    return { coverItems, rawUrlItems };
  };

  const getAudioItemAsync = async (): Promise<GetItemsResItem | null> => {
    // 当前播放内容
    const audio_item_bar = (await storageManager.get(
      "audio_item_bar"
    )) as GetItemsResItem;
    setAudioItemAsync(audio_item_bar);
    return audio_item_bar;
  };

  const setAudioItemAsync = async (audio?: GetItemsResItem) => {
    const item = audio ?? audioItem;
    setAudioItem(item);
    await storageManager.set("audio_item_bar", item);
  };

  useEffect(() => {
    getAudioItemAsync();
    onFetchRawUrl();
    emitter.on("onAudioChange", onFetchRawUrl);
    return () => {
      emitter.off("onAudioChange", onFetchRawUrl);
    };
  }, []);

  const playSound = async () => {
    if (loading) return;
    setPlaying(true);
  };

  const pauseSound = async () => {
    if (loading) return;
    setPlaying(false);
  };

  const onLoaded = () => {
    // console.log("onLoaded");
    setLoading(false);
  };

  const onError = () => {
    // console.log("onError");
  };

  const onFinish = () => {
    // console.log("onFinish");
    // { borderColor: mode === "dark" ? theme.primary : "transparent" },
  };

  const toAudioPlayer = () => {
    router.navigate("/views/player");
  };

  return (
    <ThemedView
      style={[
        styles.barContainer,
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
      <ImageBackground
        style={styles.backgroundImage}
        src={audioItem?.cover}
        source={audioItem?.cover ? require("@/assets/images/logo.png") : null}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.barLeftContainer} onPress={toAudioPlayer}>
        {loading ? (
          <ActivityIndicator
            size={30}
            color={theme.primary}
            style={styles.imageStyle}
          />
        ) : (
          <ThemeImage src={audioItem?.cover} style={styles.imageStyle} />
        )}
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 16 }} numberOfLines={1}>
            {audioItem?.name ?? "没有音乐可播放"}
          </ThemedText>
          <View>
            <ThemedText style={styles.timeStyle}>
              {current}/{duration}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
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
        onError={onError}
        onLoaded={onLoaded}
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
    left: "2%",
    right: "2%",
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
    // borderWidth: 0.5,
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    resizeMode: "cover", // 让图片覆盖整个容器
    opacity: 0.3,
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
  },
  imageStyle: {
    width: 40,
    height: 40,
    margin: 3,
    borderRadius: 5,
    marginRight: 5,
    flexShrink: 0,
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
