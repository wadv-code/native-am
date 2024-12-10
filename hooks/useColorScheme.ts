import { useColorScheme as useColorSchemeMode } from "react-native";

export const useColorScheme = () => {
  return useColorSchemeMode() ?? "light";
};
