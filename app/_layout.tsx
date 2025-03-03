import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Appearance, type ColorSchemeName } from "react-native";
import { Colors } from "@/constants/Colors";
import { getStorage } from "@/storage/long";
import { COLOR_SCHEME, THEME_PRIMARY } from "@/storage/storage-keys";
import ThemedToast from "@/components/theme/ThemedToast";
import {
  createTheme,
  ThemeProvider,
  type CreateThemeOptions,
} from "@rneui/themed";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setColorScheme } = Appearance;
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    FontNumber: require("../assets/fonts/FontNumber.ttf"),
  });
  const [theme, setTheme] = useState<CreateThemeOptions | undefined>();

  const getCreateThemeOptions = useCallback(async () => {
    const mode = await getStorage<ColorSchemeName>(COLOR_SCHEME, "light");
    const primary = await getStorage<string>(THEME_PRIMARY, "");
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
  }, [setColorScheme]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    getCreateThemeOptions();
  }, [getCreateThemeOptions]);

  if (!theme || !loaded) return null;

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ThemedToast position="top" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="views" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
