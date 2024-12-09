import type { GetItemsResItem } from "@/api";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { getIconSymbol } from "@/utils/lib";
import { useTheme } from "@/hooks/useThemeColor";
import { ThemedText } from "../theme/ThemedText";
import { IconSymbol } from "../ui";
import React from "react";

type ItemProps = {
  item: GetItemsResItem;
  height?: number;
  onPress: (option: GetItemsResItem) => void;
};

export type IndexItemProps = ItemProps;

const IndexItem = React.memo(
  (option: IndexItemProps) => {
    const { item, height = 50, onPress } = option;
    const { id, name, is_dir, sizeFormat, modifiedFormat } = item;
    const theme = useTheme();
    return (
      <View key={id} style={[styles.itemContainer, { height }]}>
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => onPress && onPress(item)}
        >
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
              style={styles.title}
            >
              {name}
            </ThemedText>
            <ThemedText style={styles.size}>{sizeFormat}</ThemedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightContainer}>
          <ThemedText style={styles.timeStyle}>{modifiedFormat}</ThemedText>
          <IconSymbol
            size={20}
            name={is_dir ? "keyboard-arrow-right" : "more-vert"}
          />
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // 如果item的id没有改变，则不需要重新渲染
    return prevProps.item.id === nextProps.item.id;
  }
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  size: {
    fontSize: 12,
    marginTop: 5,
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

IndexItem.displayName = "IndexItem";

export { IndexItem };
