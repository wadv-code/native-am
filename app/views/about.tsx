import { HeaderBar } from "@/components/sys";
import { Text } from "@rneui/themed";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { StyleSheet } from "react-native";

const AboutScreen = () => {
  return (
    <ThemedNavigation style={styles.container} statusBar={true}>
      <HeaderBar />
      <Text h1={true}>AboutScreen</Text>
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
    gap: 10,
  },
});

export default AboutScreen;
