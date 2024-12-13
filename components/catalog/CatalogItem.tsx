import type { GetItemsResItem } from "@/api";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { getIconSymbol } from "@/utils/lib";
import { IconSymbol } from "../ui";
import React from "react";
import { Text, useTheme } from "@rneui/themed";

type ItemProps = {
  item: GetItemsResItem;
  onPress: (option: GetItemsResItem) => void;
};

export type CatalogItemProps = ItemProps;

const CatalogItem = React.memo(
  (option: CatalogItemProps) => {
    const { item, onPress } = option;
    const { id, name, is_dir, sizeFormat, modifiedFormat } = item;
    const { theme } = useTheme();
    return (
      <View key={id} style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => onPress && onPress(item)}
        >
          <IconSymbol
            size={26}
            name={getIconSymbol(name, is_dir)}
            color={theme.colors.primary}
            style={styles.leftSymbol}
          />
          <View>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
              {name}
            </Text>
            <Text style={styles.size}>{sizeFormat}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightContainer}>
          <Text style={styles.timeStyle}>{modifiedFormat}</Text>
          <IconSymbol
            size={24}
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
    paddingVertical: 7,
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
  },
  leftSymbol: {
    marginRight: 5,
  },
});

CatalogItem.displayName = "CatalogItem";

export { CatalogItem };
