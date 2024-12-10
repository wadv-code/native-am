import { Platform, View, type ViewProps } from "react-native";
import Constants from "expo-constants";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";

type HeaderBarProps = ViewProps & {
  statusBarStyle?: StatusBarStyle;
};

const HeaderBar = ({ statusBarStyle = "auto", style }: HeaderBarProps) => {
  return (
    <View style={[styles.container, style]}>
      <StatusBar style={statusBarStyle} />
    </View>
  );
};

const styles = Platform.select({
  android: {
    container: {
      height: Constants.statusBarHeight,
    },
  },
  default: {},
});

export { HeaderBar, HeaderBarProps };
