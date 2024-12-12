import Animated, { useAnimatedRef } from "react-native-reanimated";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import ThemeImage from "@/components/theme/ThemeImage";
import { useState } from "react";
import { storageManager } from "@/storage";
import ThemedModal from "@/components/theme/ThemedModal";
import { useRouter } from "expo-router";
import { formatPath } from "@/utils/lib";
import { useAppDispatch } from "@/hooks/useStore";
import { GetCover } from "@/api/api";
import { globalStyles } from "@/styles";
import {
  handleCoverItems,
  setAudioInfo,
  setLoading,
} from "@/store/slices/audioSlice";
import {
  ActivityIndicator,
  Alert,
  Appearance,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";

export default function MineScreen() {
  const { theme } = useThemeColor();
  const mode = useColorScheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDark, setIsDark] = useState(mode === "dark");
  const [modalVisible, setModalVisible] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const bottom = useBottomTabOverflow();
  const audio = useSelector((state: RootState) => state.audio);
  const { loading, audioInfo } = audio;
  const { setColorScheme } = Appearance;

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

  const clearStorage = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => storageManager.clear() },
      ],
      { cancelable: false }
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const openSettings = () => {
    router.navigate("/views/settings");
  };

  const openViewer = () => {
    router.navigate("/views/viewer");
  };

  const setMode = () => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    setColorScheme(colorScheme);
    setIsDark(!isDark);
    storageManager.set("color_scheme", colorScheme);
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
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <View style={styles.header}>
          {/* <View style={styles.headerBar}></View>
          <View style={styles.headerTool}>
            <TouchableOpacity>
              <IconSymbol
                name="qr-code-scanner"
                style={{ color: theme.text }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openSettings}>
              <IconSymbol name="settings" style={{ color: theme.text }} />
            </TouchableOpacity>
          </View> */}
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
        <ThemedView
          darkColor="rgba(0,0,0,0.5)"
          lightColor="rgba(255,255,255,0.5)"
          style={styles.grid}
        >
          <ThemedText type="subtitle" style={{ paddingHorizontal: 10 }}>
            我的功能
          </ThemedText>
          <View style={styles.gridContent}>
            <TouchableOpacity style={styles.gridItem} onPress={setMode}>
              <IconSymbol
                name={isDark ? "dark-mode" : "light-mode"}
                size={35}
              />
              <ThemedText bold="bold">
                {isDark ? "深色模式" : "浅色模式"}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={clearStorage}>
              <IconSymbol name="delete-sweep" size={35} />
              <ThemedText bold="bold">清除缓存</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={openViewer}>
              <IconSymbol name="photo-library" size={35} />
              <ThemedText bold="bold">愉悦心情</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={openSettings}>
              <IconSymbol name="settings" size={35} />
              <ThemedText bold="bold">应用设置</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={openModal}>
              <IconSymbol name="table-view" size={35} />
              <ThemedText bold="bold">测试弹窗</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Animated.ScrollView>
      <ThemedModal modalVisible={modalVisible} closeModal={closeModal} />
    </ThemedNavigation>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  rowAround: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
  grid: {
    flex: 1,
    marginHorizontal: "2%",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  gridContent: {
    flexGrow: 1,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: 5,
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  rightText: {
    marginRight: 10,
  },
});
