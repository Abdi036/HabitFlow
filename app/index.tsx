import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LandingScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      // User is logged in, navigate to home
      router.replace('/home');
    }
  }, [user, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <LinearGradient
        colors={["#3AB5F6", "#8364FF"]}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#3AB5F6", "#8364FF"]}
      className="flex-1 justify-center items-center px-6"
    >
      {/* Icon */}
      <View className="w-28 h-28 bg-white/20 rounded-full justify-center items-center mb-6">
        <Text className="text-5xl">✨</Text>
      </View>

      {/* Title */}
      <Text className="text-white text-3xl font-bold text-center mb-2">
        Build Better Habits
      </Text>

      {/* Subtitle */}
      <Text className="text-white/90 text-center mb-8">
        Track your daily routine, build streaks, and achieve{"\n"}your goals
      </Text>

      {/* Feature blocks */}
      <View className="w-full space-y-3 mb-10">
        <View className="bg-white/20 p-4 rounded-xl">
          <Text className="text-white font-medium">📍  Track daily habits</Text>
        </View>

        <View className="bg-white/20 p-4 rounded-xl">
          <Text className="text-white font-medium">🔥  Build streaks</Text>
        </View>

        <View className="bg-white/20 p-4 rounded-xl">
          <Text className="text-white font-medium">📊  See your progress</Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity 
        className="bg-white px-10 py-4 rounded-full shadow-lg"
        onPress={() => router.push('/(auth)/signup')}
      >
        <Text className="text-blue-600 font-semibold text-lg">Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
