import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/theme/ThemedText";
import ParallaxView from "@/components/ParallaxView";

import {
  useBaseApi,
  type GetItemsParams,
  type GetItemsResItem,
} from "@/api/api";
import { IndexItem } from "@/components/index/IndexItem";

const { GetItems } = useBaseApi();

export default function HomeScreen() {
  const [params, setParams] = useState<GetItemsParams>({
    page: 1,
    password: "",
    path: "/asmr",
    per_page: 30,
    refresh: false,
  });

  const [items, setItems] = useState<GetItemsResItem[]>([]);

  const onFetch = async () => {
    try {
      const { data } = await GetItems(params);
      setItems(data.content);
      console.log(items.length);
    } catch {
      console.log("Request Error");
    }
  };

  useEffect(() => {
    onFetch();
  }, []);

  return (
    <ParallaxView>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </View>

      {/* <ThemedButton title="获取列表" onPress={onFetch} /> */}

      <FlatList
        data={items}
        renderItem={({ item }) => <IndexItem {...item} />}
        keyExtractor={(item) => item.name}
      />

      {/* 占位 */}

      <View style={{ height: 30, width: "100%" }}></View>
    </ParallaxView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
