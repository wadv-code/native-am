import React, { useEffect, useState } from "react";
import { HeaderBar } from "@/components/sys";
import { ThemedView } from "@/components/theme/ThemedView";
import { globalStyles } from "@/styles";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "expo-router";
import { WebView } from "react-native-webview";
import type { RootStackParamList } from "@/types";

type WevScreenRouteProp = RouteProp<RootStackParamList, "web-view">;

const WebScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<WevScreenRouteProp>();
  const [src, setSrc] = useState("");
  const nav = useNavigation();

  useEffect(() => {
    if (route && route.params) {
      const url = route.params.url;
      setSrc(url);
      nav.setOptions({
        headerTitle: route.params.title,
      });
    }
  }, [nav, route]);
  return (
    <ThemedView style={globalStyles.flex}>
      <HeaderBar />
      <WebView
        source={{ uri: src }}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      />
    </ThemedView>
  );
};

export default WebScreen;
