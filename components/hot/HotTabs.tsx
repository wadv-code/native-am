import type { GetHotListRes } from "@/api/api";
import { globalStyles } from "@/styles";
import { Text, useTheme } from "@rneui/themed";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

type HotTabsProps = {
  items: GetHotListRes;
  index: number;
  onChange?: (index: number) => void;
};

const HotTabs = (props: HotTabsProps) => {
  const { index, items, onChange } = props;
  const { theme } = useTheme();
  return (
    <View>
      <Animated.ScrollView
        contentContainerStyle={{ height: 40 }}
        scrollEventThrottle={16}
        horizontal={true}
      >
        {items.map((v, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              style={[globalStyles.rowCenter, styles.scrollViewItem]}
              onPress={() => onChange && onChange(idx)}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      idx === index ? theme.colors.primary : theme.colors.grey0,
                  },
                ]}
              >
                {v.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewItem: {
    // height: 40,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export { HotTabs, HotTabsProps };
