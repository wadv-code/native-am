import { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { IconSymbol } from "@/components/ui";
import { ThemedText } from "@/components/theme/ThemedText";
import { emitter } from "@/utils/mitt";
import Slider from "@react-native-community/slider";
import { useTheme } from "@/hooks/useThemeColor";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  handleCoverItems,
  setAudioInfo,
  setPlaying,
} from "@/store/slices/audioSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { formatMilliseconds, formatPath } from "@/utils/lib";
import { ThemedView } from "../theme/ThemedView";
import {
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GetCover } from "@/api/api";

type ViewPlayerProps = {
  closeModal: () => void;
};

const ViewPlayer = ({ closeModal }: ViewPlayerProps) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [dragCurrent, setDragCurrent] = useState<string | undefined>();
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch();
  const audio = useSelector((state: RootState) => state.audio);
  const {
    audioInfo,
    playing,
    currentFormat,
    durationFormat,
    duration,
    current,
  } = audio;

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateStyle = { transform: [{ rotate: spin }] };

  // const handleBack = () => {
  //   navigation.goBack();
  // };

  const onSlidingComplete = (value: number) => {
    dispatch(setPlaying(true));
    setDragCurrent(undefined);
    // dispatch(setCurrent(value));
    emitter.emit("setAudioSeek", value);
  };

  const onValueChange = (value: number) => {
    setDragCurrent(formatMilliseconds(value));
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
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  };

  const stopAnimation = () => {
    rotateAnimation.stopAnimation();
  };

  const onCoverRefresh = async () => {
    if (loading) return;
    try {
      const path = formatPath(audioInfo.parent || "/", audioInfo.name);
      setLoading(true);
      const data = await GetCover({ type: "json", mode: 8 });
      if (data.url) {
        const uri = __DEV__ ? data.url : data.url.replace(/http:/g, "https:");
        handleCoverItems({ key: path, value: uri });
        dispatch(setAudioInfo({ ...audioInfo, cover: uri }));
      }
    } catch {
      console.log("图片加载失败");
    } finally {
      setLoading(false);
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
    if (isHappy) {
      Animated.timing(animatedValue, {
        toValue: -500, // 目标位置（假设屏幕外是负值）
        duration: 1000, // 动画时长（毫秒）
        useNativeDriver: true, // 使用原生动画驱动（性能更好）
      }).start(() => {
        animatedValue.stopAnimation();
      });
      Animated.timing(animatedOpacity, {
        toValue: 0, // 目标位置（假设屏幕外是负值）
        duration: 1000, // 动画时长（毫秒）
        useNativeDriver: true, // 使用原生动画驱动（性能更好）
      }).start(() => {
        animatedOpacity.stopAnimation();
      });
    } else {
      Animated.timing(animatedValue, {
        toValue: 0, // 目标位置（假设屏幕外是负值）
        duration: 1000, // 动画时长（毫秒）
        useNativeDriver: true, // 使用原生动画驱动（性能更好）
      }).start(() => {
        animatedValue.stopAnimation();
      });
      Animated.timing(animatedOpacity, {
        toValue: 1, // 目标位置（假设屏幕外是负值）
        duration: 1000, // 动画时长（毫秒）
        useNativeDriver: true, // 使用原生动画驱动（性能更好）
      }).start(() => {
        animatedOpacity.stopAnimation();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHappy]);

  const animatedStyle = {
    transform: [{ translateX: animatedValue }],
  };
  const opacityStyle = { opacity: animatedOpacity };

  return (
    <ThemedView style={[styles.viewContainer]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={closeModal}>
          <IconSymbol
            name="keyboard-arrow-down"
            size={Platform.OS === "android" ? 35 : 25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsHappy(!isHappy)}>
          <ThemedText style={{ fontWeight: "bold" }}>
            {isHappy ? "退出愉悦心情" : "愉悦心情"}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <ImageBackground
        style={[styles.backgroundImage, { opacity: isHappy ? 1 : 0.3 }]}
        src={audioInfo.cover}
      />
      <TouchableOpacity onPress={onCoverRefresh} style={styles.animatedImage}>
        {loading ? (
          <ActivityIndicator
            size={100}
            color={theme.primary}
            style={styles.screen}
          />
        ) : (
          <Animated.Image
            src={audioInfo.cover}
            style={[styles.cover, rotateStyle, opacityStyle]}
          />
        )}
      </TouchableOpacity>
      <Animated.View style={[styles.infoContainer, animatedStyle]}>
        <ThemedText style={styles.infoTitle}>{audioInfo.name}</ThemedText>
        <ThemedText style={[styles.parent, { color: theme.icon }]}>
          {audioInfo.parent}
        </ThemedText>
        <ThemedText style={{ color: theme.icon }}>
          {audioInfo.modifiedFormat}
        </ThemedText>
        <Slider
          value={current}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor={theme.primary}
          thumbTintColor={theme.primary}
          step={1}
          style={{ width: "100%" }}
        />
        <View style={styles.time}>
          <ThemedText>{dragCurrent || currentFormat}</ThemedText>
          <ThemedText>{durationFormat}</ThemedText>
        </View>
        <View style={styles.toolbar}>
          <TouchableOpacity>
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
          <TouchableOpacity>
            <IconSymbol
              name="arrow-right"
              size={Platform.OS === "android" ? 50 : 30}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  screen: { width: "100%", height: "100%" },
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    position: "relative",
    zIndex: 1,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  animatedImage: {
    flex: 1,
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
    fontWeight: "bold",
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
    position: "absolute",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
});

export { ViewPlayer, ViewPlayerProps };
