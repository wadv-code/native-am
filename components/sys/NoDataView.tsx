import { StyleSheet, View } from "react-native";
import { IconSymbol } from "../ui";
import { ThemedText } from "../theme/ThemedText";

const NoDataView = () => {
  return (
    <View style={styles.noDataContainer}>
      <IconSymbol name="playlist-remove" size={40} />
      <ThemedText style={styles.noDataText}>No data available</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    marginTop: 8,
    fontSize: 16,
    color: "#888",
  },
});

export { NoDataView };
