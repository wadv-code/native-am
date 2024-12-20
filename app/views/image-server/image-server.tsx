import { getImageServerItems, type ServerItem } from "@/components/mine/util";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { IconSymbol } from "@/components/ui";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { removeStorage, setStorage } from "@/storage/long";
import { globalStyles } from "@/styles";
import { useIsFocused } from "@react-navigation/native";
import { Button, Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

const ImageServer = () => {
  const { theme } = useTheme();
  const bottom = useBottomTabOverflow();
  const isFocused = useIsFocused();
  const [items, setItems] = useState<ServerItem[]>([]);

  const handleDelete = (item: ServerItem, index: number) => {
    Alert.alert(
      "提示",
      `真的要删除《${item.title}》吗？`,
      [
        {
          text: "取消",
          onPress: () => console.log("取消"),
          style: "cancel",
        },
        { text: "确认删除", onPress: () => handleRemove(index) },
      ],
      { cancelable: false }
    );
  };

  const handleRemove = (index: number) => {
    items.splice(index, 1);
    const list = [...items];
    setItems(list);
    if (list.length) setStorage("serverItems", list);
    else removeStorage("serverItems");
  };

  const handleEdit = (item: ServerItem) => {
    router.push({
      pathname: "/views/image-server/image-server-edit",
      params: { id: item.id },
    });
  };

  const handleDefault = (item: ServerItem) => {
    items.forEach((v) => {
      v.isDefault = false;
    });
    item.isDefault = true;
    const list = [...items];
    setItems(list);
    setStorage("serverItems", list);
  };

  const handleAdd = () => {
    router.push("/views/image-server/image-server-edit");
  };

  const getItems = async () => {
    const list = await getImageServerItems();
    setItems([...list]);
  };

  useEffect(() => {
    if (isFocused) getItems();
  }, [isFocused]);

  return (
    <ThemedNavigation statusBar={true} title="图片服务器维护">
      <Animated.ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        {items.map((item, index) => {
          return (
            <View key={index} style={styles.item}>
              <View style={globalStyles.rowBetween}>
                <Text h4={true}>{item.title}</Text>
                <View style={[globalStyles.row, { gap: 10 }]}>
                  <TouchableOpacity onPress={() => handleDefault(item)}>
                    <IconSymbol
                      name={
                        item.isDefault
                          ? "radio-button-checked"
                          : "radio-button-unchecked"
                      }
                      color={
                        item.isDefault
                          ? theme.colors.primary
                          : theme.colors.grey0
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <IconSymbol name="edit-document" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item, index)}>
                    <IconSymbol name="delete-outline" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text>地址：{item.url}</Text>
              <Text style={{ color: theme.colors.warning }}>
                参数：{item.params.map((v) => `${v.key}=${v.value}`).join("&")}
              </Text>
            </View>
          );
        })}
      </Animated.ScrollView>
      <View style={styles.action}>
        <Button color="warning" onPress={handleAdd}>
          新增服务器
        </Button>
      </View>
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
  },
  action: {
    padding: 20,
  },
});

export default ImageServer;
