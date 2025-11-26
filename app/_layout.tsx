import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';
import { AuthProvider } from "../contexts/AuthContext";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/signin" />
        <Stack.Screen name="(auth)/forgotpassword" />
      </Stack>
      

      <Toast />
    </AuthProvider>
  );
}
