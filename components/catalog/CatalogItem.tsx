import React, { memo } from "react";
import type { GetItemsResItem } from "@/api";
import { getIconSymbol } from "@/utils/lib";
import { IconSymbol } from "../ui";
import { makeStyles, Text, useTheme } from "@rneui/themed";
import { useSelector } from "react-redux";
import { TouchableOpacity, View } from "react-native";
import type { RootState } from "@/store";

type ItemProps = {
  item: GetItemsResItem;
  refreshId?: string;
  height?: number;
  showParent?: boolean;
  onIconPress?: (option: GetItemsResItem) => void;
  onLeftPress?: (option: GetItemsResItem) => void;
  onRightPress?: (option: GetItemsResItem) => void;
};

export type CatalogItemProps = ItemProps;

const CatalogItem = memo(
  (props: CatalogItemProps) => {
    const styles = useStyles(props);
    const { item, showParent } = props;
    const { is_collect } = item;
    const { onIconPress, onLeftPress, onRightPress } = props;
    const { theme } = useTheme();
    const { audioInfo } = useSelector((state: RootState) => state.audio);

    return (
      <View key={item.id} style={styles.itemContainer}>
        <View
          style={[styles.line, { opacity: audioInfo.id === item.id ? 1 : 0 }]}
        />
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => onLeftPress && onLeftPress(item)}
        >
          <IconSymbol
            size={24}
            name={getIconSymbol(item.name, item.is_dir)}
            color={theme.colors.primary}
            style={styles.leftSymbol}
          />
          <View>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
              {item.name}
            </Text>
            <Text style={styles.timeStyle}>
              {showParent ? item.parent : item.modifiedFormat}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.rightContainer}>
          <Text style={styles.size}>{item.sizeFormat}</Text>
          <TouchableOpacity onPress={() => onIconPress && onIconPress(item)}>
            <IconSymbol
              size={24}
              name={is_collect ? "star" : "star-border"}
              color={is_collect ? theme.colors.primary : theme.colors.grey0}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRightPress && onRightPress(item)}>
            <IconSymbol
              size={24}
              name={item.is_dir ? "keyboard-arrow-right" : "more-vert"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    if (nextProps.refreshId === nextProps.item.id) {
      return false;
    }
    return prevProps.item.id === nextProps.item.id;
  }
);

const useStyles = makeStyles((theme, props: CatalogItemProps) => ({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    position: "relative",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: props.height ?? 50,
    paddingRight: 40,
  },
  title: {
    fontSize: 14,
    lineHeight: 16,
  },
  size: {
    fontSize: 12,
    marginRight: 5,
    color: theme.colors.primary,
  },
  timeStyle: {
    fontSize: 12,
    marginTop: 3,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSymbol: {
    marginRight: 7,
  },
  line: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    height: "100%",
    width: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
}));

CatalogItem.displayName = "CatalogItem";

export { CatalogItem };
