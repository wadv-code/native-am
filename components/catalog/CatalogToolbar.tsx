import { StyleSheet, View } from "react-native";
import React from "react";
import { CatalogAction } from "./CatalogAction";
import type { ActionSortOrder } from "@/types";
import { CatalogCrumbs, type CatalogCrumbItem } from "./CatalogCrumbs";

type ToolbarProps = {
  items: CatalogCrumbItem[];
  item?: CatalogCrumbItem;
  search?: boolean;
  onChangeView?: (index: number) => void;
  onSortOrder?: (order: ActionSortOrder) => void;
};

const CatalogToolbar = (props: ToolbarProps) => {
  const { item, items, search, onChangeView, onSortOrder } = props;

  return (
    <View style={styles.container}>
      <CatalogCrumbs
        onPress={onChangeView}
        item={item}
        items={items}
        search={search}
      />
      <CatalogAction
        rightText={item?.text ?? ""}
        title={item?.name || "精选"}
        onSortOrder={onSortOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export { CatalogToolbar };
