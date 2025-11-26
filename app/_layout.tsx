import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(auth)/signin" />
      <Stack.Screen name="(auth)/forgotpassword" />
    </Stack>
  );
}
