import { getImageServerItems, type ServerItem } from "@/components/mine/util";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { ThemedText } from "@/components/theme/ThemedText";
import { IconSymbol } from "@/components/ui";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { storageManager } from "@/storage";
import { globalStyles } from "@/styles";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

const ImageServer = () => {
  const router = useRouter();
  const bottom = useBottomTabOverflow();
  const [items, setItems] = useState<ServerItem[]>([]);

  const handleDelete = (item: ServerItem) => {
    console.log(item);
    Alert.alert(
      "Confirmation",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => storageManager.clear() },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = (item: ServerItem) => {
    console.log(item);
    router.push({
      pathname: "/views/image-server/image-server-edit",
      params: { id: item.id },
    });
  };

  const getItems = async () => {
    const list = await getImageServerItems();
    setItems([...list]);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <ThemedNavigation statusBar={true} isImage={true} title="图片服务器维护">
      <Animated.ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        {items.map((item, index) => {
          return (
            <View key={index} style={styles.item}>
              <View style={[globalStyles.rowBetween, styles.title]}>
                <ThemedText type="subtitle">{item.title}</ThemedText>
                <View style={[globalStyles.row, { gap: 10 }]}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <IconSymbol name="edit-document" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)}>
                    <IconSymbol name="delete-outline" />
                  </TouchableOpacity>
                </View>
              </View>
              <ThemedText>地址：{item.url}</ThemedText>
              <ThemedText>
                参数：{item.params.map((v) => `${v.key}=${v.value}`).join("&")}
              </ThemedText>
            </View>
          );
        })}
      </Animated.ScrollView>
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
  },
  title: {},
});

export default ImageServer;
