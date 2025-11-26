import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

// Mock data
const achievements = [
  { icon: "🔥", title: "Week Warrior", description: "Complete all habits for 7 days", unlocked: true },
  { icon: "⭐", title: "Perfect Month", description: "100% completion for a month", unlocked: false },
  { icon: "💪", title: "Fitness Fanatic", description: "Complete 30 workout sessions", unlocked: true },
  { icon: "🎯", title: "Consistency King", description: "30-day streak on any habit", unlocked: false },
];

const StatCard = ({ title, value, subtitle, icon, colors, isDark }: any) => (
  <View className={`${colors.card} p-4 rounded-2xl flex-1`}>
    <View className="flex-row justify-between items-start mb-2">
      <View className={`${isDark ? 'bg-white/20' : 'bg-gray-100'} p-2 rounded-xl`}>
        <Ionicons name={icon} size={20} color={colors.icon} />
      </View>
    </View>
    <Text className={`${colors.textSecondary} text-xs font-medium mb-1`}>{title}</Text>
    <Text className={`${colors.text} text-2xl font-bold`}>{value}</Text>
    <Text className={`${colors.textSecondary} text-xs`}>{subtitle}</Text>
  </View>
);

const AchievementBadge = ({ icon, title, description, unlocked, colors, isDark }: any) => (
  <View className={`flex-row items-center p-4 rounded-2xl mb-3 ${
    unlocked ? colors.card : (isDark ? 'bg-white/5 opacity-70' : 'bg-gray-100 opacity-70')
  }`}>
    <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
      unlocked ? (isDark ? 'bg-white/20' : 'bg-gray-100') : (isDark ? 'bg-white/5' : 'bg-gray-200')
    }`}>
      <Text className="text-2xl">{icon}</Text>
    </View>
    <View className="flex-1">
      <Text className={`font-bold text-base ${unlocked ? colors.text : colors.textSecondary}`}>
        {title}
      </Text>
      <Text className={`${colors.textSecondary} text-xs mt-1`}>{description}</Text>
    </View>
    {unlocked && (
      <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
    )}
    {!unlocked && (
      <Ionicons name="lock-closed" size={20} color={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"} />
    )}
  </View>
);

export default function StatsScreen() {
  const { isDark, colors } = useTheme();

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="mb-6">
          <Text className={`${colors.text} text-2xl font-bold mb-2`}>Your Stats</Text>
          <Text className={`${colors.textSecondary} text-sm`}>Track your progress and achievements</Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-3 mb-3">
          <StatCard
            title="Total Streaks"
            value="42"
            subtitle="days total"
            icon="trending-up"
            colors={colors}
            isDark={isDark}
          />
          <StatCard
            title="Completion Rate"
            value="87%"
            subtitle="this month"
            icon="disc"
            colors={colors}
            isDark={isDark}
          />
        </View>

        <View className="mb-6">
          <StatCard
            title="Longest Streak"
            value="12 days"
            subtitle="Morning Meditation"
            icon="trophy"
            colors={colors}
            isDark={isDark}
          />
        </View>

        {/* Achievements */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="ribbon" size={20} color={colors.icon} />
            <Text className={`${colors.text} font-semibold text-lg`}>Achievements</Text>
            <Text className={`${colors.textSecondary} text-sm`}>
              ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </Text>
          </View>
          
          <View>
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} {...achievement} colors={colors} isDark={isDark} />
            ))}
          </View>
        </View>

        {/* Motivational Message */}
        <View className={`${isDark ? 'bg-white' : 'bg-white shadow-lg'} rounded-2xl p-6 shadow-lg mb-8`}>
          <Text className="text-cyan-600 text-lg font-bold mb-2">Keep Going!</Text>
          <Text className="text-gray-600 text-sm leading-relaxed">
            You're doing amazing! You've completed 87% of your habits this month. Just 2 more perfect days to unlock the "Perfect Month" achievement.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
