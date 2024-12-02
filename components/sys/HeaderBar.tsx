import { StyleSheet } from "react-native";
import { ThemedView } from "../theme/ThemedView";
import Constants from "expo-constants";

const HeaderBar = () => {
  return <ThemedView style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    height: Constants.statusBarHeight,
  },
});

export { HeaderBar };
