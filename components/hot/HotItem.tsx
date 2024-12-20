import type { GetHotListItem } from "@/api/api";
import { Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import { IconSymbol } from "../ui";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from "react-native";

type HotItemProps = TouchableOpacityProps & {
  item: GetHotListItem;
  index: number;
};

const HotItem = (props: HotItemProps) => {
  const { theme } = useTheme();
  const { item, index } = props;

  const openPage = () => {
    router.push({
      pathname: "/views/web",
      params: { url: item.mobil_url, title: item.title },
    });
  };

  return (
    <TouchableOpacity
      key={`${index}_${item.title}`}
      style={styles.listContentItem}
      onPress={openPage}
    >
      <Text
        style={[
          styles.index,
          {
            color: item.index <= 3 ? theme.colors.danger : theme.colors.grey0,
          },
        ]}
      >
        {item.index}.
      </Text>
      <Text style={styles.title}>{item.title}</Text>
      {item.hot && (
        <View style={styles.hot}>
          <Text>{item.hot}</Text>
          <IconSymbol
            size={12}
            color={theme.colors.danger}
            name="whatshot"
            style={{ marginLeft: 5, marginTop: 2 }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listContentItem: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingRight: 5,
  },
  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    flexWrap: "wrap",
  },
  hot: {
    flexShrink: 0,
    flexDirection: "row",
    paddingLeft: 10,
  },
  index: {
    width: 35,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export { HotItem, HotItemProps };
