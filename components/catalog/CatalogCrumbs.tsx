import { globalStyles } from "@/styles";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui";
import Animated from "react-native-reanimated";
import { Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";

type CatalogCrumbItem = {
  name: string;
  path: string;
  selectedName?: string;
  text?: string;
};

type CatalogCrumbsProps = {
  item?: CatalogCrumbItem;
  items: CatalogCrumbItem[];
  search?: boolean;
  onPress?: (index: number) => void;
};

const CatalogCrumbs = (props: CatalogCrumbsProps) => {
  const { item, items, search, onPress } = props;

  const { theme } = useTheme();

  const openSearch = () => {
    router.navigate({
      pathname: "/views/search",
      params: {
        path: item?.path || "/",
      },
    });
  };

  const onChange = (index: number) => {
    onPress && onPress(index);
  };

  const getColor = (v: CatalogCrumbItem) => {
    return item?.path === v.path ? theme.colors.primary : theme.colors.grey0;
  };

  return (
    <View style={globalStyles.row}>
      <TouchableOpacity onPress={() => onChange(0)}>
        <IconSymbol
          size={24}
          color={getColor({ name: "", path: "/" })}
          name="snippet-folder"
        />
      </TouchableOpacity>
      <Animated.ScrollView
        scrollEventThrottle={16}
        style={{ height: 40 }}
        horizontal={true}
        contentContainerStyle={styles.scrollView}
      >
        {items
          .filter((f) => f.name)
          .map((v, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.breadcrumb}
                onPress={() => onChange(index + 1)}
              >
                <IconSymbol
                  size={16}
                  style={{ marginHorizontal: 3 }}
                  color={getColor(v)}
                  name="arrow-right"
                />
                <Text style={[styles.text, { color: getColor(v) }]}>
                  {v.name}
                </Text>
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
    fontFamily: "SpaceMono",
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
