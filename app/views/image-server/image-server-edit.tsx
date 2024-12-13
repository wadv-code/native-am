import { getImageServerItems, type ServerItem } from "@/components/mine/util";
import { ThemedInput } from "@/components/theme/ThemedInput";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { ThemedText } from "@/components/theme/ThemedText";
import { IconSymbol } from "@/components/ui";
import { globalStyles } from "@/styles";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ImageServerEdit = () => {
  const [item, setItem] = useState<ServerItem>({
    id: "",
    title: "",
    url: "",
    params: [],
  });

  const getItem = async () => {
    const list = await getImageServerItems();
    const row = list.find((f) => f.isDefault);
    if (row) setItem(row);
  };

  const handleDelete = (index: number) => {
    item.params.splice(index, 1);
    setItem({ ...item });
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <ThemedNavigation statusBar={true} isImage={true} title="图片服务器编辑">
      <View style={[globalStyles.row, styles.formItem]}>
        <ThemedText>名称：</ThemedText>
        <ThemedInput
          value={item.title}
          placeholder="名称"
          style={globalStyles.flexGrow}
        />
      </View>
      <View style={[globalStyles.row, styles.formItem]}>
        <ThemedText>地址：</ThemedText>
        <ThemedInput
          value={item.url}
          placeholder="名称"
          style={globalStyles.flexGrow}
        />
      </View>
      <View style={[globalStyles.column, styles.formItem]}>
        {item.params.map((v, idx) => {
          return (
            <View
              key={idx}
              style={[{ width: "100%" }, globalStyles.rowBetween]}
            >
              <ThemedText>key:</ThemedText>
              <ThemedInput
                style={styles.paramInput}
                value={v.key}
                placeholder="key"
              />
              <ThemedText>value:</ThemedText>
              <ThemedInput
                style={styles.paramInput}
                value={v.value}
                placeholder="value"
              />
              <TouchableOpacity onPress={() => handleDelete(idx)}>
                <IconSymbol name="delete" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
  },
  title: {},
  formItem: {
    paddingHorizontal: 10,
  },
  paramInput: {
    width: "32%",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    margin: 0,
  },
});

export default ImageServerEdit;
