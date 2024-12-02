import { useEffect, useState } from "react";
import { IndexItem } from "@/components/index/IndexItem";
import ParallaxView from "@/components/ParallaxView";
import { HeaderToolbar } from "@/components/sys";
import { formatPath, isAudioFile } from "@/utils/lib";
import { emitter } from "@/utils/mitt";
import { storageManager } from "@/storage";
import {
  FlatList,
  BackHandler,
  Platform,
  RefreshControl,
  ToastAndroid,
  Alert,
} from "react-native";
import {
  useBaseApi,
  type GetItemsParams,
  type GetItemsResItem,
} from "@/api/api";

const { GetItems } = useBaseApi();

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedName, setSelectedName] = useState<string>();
  const [historyItems, setHistoryItems] = useState<GetItemsParams[]>([]);
  const [items, setItems] = useState<GetItemsResItem[]>([]);

  const [params, setParams] = useState<GetItemsParams>({
    name: "",
    page: 1,
    password: "",
    path: "/",
    per_page: 30,
    refresh: false,
  });

  const onFetch = async (refresh?: boolean) => {
    try {
      setRefreshing(true);
      const { data } = await GetItems(params, refresh);
      data.content.forEach((item) => {
        item.parent = params.path;
      });
      setItems(data.content);
      refresh && ToastAndroid.show("刷新成功。", 1000);
    } catch {
      console.log("Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  // 刷新
  const onRefresh = async () => {
    onFetch(true);
  };

  const handleItem = (item: GetItemsResItem) => {
    setSelectedName(item.name);
    if (item.is_dir) {
      params.name = item.name;
      params.path = formatPath(params.path, item.name);
      historyItems.push({ ...params });
      onFetch();
      storageManager.set("history_items", historyItems);
    } else if (isAudioFile(item.name)) {
      emitter.emit("onAudioChange", item);
    } else {
      Alert.prompt("还未处理的文件格式。");
    }
  };

  const toHistory = (history?: GetItemsParams) => {
    if (history) {
      if (history.path === params.path) return;
      const index = historyItems.findIndex((f) => f.path === history.path);
      if (index > -1) setHistoryItems([...historyItems.slice(0, index + 1)]);
      params.path = history ? history.path : "/";
      params.name = history.name;
      onFetch();
    } else {
      setHistoryItems([]);
      params.path = "/";
      onFetch();
    }
    return historyItems;
  };

  useEffect(() => {
    const backAction = () => {
      const history = historyItems[historyItems.length - 2];
      if (history) toHistory(history);
      else if (historyItems.length === 1) toHistory();
      return true;
    };
    // 注册返回事件监听
    BackHandler.addEventListener("hardwareBackPress", backAction);
    // 组件卸载时移除监听
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  });

  const onFetchHistoryItems = async () => {
    const list = (await storageManager.get("history_items")) || [];
    const lastParams = list[list.length - 1];
    if (lastParams) {
      params.path = lastParams.path;
      params.name = lastParams.name;
      setParams({ ...lastParams });
    }
    setHistoryItems(list);
    onFetch();
  };

  useEffect(() => {
    onFetchHistoryItems();
  }, []);

  return (
    <ParallaxView>
      <HeaderToolbar
        items={historyItems}
        name={selectedName}
        onPress={toHistory}
        onRoot={() => toHistory()}
      />
      <FlatList
        data={items}
        renderItem={({ item }) => <IndexItem {...item} onPress={handleItem} />}
        keyExtractor={(item) => item.name}
        extraData={selectedName}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={Platform.select({
          ios: {
            paddingBottom: 120,
          },
          default: {
            paddingBottom: 60,
          },
        })}
      />
    </ParallaxView>
  );
}
