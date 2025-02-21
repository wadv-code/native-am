import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import type { GetItem } from "@/api";
import { GetItems } from "@/api/api";
import { useRouter } from "expo-router";
import { ThemedNavigation } from "../theme/ThemedNavigation";
import { formatPath, sleep } from "@/utils/lib";
import { CatalogItem } from "../catalog/CatalogItem";
import { Text } from "@rneui/themed";
import { setStorage } from "@/storage/long";
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  type TextProps,
} from "react-native";

type ListPlayerProps = TextProps & {
  closeModal: () => void;
};

const ListPlayer = ({ closeModal }: ListPlayerProps) => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const audio = useSelector((state: RootState) => state.audio);
  const { audioInfo } = audio;
  const [total, setTotal] = useState<number>(0);
  const [items, setItems] = useState<GetItem[]>([]);

  const onFetch = useCallback(async () => {
    try {
      setRefreshing(true);
      const params = {
        page: 1,
        password: "asmrgay",
        path: audioInfo.parent ?? "/",
        per_page: 1000,
        refresh: false,
      };
      const { data } = await GetItems(params);
      setTotal(data.total);
      setItems([...data.content]);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setRefreshing(false);
    }
  }, [audioInfo.parent]);

  // 刷新
  const onRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setItems([]);
    await sleep(300);
    onFetch();
  };

  const onLeftPress = async (item: GetItem) => {
    if (refreshing) return;
    if (item.is_dir) {
      await setStorage(
        "onCatalogChangePath",
        formatPath(item.parent || "/", item.name)
      );
      closeModal();
      router.replace("/catalog");
    }
  };

  useEffect(() => {
    if (audioInfo.parent) onFetch();
  }, [audioInfo.parent, onFetch]);

  return (
    <ThemedNavigation
      statusBar={true}
      isImage={true}
      opacity={0.2}
      isModal={true}
      onLeft={closeModal}
      leftIcon="keyboard-arrow-down"
      rightText={() => (
        <Text
          style={styles.rightText}
        >{`${items.length}条 共${total}条记录`}</Text>
      )}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatalogItem item={item} onLeftPress={onLeftPress} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={Platform.select({
          ios: {
            paddingBottom: 180,
          },
          default: {
            paddingBottom: 100,
          },
        })}
      />
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  rightText: {
    marginRight: 10,
    fontSize: 16,
  },
});

export { ListPlayer, ListPlayerProps };
