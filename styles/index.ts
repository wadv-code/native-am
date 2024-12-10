import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
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
  bold: {
    fontWeight: "bold",
  },
});
