import type { GetItemsResItem } from "@/api/api";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { formatFileSize, formatTimeAgo, getIconSymbol } from "@/utils/lib";
import { useTheme } from "@/hooks/useThemeColor";
import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";
import { IconSymbol } from "../ui";

interface ItemProps extends GetItemsResItem {
  index?: number;
}

export type IndexItemProps = ItemProps;

const IndexItem = (option: IndexItemProps) => {
  const { id, name, modified, is_dir, size, index, onPress } = option;
  const theme = useTheme();

  return (
    <TouchableOpacity
      key={id}
      style={styles.itemContainer}
      onPress={() => onPress && onPress(option, index)}
    >
      <ThemedView style={styles.leftContainer}>
        <IconSymbol
          size={26}
          name={getIconSymbol(name, is_dir)}
          color={theme.primary}
          style={styles.leftSymbol}
        />
        <View>
          <ThemedText
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14 }}
          >
            {name}
          </ThemedText>
          <ThemedText style={styles.size}>{formatFileSize(size)}</ThemedText>
        </View>
      </ThemedView>
      <ThemedView style={styles.rightContainer}>
        <ThemedText style={styles.timeStyle}>
          {formatTimeAgo(modified)}
        </ThemedText>
        <IconSymbol
          size={20}
          name={is_dir ? "keyboard-arrow-right" : "more-vert"}
        />
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 40,
  },
  size: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 300,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeStyle: {
    fontSize: 12,
    marginRight: 5,
  },
  leftSymbol: {
    marginRight: 5,
  },
});

export { IndexItem };
