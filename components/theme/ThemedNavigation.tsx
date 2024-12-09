import { ThemedText } from "@/components/theme/ThemedText";
import { HeaderBar } from "../sys";
import { IconSymbol } from "../ui";
import { useThemeColor } from "@/hooks/useThemeColor";
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
} from "react-native";
import type { MaterialIconsName } from "@/types";
import { getStorageAsync } from "@/store/slices/audioSlice";
import { randomNum } from "@/utils/lib";

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
    onBack?: () => void;
    onRight?: () => void;
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
    rightIcon = "cake",
    opacity = 0.5,
    rightText,
    src,
    iconSize,
  } = props;
  const { onBack, onRight } = props;
  const { theme } = useThemeColor();
  const router = useRouter();
  const audio = useSelector((state: RootState) => state.audio);
  const { audioInfo } = audio;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

  const onCanBack = () => {
    if (onBack) {
      onBack();
    } else {
      const canGoBack = router.canGoBack();
      if (canGoBack) router.back();
    }
  };

  useEffect(() => {
    if (!currentSrc) {
      (async () => {
        const { coverItems } = await getStorageAsync();
        if (coverItems.length) {
          const option = coverItems[randomNum(coverItems.length - 1)];
          if (option) setCurrentSrc(option.value);
        }
      })();
    }
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
      <View style={styles.header}>
        {statusBar && <HeaderBar />}
        <View style={[globalStyles.row, globalStyles.justifyBetween]}>
          <TouchableOpacity
            style={[
              globalStyles.row,
              globalStyles.justifyCenter,
              styles.action,
            ]}
            onPress={onCanBack}
          >
            <IconSymbol
              color={theme.text}
              size={iconSize ?? 28}
              name={leftIcon}
            />
          </TouchableOpacity>
          <ThemedText type="title">{title}</ThemedText>
          {rightText || (
            <TouchableOpacity
              style={[
                globalStyles.row,
                globalStyles.justifyCenter,
                styles.action,
              ]}
              onPress={onRight}
            >
              <IconSymbol
                color={theme.text}
                size={iconSize ?? 28}
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
  content: {
    flexGrow: 1,
  },
  header: {
    width: "100%",
  },
  action: {
    width: 50,
    paddingVertical: 10,
  },
});

export { ThemedNavigation, ThemedNavigationProps };
