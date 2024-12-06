import { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { IconSymbol } from "@/components/ui";
import { ThemedText } from "@/components/theme/ThemedText";
import { useNavigation } from "expo-router";
import { emitter } from "@/utils/mitt";
import Slider from "@react-native-community/slider";
import { useTheme } from "@/hooks/useThemeColor";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setPlaying } from "@/store/slices/audioSlice";
import { useAppDispatch } from "@/hooks/useStore";
import {
  Animated,
  Easing,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { formatMilliseconds } from "@/utils/lib";

const PlayerScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const mode = useColorScheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragCurrent, setDragCurrent] = useState<string | undefined>();
  const rotateAnimation = useRef(new Animated.Value(0)).current;
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

  const handleBack = () => {
    navigation.goBack();
  };

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
    setIsAnimating(true);
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start(() => {
      // 动画完成时的回调
      setIsAnimating(false);
    });
  };

  const stopAnimation = () => {
    rotateAnimation.stopAnimation();
    setIsAnimating(false);
  };

  useEffect(() => {
    if (playing) startAnimation();
    return () => {
      stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotateAnimation]);

  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <IconSymbol name="keyboard-arrow-down" size={35} />
        </TouchableOpacity>
        <ThemedText>导航条</ThemedText>
      </View>

      <ImageBackground
        style={[
          styles.backgroundImage,
          { opacity: mode === "dark" ? 0.5 : 0.2 },
        ]}
        src={audioInfo.cover}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.Image
          src={audioInfo.cover}
          style={[styles.cover, rotateStyle]}
        />
      </View>
      <View style={styles.infoContainer}>
        <ThemedText style={styles.infoTitle}>{audioInfo.name}</ThemedText>
        <ThemedText>{audioInfo.parent}</ThemedText>
        <ThemedText>{audioInfo.modifiedFormat}</ThemedText>
      </View>
      <View style={styles.timeContainer}>
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
        />
        <View style={styles.time}>
          <ThemedText>{dragCurrent || currentFormat}</ThemedText>
          <ThemedText>{durationFormat}</ThemedText>
        </View>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity>
          <IconSymbol name="arrow-left" size={50} />
        </TouchableOpacity>
        <TouchableOpacity onPress={playing ? pauseSound : playSound}>
          <IconSymbol
            name={playing ? "pause-circle-outline" : "play-circle-outline"}
            size={60}
            style={{ marginHorizontal: 30 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <IconSymbol name="arrow-right" size={50} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
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
  infoContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeContainer: {
    width: "100%",
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
    marginTop: 20,
    marginBottom: 50,
  },
});

export default PlayerScreen;
