import { makeStyles } from "@rneui/themed";
import { GetHotList, type GetHotListRes } from "@/api/api";
import { useEffect, useState } from "react";
import { getStorage, setStorage } from "@/storage/long";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { HotTabs } from "@/components/hot/HotTabs";
import { HotTabView } from "@/components/hot/HotTabView";

const HotScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState<GetHotListRes>([]);

  const styles = useStyles();

  const onFetch = async (refresh?: boolean) => {
    try {
      setRefreshing(true);
      const HotScreenName = await getStorage("HotScreen", "");
      const { data } = await GetHotList(refresh);
      const idx = data.findIndex((f) => f.name === HotScreenName);
      if (idx !== -1) setIndex(idx);
      setItems([...data]);
    } catch {
      return Promise.reject("onFetch Request Error");
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    onFetch(true);
  };

  useEffect(() => {
    const item = items[index];
    if (item) setStorage("HotScreen", item.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    onFetch();
  }, []);

  return (
    <ThemedNavigation
      title="热搜聚合"
      style={styles.container}
      statusBar={true}
      onRight={onRefresh}
    >
      <HotTabs index={index} items={items} onChange={setIndex} />
      <HotTabView
        items={items}
        index={index}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </ThemedNavigation>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
}));

export default HotScreen;
