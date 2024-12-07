import { StyleSheet, type ViewProps } from "react-native";
import { ThemedView } from "@/components/theme/ThemedView";

export type ParallaxViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export default function ParallaxView({ children, style }: ParallaxViewProps) {
  return <ThemedView style={[styles.container, style]}>{children}</ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
