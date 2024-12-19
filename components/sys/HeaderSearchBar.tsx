import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui";
import { useEffect, useRef, useState } from "react";
import { HeaderBar } from "./HeaderBar";
import { Button, useTheme } from "@rneui/themed";
import { getStorage, setStorage } from "@/storage/long";

type HeaderSearchBarProps = {
  keywords?: string;
  loading?: boolean;
  onSearch?: (keyword?: string) => void;
};

const HeaderSearchBar = (props: HeaderSearchBarProps) => {
  const { keywords, loading, onSearch } = props;
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [search, setSearch] = useState("");

  const handleSearch = (query: string) => {
    const isFocused = inputRef.current?.isFocused();
    if (isFocused) return inputRef.current?.blur();
    onSearch && onSearch(query);
    setStorage("keywords", query);
  };

  const handleClear = () => {
    setSearch("");
  };

  useEffect(() => {
    (async () => {
      const value = keywords || (await getStorage<string>("keywords", ""));
      setSearch(value);
    })();
  }, [keywords]);

  return (
    <View style={styles.container}>
      <HeaderBar />
      <View
        style={[
          styles.viewContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.greyOutline,
          },
        ]}
      >
        <View style={styles.searchIcon}>
          <IconSymbol name="search" />
        </View>
        <TextInput
          ref={inputRef}
          placeholder="Search..."
          placeholderTextColor={theme.colors.grey3}
          value={search}
          onChangeText={(query) => setSearch(query)}
          onEndEditing={() => handleSearch(search)}
          style={[styles.input, { color: theme.colors.grey0 }]}
        />
        {search ? (
          <TouchableOpacity style={styles.closeIcon} onPress={handleClear}>
            <IconSymbol size={22} name="close" />
          </TouchableOpacity>
        ) : null}
        <Button
          loading={loading}
          loadingStyle={styles.loadingStyle}
          containerStyle={styles.searchBtn}
          titleStyle={styles.searchBtnTitle}
          onPress={() => handleSearch(search)}
        >
          搜索
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  searchBtn: {
    width: 70,
    height: "85%",
    marginRight: 2,
    borderRadius: 4,
  },
  searchBtnTitle: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  loadingStyle: {
    width: 10,
    height: 10,
  },
  viewContainer: {
    width: "100%",
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
    paddingVertical: 7,
    margin: 0,
    flexGrow: 1,
    height: "100%",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchIcon: {
    paddingHorizontal: 5,
    flexShrink: 0,
  },
  closeIcon: {
    paddingHorizontal: 7,
  },
});

export { HeaderSearchBar };
