import { globalStyles } from "@/styles";
import { TouchableOpacity, type ViewProps } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { IconSymbol } from "../ui";
import { useEffect, useState } from "react";
import type {
  ActionOrder,
  ActionSort,
  ActionSortOrder,
  MaterialIconsName,
} from "@/types";
import { Text } from "@rneui/themed";
import { orders, sorts } from "@/utils";
import { getSortOrder } from "@/utils/common";
import { setStorage } from "@/storage/long";

type CatalogActionProps = ViewProps & {
  title?: string;
  rightText?: string;
  onSortOrder?: (order: ActionSortOrder) => void;
};

const CatalogAction = ({
  style,
  title,
  rightText,
  onSortOrder,
}: CatalogActionProps) => {
  const [sort, setSort] = useState<ActionSort>("descending");
  const [order, setOrder] = useState<ActionOrder>("time");

  const onOrder = () => {
    const index = orders.findIndex((f) => f === order);
    const orderString = orders[index + 1];
    const value = orderString ?? orders[0];
    setOrder(value);
    setStorage("orderString", value);
    onSortOrder && onSortOrder({ sort, order: value });
  };

  const onSort = () => {
    const index = sorts.findIndex((f) => f === sort);
    const sortString = sorts[index + 1];
    const value = sortString ?? sorts[0];
    setSort(value);
    setStorage("sortString", value);
    onSortOrder && onSortOrder({ sort: value, order });
  };

  const getOrderIcon: () => MaterialIconsName = () => {
    const icons: Record<ActionSort, MaterialIconsName> = {
      ascending: "arrow-upward",
      descending: "arrow-downward",
    };
    return icons[sort];
  };

  useEffect(() => {
    (async () => {
      const option = await getSortOrder();
      setOrder(option.order);
      setSort(option.sort);
    })();
  }, []);

  return (
    <View style={[globalStyles.rowBetween, style]}>
      <Text
        style={[styles.smallText, { width: "63%" }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <View style={styles.action}>
        <Text style={styles.smallText}>{rightText}</Text>
        <TouchableOpacity style={globalStyles.row} onPress={onOrder}>
          <IconSymbol
            style={{ marginRight: 3 }}
            size={16}
            name="sort-by-alpha"
          />
          <Text style={styles.smallText}>{order}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSort}>
          <IconSymbol size={18} name={getOrderIcon()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  action: {
    width: "22%",
    gap: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  smallText: {
    fontSize: 14,
    textTransform: "capitalize",
    fontFamily: "SpaceMono",
  },
});

export { CatalogAction, CatalogActionProps };
