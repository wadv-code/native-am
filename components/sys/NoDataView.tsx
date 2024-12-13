import { StyleSheet, View } from "react-native";
import { IconSymbol } from "../ui";
import { Text } from "@rneui/themed";

const NoDataView = () => {
  return (
    <View style={styles.noDataContainer}>
      <IconSymbol name="playlist-remove" size={40} />
      <Text style={styles.noDataText}>No data available</Text>
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
