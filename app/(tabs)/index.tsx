import { HeaderBar } from "@/components/sys";
import { ThemedView } from "@/components/theme/ThemedView";
import { Text } from "@rneui/themed";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <Text h1={true} style={{ textAlign: "center" }}>
        我是首页
      </Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
