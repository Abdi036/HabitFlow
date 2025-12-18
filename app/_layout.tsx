import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import "../global.css";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start fade out animation at 2 seconds
    const fadeTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    // Hide splash screen at 2.5 seconds (after fade completes)
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [fadeAnim]);

  if (showSplash) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
      <AuthProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
              animation: "slide_from_right",
              animationDuration: 300,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="(auth)/signup" />
            <Stack.Screen name="(auth)/signin" />
            <Stack.Screen name="(auth)/forgotpassword" />
          </Stack>
          <Toast visibilityTime={3000} autoHide={true} />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}
