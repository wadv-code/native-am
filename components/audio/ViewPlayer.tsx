import { useEffect, useRef, useState } from "react";
import { IconSymbol } from "@/components/ui";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/useStore";
import { formatMilliseconds, formatPath } from "@/utils/lib";
import { GetCover, GetMusic } from "@/api/api";
import { ThemedNavigation } from "../theme/ThemedNavigation";
import { Image, Text, makeStyles, useTheme } from "@rneui/themed";
import { globalStyles } from "@/styles";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import {
  handleCoverItems,
  setAudioInfo,
  setPlaying,
  setSeek,
} from "@/store/slices/audioSlice";

const { width } = Dimensions.get("window");

type ViewPlayerProps = {
  closeModal: () => void;
};

const ViewPlayer = ({ closeModal }: ViewPlayerProps) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [value, setValue] = useState(0);
  const startRef = useRef(false);
  const [dragCurrent, setDragCurrent] = useState<string | undefined>();
  const audio = useSelector((state: RootState) => state.audio);
  const {
    audioInfo,
    playing,
    currentFormat,
    durationFormat,
    progress,
    duration,
    loading,
  } = audio;

  const styles = useStyles();

  const onSlidingComplete = (value: number) => {
    startRef.current = false;
    setDragCurrent(undefined);
    const seek = Math.round(value * duration);
    dispatch(setSeek(seek));
  };

  const onValueChange = (value: number) => {
    if (startRef.current) {
      const diff = Math.round(value * duration);
      setDragCurrent(formatMilliseconds(diff));
    }
  };

  const onSlidingStart = () => {
    startRef.current = true;
    dispatch(setPlaying(false));
  };

  const playSound = async () => {
    dispatch(setPlaying(true));
  };

  const pauseSound = async () => {
    dispatch(setPlaying(false));
  };

  const onCoverRefresh = async () => {
    if (refreshing) return;
    try {
      const path = formatPath(audioInfo.parent || "/", audioInfo.name);
      setRefreshing(true);
      const url = await GetCover();
      if (url) {
        handleCoverItems({ key: path, value: url });
        dispatch(setAudioInfo({ ...audioInfo, cover: url }));
      }
    } catch {
      console.log("图片加载失败");
    } finally {
      setRefreshing(false);
    }
  };

  const nextPress = async () => {
    if (loading || refreshing) return;
    try {
      setRefreshing(true);
      const { info } = await GetMusic();
      if (info) {
        const id = info.id.toString();
        dispatch(
          setAudioInfo({
            id,
            name: info.name,
            auther: info.auther,
            raw_url: info.url,
            cover: info.pic_url,
          })
        );
      }
    } finally {
      setRefreshing(false);
      // dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    setValue(progress);
    if (dragCurrent) setDragCurrent(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <ThemedNavigation
      statusBar={true}
      isImage={true}
      style={styles.viewContainer}
      onLeft={closeModal}
      leftIcon="keyboard-arrow-down"
    >
      <View style={styles.animatedImage}>
        <TouchableOpacity onPress={onCoverRefresh} style={styles.cover}>
          {(refreshing || loading) && (
            <ActivityIndicator
              size={100}
              color={theme.colors.primary}
              style={styles.indicator}
            />
          )}
          <Image
            src={audioInfo.cover}
            resizeMode="cover"
            containerStyle={globalStyles.screen}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{audioInfo.name}</Text>
        <Text style={styles.parent}>{audioInfo.auther}</Text>
        <Text style={[styles.parent, { color: theme.colors.grey0 }]}>
          {audioInfo.parent}
        </Text>
        <Text style={[styles.parent, { color: theme.colors.grey0 }]}>
          {audioInfo.sizeFormat}
        </Text>
        <Text style={{ color: theme.colors.grey0 }}>
          {audioInfo.modifiedFormat}
        </Text>
        <Slider
          value={value}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={theme.colors.primary}
          thumbTintColor={theme.colors.primary}
          step={0.01}
          style={{ width: "90%" }}
        />
        <View style={styles.time}>
          <Text style={styles.timeText}>{dragCurrent || currentFormat}</Text>
          <Text style={styles.timeText}>{durationFormat}</Text>
        </View>
        <View style={[globalStyles.rowAround, styles.toolbar]}>
          <TouchableOpacity onPress={nextPress}>
            <IconSymbol
              name="skip-previous"
              size={Platform.OS === "android" ? 40 : 30}
              style={styles.toolbarIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playing ? pauseSound : playSound}>
            <IconSymbol
              name={playing ? "pause-circle" : "play-circle"}
              size={70}
              style={styles.toolbarIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextPress}>
            <IconSymbol
              name="skip-next"
              size={Platform.OS === "android" ? 40 : 30}
              style={styles.toolbarIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedNavigation>
  );
};

const useStyles = makeStyles((theme) => ({
  indicator: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  rightText: {
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  animatedImage: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    paddingTop: width * 0.05,
  },
  infoContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  parent: {
    fontSize: 14,
  },
  time: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  timeText: {
    fontSize: 18,
    color: theme.colors.grey2,
    fontFamily: "FontNumber",
  },
  cover: {
    width: width - 60,
    height: width - 60,
    borderRadius: 8,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6, // Android上的阴影效果
    overflow: "hidden",
  },
  toolbar: {
    width: "90%",
    paddingVertical: 30,
  },
  toolbarIcon: {
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10, // Android上的阴影效果
  },
}));

export { ViewPlayer, ViewPlayerProps };
