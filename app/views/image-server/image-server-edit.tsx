import axios from "axios";
import Animated from "react-native-reanimated";
import { GetCover } from "@/api/api";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { IconSymbol } from "@/components/ui";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { globalStyles } from "@/styles";
import { IMAGE_DEFAULT_URL } from "@/utils";
import { isString } from "@/utils/helper";
import { Button, Image, Input, Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getImageServerItems,
  type ServerItem,
  type ServerItemParam,
} from "@/components/mine/util";
import { setStorage } from "@/storage/long";

const ImageServerEdit = () => {
  const info = useRouteInfo();
  const bottom = useBottomTabOverflow();
  const notParsing = useRef(false);
  const { theme } = useTheme();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [item, setItem] = useState<ServerItem>({
    id: "",
    title: "",
    url: "",
    params: [],
  });

  const getItem = async () => {
    const list = await getImageServerItems();
    const row = list.find((f) => f.id === info.params?.id);
    if (row) setItem(row);
  };

  const saveItem = async (id?: string) => {
    const list = await getImageServerItems();
    const index = list.findIndex((f) => f.id === id);
    if (index !== -1) {
      const row = list[index];
      list[index] = Object.assign(row, item);
    } else {
      if (!item.id) item.id = Date.now().toString();
      list.push({ ...item });
    }
    await setStorage("serverItems", list);
    handleBack();
  };

  const handleDelete = (index: number) => {
    item.params.splice(index, 1);
    setItem({ ...item });
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddParams = () => {
    item.params.push({
      key: "",
      value: "",
    });
    setItem({ ...item });
  };

  const handleSave = () => {
    saveItem(item.id);
  };

  const onInputChange = (
    v: ServerItemParam,
    key: "key" | "value",
    value: string
  ) => {
    v[key] = value;
    setItem({ ...item });
  };

  const onItemChange = (key: keyof ServerItem, value: string) => {
    setItem({ ...item, [key]: value });
  };

  const onBlur = () => {
    const option = new URL(analysis);
    const origin = option.origin; // 包括协议、主机名和端口（如果有的话）
    const pathname = option.pathname; // 路径部分
    const fullUrlWithoutParams = `${origin}${pathname}`;
    item.url = fullUrlWithoutParams;
    item.title = item.title || origin;
    // 提取参数部分
    const params: ServerItemParam[] = [];
    option.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });
    item.params = params;
    notParsing.current = true;
    setItem({ ...item });
  };

  const handleFetch = async () => {
    setLoading(true);
    const url = await GetCover(item);
    if (isString(url)) setUrl(url);
  };

  useEffect(() => {
    if (notParsing.current) {
      notParsing.current = false;
      return;
    }
    if (item.url) {
      const param: Recordable<string> = {};
      if (item) {
        item.params.forEach((v) => {
          param[v.key] = v.value;
        });
      } else {
        param.type = "json";
        param.mode = "8";
      }
      const url = axios.getUri({
        url: item ? item.url : IMAGE_DEFAULT_URL,
        method: "get",
        params: param,
      });
      setAnalysis(url);
    }
  }, [item]);

  useEffect(() => {
    getItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemedNavigation
      statusBar={true}
      title="图片服务器编辑"
      style={styles.container}
    >
      <Animated.ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Input
          value={item.title}
          placeholder="名称"
          onChangeText={(value) => onItemChange("title", value)}
          leftIcon={<Text>名称</Text>}
        />
        <Input
          value={item.url}
          placeholder="名称"
          onChangeText={(value) => onItemChange("url", value)}
          leftIcon={<Text>地址</Text>}
        />
        <View style={globalStyles.column}>
          {item.params.map((v, idx) => {
            return (
              <View
                key={idx}
                style={[globalStyles.rowBetween, { width: "100%" }]}
              >
                <View style={styles.paramInput}>
                  <Input
                    value={v.key}
                    onChangeText={(value) => onInputChange(v, "key", value)}
                    placeholder="key"
                    leftIcon={<Text>Key:</Text>}
                  />
                </View>
                <View style={styles.paramInput}>
                  <Input
                    value={v.value}
                    onChangeText={(value) => onInputChange(v, "value", value)}
                    placeholder="value"
                    leftIcon={<Text>Value:</Text>}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(idx)}
                  style={{ marginRight: 10 }}
                >
                  <IconSymbol name="delete-outline" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View>
          <Text style={{ marginLeft: 10 }}>解析网址：</Text>
          <Input
            value={analysis}
            placeholder="解析网址"
            multiline={true}
            onChangeText={(value) => setAnalysis(value)}
            onBlur={onBlur}
          />
        </View>

        <View style={[styles.action, globalStyles.rowAround]}>
          <Button color="warning" onPress={handleAddParams}>
            添加参数
          </Button>
          <Button color="secondary" loading={loading} onPress={handleFetch}>
            测试
          </Button>
          <Button onPress={handleSave}>保存编辑</Button>
        </View>

        {!!url && (
          <View>
            <TouchableOpacity
              style={[globalStyles.rowCenter, { marginVertical: 20 }]}
              onPress={() => setUrl("")}
            >
              <Image
                src={url}
                PlaceholderContent={
                  loading ? (
                    <ActivityIndicator
                      size={50}
                      style={globalStyles.screen}
                      color={theme.colors.primary}
                    />
                  ) : undefined
                }
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                containerStyle={styles.image}
              />
            </TouchableOpacity>
            <Text>路径：{url}</Text>
          </View>
        )}
      </Animated.ScrollView>
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  paramItem: {
    flexGrow: 1,
  },
  paramInput: {
    width: "40%",
  },
  action: {
    height: 40,
    gap: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
});

export default ImageServerEdit;
