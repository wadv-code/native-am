import Animated, { useAnimatedRef } from "react-native-reanimated";
import { ThemedText } from "@/components/theme/ThemedText";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import ThemeImage from "@/components/theme/ThemeImage";
import { useRouter } from "expo-router";
import { formatPath } from "@/utils/lib";
import { useAppDispatch } from "@/hooks/useStore";
import { GetCover } from "@/api/api";
import { globalStyles } from "@/styles";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import MineGrid from "@/components/mine/MineGrid";
import {
  handleCoverItems,
  setAudioInfo,
  setLoading,
} from "@/store/slices/audioSlice";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { gridItems } from "@/components/mine/util";

export default function MineScreen() {
  const { theme } = useThemeColor();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const bottom = useBottomTabOverflow();
  const audio = useSelector((state: RootState) => state.audio);
  const { loading, audioInfo } = audio;

  const onCoverRefresh = async () => {
    try {
      const path = formatPath(audioInfo.parent || "/", audioInfo.name);
      dispatch(setLoading(true));
      const data = await GetCover({ type: "json", mode: "3,5,8" });
      if (data.url) {
        const uri = __DEV__ ? data.url : data.url.replace(/http:/g, "https:");
        handleCoverItems({ key: path, value: uri });
        dispatch(setAudioInfo({ ...audioInfo, cover: uri }));
      }
    } catch {
      console.log("图片加载失败");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const openSettings = () => {
    router.navigate("/views/settings");
  };

  const onLeft = () => {
    console.log("onLeft");
    return true;
  };

  return (
    <ThemedNavigation
      leftIcon="qr-code-scanner"
      isImage={true}
      statusBar={true}
      style={styles.container}
      rightText={
        <TouchableOpacity onPress={openSettings} style={styles.rightText}>
          <IconSymbol name="settings" style={{ color: theme.text }} />
        </TouchableOpacity>
      }
      onLeft={onLeft}
    >
      <Animated.ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={globalStyles.row}>
              <TouchableOpacity onPress={onCoverRefresh}>
                {loading ? (
                  <ActivityIndicator
                    size={30}
                    color={theme.primary}
                    style={styles.reactLogo}
                  />
                ) : (
                  <ThemeImage
                    src={audioInfo.cover}
                    style={styles.reactLogo}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
              <View style={{ flexGrow: 1 }}>
                <ThemedText style={styles.userText}>没在听</ThemedText>
                <ThemedText style={styles.userTips}>层楼终究误少年</ThemedText>
              </View>
              <View style={globalStyles.row}>
                <ThemedText>个人中心</ThemedText>
                <IconSymbol name="chevron-right" />
              </View>
            </View>
          </View>
          <View style={[globalStyles.row, globalStyles.justifyAround]}>
            <TouchableOpacity style={styles.headerItem}>
              <ThemedText style={styles.headerMenuCount}>36</ThemedText>
              <ThemedText style={styles.headerMenuText}>发布</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerItem}>
              <ThemedText style={styles.headerMenuCount}>2</ThemedText>
              <ThemedText style={styles.headerMenuText}>草稿</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerItem}>
              <ThemedText style={styles.headerMenuCount}>16</ThemedText>
              <ThemedText style={styles.headerMenuText}>收藏</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerItem}>
              <ThemedText style={styles.headerMenuCount}>8</ThemedText>
              <ThemedText style={styles.headerMenuText}>浏览历史</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        <MineGrid items={gridItems} title="我的功能" />
      </Animated.ScrollView>
    </ThemedNavigation>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  reactLogo: {
    height: 70,
    width: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  header: {
    position: "relative",
    overflow: "hidden",
    borderEndEndRadius: 12,
    borderStartEndRadius: 12,
  },
  headerItem: {
    width: "20%",
    marginTop: 10,
  },
  headerMenuText: {
    fontSize: 18,
    textAlign: "center",
  },
  headerMenuCount: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  headerContent: {
    paddingHorizontal: 15,
    flexGrow: 1,
  },
  userText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userTips: {
    marginTop: 5,
  },
  rightText: {
    marginRight: 10,
  },
});
