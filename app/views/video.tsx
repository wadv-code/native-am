import { makeStyles, Text, useTheme } from "@rneui/themed";
import { GetDetail } from "@/api/api";
import { useCallback, useEffect, useState } from "react";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/types";
import type { GetItem } from "@/api";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { formatContent } from "@/utils/common";
import { globalStyles } from "@/styles";
import { useVideoPlayer, VideoView, type VideoContentFit } from "expo-video";
import { useEvent } from "expo";

type VideoScreenRouteProp = RouteProp<RootStackParamList, "video">;

const { height } = Dimensions.get("window");
const fitKeys: VideoContentFit[] = ["contain", "cover", "fill"];

const VideoScreen = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<GetItem>({ name: "", id: "" });
  const route = useRoute<VideoScreenRouteProp>();
  const player = useVideoPlayer({});
  const [contentFit, setContentFit] = useState<VideoContentFit>("contain");

  // const { isPlaying } = useEvent(player, "playingChange", {
  //   isPlaying: player.playing,
  // });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  // const player = useVideoPlayer({ uri: "" }, (player) => {
  //   console.log(player.duration);
  //   // player.loop = true;
  //   // player.play();
  // });

  const styles = useStyles();

  const onFetch = useCallback(() => {
    setLoading(true);
    const path = route.params.path;
    GetDetail({ path, password: "" })
      .then(({ data }) => {
        if (data) {
          formatContent([data]);
          setItem(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [route]);

  useEffect(() => {
    onFetch();
  }, [onFetch]);

  useEffect(() => {
    if (item.raw_url) {
      player.replace(item.raw_url);
    }
  }, [item, player]);

  const onFitChange = useCallback(() => {
    const index = fitKeys.indexOf(contentFit);
    const nextKey = fitKeys[index + 1];
    const key = nextKey ? nextKey : fitKeys[0];
    setContentFit(key);
  }, [contentFit]);

  return (
    <ThemedNavigation
      title="播放视频"
      style={globalStyles.rowCenter}
      statusBar={true}
      isImage={false}
      rightText={
        <TouchableOpacity onPress={onFitChange} style={styles.right}>
          <Text style={styles.rightText}>{contentFit}</Text>
        </TouchableOpacity>
      }
    >
      <VideoView
        style={styles.video}
        player={player}
        contentFit={contentFit}
        allowsFullscreen
        allowsPictureInPicture
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
    fontFamily: "SpaceMono",
  },
}));

export default VideoScreen;
