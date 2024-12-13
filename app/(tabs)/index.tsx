import { HeaderBar } from "@/components/sys";
import { Button } from "@rneui/themed";
import { ThemedView } from "@/components/theme/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, gap: 10, paddingHorizontal: 10 }}>
      <HeaderBar />
      <Button title="Solid" />
      <Button title="Outline" type="outline" />
      <Button title="Clear" type="clear" />
    </ThemedView>
  );
}
