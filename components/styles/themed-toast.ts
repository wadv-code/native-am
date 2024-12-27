import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },

  mainContainer: {
    borderRadius: 3,
    position: "absolute",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },

  hideButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },

  textStyle: {
    fontSize: 14,
  },

  progressBarContainer: {
    flexDirection: "row",
    position: "absolute",
    height: 4,
    width: "100%",
    bottom: 0,
  },

  content: {
    width: "100%",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  iconWrapper: {
    marginRight: 5,
  },
});
export { styles };
