import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { AudioBar } from "@/components/audio";
import { useTheme } from "@/hooks/useThemeColor";
import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { HeaderBar } from "@/components/sys";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <>
      <HeaderBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor:
            colorScheme === "dark" ? theme.tint : theme.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
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
              <MaterialIcons size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="send" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="mine"
          options={{
            title: "Mine",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="account-circle" color={color} />
            ),
          }}
        />
      </Tabs>

      <AudioBar />
    </>
  );
}
