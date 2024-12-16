import React from "react";
import type { GetItemsResItem } from "@/api";
import { getIconSymbol } from "@/utils/lib";
import { IconSymbol } from "../ui";
import { Text, useTheme } from "@rneui/themed";
import { useSelector } from "react-redux";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { RootState } from "@/store";

type ItemProps = {
  item: GetItemsResItem;
  showParent?: boolean;
  onPress: (option: GetItemsResItem) => void;
};

export type CatalogItemProps = ItemProps;

const CatalogItem = React.memo(
  (option: CatalogItemProps) => {
    const { item, showParent, onPress } = option;
    const { id, name, is_dir, sizeFormat, modifiedFormat } = item;
    const { theme } = useTheme();
    const { audioInfo } = useSelector((state: RootState) => state.audio);

    return (
      <View key={id} style={styles.itemContainer}>
        <View
          style={[
            styles.line,
            {
              backgroundColor: theme.colors.primary,
              opacity: audioInfo.id === item.id ? 1 : 0,
            },
          ]}
        />
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => onPress && onPress(item)}
        >
          <IconSymbol
            size={26}
            name={getIconSymbol(item.name, is_dir)}
            color={theme.colors.primary}
            style={styles.leftSymbol}
          />
          <View>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
              {name}
            </Text>
            <Text style={styles.size}>
              {showParent ? item.parent : sizeFormat}
            </Text>
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
    paddingHorizontal: 7,
    position: "relative",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 40,
    paddingVertical: 7,
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
  line: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    height: "100%",
    width: 4,
    borderRadius: 2,
  },
});

CatalogItem.displayName = "CatalogItem";

export { CatalogItem };
