import { HomeView } from "@/components/home/HomeView";
import { HeaderBar } from "@/components/sys";
import { ThemedView } from "@/components/theme/ThemedView";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <HomeView />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
