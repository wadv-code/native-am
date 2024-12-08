import ParallaxView from "@/components/ParallaxView";
import { ThemedText } from "@/components/theme/ThemedText";

const IndexScreen = () => {
  return (
    <ParallaxView>
      <ThemedText type="title" style={{ textAlign: "center", paddingTop: 10 }}>
        Index
      </ThemedText>
    </ParallaxView>
  );
};

export default IndexScreen;
