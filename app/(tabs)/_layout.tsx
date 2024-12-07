import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { AudioBar } from "@/components/audio";
import { useTheme } from "@/hooks/useThemeColor";
import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HeaderBar } from "@/components/sys";
import { ModalPlayer } from "@/components/audio/ModalPlayer";
import { MusicPlayer } from "@/components/audio/MusicPlayer";
import { IconSymbol } from "@/components/ui";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <>
      <HeaderBar />
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveBackgroundColor: theme.backgroundPrimary,
          tabBarInactiveBackgroundColor: theme.background,
          tabBarActiveTintColor:
            colorScheme === "dark" ? theme.icon : theme.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="catalog"
          options={{
            title: "Catalog",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="snippet-folder" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="mine"
          options={{
            title: "Mine",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="account-circle" color={color} />
            ),
          }}
        />
      </Tabs>

      <AudioBar onPress={() => setVisible(true)} />
      <ModalPlayer modalVisible={visible} closeModal={closeModal} />
      <MusicPlayer />
    </>
  );
}
