import type { GetItemsResItem } from "@/api/api";
import { ThemedText } from "../theme/ThemedText";
import { StyleSheet, View } from "react-native";
import { formatTimeAgo } from "@/utils";
import { ThemedView } from "../theme/ThemedView";
import { IconSymbol } from "../ui/IconSymbol";
import { useTheme } from "@/hooks/useThemeColor";

export function IndexItem({ name, modified, is_dir }: GetItemsResItem) {
  const theme = useTheme();
  return (
    <View style={styles.itemContainer}>
      <ThemedView style={styles.rowContainer}>
        <IconSymbol
          name="folder"
          color={theme.primary}
          style={styles.leftSymbol}
        />
        <ThemedText>{name}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.rowContainer}>
        <ThemedText style={styles.timeStyle}>
          {formatTimeAgo(modified)}
        </ThemedText>
        <IconSymbol name={is_dir ? "chevron.right" : "dot.scope"} />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  timeStyle: {
    fontSize: 12,
    marginRight: 5
  },
  leftSymbol: {
    marginRight: 5,
  },
});
