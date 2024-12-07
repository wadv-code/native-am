/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    color: "#ffffff",
    primary: "#17ac9b",
    text: "#11181C",
    background: "#edfefe",
    backgroundPrimary: "#edfefe",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    shadowColor: "#000000",
  },
  dark: {
    color: "#000000",
    primary: "#0a8577",
    text: "#ECEDEE",
    background: "#011413",
    backgroundPrimary: "#011211",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    shadowColor: "#ffffff",
  },
};
