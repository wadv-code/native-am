import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
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
