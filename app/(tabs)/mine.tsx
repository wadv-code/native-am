import {
  Alert,
  Appearance,
  ImageBackground,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import Constants from "expo-constants";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useTheme } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import ThemeImage from "@/components/theme/ThemeImage";
import { useState } from "react";
import { storageManager } from "@/storage";
import ThemedModal from "@/components/theme/ThemedModal";
import { useRouter } from "expo-router";

export default function MineScreen() {
  const theme = useTheme();
  const mode = useColorScheme();
  const router = useRouter();
  const [isDark, setIsDark] = useState(mode === "dark");
  const [modalVisible, setModalVisible] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const bottom = useBottomTabOverflow();
  const audio = useSelector((state: RootState) => state.audio);
  const { audioInfo } = audio;
  const { setColorScheme } = Appearance;

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

  const openAbout = () => {
    router.navigate("/views/about");
  };

  const openViewer = () => {
    router.navigate("/views/viewer");
  };

  const setMode = () => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    setIsDark(!isDark);
    setColorScheme(colorScheme);
    storageManager.set("color_scheme", colorScheme);
  };
  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        src={audioInfo.cover}
        resizeMode="cover"
      />
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <View style={styles.header}>
          <View style={styles.headerBar}></View>
          <View style={styles.headerTool}>
            <TouchableOpacity>
              <IconSymbol
                name="qr-code-scanner"
                style={{ color: theme.text }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <IconSymbol name="settings" style={{ color: theme.text }} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <View style={styles.row}>
              <ThemeImage
                src={audioInfo.cover}
                style={styles.reactLogo}
                resizeMode="cover"
              />
              <View style={{ flexGrow: 1 }}>
                <ThemedText style={styles.userText}>没在听</ThemedText>
                <ThemedText style={styles.userTips}>层楼终究误少年</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText>个人中心</ThemedText>
                <IconSymbol name="chevron-right" />
              </View>
            </View>
          </View>
          <View style={styles.rowAround}>
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
        <ThemedView style={styles.grid}>
          <ThemedText type="subtitle" style={{ paddingHorizontal: 10 }}>
            我的功能
          </ThemedText>
          <View style={styles.gridContent}>
            <TouchableOpacity style={styles.gridItem} onPress={clearStorage}>
              <IconSymbol name="delete-sweep" size={35} />
              <ThemedText>清除缓存</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={openViewer}>
              <IconSymbol name="photo-library" size={35} />
              <ThemedText>愉悦心情</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={openModal}>
              <IconSymbol name="table-view" size={35} />
              <ThemedText>测试弹窗</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={setMode}>
              <IconSymbol
                name={isDark ? "dark-mode" : "light-mode"}
                size={35}
              />
              <ThemedText>{isDark ? "深色模式" : "浅色模式"}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
        <ThemedView style={styles.grid}>
          <ThemedText type="subtitle" style={{ paddingHorizontal: 10 }}>
            常用功能
          </ThemedText>
          <View style={styles.cellStyle}>
            <View style={[styles.row, { gap: 10 }]}>
              <IconSymbol name={isDark ? "dark-mode" : "light-mode"} />
              <ThemedText style={styles.cellTitle}>
                {isDark ? "深色模式" : "浅色模式"}
              </ThemedText>
            </View>
            <Switch
              thumbColor={theme.text}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setMode}
              value={isDark}
            />
          </View>
          <TouchableOpacity style={styles.cellStyle} onPress={clearStorage}>
            <View style={[styles.row, { gap: 10 }]}>
              <IconSymbol name="delete-sweep" />
              <ThemedText style={styles.cellTitle}>清除缓存</ThemedText>
            </View>
            <IconSymbol name="chevron-right" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cellStyle} onPress={openViewer}>
            <View style={[styles.row, { gap: 10 }]}>
              <IconSymbol name="photo-library" />
              <ThemedText style={styles.cellTitle}>愉悦心情</ThemedText>
            </View>
            <IconSymbol name="chevron-right" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cellStyle} onPress={openModal}>
            <View style={[styles.row, { gap: 10 }]}>
              <IconSymbol name="table-view" />
              <ThemedText style={styles.cellTitle}>弹窗测试</ThemedText>
            </View>
            <IconSymbol name="chevron-right" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cellStyle} onPress={openAbout}>
            <View style={[styles.row, { gap: 10 }]}>
              <IconSymbol name="supervisor-account" />
              <ThemedText style={styles.cellTitle}>关于我们</ThemedText>
            </View>
            <IconSymbol name="chevron-right" />
          </TouchableOpacity>
        </ThemedView>
      </Animated.ScrollView>
      <ThemedModal modalVisible={modalVisible} closeModal={closeModal} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowAround: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  reactLogo: {
    height: 70,
    width: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  header: {
    position: "relative",
    overflow: "hidden",
    borderEndEndRadius: 12,
    borderStartEndRadius: 12,
  },
  headerBar: {
    height: Constants.statusBarHeight,
  },
  headerTool: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
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
    opacity: 0.3,
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
  cellStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  cellTitle: {
    fontSize: 20,
    paddingVertical: 10,
  },
});
