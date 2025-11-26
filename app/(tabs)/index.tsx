import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { isDark, colors } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  // Mock habits data
  const habits = [
    { id: 1, name: "Morning Meditation", icon: "🧘", completed: true },
    { id: 2, name: "Read 30 Minutes", icon: "📚", completed: true },
    { id: 3, name: "Workout", icon: "💪", completed: false },
    { id: 4, name: "Drink Water", icon: "💧", completed: false },
    { id: 5, name: "Complete Tasks", icon: "✅", completed: false },
  ];

  const completedCount = habits.filter(h => h.completed).length;
  const progress = (completedCount / habits.length) * 100;

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-12 pb-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className={`${colors.text} text-2xl font-bold`}>Today's Habits</Text>
              <Text className={`${colors.textSecondary} text-sm mt-1`}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => router.push('/notifications')}>
                <Ionicons name="notifications-outline" size={24} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Card */}
          <View className={`${colors.card} p-6 rounded-3xl`}>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className={`${colors.textSecondary} text-sm font-medium mb-2`}>Daily Progress</Text>
                <Text className={`${colors.text} text-3xl font-bold`}>
                  {completedCount}/{habits.length}
                </Text>
                <Text className={`${colors.textSecondary} text-xs mt-1`}>habits completed</Text>
              </View>
              
              {/* Simple Progress Circle */}
              <View className={`w-24 h-24 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-100'} items-center justify-center`}>
                <Text className={`${colors.text} text-2xl font-bold`}>{Math.round(progress)}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View className="px-6 pb-6">
          <Text className={`${colors.text} font-semibold text-lg mb-4`}>Your Habits</Text>
          {habits.map((habit) => (
            <View 
              key={habit.id} 
              className={`${colors.card} p-4 rounded-2xl mb-3 flex-row items-center justify-between`}
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-3xl mr-3">{habit.icon}</Text>
                <Text className={`${colors.text} font-medium`}>{habit.name}</Text>
              </View>
              <TouchableOpacity 
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  habit.completed ? 'bg-green-400' : (isDark ? 'bg-white/30' : 'bg-gray-200')
                }`}
              >
                {habit.completed && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
