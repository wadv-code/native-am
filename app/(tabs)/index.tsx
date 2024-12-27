import { HeaderBar } from "@/components/sys";
import { Toast } from "@/components/theme";
import { ThemedView } from "@/components/theme/ThemedView";
import { Button, Text } from "@rneui/themed";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  const openToast = () => {
    Toast.info("测试数据", "top");
  };
  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <Text h1={true} style={{ textAlign: "center" }}>
        我是首页
      </Text>
      <Button onPress={openToast}>到头了</Button>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
