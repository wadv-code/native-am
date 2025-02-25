import React from "react";
import { Stack } from "expo-router";

export default function ViewsLayout() {
  return (
    <Stack>
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="viewer" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="web" options={{ headerShown: false }} />
      <Stack.Screen name="hot" options={{ headerShown: false }} />
      <Stack.Screen name="video" options={{ headerShown: false }} />
      <Stack.Screen name="server/server" options={{ headerShown: false }} />
      <Stack.Screen
        name="server/server-edit"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
