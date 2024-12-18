import { globalStyles } from "@/styles";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui";
import Animated from "react-native-reanimated";
import { useEffect } from "react";
import { Text } from "@rneui/themed";
import { router } from "expo-router";
import { formatPath } from "@/utils/lib";

type CatalogCrumbItem = {
  name: string;
  path: string;
};

type CatalogCrumbsProps = {
  items: CatalogCrumbItem[];
  search?: boolean;
  onPress?: (item: CatalogCrumbItem, index: number) => void;
};

const CatalogCrumbs = (props: CatalogCrumbsProps) => {
  const { items, search, onPress } = props;
  const onRoot = () => {};

  const openSearch = () => {
    const path = formatPath(items.map((v) => v.name).join("/"));
    console.log(path);
    router.navigate({
      pathname: "/views/search",
      params: {
        path: path ?? "/",
      },
    });
  };

  useEffect(() => {
    // splitToItems(path);
  }, [items]);

  return (
    <View style={globalStyles.row}>
      <TouchableOpacity onPress={onRoot}>
        <IconSymbol size={24} name="snippet-folder" />
      </TouchableOpacity>
      <Animated.ScrollView
        scrollEventThrottle={16}
        style={{ height: 40 }}
        horizontal={true}
        contentContainerStyle={styles.scrollView}
      >
        {items
          .filter((f) => f.name)
          .map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.breadcrumb}
                onPress={() => onPress && onPress(item, index)}
              >
                <IconSymbol
                  size={16}
                  style={{ marginHorizontal: 3 }}
                  name="arrow-right"
                />
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
      </Animated.ScrollView>
      {search && (
        <TouchableOpacity style={styles.searchIcon} onPress={openSearch}>
          <Text style={{ fontSize: 16 }}>🔍搜索</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  icon: {
    marginLeft: 5,
    marginRight: 5,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbar: {
    width: "22%",
    gap: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  searchIcon: {
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  scrollView: {
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export { CatalogCrumbs, CatalogCrumbsProps, CatalogCrumbItem };
