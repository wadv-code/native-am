import { useCallback, useEffect, useRef, useState } from "react";
import { IconSymbol } from "@/components/ui";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useStore";
import { formatMilliseconds, sleep } from "@/utils/lib";
import { GetCover } from "@/api/api";
import { ThemedNavigation } from "../theme/ThemedNavigation";
import { Image, Text, makeStyles, useTheme } from "@rneui/themed";
import { globalStyles } from "@/styles";
import { handleCoverItems } from "@/utils/store";
import type { MaterialIconsName } from "@/types";
import { onSwitchAudio } from ".";
import type { RootState } from "@/store";
import { setStorage } from "@/storage/long";
import { router } from "expo-router";
import { CATALOG_CHANGE_PATH } from "@/storage/storage-keys";
import {
  setAudioCover,
  setAudioInfo,
  setPlaying,
  setSeek,
} from "@/store/slices/audioSlice";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type ViewPlayerProps = {
  closeModal: () => void;
};

type ToolsOption = {
  value: number;
  icon: MaterialIconsName;
  selectedIcon?: MaterialIconsName;
  disabled?: boolean;
  selected?: boolean;
};

const ViewPlayer = ({ closeModal }: ViewPlayerProps) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const audio = useSelector((state: RootState) => state.audio);
  const { audioInfo, playing, loading } = audio;
  const {
    duration = 0,
    progress = 0,
    currentFormat,
    durationFormat,
  } = audioInfo;
  const [refreshing, setRefreshing] = useState(false);
  const [isMotion, setIsMotion] = useState(true);
  const [isMusic, setIsMusic] = useState(!audioInfo.parent);
  // const [selectIndex, setSelectedIndex] = useState(0);
  const [tools, setTools] = useState<ToolsOption[]>([
    { value: 1, icon: "message" },
    { value: 2, icon: "file-download" },
    { value: 3, icon: "star-outline" },
    { value: 4, icon: "motion-photos-on", selectedIcon: "motion-photos-auto" },
    { value: 5, icon: "music-off", selectedIcon: "music-note" },
  ]);
  const [value, setValue] = useState(0);
  const startRef = useRef(false);
  const [dragCurrent, setDragCurrent] = useState<string | undefined>();

  const styles = useStyles();

  const updateTool = (id: number, key: keyof ToolsOption, value: any) => {
    setTools((prevItems) => {
      return prevItems.map((item) => {
        if (item.value === id) {
          return { ...item, [key]: value };
        }
        return item;
      });
    });
  };

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
  };

  const openPage = async () => {
    await setStorage(CATALOG_CHANGE_PATH, audioInfo.parent || "/");
    closeModal();
    await sleep(300);
    router.replace("/catalog");
  };

  const onCoverRefresh = async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      const url = await GetCover();
      if (url) {
        handleCoverItems({ key: audioInfo.id, value: url });
        dispatch(setAudioCover(url));
      }
    } finally {
      setRefreshing(false);
    }
  };

  const nextPress = async (gate: 1 | -1) => {
    if (refreshing) return;
    setRefreshing(true);
    const audio = await onSwitchAudio(audioInfo, gate, isMusic);
    if (audio) {
      dispatch(setAudioInfo(audio));
    }
    setRefreshing(false);
  };

  const togglePlaying = useCallback(() => {
    if (loading) return;
    dispatch(setPlaying(!playing));
  }, [loading, playing, dispatch]);

  const onPressToolbar = useCallback(
    (index: number) => {
      const item = tools[index];
      if (item && item.value === 5) {
        setIsMusic(!isMusic);
        updateTool(item.value, "selected", !isMusic);
      } else if (item && item.value === 4) {
        setIsMotion(!isMotion);
        updateTool(item.value, "selected", !isMotion);
      }
    },
    [isMotion, isMusic, tools]
  );

  useEffect(() => {
    setValue(progress);
    if (!startRef.current) setDragCurrent(undefined);
  }, [progress]);

  return (
    <ThemedNavigation
      statusBar={true}
      style={styles.viewContainer}
      onLeft={closeModal}
      iconSize={30}
      isModal={true}
      leftIcon="keyboard-arrow-down"
    >
      <View style={styles.animatedImage}>
        <TouchableOpacity onPress={onCoverRefresh} style={styles.cover}>
          {refreshing && (
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
        <Text>{audioInfo.auther}</Text>
        <TouchableOpacity onPress={openPage}>
          <Text style={{ color: theme.colors.grey0 }}>{audioInfo.parent}</Text>
        </TouchableOpacity>
        <View
          style={[
            globalStyles.rowAround,
            { width: "100%", paddingVertical: 5 },
          ]}
        >
          <Text style={{ color: theme.colors.grey0 }}>
            {audioInfo.sizeFormat}
          </Text>
          <Text style={{ color: theme.colors.grey0 }}>
            {audioInfo.modifiedFormat}
          </Text>
          <TouchableOpacity onPress={() => onPressToolbar(4)}>
            <Text>{isMusic ? "音乐模式" : "资源模式"}</Text>
          </TouchableOpacity>
        </View>
        <Slider
          value={value}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.grey0}
          thumbTintColor={theme.colors.primary}
          step={0.01}
          style={{ width: "95%" }}
        />
        <View style={styles.time}>
          <Text style={styles.timeText}>{dragCurrent ?? currentFormat}</Text>
          <Text style={styles.timeText}>{durationFormat}</Text>
        </View>
        <View style={[globalStyles.rowBetween, styles.toolbar]}>
          {tools.map((v, index) => {
            return (
              <TouchableOpacity
                key={v.value}
                onPress={() => onPressToolbar(index)}
              >
                <IconSymbol
                  color={v.disabled ? theme.colors.grey3 : theme.colors.grey0}
                  name={v.selected ? v.selectedIcon ?? v.icon : v.icon}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={[globalStyles.rowAround, styles.acion]}>
          <TouchableOpacity onPress={() => nextPress(-1)}>
            <IconSymbol
              name="skip-previous"
              size={Platform.OS === "android" ? 40 : 30}
              style={styles.acionIcon}
            />
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size={71.2} color={theme.colors.grey3} />
          ) : (
            <TouchableOpacity onPress={togglePlaying}>
              <IconSymbol
                name={playing ? "pause-circle" : "play-circle"}
                size={70}
                style={styles.acionIcon}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => nextPress(1)}>
            <IconSymbol
              name="skip-next"
              size={Platform.OS === "android" ? 40 : 30}
              style={styles.acionIcon}
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
    paddingTop: 10,
  },
  infoContainer: {
    width: "98%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
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
  acion: {
    width: "90%",
    paddingBottom: 30,
  },
  acionIcon: {
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10, // Android上的阴影效果
  },
  toolbar: {
    width: "90%",
    paddingVertical: 10,
  },
}));

export { ViewPlayer, ViewPlayerProps };
