import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { useTheme } from "@/hooks/useThemeColor";

const SearchScreen = () => {
  const theme = useTheme();
  return (
    <ParallaxScrollView>
      <ThemedView>
        <ThemedText style={{ color: theme.primary }}>SearchScreen</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
};
export default SearchScreen;
