import React from "react";
import type { GetItemsResItem } from "@/api";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import { getIconSymbol } from "@/utils/lib";
import { IconSymbol } from "../ui";

type ItemProps = {
  item: GetItemsResItem;
  onPress: (option: GetItemsResItem) => void;
};

export type SearchItemProps = ItemProps;

const SearchItem = React.memo(
  (option: SearchItemProps) => {
    const { item, onPress } = option;
    const { id, name, is_dir, parent, sizeFormat } = item;
    const { theme } = useTheme();

    return (
      <TouchableOpacity
        key={id}
        style={styles.itemContainer}
        onPress={() => onPress && onPress(item)}
      >
        <View style={styles.leftContainer}>
          <IconSymbol
            size={26}
            name={getIconSymbol(name, is_dir)}
            color={theme.colors.primary}
            style={styles.leftSymbol}
          />
          <View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ fontSize: 14 }}
            >
              {name}
            </Text>
            <Text style={[styles.size, { color: theme.colors.primary }]}>
              {parent}
            </Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.timeStyle}>{sizeFormat}</Text>
          <IconSymbol
            size={20}
            name={is_dir ? "keyboard-arrow-right" : "more-vert"}
          />
        </View>
      </TouchableOpacity>
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
    marginTop: 3,
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

SearchItem.displayName = "SearchItem";

export { SearchItem };
