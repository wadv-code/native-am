import { IconSymbol } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { globalStyles } from "@/styles";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { Button, Switch, Text, useTheme } from "@rneui/themed";
import { Colors } from "@/constants/Colors";
import {
  Alert,
  Appearance,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { removeStorage, setStorage } from "@/storage/long";
import { setIsHttps, setIsImageBackground } from "@/store/slices/appSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/useStore";
import { COLOR_SCHEME, THEME_PRIMARY } from "@/storage/storage-keys";

const SettingsScreen = () => {
  const router = useRouter();
  const mode = useColorScheme();
  const dispatch = useAppDispatch();
  const { theme, updateTheme } = useTheme();
  const [colors, setColors] = useState<string[]>([]);
  const { isHttps, isImageBackground } = useSelector(
    (state: RootState) => state.app
  );
  const { setColorScheme } = Appearance;

  const setMode = () => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    setColorScheme(colorScheme);
    updateTheme({
      mode: colorScheme,
    });
    setStorage(COLOR_SCHEME, colorScheme);
  };

  const onIsImage = () => {
    dispatch(setIsImageBackground(!isImageBackground));
  };

  const onIsHttps = () => {
    dispatch(setIsHttps(!isHttps));
  };

  const openAbout = () => {
    router.navigate("/views/about");
  };

  const clearStorage = () => {
    Alert.alert(
      "提示",
      "确认要清除缓存吗？",
      [
        {
          text: "Cancel",
          onPress: () => console.log("取消"),
          style: "cancel",
        },
        { text: "确认清除", onPress: () => clearStorage() },
      ],
      { cancelable: false }
    );
  };

  const takeColors = () => {
    if (!theme) return;
    const keys = [
      "danger",
      "success",
      "warning",
      "pink",
      "purple",
      "deepPurple",
      "indigo",
      "blue",
      "lightBlue",
      "cyan",
      "teal",
      "lightGreen",
      "lime",
      "yellow",
      "amber",
      "deepOrange",
      "brown",
      "blueGrey",
      "grey",
    ];
    const list: string[] = [];

    keys.forEach((key) => {
      // @ts-ignore
      const color: string = theme.colors[key];
      if (color) list.push(color);
    });

    setColors(list);
  };

  const setThemePrimary = (color: string) => {
    if (color !== theme.colors.primary) {
      updateTheme({
        darkColors: {
          primary: color,
        },
        lightColors: {
          primary: color,
        },
      });
      setStorage(THEME_PRIMARY, color);
    } else {
      updateTheme({
        darkColors: {
          primary: Colors.dark.primary,
        },
        lightColors: {
          primary: Colors.light.primary,
        },
      });
      removeStorage(THEME_PRIMARY);
    }
  };

  useEffect(takeColors, [theme]);
  return (
    <ThemedNavigation style={styles.container} statusBar={true}>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol
            name={theme.mode === "dark" ? "dark-mode" : "light-mode"}
          />
          <Text style={styles.cellTitle}>
            {theme.mode === "dark" ? "深色模式" : "浅色模式"}
          </Text>
        </View>
        <Switch onValueChange={setMode} value={theme.mode === "dark"} />
      </View>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="wifi-tethering" />
          <Text style={styles.cellTitle}>启用HTTPS</Text>
        </View>
        <Switch onValueChange={onIsHttps} value={isHttps} />
      </View>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="image" />
          <Text style={styles.cellTitle}>启用背景图</Text>
        </View>
        <Switch onValueChange={onIsImage} value={isImageBackground} />
      </View>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="palette" />
          <Text style={styles.cellTitle}>主题设置</Text>
        </View>
        <View style={{ width: "60%" }}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            horizontal={true}
            contentContainerStyle={[globalStyles.row, { gap: 5 }]}
          >
            {colors.map((v, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.color,
                    {
                      backgroundColor: v,
                      borderColor:
                        v === theme.colors.primary
                          ? theme.colors.grey0
                          : "transparent",
                    },
                  ]}
                  onPress={() => setThemePrimary(v)}
                />
              );
            })}
          </Animated.ScrollView>
        </View>
      </View>
      <TouchableOpacity style={styles.cellStyle} onPress={clearStorage}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="delete-sweep" />
          <Text style={styles.cellTitle}>清除缓存</Text>
        </View>
        <IconSymbol name="chevron-right" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cellStyle} onPress={openAbout}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="supervisor-account" />
          <Text style={styles.cellTitle}>关于我们</Text>
        </View>
        <IconSymbol name="chevron-right" />
      </TouchableOpacity>
      <Button title="我是主题色按钮" />
      <Button title="我是主题色按钮" type="outline" />
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
    gap: 10,
  },
  cellStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  cellStyleColumn: {
    marginTop: 5,
  },
  cellTitle: {
    fontSize: 20,
  },
  color: {
    height: 24,
    width: 24,
    borderRadius: 3,
    borderWidth: 2,
  },
});

export default SettingsScreen;
