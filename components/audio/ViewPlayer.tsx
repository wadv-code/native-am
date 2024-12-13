import { useEffect, useRef, useState } from "react";
import { IconSymbol } from "@/components/ui";
import { emitter } from "@/utils/mitt";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/useStore";
import { formatMilliseconds, formatPath } from "@/utils/lib";
import { GetCover } from "@/api/api";
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

type ViewPlayerProps = {
  closeModal: () => void;
};

const ViewPlayer = ({ closeModal }: ViewPlayerProps) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [value, setValue] = useState(0);
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
    current,
    duration,
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
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 30000,
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
      const url = await GetCover();
      if (url) {
        handleCoverItems({ key: path, value: url });
        dispatch(setAudioInfo({ ...audioInfo, cover: url }));
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

  useEffect(() => {
    setValue(parseFloat((current / duration).toFixed(2)));
    if (dragCurrent) setDragCurrent(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const animatedStyle = {
    transform: [{ translateX: animatedValue }],
  };
  const opacityStyle = { opacity: animatedOpacity };

  return (
    <ThemedNavigation
      statusBar={true}
      isImage={true}
      style={styles.viewContainer}
      onLeft={closeModal}
      isHappy={isHappy}
      leftIcon="keyboard-arrow-down"
      onRight={() => setIsHappy(!isHappy)}
      rightText={
        <TouchableOpacity
          onPress={() => setIsHappy(!isHappy)}
          style={styles.rightText}
        >
          <Text style={{ fontWeight: "bold" }}>
            {isHappy ? "退出愉悦心情" : "愉悦心情"}
          </Text>
        </TouchableOpacity>
      }
    >
      <TouchableOpacity onPress={onCoverRefresh} style={styles.animatedImage}>
        {loading ? (
          <ActivityIndicator
            size={100}
            color={theme.colors.primary}
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
        <Text style={styles.infoTitle}>{audioInfo.name}</Text>
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
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  screen: { width: "100%", height: "100%" },
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
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
});

export { ViewPlayer, ViewPlayerProps };
