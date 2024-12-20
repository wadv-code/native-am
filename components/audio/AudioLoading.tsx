import type { RootState } from "@/store";
import { globalStyles } from "@/styles";
import { makeStyles } from "@rneui/themed";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

const AudioLoading = () => {
  const styles = useStyles();
  const audioState = useSelector((state: RootState) => state.audio);
  const { loading } = audioState;

  return (
    <>
      {loading && (
        <View style={[styles.overlayStyle, globalStyles.rowCenter]}>
          <ActivityIndicator color="white" size={50} />
        </View>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  overlayStyle: {
    backgroundColor: "rgba(0,0,0,0.2)",
    margin: 0,
    padding: 0,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

export { AudioLoading };
