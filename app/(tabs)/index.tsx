import ParallaxView from "@/components/ParallaxView";
import { HeaderBar } from "@/components/sys";
import { ThemedText } from "@/components/theme/ThemedText";

const IndexScreen = () => {
  return (
    <ParallaxView>
      <HeaderBar />
      <ThemedText type="title" style={{ textAlign: "center" }}>
        Index
      </ThemedText>
    </ParallaxView>
  );
};

export default IndexScreen;
