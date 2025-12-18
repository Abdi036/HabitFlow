import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)");
    }
  }, [user, loading, router]);

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
      {/* HabitFlow Icon */}
      <View
        className={`w-28 h-28 ${
          isDark ? "bg-white/20" : "bg-gray-100"
        } rounded-full justify-center items-center mb-6`}
      >
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={70}
          color={isDark ? "white" : "#0ea5e9"}
        />
      </View>

      <Text className={`${colors.text} text-4xl font-bold text-center mb-4`}>
        Build Better Habits
      </Text>

      <Text
        className={`${colors.text} italic text-lg text-center mb-8 font-bold`}
      >
        Track your daily routine, build streaks, and achieve{"\n"}your goals
      </Text>

      <View className="w-full space-y-3 mb-10">
        <View className={`${colors.card} p-4 rounded-xl mb-5`}>
          <Text className={`${colors.text} font-bold`}>
            📍 Track daily habits
          </Text>
        </View>

        <View className={`${colors.card} p-4 rounded-xl mb-5`}>
          <Text className={`${colors.text} font-bold`}>🔥 Build streaks</Text>
        </View>

        <View className={`${colors.card} p-4 rounded-xl mb-5`}>
          <Text className={`${colors.text} font-bold`}>
            📊 See your progress
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className={`${
          isDark ? "bg-white" : "bg-cyan-500"
        } px-10 py-4 rounded-full shadow-lg`}
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text
          className={`${
            isDark ? "text-blue-600" : "text-white"
          } font-semibold text-lg`}
        >
          Get Started
        </Text>
      </TouchableOpacity>
      <View className="items-center p-2">
        <Text className="text-white font-bold text-2xl">or</Text>
      </View>
      <TouchableOpacity
        className={`${
          isDark ? "bg-white" : "bg-cyan-500"
        } px-10 py-4 rounded-full shadow-lg`}
        onPress={() => router.push("/(auth)/signin")}
      >
        <Text
          className={`${
            isDark ? "text-blue-600" : "text-white"
          } font-semibold text-lg`}
        >
          Sign in
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
