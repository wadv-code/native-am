import Animated from "react-native-reanimated";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { IconSymbol } from "@/components/ui";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
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
import { Image, Text, useTheme } from "@rneui/themed";

export default function MineScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const bottom = useBottomTabOverflow();
  const audio = useSelector((state: RootState) => state.audio);
  const { loading, audioInfo } = audio;

  const onCoverRefresh = async () => {
    try {
      const path = formatPath(audioInfo.parent || "/", audioInfo.name);
      dispatch(setLoading(true));
      const url = await GetCover();
      if (url) {
        handleCoverItems({ key: path, value: url });
        dispatch(setAudioInfo({ ...audioInfo, cover: url }));
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
      statusBar={true}
      style={styles.container}
      rightText={
        <TouchableOpacity onPress={openSettings} style={styles.rightText}>
          <IconSymbol name="settings" style={{ color: theme.colors.grey0 }} />
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
                    color={theme.colors.primary}
                    style={styles.reactLogo}
                  />
                ) : (
                  <Image
                    src={audioInfo.cover}
                    containerStyle={styles.reactLogo}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
              <View style={{ flexGrow: 1 }}>
                <Text style={styles.userText}>没在听</Text>
                <Text style={styles.userTips}>层楼终究误少年</Text>
              </View>
              <View style={globalStyles.row}>
                <Text>个人中心</Text>
                <IconSymbol name="chevron-right" />
              </View>
            </View>
          </View>
          <View style={[globalStyles.row, globalStyles.justifyAround]}>
            <TouchableOpacity style={styles.headerItem}>
              <Text style={styles.headerMenuCount}>36</Text>
              <Text style={styles.headerMenuText}>发布</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerItem}>
              <Text style={styles.headerMenuCount}>2</Text>
              <Text style={styles.headerMenuText}>草稿</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerItem}>
              <Text style={styles.headerMenuCount}>16</Text>
              <Text style={styles.headerMenuText}>收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerItem}>
              <Text style={styles.headerMenuCount}>8</Text>
              <Text style={styles.headerMenuText}>浏览历史</Text>
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
    marginTop: 5,
  },
  headerMenuCount: {
    textAlign: "center",
    fontSize: 26,
    fontFamily: "FontNumber",
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
