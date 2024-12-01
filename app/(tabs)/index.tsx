import { useEffect, useState } from "react";
import { IndexItem } from "@/components/index/IndexItem";
import { FlatList, Platform, SafeAreaView } from "react-native";
import ParallaxView from "@/components/ParallaxView";
import { HeaderToolbar } from "@/components/sys";
import {
  useBaseApi,
  type GetItemsParams,
  type GetItemsResItem,
} from "@/api/api";

const { GetItems } = useBaseApi();

export default function HomeScreen() {
  const [selectedName, setSelectedName] = useState<string>();
  const [params, setParams] = useState<GetItemsParams>({
    page: 1,
    password: "",
    path: "/asmr/中文音声",
    per_page: 1000,
    refresh: false,
  });

  const [items, setItems] = useState<GetItemsResItem[]>([]);

  const onFetch = async () => {
    try {
      const { data } = await GetItems(params);
      setItems(data.content);
    } catch {
      console.log("Request Error");
    }
  };

  useEffect(() => {
    onFetch();
  }, []);

  return (
    <ParallaxView>
      <HeaderToolbar path={params.path} name={selectedName} />

      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <IndexItem
              {...item}
              onPress={(item) => setSelectedName(item.name)}
            />
          )}
          keyExtractor={(item) => item.name}
          extraData={selectedName}
          contentContainerStyle={Platform.select({
            ios: {
              paddingBottom: 120,
            },
            default: {
              paddingBottom: 50,
            },
          })}
        />
      </SafeAreaView>
    </ParallaxView>
  );
}
