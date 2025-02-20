import { FAB, makeStyles, Text, useTheme } from "@rneui/themed";
import { GetDetail, GetVideo } from "@/api/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { formatContent } from "@/utils/common";
import { globalStyles } from "@/styles";
import { Toast } from "@/components/theme";
import { useEventListener } from "expo";
import type { RootStackParamList } from "@/types";
import type { GetItem } from "@/api";
import { ThemedView } from "@/components/theme/ThemedView";
import { View } from "react-native";
import { IconSymbol } from "@/components/ui";
import { router } from "expo-router";
import { ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import {
  useVideoPlayer,
  VideoView,
  type VideoContentFit,
  type VideoPlayerStatus,
} from "expo-video";

type VideoScreenRouteProp = RouteProp<RootStackParamList, "video">;

const fitKeys: VideoContentFit[] = ["contain", "cover", "fill"];

type VideoResponse = {
  download_url: string;
  video_title: string;
};

const VideoScreen = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isControl, setIsControl] = useState(false);
  const [status, setStatus] = useState<VideoPlayerStatus>("idle");
  const [item, setItem] = useState<GetItem>({ name: "", id: "" });
  const [video, setVideo] = useState<VideoResponse>({
    video_title: "",
    download_url: "",
  });
  const route = useRoute<VideoScreenRouteProp>();
  const player = useVideoPlayer({}, (player) => {
    // player.loop = true;
    player.play();
  });
  const [contentFit, setContentFit] = useState<VideoContentFit>("contain");
  const errorCountRef = useRef(0);

  const styles = useStyles();

  const onBack = () => {
    router.back();
  };

  const onFetch = useCallback(async () => {
    setLoading(true);
    const path = route.params.path;
    if (path) {
      try {
        const { data } = await GetDetail({ path, password: "asmrgay" });
        if (data) {
          formatContent([data], false);
          setItem(data);
        }
      } catch (err) {
        Toast.error(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const data = await GetVideo<VideoResponse>();
        if (data) {
          setVideo(data);
        }
        // if (data && data.download_url) {
        //   setSource(data.download_url);
        // }
      } catch (err) {
        Toast.error(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    }
  }, [route.params.path]);

  const onFitChange = useCallback(() => {
    const index = fitKeys.indexOf(contentFit);
    const nextKey = fitKeys[index + 1];
    const key = nextKey ? nextKey : fitKeys[0];
    setContentFit(key);
  }, [contentFit]);

  useEventListener(player, "statusChange", ({ status, error }) => {
    // console.log(status, " => ", isControl);
    setStatus(status);
    if (error) {
      if (errorCountRef.current < 5) {
        errorCountRef.current += 1;
        Toast.warn(error.message);
        onFetch();
      }
    } else if (status === "idle" && isControl) {
      onFetch();
    }
  });

  useEffect(() => {
    if (item.raw_url || video.download_url)
      player.replace(item.raw_url || video.download_url);
  }, [player, item.raw_url, video.download_url]);

  useEffect(() => {
    onFetch();
  }, [onFetch]);

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          globalStyles.rowBetween,
          globalStyles.statusbar,
          styles.headerContainer,
        ]}
      >
        <TouchableOpacity onPress={onBack} style={styles.left}>
          <IconSymbol
            name="chevron-left"
            color="white"
            size={Platform.OS === "android" ? 30 : 22}
          />
        </TouchableOpacity>
        <Text
          style={{ color: "white", maxWidth: "70%" }}
          numberOfLines={1}
          lineBreakMode="tail"
        >
          {item.name || video.video_title}
        </Text>
        <TouchableOpacity onPress={onFitChange} style={styles.right}>
          <Text style={styles.rightText}>{contentFit}</Text>
        </TouchableOpacity>
      </View>
      <VideoView
        style={styles.video}
        player={player}
        contentFit={contentFit}
        nativeControls={!isControl}
      />
      <FAB
        style={styles.refresh}
        loading={loading || status === "loading"}
        onPress={onFetch}
        color={theme.colors.primary}
        size="small"
        icon={{
          name: "refresh",
          color: "white",
        }}
      />
      <FAB
        style={styles.control}
        onPress={() => setIsControl(!isControl)}
        color={isControl ? theme.colors.danger : theme.colors.success}
        size="small"
        icon={{
          name: isControl ? "stop" : "play-arrow",
          color: "white",
        }}
      />

      {(loading || status === "loading") && (
        <ActivityIndicator
          size={50}
          color={theme.colors.primary}
          style={styles.loading}
        />
      )}
    </ThemedView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: "black",
    position: "relative",
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 10,
    position: "relative",
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,.1)",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loading: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 1,
  },
  floatBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 24,
  },
  left: {
    width: 40,
  },
  right: {
    width: 40,
    justifyContent: "flex-end",
  },
  rightText: {
    textAlign: "center",
    fontSize: 14,
    textTransform: "capitalize",
    color: "white",
  },
  refresh: {
    position: "absolute",
    right: 20,
    bottom: 90,
  },
  control: {
    position: "absolute",
    right: 20,
    bottom: 140,
  },
}));

export default VideoScreen;
