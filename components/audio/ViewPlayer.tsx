import { useEffect, useRef, useState } from "react";
import { IconSymbol } from "@/components/ui";
import { emitter } from "@/utils/mitt";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/useStore";
import { formatMilliseconds, formatPath } from "@/utils/lib";
import { GetCover, GetMusic } from "@/api/api";
import { ThemedNavigation } from "../theme/ThemedNavigation";
import { Text, useTheme } from "@rneui/themed";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  handleCoverItems,
  setAudioInfo,
  setPlaying,
} from "@/store/slices/audioSlice";
import { globalStyles } from "@/styles";

type ViewPlayerProps = {
  closeModal: () => void;
};

const ViewPlayer = ({ closeModal }: ViewPlayerProps) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [value, setValue] = useState(0);
  const [dragCurrent, setDragCurrent] = useState<string | undefined>();
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch();
  const audio = useSelector((state: RootState) => state.audio);
  const {
    audioInfo,
    playing,
    currentFormat,
    durationFormat,
    current,
    duration,
    loading,
  } = audio;
  const [isMusic, setIsMusic] = useState(!audioInfo.parent);

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateStyle = { transform: [{ rotate: spin }] };

  // const handleBack = () => {
  //   navigation.goBack();
  // };

  const onSlidingComplete = (value: number) => {
    setDragCurrent(undefined);
    dispatch(setPlaying(true));
    const diff = Math.floor(value * duration);
    emitter.emit("setAudioSeek", diff);
  };

  const onValueChange = (value: number) => {
    const diff = Math.floor(value * duration);
    setDragCurrent(formatMilliseconds(diff));
  };

  const onSlidingStart = () => {
    dispatch(setPlaying(false));
  };

  const playSound = async () => {
    dispatch(setPlaying(true));
    startAnimation();
  };

  const pauseSound = async () => {
    dispatch(setPlaying(false));
    stopAnimation();
  };

  const startAnimation = () => {
    rotateAnimation.setValue(0);
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(startAnimation);
  };

  const stopAnimation = () => {
    rotateAnimation.stopAnimation();
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
        emitter.emit("onAudioChange", {
          id,
          name: info.name,
          auther: info.auther,
          raw_url: info.url,
          cover: info.pic_url,
        });
      }
    } finally {
      setRefreshing(false);
      // dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (playing) setTimeout(startAnimation, 300);
    return () => {
      stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotateAnimation]);

  useEffect(() => {
    setValue(parseFloat((current / duration).toFixed(2)));
    if (dragCurrent) setDragCurrent(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <ThemedNavigation
      statusBar={true}
      isImage={true}
      style={styles.viewContainer}
      onLeft={closeModal}
      leftIcon="keyboard-arrow-down"
      rightText={
        <TouchableOpacity
          onPress={() => setIsMusic(!isMusic)}
          style={styles.rightText}
        >
          <Text style={{ fontWeight: "bold" }}>
            {isMusic ? "退出音乐模式" : "进入音乐模式"}
          </Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.animatedImage}>
        <TouchableOpacity
          onPress={onCoverRefresh}
          style={[styles.cover, rotateStyle]}
        >
          {(refreshing || loading) && (
            <ActivityIndicator
              size={100}
              color={theme.colors.primary}
              style={styles.indicator}
            />
          )}
          <Animated.Image src={audioInfo.cover} style={globalStyles.screen} />
        </TouchableOpacity>
      </View>
      <Animated.View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{audioInfo.name}</Text>
        <Text style={styles.parent}>{audioInfo.auther}</Text>
        <Text style={[styles.parent, { color: theme.colors.grey0 }]}>
          {audioInfo.parent}
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
          <Text>{dragCurrent || currentFormat}</Text>
          <Text>{durationFormat}</Text>
        </View>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={nextPress}>
            <IconSymbol
              name="arrow-left"
              size={Platform.OS === "android" ? 50 : 30}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playing ? pauseSound : playSound}>
            <IconSymbol
              name={playing ? "pause-circle-outline" : "play-circle-outline"}
              size={60}
              style={{ marginHorizontal: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextPress}>
            <IconSymbol
              name="arrow-right"
              size={Platform.OS === "android" ? 50 : 30}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
    paddingHorizontal: 40,
  },
  cover: {
    width: 300,
    height: 300,
    borderRadius: 150,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2, // Android上的阴影效果
    overflow: "hidden",
    borderWidth: 35,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
});

export { ViewPlayer, ViewPlayerProps };
