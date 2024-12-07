import type { PropsWithChildren } from "react";
import { StyleSheet, type ViewProps } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "@/components/theme/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";

type Props = PropsWithChildren<ViewProps>;

export default function ParallaxScrollView({ children, style }: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView style={[styles.container, style]}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 10,
    // paddingRight: 10
  },
  content: {
    flex: 1,
    gap: 10,
    overflow: "hidden",
  },
});
