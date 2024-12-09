import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { AudioBar } from "@/components/audio";
import { useTheme } from "@/hooks/useThemeColor";
import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HeaderBar } from "@/components/sys";
import { MusicPlayer } from "@/components/audio/MusicPlayer";
import { IconSymbol } from "@/components/ui";
import TabBarBackground from "@/components/ui/TabBarBackground";
import {
  ModalPlayer,
  type ModalPlayerType,
} from "@/components/audio/ModalPlayer";

export default function TabLayout() {
  const mode = useColorScheme();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalPlayerType>("view");

  const closeModal = () => {
    setVisible(false);
  };

  const openModal = async (type: ModalPlayerType) => {
    setModalType(type);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setVisible(true);
  };

  return (
    <>
      <Tabs
        initialRouteName="mine"
        screenOptions={{
          tabBarActiveBackgroundColor: theme.backgroundPrimary,
          tabBarInactiveBackgroundColor: theme.background,
          tabBarActiveTintColor: mode === "dark" ? theme.text : theme.primary,
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

      <AudioBar onPress={openModal} />
      <ModalPlayer
        modalType={modalType}
        modalVisible={visible}
        closeModal={closeModal}
      />
      <MusicPlayer />
    </>
  );
}
