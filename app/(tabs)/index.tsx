import { HeaderBar } from "@/components/sys";
import { ThemedView } from "@/components/theme/ThemedView";
import { Text } from "@rneui/themed";
import { StyleSheet } from "react-native";
// import MineGrid from "@/components/mine/MineGrid";
// import { gridItems } from "@/components/mine/util";

const HomeScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <Text h1={true} style={{ textAlign: "center" }}>
        我的首页
      </Text>
      <Text style={{ textAlign: "center", marginTop: 100 }}>
        音频资源访问需要梯子，开发中测试关闭https即可
      </Text>
      {/* <MineGrid items={gridItems} title="我的功能" /> */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
