import type { GetHotListRes } from "@/api/api";
import type { TabViewProps } from "@rneui/base";
import { TabView } from "@rneui/themed";
import { FlatList, RefreshControl } from "react-native";
import { HotItem } from "./HotItem";

type HotTabViewProps = TabViewProps & {
  items: GetHotListRes;
  index: number;
  refreshing: boolean;
  onRefresh?: () => void;
};

const HotTabView = (props: HotTabViewProps) => {
  const { index, items, refreshing } = props;
  const { onRefresh } = props;
  return (
    <TabView containerStyle={{ flexGrow: 1 }} value={index} disableSwipe={true}>
      {items.map((v, idx) => {
        return (
          <TabView.Item key={idx} style={{ width: "100%" }}>
            {index === idx && (
              <FlatList
                data={v.data}
                renderItem={({ item, index }) => (
                  <HotItem item={item} index={index} />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </TabView.Item>
        );
      })}
    </TabView>
  );
};

export { HotTabView, HotTabViewProps };
