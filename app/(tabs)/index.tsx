import { HeaderBar } from "@/components/sys";
import { Button, FAB } from "@rneui/themed";
import { ThemedView } from "@/components/theme/ThemedView";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { useTheme } from "@rneui/themed";

const HomeScreen = () => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);
  return (
    <ThemedView style={styles.container}>
      <HeaderBar />
      <Button title="Solid" />
      <Button title="Outline" type="outline" />
      <Button title="Clear" type="clear" onPress={() => setVisible(!visible)} />
      {/* <Button containerStyle={styles.floatBtn}>
        <IconSymbol name="keyboard-arrow-up" color="white" />
      </Button> */}
      <FAB
        visible={visible}
        icon={{ name: "keyboard-arrow-up", color: "white" }}
        size="small"
        color={theme.colors.primary}
        style={styles.floatBtn}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
    position: "relative",
  },
  floatBtn: {
    position: "absolute",
    right: 10,
    bottom: 70,
    borderRadius: 24,
  },
});

export default HomeScreen;
