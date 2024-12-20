import { HeaderBar } from "@/components/sys";
import { ThemedView } from "@/components/theme/ThemedView";
import { globalStyles } from "@/styles";
import type { RootStackParamList } from "@/types";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";

type WevViewRouteProp = RouteProp<RootStackParamList, "web-view">;

const MyWebComponent = () => {
  const route = useRoute<WevViewRouteProp>();
  const [src, setSrc] = useState("");
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const nav = useNavigation();

  const handleNavigationStateChange = (navState: any) => {
    console.log(navState.url);
    // 在这里添加你的逻辑来检查是否应该阻止加载某个 URL
    // 如果需要阻止，返回一个 false，否则不返回任何值或返回 true
    // if (navState.url.startsWith("some-unwanted-scheme://")) {
    //   return false; // 阻止加载
    // }

    // // 默认情况下不阻止加载
    // return true; // 可选，明确允许加载
    return false;
  };

  useEffect(() => {
    if (route && route.params) {
      const url = route.params.url;
      const option = new URL(url);
      setWhitelist([option.origin]);
      setTimeout(() => {
        setSrc(route.params.url);
        nav.setOptions({
          headerTitle: route.params.title,
        });
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ThemedView style={globalStyles.flex}>
      <HeaderBar />
      <WebView
        source={{ uri: src }}
        style={{ flex: 1 }}
        onShouldStartLoadWithRequest={handleNavigationStateChange}
        originWhitelist={whitelist}
      />
    </ThemedView>
  );
};

export default MyWebComponent;
