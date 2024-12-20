import React, { memo } from "react";
import type { GetItem } from "@/api";
import { getIconSymbol, isAudioFile } from "@/utils/lib";
import { IconSymbol } from "../ui";
import { makeStyles, Text, useTheme } from "@rneui/themed";
import { useSelector } from "react-redux";
import { Alert, TouchableOpacity, View } from "react-native";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/useStore";
import { setAudioInfoAsync } from "@/store/slices/audioSlice";

type ItemProps = {
  item: GetItem;
  refreshId?: string;
  height?: number;
  showParent?: boolean;
  onIconPress?: (option: GetItem) => void;
  onLeftPress?: (option: GetItem) => void;
  onRightPress?: (option: GetItem) => void;
};

export type CatalogItemProps = ItemProps;

const CatalogItem = memo(
  (props: CatalogItemProps) => {
    const dispatch = useAppDispatch();
    const styles = useStyles(props);
    const { item, showParent } = props;
    const { is_collect } = item;
    const { onIconPress, onLeftPress, onRightPress } = props;
    const { theme } = useTheme();
    const { audioInfo } = useSelector((state: RootState) => state.audio);

    const onPress = () => {
      if (isAudioFile(item.name)) {
        dispatch(setAudioInfoAsync(item));
      } else if (item.is_dir) {
        onLeftPress && onLeftPress(item);
      } else {
        Alert.prompt("还未处理的文件格式。");
      }
    };

    return (
      <View key={item.id} style={styles.itemContainer}>
        <View
          style={[styles.line, { opacity: audioInfo.id === item.id ? 1 : 0 }]}
        />
        <TouchableOpacity style={styles.leftContainer} onPress={onPress}>
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
    paddingHorizontal: 10,
    position: "relative",
    height: props.height ?? 50,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 40,
  },
  title: {
    fontSize: 14,
    lineHeight: 16,
  },
  size: {
    fontSize: 13,
    marginRight: 5,
    fontFamily: "SpaceMono",
    letterSpacing: -1,
  },
  timeStyle: {
    fontSize: 12,
    marginTop: 3,
    color: theme.colors.primary,
    fontFamily: "SpaceMono",
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
