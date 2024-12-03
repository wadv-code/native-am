import { Platform } from "react-native";
import { ThemedView } from "../theme/ThemedView";
import Constants from "expo-constants";

const HeaderBar = () => {
  return (
    <ThemedView
      style={Platform.select({
        android: {
          height: Constants.statusBarHeight,
        },
      })}
    />
  );
};

export { HeaderBar };
