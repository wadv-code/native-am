import {
  Alert,
  FlatList,
  ImageBackground,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  type TextProps,
} from "react-native";
import Constants from "expo-constants";
import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";
import { IconSymbol } from "../ui";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEffect, useRef, useState } from "react";
import type { GetItemsParams, GetItemsResItem } from "@/api";
import { GetItems } from "@/api/api";
import {
  formatFileSize,
  formatPath,
  formatTimeAgo,
  isAudioFile,
} from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { IndexItem } from "../index/IndexItem";
import { useThemeColor } from "@/hooks/useThemeColor";
import { storageManager } from "@/storage";
import { useRouter } from "expo-router";

type ListPlayerProps = TextProps & {
  closeModal: () => void;
};

const ListPlayer = ({ closeModal }: ListPlayerProps) => {
  const { theme } = useThemeColor();
  const router = useRouter();
  const [isHappy, setIsHappy] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const audio = useSelector((state: RootState) => state.audio);
  const { audioInfo } = audio;
  const isInitialRender = useRef<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [items, setItems] = useState<GetItemsResItem[]>([]);
  const [params, setParams] = useState<GetItemsParams>({
    page: 1,
    password: "",
    path: "/",
    per_page: 1000,
    refresh: false,
  });

  const onFetch = async () => {
    try {
      setRefreshing(true);
      const { data } = await GetItems(params);
      setTotal(data.total);
      setItems([
        ...data.content.map((item) => {
          item.id = Math.random().toString();
          item.parent = params.path;
          // item.modified = dayjs(item.modified || Date.now()).format(
          //   "YYYY-MM-DD hh:ss"
          // );
          item.modifiedFormat = formatTimeAgo(item.modified);
          item.sizeFormat = formatFileSize(item.size);
          return item;
        }),
      ]);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  // 刷新
  const onRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setItems([]);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setParams({ ...params, page: 1 });
  };

  const handleItem = async (item: GetItemsResItem) => {
    if (refreshing) return;
    if (item.is_dir) {
      await storageManager.set(
        "parent_search_path",
        formatPath(item.parent || "/", item.name)
      );
      closeModal();
      router.replace("/catalog");
    } else if (isAudioFile(item.name)) {
      emitter.emit("onAudioChange", item);
      closeModal();
    } else {
      Alert.prompt("还未处理的文件格式。");
    }
  };

  useEffect(() => {
    if (!isInitialRender.current) {
      isInitialRender.current = true;
      return;
    }
    onFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (audioInfo.parent) {
      setParams({ ...params, path: audioInfo.parent });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioInfo]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={closeModal}>
          <IconSymbol
            color={theme.text}
            name="keyboard-arrow-down"
            size={Platform.OS === "android" ? 35 : 25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsHappy(!isHappy)}
          style={styles.right}
        >
          <ThemedText>
            {items.length}/{total}
          </ThemedText>
          <ThemedText style={{ fontWeight: "bold" }}>
            {isHappy ? "退出愉悦心情" : "愉悦心情"}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <ImageBackground
        style={[styles.backgroundImage, { opacity: isHappy ? 1 : 0.3 }]}
        src={audioInfo.cover}
      />
      <FlatList
        data={items}
        style={{
          paddingHorizontal: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IndexItem item={item} onPress={handleItem} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={Platform.select({
          ios: {
            paddingBottom: 80,
          },
          default: {
            paddingBottom: 10,
          },
        })}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export { ListPlayer, ListPlayerProps };
