import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Appearance, SafeAreaView, type ColorSchemeName } from "react-native";
import { Colors } from "@/constants/Colors";
import { getStorage } from "@/storage/long";
// import { AudioLoading } from "@/components/audio/AudioLoading";
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

  const getCreateThemeOptions = async () => {
    const mode = await getStorage<ColorSchemeName>("colorScheme", "light");
    const primary = await getStorage<string>("themePrimary", "");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!theme) {
    return null;
  }

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView
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
          {/* <AudioLoading /> */}
        </ThemeProvider>
      </Provider>
    </SafeAreaView>
  );
}
