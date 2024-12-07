import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui";
import { ThemedText } from "../theme/ThemedText";
import { useTheme } from "@/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
import { HeaderBar } from "./HeaderBar";

type HeaderSearchBarProps = {
  keywords?: string;
  onSeatch?: (keyword?: string) => void;
};

const HeaderSearchBar = ({ keywords, onSeatch }: HeaderSearchBarProps) => {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [search, setSearch] = useState("");
  const handleSearch = (query: string) => {
    const isFocused = inputRef.current?.isFocused();
    if (isFocused) return inputRef.current?.blur();
    onSeatch && onSeatch(query);
  };

  useEffect(() => {
    setSearch(keywords || "");
  }, [keywords]);

  return (
    <>
      <HeaderBar />
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundPrimary,
            borderColor: theme.tabIconDefault,
          },
        ]}
      >
        <View style={styles.searchIcon}>
          <IconSymbol name="search" />
        </View>
        <TextInput
          ref={inputRef}
          placeholder="Search..."
          placeholderTextColor={theme.icon}
          value={search}
          onChangeText={(query) => setSearch(query)}
          onEndEditing={() => handleSearch(search)}
          style={[styles.input, { color: theme.text }]}
        />
        <TouchableOpacity
          style={[styles.search, { backgroundColor: theme.primary }]}
          onPress={() => handleSearch(search)}
        >
          <ThemedText style={styles.searchText}>搜索</ThemedText>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  search: {
    width: 60,
    height: "76%",
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  searchText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  container: {
    width: "100%",
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    flexGrow: 1,
    height: "100%",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 5,
    flexShrink: 0,
  },
});

export { HeaderSearchBar };
