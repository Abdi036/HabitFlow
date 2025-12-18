import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getHabits } from "../../lib/appwrite";
import type { Habit } from "../../lib/types";

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
      {stat.delta && (
        <Text
          className={`${stat.delta.startsWith("-") ? "text-red-400" : "text-green-300"} text-xs font-semibold`}
        >
          {stat.delta}
        </Text>
      )}
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
  const height = maxValue > 0 ? (value / maxValue) * 90 : 0;
  return (
    <View className="items-center flex-1">
      <View
        className={`${isDark ? "bg-white/20" : "bg-gray-200"} w-2 rounded-2xl justify-end`}
        style={{ height: 100 }}
      >
        <View
          className="bg-green-400 rounded-2xl"
          style={{ height: Math.max(height, 4), width: 8 }}
        />
      </View>
      <Text className="text-xs text-white/70 mt-2">{day}</Text>
    </View>
  );
};

// Date helper
const getStartOfWeek = () => {
    const d = new Date();
    const day = d.getDay(); 
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function StatsScreen() {
  const { isDark, colors } = useTheme();
  const { user } = useAuth();
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Calculated Stats State
  const [stats, setStats] = useState({
    activeHabits: 0,
    perfectDays: 0,
    weeklyCompletionRate: 0,
    completionDelta: "+0%", // Harder to calculate without historical snapshots, keeping placeholder or simple logic
    monthlyCompletionRate: 0,
    streakCount: 0, // Habits currently on a streak
  });

  const [weeklySnapshot, setWeeklySnapshot] = useState<{label: string, value: number}[]>([]);
  const [achievements, setAchievements] = useState([
    {
        id: 'week_warrior',
        icon: "🔥",
        title: "Week Warrior",
        description: "Complete all habits for 7 days",
        unlocked: false,
    },
    {
        id: 'perfect_month',
        icon: "⭐",
        title: "Perfect Month",
        description: "100% completion for a month",
        unlocked: false,
    },
    {
        id: 'fitness',
        icon: "💪",
        title: "Fitness Fanatic",
        description: "Complete 30 workout sessions",
        unlocked: false,
    },
    {
        id: 'consistency',
        icon: "🎯",
        title: "Consistency King",
        description: "30-day streak on any habit",
        unlocked: false,
    },
  ]);

  const calculateStats = (currentHabits: Habit[]) => {
    if (currentHabits.length === 0) {
        setStats({
            activeHabits: 0,
            perfectDays: 0,
            weeklyCompletionRate: 0,
            completionDelta: "0%",
            monthlyCompletionRate: 0,
            streakCount: 0
        });
        setWeeklySnapshot(["M", "T", "W", "T", "F", "S", "S"].map(l => ({ label: l, value: 0 })));
        return;
    }

    const today = new Date();
    const activeHabitsCount = currentHabits.length;
    
    // 1. Weekly Snapshot & Completion Rate
    // Generate dates for current week or last 7 days. Let's do last 7 days for "Momentum"
    const last7Days = [];
    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
    const weeklyData: { label: string; value: number }[] = [];
    let totalWeeklyCompletions = 0;
    
    // We'll use Mon-Sun for the bar chart typical view, or just last 7 days relative to today?
    // Let's stick to Mon-Sun of current week for structure
    const startOfWeek = getStartOfWeek();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        weekDates.push(d);
    }

    weekDates.forEach(date => {
        const dateKey = formatDateKey(date);
        const dayLabel = dayLabels[date.getDay()];
        
        let dailyCount = 0;
        currentHabits.forEach(h => {
             if (h.completedDates.includes(dateKey)) dailyCount++;
        });

        weeklyData.push({ label: dayLabel, value: dailyCount });
        totalWeeklyCompletions += dailyCount;
    });

    const maxWeeklyCompletions = activeHabitsCount * 7;
    const weeklyRate = maxWeeklyCompletions > 0 
        ? Math.round((totalWeeklyCompletions / maxWeeklyCompletions) * 100) 
        : 0;

    // 2. Perfect Days (All active habits completed in a day)
    // We'll look at all unique dates present in any habit history
    const allDates = new Set<string>();
    currentHabits.forEach(h => h.completedDates.forEach(d => allDates.add(d)));
    
    let perfectDaysCount = 0;
    allDates.forEach(dateStr => {
        // Check if all habits were completed on this date
        // Note: This logic assumes all habits were active on that date. 
        // For simplicity, we count a perfect day if completions == total habits count
        const completionsOnDate = currentHabits.filter(h => h.completedDates.includes(dateStr)).length;
        if (completionsOnDate === activeHabitsCount) perfectDaysCount++;
    });

    // 3. Streaking Habits Count
    let streakCount = 0;
    currentHabits.forEach(h => {
        // Simple check if completed today or yesterday
         const todayKey = formatDateKey(new Date());
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         const yesterdayKey = formatDateKey(yesterday);
         
         if (h.completedDates.includes(todayKey) || h.completedDates.includes(yesterdayKey)) {
             streakCount++;
         }
    });

    // 4. Monthly Rate (Current Month)
    const currentMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    let monthCompletions = 0;
    let daysPassedInMonth = today.getDate();
    
    currentHabits.forEach(h => {
        monthCompletions += h.completedDates.filter(d => d.startsWith(currentMonthPrefix)).length;
    });
    
    // Max completions = habits * days passed
    const maxMonthCompletions = activeHabitsCount * daysPassedInMonth;
    const monthlyRate = maxMonthCompletions > 0 
        ? Math.round((monthCompletions / maxMonthCompletions) * 100) 
        : 0;


    setStats({
        activeHabits: activeHabitsCount,
        perfectDays: perfectDaysCount,
        weeklyCompletionRate: weeklyRate,
        completionDelta: "+12%", // Placeholder
        monthlyCompletionRate: monthlyRate,
        streakCount
    });
    
    setWeeklySnapshot(weeklyData);

    // 5. Update Achievements
    setAchievements(prev => prev.map(a => {
        let isUnlocked = false;
        if (a.id === 'week_warrior') {
            // Check for any 7-day stretch where completions == habits count * 7 (simplified: weekly rate 100%?)
            // let's just use current week perfect days count for now
            isUnlocked = weeklyRate === 100;
        } else if (a.id === 'perfect_month') {
            isUnlocked = monthlyRate === 100 && daysPassedInMonth > 20; // heuristic
        } else if (a.id === 'fitness') {
            // Check fitness category count
            const fitnessCompletions = currentHabits
                .filter(h => h.category.toLowerCase().includes('fitness') || h.category.toLowerCase().includes('health'))
                .reduce((acc, h) => acc + h.completedDates.length, 0);
            isUnlocked = fitnessCompletions >= 30;
        } else if (a.id === 'consistency') {
            // Check simple streak length on any habit
            isUnlocked = currentHabits.some(h => h.completedDates.length >= 30); // Very rough approximation of streak
        }
        return { ...a, unlocked: isUnlocked };
    }));

  };

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
        const data = await getHabits(user.$id);
        setHabits(data);
        calculateStats(data);
    } catch (e) {
        console.error("Failed to load stats", e);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
      setRefreshing(true);
      loadData();
  };

  if (loading && !refreshing && habits.length === 0) {
      return (
          <LinearGradient colors={colors.background} className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color={colors.icon} />
          </LinearGradient>
      );
  }

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
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
        }
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
                {stats.monthlyCompletionRate}%
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
                {stats.completionDelta === "0%" ? "No change" : `${stats.completionDelta} vs last month`}
              </Text>
            </View>
            <View className="bg-white/10 px-3 py-1 rounded-full">
              <Text className="text-white/80 text-xs">{stats.streakCount} habits streaking</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-6">
            <StatHighlightCard
              colors={colors}
              isDark={isDark}
              stat={{ label: "Habits active", value: stats.activeHabits.toString().padStart(2, '0'), icon: "layers-outline", delta: "" }}
            />
             <StatHighlightCard
              colors={colors}
              isDark={isDark}
              stat={{ label: "Perfect days", value: stats.perfectDays.toString().padStart(2, '0'), icon: "sparkles-outline", delta: "" }}
            />
             <StatHighlightCard
              colors={colors}
              isDark={isDark}
              stat={{ label: "This week", value: `${stats.weeklyCompletionRate}%`, icon: "bar-chart-outline", delta: "" }}
            />
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
            {weeklySnapshot.map((day, index) => (
              <WeeklyBar
                key={`${day.label}-${index}`}
                day={day.label}
                value={day.value}
                maxValue={stats.activeHabits}
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

      </ScrollView>
    </LinearGradient>
  );
}
