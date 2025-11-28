import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const highlightStats = [
  { label: "Habits active", value: "06", icon: "layers-outline", delta: "+2" },
  { label: "Perfect days", value: "18", icon: "sparkles-outline", delta: "+5" },
  { label: "This week", value: "82%", icon: "bar-chart-outline", delta: "-3%" },
];

const weeklySnapshot = [
  { label: "M", value: 4 },
  { label: "T", value: 5 },
  { label: "W", value: 6 },
  { label: "T", value: 3 },
  { label: "F", value: 6 },
  { label: "S", value: 2 },
  { label: "S", value: 5 },
];

const achievements = [
  {
    icon: "🔥",
    title: "Week Warrior",
    description: "Complete all habits for 7 days",
    unlocked: true,
  },
  {
    icon: "⭐",
    title: "Perfect Month",
    description: "100% completion for a month",
    unlocked: false,
  },
  {
    icon: "💪",
    title: "Fitness Fanatic",
    description: "Complete 30 workout sessions",
    unlocked: true,
  },
  {
    icon: "🎯",
    title: "Consistency King",
    description: "30-day streak on any habit",
    unlocked: false,
  },
];

const reflections = [
  "Which habit made you feel the best this week?",
  "What blocked you on low-energy days?",
  "How will you celebrate your next milestone?",
];

const StatHighlightCard = ({ colors, isDark, stat }: any) => (
  <View className={`${colors.card} rounded-2xl p-4 flex-1`}>
    <View className="flex-row items-center justify-between mb-3">
      <View
        className={`${isDark ? "bg-white/20" : "bg-gray-100"} w-10 h-10 rounded-xl items-center justify-center`}
      >
        <Ionicons name={stat.icon as any} size={18} color={colors.icon} />
      </View>
      <Text
        className={`${stat.delta.startsWith("-") ? "text-red-400" : "text-green-300"} text-xs font-semibold`}
      >
        {stat.delta}
      </Text>
    </View>
    <Text className={`${colors.textSecondary} text-xs uppercase tracking-wide`}>
      {stat.label}
    </Text>
    <Text className={`${colors.text} text-3xl font-bold mt-1`}>
      {stat.value}
    </Text>
  </View>
);

