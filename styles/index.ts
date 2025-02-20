import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export const globalStyles = StyleSheet.create({
  statusbar: {
    paddingTop: Constants.statusBarHeight,
  },
  screen: {
    width: "100%",
    height: "100%",
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAround: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  columnBetween: {
    flexDirection: "column",
    alignContent: "space-between",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  justifyAround: {
    justifyContent: "space-around",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  flexGrow: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  position: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
