import { ThemedView } from "@/components/theme/ThemedView";
import { Text } from "@rneui/themed";
import { StyleSheet } from "react-native";

const AboutScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <Text>About</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AboutScreen;
