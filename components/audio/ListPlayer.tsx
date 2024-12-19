import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEffect, useRef, useState } from "react";
import type { GetItemsParams, GetItem } from "@/api";
import { GetItems } from "@/api/api";
import { emitter } from "@/utils/mitt";
import { useRouter } from "expo-router";
import { ThemedNavigation } from "../theme/ThemedNavigation";
import { formatPath, isAudioFile } from "@/utils/lib";
import { CatalogItem } from "../catalog/CatalogItem";
import { Text } from "@rneui/themed";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  type TextProps,
} from "react-native";
import { setStorage } from "@/storage/long";

type ListPlayerProps = TextProps & {
  closeModal: () => void;
};

const ListPlayer = ({ closeModal }: ListPlayerProps) => {
  const router = useRouter();
  const [isHappy, setIsHappy] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const audio = useSelector((state: RootState) => state.audio);
  const { audioInfo } = audio;
  const isInitialRender = useRef<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [items, setItems] = useState<GetItem[]>([]);
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
      setItems([...data.content]);
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

  const onLeftPress = async (item: GetItem) => {
    if (refreshing) return;
    if (item.is_dir) {
      await setStorage(
        "parentSearchPath",
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
    <ThemedNavigation
      statusBar={true}
      isImage={true}
      style={styles.viewContainer}
      onLeft={closeModal}
      isHappy={isHappy}
      leftIcon="keyboard-arrow-down"
      rightText={
        <Text
          style={styles.rightText}
        >{`${items.length}条 共${total}条记录`}</Text>
      }
      onRight={() => setIsHappy(!isHappy)}
    >
      <FlatList
        data={items}
        style={{
          paddingHorizontal: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatalogItem item={item} onLeftPress={onLeftPress} />
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
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  rightText: {
    marginRight: 10,
    fontSize: 16,
  },
});

export { ListPlayer, ListPlayerProps };
