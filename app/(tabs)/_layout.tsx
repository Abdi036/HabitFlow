import { Tabs } from "expo-router";
import React from "react";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesom5 from "@expo/vector-icons/FontAwesome5";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            focused ? (
              <FontAwesom5 name="home" size={24} color={color} />
            ) : (
              <AntDesign name="home" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
    </Tabs>
  );
}
