/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { fonts, type FontStyle } from "./fonts";

export type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    backgroundPrimary: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    danger: string;
    success: string;
    warning: string;
    pink: string;
    purple: string;
    deepPurple: string;
    indigo: string;
    blue: string;
    lightBlue: string;
    cyan: string;
    teal: string;
    lightGreen: string;
    lime: string;
    yellow: string;
    amber: string;
    deepOrange: string;
    brown: string;
    blueGrey: string;
    grey: string;
    color: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
    shadowColor: string;
  };
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
};

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: "#17ac9b",
    text: "#11181C",
    background: "#edfefe",
    backgroundPrimary: "#edfefe",
    card: "rgb(255, 255, 255)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
    danger: "#F44336",
    success: "#4CAF50",
    warning: "#FF9800",
    pink: "#E91E63",
    purple: "#9C27B0",
    deepPurple: "#673AB7",
    indigo: "#3F51B5",
    blue: "#2196F3",
    lightBlue: "#03A9F4",
    cyan: "#00BCD4",
    teal: "#009688",
    lightGreen: "#8BC34A",
    lime: "#CDDC39",
    yellow: "#FFEB3B",
    amber: "#FFC107",
    deepOrange: "#FF5722",
    brown: "#795548",
    blueGrey: "#607D8B",
    grey: "#9E9E9E",
    color: "#ffffff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    shadowColor: "#000000",
  },
  fonts,
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: "#0a8577",
    text: "#ECEDEE",
    background: "#011413",
    backgroundPrimary: "#011211",
    card: "rgb(18, 18, 18)",
    border: "rgb(18, 18, 18)",
    notification: "rgb(255, 69, 58)",
    danger: "#F44336",
    success: "#4CAF50",
    warning: "#FF9800",
    pink: "#E91E63",
    purple: "#9C27B0",
    deepPurple: "#673AB7",
    indigo: "#3F51B5",
    blue: "#2196F3",
    lightBlue: "#03A9F4",
    cyan: "#00BCD4",
    teal: "#009688",
    lightGreen: "#8BC34A",
    lime: "#CDDC39",
    yellow: "#FFEB3B",
    amber: "#FFC107",
    deepOrange: "#FF5722",
    brown: "#795548",
    blueGrey: "#607D8B",
    grey: "#9E9E9E",
    color: "#000000",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    shadowColor: "#ffffff",
  },
  fonts,
};
