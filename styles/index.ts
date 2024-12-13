import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
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
});
