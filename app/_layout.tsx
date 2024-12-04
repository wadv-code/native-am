import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Appearance, SafeAreaView } from "react-native";
import { useTheme } from "@/hooks/useThemeColor";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { storageManager } from "@/storage";

// // player
// import setApp from "@/player/services";
// setApp();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setColorScheme } = Appearance;
  const colorScheme = useColorScheme();
  const theme = useTheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // 主题
  useEffect(() => {
    const initColorScheme = async () => {
      const colorScheme = (await storageManager.get("color_scheme")) ?? "light";
      console.log(colorScheme);
      setColorScheme(colorScheme);
    };
    initColorScheme();
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}
