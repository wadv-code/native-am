import { makeStyles, Text, useTheme } from "@rneui/themed";
import { GetDetail } from "@/api/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { formatContent } from "@/utils/common";
import { globalStyles } from "@/styles";
import { Toast } from "@/components/theme";
import { useEventListener } from "expo";
import type { RootStackParamList } from "@/types";
import type { GetItem } from "@/api";
import {
  useVideoPlayer,
  VideoView,
  type VideoContentFit,
  type VideoPlayerStatus,
} from "expo-video";

type VideoScreenRouteProp = RouteProp<RootStackParamList, "video">;

const { height } = Dimensions.get("window");
const fitKeys: VideoContentFit[] = ["contain", "cover", "fill"];

const VideoScreen = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<VideoPlayerStatus>("idle");
  const [item, setItem] = useState<GetItem>({ name: "", id: "" });
  const route = useRoute<VideoScreenRouteProp>();
  const player = useVideoPlayer({}, (player) => {
    player.play();
  });
  const [contentFit, setContentFit] = useState<VideoContentFit>("contain");
  const errorCountRef = useRef(0);

  const styles = useStyles();

  const onFetch = useCallback(async () => {
    setLoading(true);
    const path = route.params.path;
    try {
      const { data } = await GetDetail({ path, password: "" });
      if (data) {
        formatContent([data]);
        setItem(data);
      }
    } catch (err) {
      Toast.error(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, [route]);

  const onFitChange = useCallback(() => {
    const index = fitKeys.indexOf(contentFit);
    const nextKey = fitKeys[index + 1];
    const key = nextKey ? nextKey : fitKeys[0];
    setContentFit(key);
  }, [contentFit]);

  useEventListener(player, "statusChange", ({ status, error }) => {
    setStatus(status);
    if (error) {
      if (errorCountRef.current < 5) {
        errorCountRef.current += 1;
        Toast.warn(error.message);
        onFetch();
      }
    }
    // console.log("Player status changed: ", status);
  });

  useEffect(() => {
    if (item.raw_url) player.replace(item.raw_url);
  }, [item.raw_url, player]);

  useEffect(() => {
    onFetch();
  }, [onFetch]);

  return (
    <ThemedNavigation
      title={item.name || "播放视频"}
      style={globalStyles.rowCenter}
      statusBar={true}
      isImage={false}
      rightText={() => (
        <TouchableOpacity onPress={onFitChange} style={styles.right}>
          <Text style={styles.rightText}>{contentFit}</Text>
        </TouchableOpacity>
      )}
    >
      <VideoView
        style={styles.video}
        player={player}
        contentFit={contentFit}
        allowsFullscreen
        allowsPictureInPicture
        startsPictureInPictureAutomatically
      />
      {(loading || status === "loading") && (
        <ActivityIndicator
          size={50}
          color={theme.colors.primary}
          style={styles.loading}
        />
      )}
    </ThemedNavigation>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  video: {
    position: "absolute",
    width: "100%",
    height: height - 40,
    backgroundColor: "black",
    left: 0,
    top: 0,
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
  right: {
    width: 60,
  },
  rightText: {
    textAlign: "center",
    fontSize: 14,
    textTransform: "capitalize",
  },
}));

export default VideoScreen;
