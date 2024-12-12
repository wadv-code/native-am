import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Appearance } from "react-native";
import { StatusBar } from "expo-status-bar";
import { storageManager } from "@/storage";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider } from "@/components/theme/ThemeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setColorScheme } = Appearance;
  // const theme = useContext(ThemeContext);

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
      setColorScheme(colorScheme);
    };
    initColorScheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="views/search" options={{ headerShown: false }} />
          <Stack.Screen name="views/viewer" options={{ headerShown: false }} />
          <Stack.Screen name="views/about" options={{ headerShown: false }} />
          <Stack.Screen
            name="views/settings"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="views/image-server"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
