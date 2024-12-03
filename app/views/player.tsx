import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { useTheme } from "@/hooks/useThemeColor";

const PlayerScreen = () => {
  const theme = useTheme();
  return (
    <ParallaxScrollView>
      <ThemedView>
        <ThemedText style={{ color: theme.primary }}>PlayerScreen</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
};
export default PlayerScreen;
