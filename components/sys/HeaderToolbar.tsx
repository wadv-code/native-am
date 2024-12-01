import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../theme/ThemedView";
import { IconSymbol } from "../ui/IconSymbol";
import { ThemedText } from "../theme/ThemedText";
import { useTheme } from "@/hooks/useThemeColor";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { useState } from "react";

export type HeaderToolbarProps = {
  path: string;
  name?: string;
};

const HeaderToolbar = ({ path, name }: HeaderToolbarProps) => {
  const [isDesc, setIsDesc] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const theme = useTheme();
  const items = path.split("/").filter((f) => f);
  return (
    <ThemedView>
      {/* <View>面包屑</View> */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.rootIcon}>
          <IconSymbol size={26} name="folder.fill.badge.gearshape" />
        </TouchableOpacity>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          style={{ height: 40 }}
          horizontal={true}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {items.map((v, index) => {
            return (
              <View key={index} style={styles.breadcrumb}>
                <IconSymbol
                  size={14}
                  style={styles.icon}
                  weight="bold"
                  name="chevron.compact.right"
                />
                <TouchableOpacity>
                  <ThemedText style={[styles.text, { color: theme.primary }]}>
                    {v}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.ScrollView>
      </View>
      {/* <View>排序</View> */}
      <View style={styles.filterContainer}>
        <ThemedText
          style={[styles.smallText, { width: "75%" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name ?? "精选"}
        </ThemedText>
        <View style={[styles.row, styles.toolbar]}>
          <TouchableOpacity style={styles.row}>
            <IconSymbol
              style={styles.icon}
              size={16}
              name="arrow.up.and.down.text.horizontal"
            />
            <ThemedText style={styles.smallText}>名称</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 5 }}
            onPress={() => setIsDesc(!isDesc)}
          >
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
    width: "20%",
    gap: 7,
    flexDirection: "row",
  },
  text: {
    fontSize: 14,
  },
  smallText: {
    fontSize: 12,
  },
  rootIcon: {
    width: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export { HeaderToolbar };
