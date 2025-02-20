import { HeaderBar } from "../sys";
import { IconSymbol } from "../ui";
import { globalStyles } from "@/styles";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { ThemedView, type ThemedViewProps } from "./ThemedView";
import type { MaterialIconsName } from "@/types";
import { randomNum, sleep } from "@/utils/lib";
import { Text, useTheme } from "@rneui/themed";
import { getStorageAsync } from "@/utils/store";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { setStorage } from "@/storage/long";
import { VIEWER_INDEX } from "@/storage/storage-keys";

const { width } = Dimensions.get("window");

type ThemedNavigationProps = PropsWithChildren<
  ThemedViewProps & {
    leftIcon?: MaterialIconsName;
    rightText?: (fn?: () => void) => ReactElement;
    statusBar?: boolean;
    title?: string;
    opacity?: number;
    iconSize?: number;
    isImage?: boolean;
    isModal?: boolean;
    src?: string;
    onLeft?: () => void | boolean;
    onRight?: () => void | boolean;
  }
>;

const ThemedNavigation = (props: ThemedNavigationProps) => {
  const {
    statusBar,
    title,
    style,
    children,
    isImage,
    leftIcon = "chevron-left",
    opacity = 0.3,
    rightText,
    src,
    iconSize = 22,
    isModal,
  } = props;
  const { onLeft, onRight } = props;
  const { theme } = useTheme();
  const router = useRouter();
  const audio = useSelector((state: RootState) => state.audio);
  const { isImageBackground } = useSelector((state: RootState) => state.app);
  const { audioInfo } = audio;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHappy, setIsHappy] = useState(false);
  const initRef = useRef(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onCanBack = () => {
    if (onLeft) {
      const refresh = onLeft();
      if (refresh) handleCurrentSrc();
    } else {
      const canGoBack = router.canGoBack();
      if (canGoBack) router.back();
    }
  };

  const onCanRight = () => {
    if (onRight) {
      const refresh = onRight();
      if (refresh) handleCurrentSrc();
    } else {
      handleCurrentSrc();
    }
  };

  const toViewer = async (index: number) => {
    if (isModal) {
      onCanBack();
      await sleep(300);
    }
    setStorage(VIEWER_INDEX, index).then(() => {
      router.push("/views/viewer");
    });
  };

  const handleCurrentSrc = useCallback(async () => {
    const { coverItems } = await getStorageAsync();
    if (coverItems.length) {
      const index = randomNum(coverItems.length - 1);
      const option = coverItems[index];
      if (option) {
        setCurrentIndex(index);
        setCurrentSrc(option.value);
      }
    } else {
      setCurrentSrc(audioInfo.cover);
    }
  }, [audioInfo.cover]);

  const isBackImage = useCallback(() => {
    return isHappy || (isImage === undefined ? isImageBackground : isImage);
  }, [isHappy, isImage, isImageBackground]);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      return;
    }
    if (isHappy) {
      fadeOut();
    } else {
      fadeIn();
    }
  }, [fadeIn, fadeOut, isHappy]);

  useEffect(() => {
    if (!currentSrc) handleCurrentSrc();
  }, [currentSrc, handleCurrentSrc]);

  return (
    <ThemedView style={styles.container}>
      {isBackImage() && (
        <ImageBackground
          style={[styles.backgroundImage, { opacity: isHappy ? 1 : opacity }]}
          src={currentSrc || audioInfo.cover}
          resizeMode="cover"
        />
      )}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isHappy
              ? theme.mode === "dark"
                ? "rgba(0,0,0,0.3)"
                : "rgba(255,255,255,0.3)"
              : "transparent",
          },
        ]}
      >
        {statusBar && <HeaderBar />}
        <View style={[globalStyles.row, globalStyles.justifyBetween]}>
          <TouchableOpacity
            style={[globalStyles.row, styles.action]}
            onPress={onCanBack}
          >
            <IconSymbol size={iconSize} name={leftIcon} />
            {isBackImage() && (
              <TouchableOpacity onPress={() => toViewer(currentIndex)}>
                <Text>第{currentIndex + 1}张</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {(rightText && rightText(handleCurrentSrc)) ?? (
            <View style={[globalStyles.row, styles.action]}>
              {isBackImage() && (
                <TouchableOpacity onPress={onCanRight}>
                  <IconSymbol name="refresh" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setIsHappy(!isHappy)}>
                <IconSymbol name="photo" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Animated.View
        style={[
          styles.content,
          style,
          { transform: [{ translateX: fadeAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  title: {
    width: width - 160,
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flexGrow: 1,
  },
  header: {
    width: "100%",
    overflow: "hidden",
    padding: 10,
  },
  action: {
    gap: 10,
  },
});

export { ThemedNavigation, ThemedNavigationProps };
