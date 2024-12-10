import { ThemedText } from "@/components/theme/ThemedText";
import { IconSymbol } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { globalStyles } from "@/styles";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import { storageManager } from "@/storage";
import { useRouter } from "expo-router";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { ThemedInput } from "@/components/theme/ThemedInput";
import {
  Alert,
  Appearance,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedButton } from "@/components/theme/ThemedButton";

const SettingsScreen = () => {
  const themeConfig = {
    image: "https://3650000.xyz/api/",
  };
  const router = useRouter();
  const mode = useColorScheme();
  const { theme, setThemeColor } = useThemeColor();
  const [isDark, setIsDark] = useState(mode === "dark");
  const [colors, setColors] = useState<string[]>([]);
  const { setColorScheme } = Appearance;

  const setMode = () => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    setColorScheme(colorScheme);
    setIsDark(!isDark);
    storageManager.set("color_scheme", colorScheme);
  };

  const openAbout = () => {
    router.navigate("/views/about");
  };

  const clearStorage = () => {
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
      const color: string = theme[key];
      if (color) list.push(color);
    });

    setColors(list);
  };

  useEffect(takeColors, [theme]);
  return (
    <ThemedNavigation style={styles.container} isImage={true} statusBar={true}>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name={isDark ? "dark-mode" : "light-mode"} />
          <ThemedText style={styles.cellTitle}>
            {isDark ? "深色模式" : "浅色模式"}
          </ThemedText>
        </View>
        <Switch
          thumbColor={theme.text}
          ios_backgroundColor={theme.primary}
          onValueChange={setMode}
          value={isDark}
        />
      </View>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="delete-sweep" />
          <ThemedText style={styles.cellTitle}>主题设置</ThemedText>
        </View>
        <View style={{ width: "60%" }}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            style={{ height: 40 }}
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
                        v === theme.primary ? theme.text : "transparent",
                    },
                  ]}
                  onPress={() => setThemeColor({ primary: v })}
                />
              );
            })}
          </Animated.ScrollView>
        </View>
      </View>
      <TouchableOpacity style={styles.cellStyle} onPress={clearStorage}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="delete-sweep" />
          <ThemedText style={styles.cellTitle}>清除缓存</ThemedText>
        </View>
        <IconSymbol name="chevron-right" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cellStyle} onPress={openAbout}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="supervisor-account" />
          <ThemedText style={styles.cellTitle}>关于我们</ThemedText>
        </View>
        <IconSymbol name="chevron-right" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cellStyleColumn} onPress={openAbout}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="image" />
          <ThemedText style={styles.cellTitle}>图片服务器</ThemedText>
        </View>
        <ThemedInput
          placeholder="输入图片服务器地址"
          placeholderTextColor={theme.icon}
          value={themeConfig.image}
        />
      </TouchableOpacity>
      <View style={{ marginTop: 20 }}>
        <ThemedButton title="主题按钮" />
      </View>
    </ThemedNavigation>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  cellStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
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
