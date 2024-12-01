import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

import { ThemedView } from "../theme/ThemedView";
import { useTheme } from "@/hooks/useThemeColor";

const HeaderBar = () => {
  const theme = useTheme();
  return (
    <ThemedView>
      <StatusBar style="auto" />
      <ThemedView style={styles.container} />
      {/* <ThemedText>我是头部啊</ThemedText> */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
});

export { HeaderBar };
