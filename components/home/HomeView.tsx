import { makeStyles, TabView, Text, useTheme } from "@rneui/themed";
import { ThemedView } from "../theme/ThemedView";
import { GetHotList, type GetHotListItem, type GetHotListRes } from "@/api/api";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { globalStyles } from "@/styles";
import { IconSymbol } from "../ui";
import { router } from "expo-router";

const HomeView = () => {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState<GetHotListRes>([]);

  const styles = useStyles();

  const onFetch = async () => {
    const { data } = await GetHotList();
    setItems([...data]);
  };

  const openPage = (item: GetHotListItem) => {
    router.push({
      pathname: "/views/web-view",
      params: { url: item.mobil_url, title: item.title },
    });
  };

  useEffect(() => {
    onFetch();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.scrollView}>
        <Animated.ScrollView scrollEventThrottle={16} horizontal={true}>
          {items.map((v, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                style={[globalStyles.rowCenter, styles.scrollViewItem]}
                onPress={() => setIndex(idx)}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        idx === index
                          ? theme.colors.primary
                          : theme.colors.grey0,
                    },
                  ]}
                >
                  {v.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      </View>

      <TabView
        containerStyle={{ flexGrow: 1 }}
        value={index}
        disableSwipe={true}
        onChange={setIndex}
      >
        {items.map((v, idx) => {
          return (
            <TabView.Item key={idx} style={{ width: "100%" }}>
              {index === idx && (
                <FlatList
                  data={v.data}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      key={`${idx.toString()}-${item.index.toString()}`}
                      style={[globalStyles.rowBetween, styles.listContentItem]}
                      onPress={() => openPage(item)}
                    >
                      <Text
                        style={[
                          styles.index,
                          {
                            color:
                              item.index <= 3
                                ? theme.colors.danger
                                : theme.colors.grey0,
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
                            style={{ marginLeft: 5 }}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.listContent}
                />
              )}
            </TabView.Item>
          );
        })}
      </TabView>
    </ThemedView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  scrollView: {
    borderBottomWidth: 1,
    borderColor: theme.colors.grey5,
  },
  scrollViewItem: {
    height: 50,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 100,
  },
  listContentItem: {
    overflow: "hidden",
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
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingLeft: 10,
  },
  index: {
    width: 35,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
}));

export { HomeView };
