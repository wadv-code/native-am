import { HeaderBar } from "../sys";
import { IconSymbol } from "../ui";
import { globalStyles } from "@/styles";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  useEffect,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { ThemedView, type ThemedViewProps } from "./ThemedView";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import type { MaterialIconsName } from "@/types";
import { getStorageAsync } from "@/store/slices/audioSlice";
import { randomNum } from "@/utils/lib";
import { Text, useTheme } from "@rneui/themed";

const { width } = Dimensions.get("window");

type ThemedNavigationProps = PropsWithChildren<
  ThemedViewProps & {
    leftIcon?: MaterialIconsName;
    rightIcon?: MaterialIconsName;
    rightText?: ReactElement;
    statusBar?: boolean;
    title?: string;
    opacity?: number;
    iconSize?: number;
    isHappy?: boolean;
    isImage?: boolean;
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
    isHappy,
    isImage,
    leftIcon = "chevron-left",
    rightIcon = "refresh",
    opacity = 0.3,
    rightText,
    src,
    iconSize,
  } = props;
  const { onLeft, onRight } = props;
  const { theme } = useTheme();
  const router = useRouter();
  const audio = useSelector((state: RootState) => state.audio);
  const { audioInfo } = audio;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

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

  const handleCurrentSrc = async () => {
    const { coverItems } = await getStorageAsync();
    if (coverItems.length) {
      const option = coverItems[randomNum(coverItems.length - 1)];
      if (option) setCurrentSrc(option.value);
    } else {
      setCurrentSrc(audioInfo.cover);
    }
  };

  useEffect(() => {
    if (!currentSrc) handleCurrentSrc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemedView style={styles.container}>
      {isImage && (
        <ImageBackground
          style={[styles.backgroundImage, { opacity: isHappy ? 1 : opacity }]}
          src={currentSrc || audioInfo.cover}
        />
      )}
      <View style={{ width: "100%" }}>
        {statusBar && <HeaderBar />}
        <View
          style={[styles.header, globalStyles.row, globalStyles.justifyBetween]}
        >
          <TouchableOpacity
            style={[
              globalStyles.row,
              globalStyles.justifyCenter,
              styles.action,
            ]}
            onPress={onCanBack}
          >
            <IconSymbol
              color={theme.colors.grey0}
              size={iconSize ?? 22}
              name={leftIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {rightText || (
            <TouchableOpacity
              style={[
                globalStyles.row,
                globalStyles.justifyCenter,
                styles.action,
              ]}
              onPress={onCanRight}
            >
              <IconSymbol
                color={theme.colors.grey0}
                size={iconSize ?? 22}
                name={rightIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={[styles.content, style]}>{children}</View>
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
    opacity: 0.2,
  },
  title: {
    width: width * 0.5,
    fontSize: 16,
    fontWeight: "bold",
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    width: "100%",
    overflow: "hidden",
  },
  action: {
    width: 50,
    paddingVertical: 10,
  },
});

export { ThemedNavigation, ThemedNavigationProps };
