import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/theme/ThemedButton";
import {
  useBaseApi,
  type GetItemsParams,
  type GetItemsResItem,
} from "@/api/api";

const { GetItems } = useBaseApi();

// const Item = ({ name }: GetItemsResItem) => (
//   <View>
//     <Text>{name}</Text>
//   </View>
// );

export default function HomeScreen() {
  const [params, setParams] = useState<GetItemsParams>({
    page: 1,
    password: "",
    path: "/",
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

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedButton title="获取列表" onPress={onFetch} />

      {/* <FlatList
        data={items}
        renderItem={({ item }) => <Item name={item.name} />}
        keyExtractor={(item) => item.name}
      /> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
