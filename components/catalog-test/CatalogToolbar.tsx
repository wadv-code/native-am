import { StyleSheet, View } from "react-native";
import React from "react";
import { CatalogAction } from "./CatalogAction";
import type { ActionSortOrder } from "@/types";
import { CatalogCrumbs, type CatalogCrumbItem } from "./CatalogCrumbs";

type ToolbarProps = {
  rightText: string;
  items: CatalogCrumbItem[];
  onSortOrder?: (order: ActionSortOrder) => void;
};

const CatalogToolbar = (props: ToolbarProps) => {
  const { rightText, items, onSortOrder } = props;

  return (
    <View style={styles.container}>
      <CatalogCrumbs items={items} />
      <CatalogAction
        rightText={rightText}
        title="精选"
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
