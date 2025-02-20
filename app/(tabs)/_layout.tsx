import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useTheme } from "@rneui/themed";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { AudioBar } from "@/components/audio";
import { useState } from "react";
import { MusicPlayer } from "@/components/audio/MusicPlayer";
import { useAppDispatch } from "@/hooks/useStore";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  ModalPlayer,
  type ModalPlayerType,
} from "@/components/audio/ModalPlayer";
import { setIsHttpsURL } from "@/utils/request";

export default function TabLayout() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalPlayerType>("view");
  const { isHttps } = useSelector((state: RootState) => state.app);

  const closeModal = () => {
    setVisible(false);
  };

  const openModal = async (type: ModalPlayerType) => {
    setModalType(type);
    setVisible(true);
  };

  useEffect(() => {
    setIsHttpsURL(isHttps);
  }, [dispatch, isHttps]);
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveBackgroundColor: theme.colors.background,
          tabBarInactiveBackgroundColor: theme.colors.background,
          tabBarActiveTintColor:
            theme.mode === "dark" ? theme.colors.grey0 : theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.grey3,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {
              borderColor: theme.colors.background,
            },
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
          name="collect"
          options={{
            title: "Collect",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="star" color={color} />
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
