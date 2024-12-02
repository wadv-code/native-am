import type { PropsWithChildren } from "react";
import { StatusBar, StyleSheet, type ViewProps } from "react-native";

import { ThemedView } from "@/components/theme/ThemedView";

export type ParallaxViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export default function ParallaxView({ children, style }: ParallaxViewProps) {
  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  content: {
    flex: 1,
    gap: 10,
    overflow: "hidden",
  },
});
