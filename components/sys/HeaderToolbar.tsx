import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../theme/ThemedView";
import { IconSymbol } from "../ui";
import { ThemedText } from "../theme/ThemedText";
import { useTheme } from "@/hooks/useThemeColor";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { useState } from "react";
import type { GetItemsParams } from "@/api/api";

interface ToolbarProps {
  name?: string;
  items: GetItemsParams[];
  onPress?: (item: GetItemsParams) => void;
  onRoot?: () => void;
}

export type HeaderToolbarProps = ToolbarProps;

const HeaderToolbar = (props: ToolbarProps) => {
  const { items, name, onPress, onRoot } = props;
  const [isDesc, setIsDesc] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  // const theme = useTheme();
  return (
    <ThemedView>
      {/* <View>面包屑</View> */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.rootIcon} onPress={onRoot}>
          <IconSymbol name="folder.fill.badge.gearshape" />
        </TouchableOpacity>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          style={{ height: 40 }}
          horizontal={true}
          contentContainerStyle={styles.scrollView}
        >
          {items.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.breadcrumb}
                onPress={() => onPress && onPress(item)}
              >
                <IconSymbol weight="bold" name="chevron.compact.right" />
                <ThemedText style={styles.text}>{item.name}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      </View>
      {/* <View>排序</View> */}
      <View style={styles.filterContainer}>
        <ThemedText
          style={[styles.smallText, { width: "78%" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name ?? "精选"}
        </ThemedText>
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.row}>
            <IconSymbol
              style={styles.icon}
              size={16}
              name="arrow.up.and.down.text.horizontal"
            />
            <ThemedText style={styles.smallText}>名称</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDesc(!isDesc)}>
            <IconSymbol
              size={16}
              name={isDesc ? "arrowshape.down.fill" : "arrowshape.up.fill"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    marginLeft: 5,
    marginRight: 5,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbar: {
    width: "22%",
    gap: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
    paddingBottom: 3,
  },
  rootIcon: {
    width: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  scrollView: {
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export { HeaderToolbar };