const AchievementBadge = ({
  icon,
  title,
  description,
  unlocked,
  colors,
  isDark,
}: any) => (
  <View
    className={`flex-row items-center p-4 rounded-2xl mb-3 ${
      unlocked ? colors.card : isDark ? "bg-white/10" : "bg-gray-100"
    } ${unlocked ? "" : "opacity-70"}`}
  >
    <View
      className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${
        unlocked
          ? isDark
            ? "bg-white/15"
            : "bg-gray-100"
          : isDark
            ? "bg-white/5"
            : "bg-white"
      }`}
    >
      <Text className="text-2xl">{icon}</Text>
    </View>
    <View className="flex-1">
      <Text className={`font-semibold text-base ${colors.text}`}>{title}</Text>
      <Text className={`${colors.textSecondary} text-xs mt-1`}>
        {description}
      </Text>
    </View>
    {unlocked ? (
      <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
    ) : (
      <Ionicons
        name="lock-closed"
        size={20}
        color={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
      />
    )}
  </View>
);

const WeeklyBar = ({
  day,
  value,
  maxValue,
  isDark,
}: {
  day: string;
  value: number;
  maxValue: number;
  isDark: boolean;
}) => {
  const height = (value / maxValue) * 90;
  return (
    <View className="items-center flex-1">
      <View
        className={`${isDark ? "bg-white/20" : "bg-gray-200"} w-2 rounded-2xl justify-end`}
        style={{ height: 100 }}
      >
        <View
          className="bg-green-400 rounded-2xl"
          style={{ height, width: 8 }}
        />
      </View>
      <Text className="text-xs text-white/70 mt-2">{day}</Text>
    </View>
  );
};

export default function StatsScreen() {
  const { isDark, colors } = useTheme();

  return (
    <LinearGradient colors={colors.background} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          paddingTop: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className={`${colors.card} rounded-3xl p-6 mb-6`}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text
                className={`${colors.text} text-sm uppercase tracking-[3px]`}
              >
                This month
              </Text>
              <Text className={`${colors.text} text-4xl font-bold mt-2`}>
                87%
              </Text>
              <Text className={`${colors.textSecondary} text-sm mt-1`}>
                completion across all active habits
              </Text>
            </View>
            <View
              className={`${isDark ? "bg-white/20" : "bg-gray-100"} rounded-3xl p-4 items-center`}
            >
              <Ionicons name="analytics" size={28} color={colors.icon} />
            </View>
          </View>
          <View className="flex-row gap-2 mt-5">
            <View className="bg-green-400/20 px-3 py-1 rounded-full">
              <Text className="text-green-200 text-xs font-semibold">
                +12% vs last month
              </Text>
            </View>
            <View className="bg-white/10 px-3 py-1 rounded-full">
              <Text className="text-white/80 text-xs">4 habits streaking</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-6">
          {highlightStats.map((stat) => (
            <StatHighlightCard
              key={stat.label}
              stat={stat}
              colors={colors}
              isDark={isDark}
            />
          ))}
        </View>

        <View className={`${colors.card} rounded-3xl p-5 mb-6`}>
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className={`${colors.text} text-lg font-semibold`}>
                Weekly momentum
              </Text>
              <Text className={`${colors.textSecondary} text-xs`}>
                Last 7 days of check-ins
              </Text>
            </View>
            <Ionicons name="pulse" size={20} color={colors.icon} />
          </View>
          <View className="flex-row gap-4">
            {weeklySnapshot.map((day) => (
              <WeeklyBar
                key={`${day.label}-${day.value}`}
                day={day.label}
                value={day.value}
                maxValue={6}
                isDark={isDark}
              />
            ))}
          </View>
        </View>

        <View className={`${colors.card} rounded-3xl p-5 mb-6`}>
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="ribbon" size={20} color={colors.icon} />
            <Text className={`${colors.text} font-semibold text-lg`}>
              Achievements
            </Text>
            <Text className={`${colors.textSecondary} text-sm`}>
              ({achievements.filter((a) => a.unlocked).length}/
              {achievements.length}) unlocked
            </Text>
          </View>
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.title}
              {...achievement}
              colors={colors}
              isDark={isDark}
            />
          ))}
        </View>

        <View className={`${colors.card} rounded-3xl p-5 mb-6`}>
          <Text className={`${colors.text} font-semibold text-lg mb-2`}>
            Reflect & refocus
          </Text>
          <Text className={`${colors.textSecondary} text-xs mb-4`}>
            Take a minute to journal through one of these prompts.
          </Text>
          {reflections.map((prompt, index) => (
            <View
              key={prompt}
              className={`flex-row items-center py-3 ${
                index < reflections.length - 1
                  ? isDark
                    ? "border-white/10"
                    : "border-gray-200"
                  : ""
              } ${index < reflections.length - 1 ? "border-b" : ""}`}
            >
              <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center mr-3">
                <Text className="text-white/80 text-sm">{index + 1}</Text>
              </View>
              <Text className={`${colors.text} flex-1 text-sm`}>{prompt}</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.icon} />
            </View>
          ))}
        </View>

        <View
          className={`${isDark ? "bg-white" : "bg-white shadow-2xl"} rounded-3xl p-6 mb-6`}
        >
          <Text className="text-cyan-600 text-lg font-bold mb-2">
            Keep going!
          </Text>
          <Text className="text-gray-600 text-sm mb-3">
            You are 2 perfect days away from unlocking &quot;Perfect
            Month&quot;. Queue up your reminders and finish strong.
          </Text>
          <View className="flex-row gap-2">
            <View className="bg-gray-100 rounded-full px-3 py-1">
              <Text className="text-gray-700 text-xs font-semibold">
                Daily reminders on
              </Text>
            </View>
            <View className="bg-gray-100 rounded-full px-3 py-1">
              <Text className="text-gray-700 text-xs font-semibold">
                Next milestone: 48 streak
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
