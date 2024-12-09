import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { StyleSheet } from "react-native";

const AboutScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">About</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AboutScreen;
