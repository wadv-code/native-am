import { IconSymbol } from "../ui";
import { useEffect, useRef, useState } from "react";
import { HeaderBar } from "./HeaderBar";
import { makeStyles, Text, useTheme } from "@rneui/themed";
import { getStorage, setStorage } from "@/storage/long";
import type { MaterialIconsName } from "@/types";
import { router } from "expo-router";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type HeaderSearchBarProps = {
  backIcon?: MaterialIconsName;
  keywords?: string;
  loading?: boolean;
  onSearch?: (keyword?: string) => void;
};

const HeaderSearchBar = (props: HeaderSearchBarProps) => {
  const { backIcon, keywords, loading, onSearch } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [search, setSearch] = useState("");

  const handleSearch = (query: string) => {
    if (loading) return;
    const isFocused = inputRef.current?.isFocused();
    if (isFocused) return inputRef.current?.blur();
    onSearch && onSearch(query);
    setStorage("keywords", query);
  };

  const handleClear = () => {
    setSearch("");
  };

  const back = () => {
    if (router.canGoBack()) {
      router.back();
    }
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {backIcon && (
          <TouchableOpacity style={styles.arrow} onPress={back}>
            <IconSymbol name={backIcon} />
          </TouchableOpacity>
        )}
        <View style={styles.viewContainer}>
          <View style={styles.searchIcon}>
            <IconSymbol name="search" size={20} />
          </View>
          <TextInput
            ref={inputRef}
            placeholder="Search..."
            placeholderTextColor={theme.colors.grey3}
            value={search}
            onChangeText={(query) => setSearch(query)}
            onEndEditing={() => handleSearch(search)}
            style={styles.input}
          />
          {search ? (
            <TouchableOpacity style={styles.closeIcon} onPress={handleClear}>
              <IconSymbol size={22} name="close" />
            </TouchableOpacity>
          ) : null}
          {loading ? (
            <ActivityIndicator
              size={18}
              color="white"
              style={styles.searchBtn}
            />
          ) : (
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => handleSearch(search)}
            >
              <Text style={{ color: "white" }}>搜索</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingHorizontal: 10,
  },
  arrow: {
    width: "12%",
    paddingLeft: 5,
  },
  searchBtn: {
    height: "85%",
    width: 70,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    marginRight: 2,
    borderRadius: 4,
  },
  viewContainer: {
    width: "88%",
    flexGrow: 1,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 35,
    borderColor: theme.colors.grey4,
  },
  input: {
    paddingVertical: 7,
    margin: 0,
    flexGrow: 1,
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.grey0,
  },
  searchIcon: {
    paddingLeft: 5,
    flexShrink: 0,
  },
  closeIcon: {
    paddingHorizontal: 7,
  },
}));

export { HeaderSearchBar };
