import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function LandingScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isDark, colors } = useTheme();

  // Check if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      // User is logged in, navigate to tabs (home)
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <LinearGradient
        colors={colors.background}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color={colors.icon} />
        <Text className={`${colors.text} mt-4`}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1 justify-center items-center px-6"
    >
      {/* Icon */}
      <View className={`w-28 h-28 ${isDark ? 'bg-white/20' : 'bg-gray-100'} rounded-full justify-center items-center mb-6`}>
        <Text className="text-5xl">✨</Text>
      </View>

      {/* Title */}
      <Text className={`${colors.text} text-3xl font-bold text-center mb-2`}>
        Build Better Habits
      </Text>

      {/* Subtitle */}
      <Text className={`${colors.textSecondary} text-center mb-8`}>
        Track your daily routine, build streaks, and achieve{"\n"}your goals
      </Text>

      {/* Feature blocks */}
      <View className="w-full space-y-3 mb-10">
        <View className={`${colors.card} p-4 rounded-xl`}>
          <Text className={`${colors.text} font-medium`}>📍  Track daily habits</Text>
        </View>

        <View className={`${colors.card} p-4 rounded-xl`}>
          <Text className={`${colors.text} font-medium`}>🔥  Build streaks</Text>
        </View>

        <View className={`${colors.card} p-4 rounded-xl`}>
          <Text className={`${colors.text} font-medium`}>📊  See your progress</Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity 
        className={`${isDark ? 'bg-white' : 'bg-cyan-500'} px-10 py-4 rounded-full shadow-lg`}
        onPress={() => router.push('/(auth)/signup')}
      >
        <Text className={`${isDark ? 'text-blue-600' : 'text-white'} font-semibold text-lg`}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
