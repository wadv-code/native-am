import { IconSymbol } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { globalStyles } from "@/styles";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import { storageManager } from "@/storage";
import { useRouter } from "expo-router";
import { ThemedNavigation } from "@/components/theme/ThemedNavigation";
import { Button, Text, useTheme } from "@rneui/themed";
import { Colors } from "@/constants/Colors";
import {
  Alert,
  Appearance,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

const SettingsScreen = () => {
  const router = useRouter();
  const mode = useColorScheme();
  const { theme, updateTheme } = useTheme();
  const [colors, setColors] = useState<string[]>([]);
  const { setColorScheme } = Appearance;

  const setMode = () => {
    const colorScheme = mode === "dark" ? "light" : "dark";
    setColorScheme(colorScheme);
    updateTheme({
      mode: colorScheme,
    });
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
      storageManager.set("theme_primary", color);
    } else {
      updateTheme({
        darkColors: {
          primary: Colors.dark.primary,
        },
        lightColors: {
          primary: Colors.light.primary,
        },
      });
      storageManager.remove("theme_primary");
    }
  };

  useEffect(takeColors, [theme]);
  return (
    <ThemedNavigation style={styles.container} isImage={true} statusBar={true}>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol
            name={theme.mode === "dark" ? "dark-mode" : "light-mode"}
          />
          <Text style={styles.cellTitle}>
            {theme.mode === "dark" ? "深色模式" : "浅色模式"}
          </Text>
        </View>
        <Switch
          thumbColor={theme.colors.grey0}
          ios_backgroundColor={theme.colors.primary}
          onValueChange={setMode}
          value={theme.mode === "dark"}
        />
      </View>
      <View style={styles.cellStyle}>
        <View style={[globalStyles.row, { gap: 10 }]}>
          <IconSymbol name="palette" />
          <Text style={styles.cellTitle}>主题设置</Text>
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
