import { Button, Overlay, Text, type BottomSheetProps } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { IconSymbol } from "../ui";

type CatalogOverlayProps = BottomSheetProps & {
  isVisible?: boolean;
  closeSheet?: () => void;
};

const CatalogOverlay = ({ isVisible, closeSheet }: CatalogOverlayProps) => {
  // const [isVisible, setIsVisible] = useState(false);

  return (
    <Overlay isVisible={!!isVisible} onBackdropPress={closeSheet}>
      <Text style={styles.textPrimary}>Hello!</Text>
      <Text style={styles.textSecondary}>Welcome to React Native Elements</Text>
      <Button
        icon={
          <IconSymbol
            name="add-alarm"
            color="white"
            size={25}
            style={{ marginRight: 10 }}
          />
        }
        title="Start Building"
        onPress={closeSheet}
      />
    </Overlay>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: "center",
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
  },
});

export { CatalogOverlay, CatalogOverlayProps };
