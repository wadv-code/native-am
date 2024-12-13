// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import {
  createTheme,
  ThemeProvider,
  type CreateThemeOptions,
} from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Appearance, SafeAreaView } from "react-native";
import { storageManager } from "@/storage";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setColorScheme } = Appearance;
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [theme, setTheme] = useState<CreateThemeOptions | undefined>();

  const getCreateThemeOptions = async () => {
    const mode = await storageManager.get("color_scheme");
    const primary = await storageManager.get("theme_primary");
    setColorScheme(mode);
    const themeProps = createTheme({
      lightColors: {
        ...Colors.light,
        primary: primary || Colors.light.primary,
      },
      darkColors: {
        ...Colors.dark,
        primary: primary || Colors.dark.primary,
      },
      mode: mode ?? "light",
    });
    setTheme(themeProps);
  };

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    getCreateThemeOptions();
  }, []);

  if (!theme) {
    return null;
  }

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        backgroundColor:
          theme.mode === "dark"
            ? theme.darkColors?.background
            : theme.lightColors?.background,
      }}
    >
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="views" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
