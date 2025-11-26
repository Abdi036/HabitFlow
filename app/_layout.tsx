import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="(auth)/signup" />
          <Stack.Screen name="(auth)/signin" />
          <Stack.Screen name="(auth)/forgotpassword" />
        </Stack>
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}
