import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getHabits } from "../../lib/appwrite";
import type { Habit } from "../../lib/types";

const CELL_SIZE = 16;
const CELL_GAP = 3;
const WEEK_COLUMN_WIDTH = CELL_SIZE + CELL_GAP;
const WEEKDAY_LABEL_WIDTH = 28;
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type HeatmapCell = {
  date: string | null;
  completed: boolean;
  isToday: boolean;
};

const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const calculateCurrentStreak = (dates: string[]) => {
  if (!dates.length) return 0;
  const uniqueSorted = Array.from(new Set(dates)).sort().reverse();
  let streak = 1;
  for (let i = 1; i < uniqueSorted.length; i++) {
    const previous = new Date(uniqueSorted[i - 1]);
    const current = new Date(uniqueSorted[i]);
    const diff = Math.round(
      (previous.getTime() - current.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (diff === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
};

const calculateLongestStreak = (dates: string[]) => {
  if (!dates.length) return 0;
  const uniqueSorted = Array.from(new Set(dates)).sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < uniqueSorted.length; i++) {
    const previous = new Date(uniqueSorted[i - 1]);
    const currentDate = new Date(uniqueSorted[i]);
    const diff = Math.round(
      (currentDate.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (diff === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
  }
  return longest;
};

const buildHeatmapWeeks = (dates: string[], year: number): HeatmapCell[][] => {
  const completedSet = new Set(dates);
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const weeks: HeatmapCell[][] = [];
  let currentWeek: HeatmapCell[] = [];
  const todayKey = formatDateKey(new Date());

  for (let i = 0; i < start.getDay(); i++) {
    currentWeek.push({ date: null, completed: false, isToday: false });
  }

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const dateKey = formatDateKey(date);
    currentWeek.push({
      date: dateKey,
      completed: completedSet.has(dateKey),
      isToday: dateKey === todayKey,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: null, completed: false, isToday: false });
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

const buildMonthLabelPositions = (weeks: HeatmapCell[][]) => {
  const labels: { month: string; weekIndex: number }[] = [];
  const monthsSeen = new Set<number>();

  weeks.forEach((week, weekIndex) => {
    const firstValidDay = week.find((day) => day.date !== null);
    if (!firstValidDay || !firstValidDay.date) return;
    const monthIndex = Number(firstValidDay.date.split("-")[1]) - 1;
    if (!monthsSeen.has(monthIndex)) {
      monthsSeen.add(monthIndex);
      labels.push({ month: MONTH_LABELS[monthIndex], weekIndex });
    }
  });

  return labels;
};

export default function HistoryScreen() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentYear = new Date().getFullYear();

  const fetchHabits = useCallback(
    async (showSpinner: boolean = true) => {
      if (!user) return;
      if (showSpinner) {
        setLoading(true);
      }
      try {
        const fetchedHabits = await getHabits(user.$id);
        setHabits(fetchedHabits);
        setSelectedHabitId((prev) => {
          if (!fetchedHabits.length) return null;
          return prev ?? fetchedHabits[0].$id;
        });
      } catch (error) {
        console.error("Error fetching habits:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [fetchHabits])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHabits(false);
  };

  const selectedHabit = useMemo(() => {
    if (!habits.length) return null;
    return habits.find((habit) => habit.$id === selectedHabitId) || habits[0];
  }, [habits, selectedHabitId]);

  useEffect(() => {
    if (!habits.length) return;
    if (!selectedHabitId) {
      setSelectedHabitId(habits[0].$id);
      return;
    }
    const exists = habits.some((habit) => habit.$id === selectedHabitId);
    if (!exists) {
      setSelectedHabitId(habits[0].$id);
    }
  }, [habits, selectedHabitId]);

  const streakStats = useMemo(() => {
    if (!selectedHabit) {
      return {
        current: 0,
        longest: 0,
        total: 0,
        lastCompleted: null as string | null,
      };
    }
    const { completedDates } = selectedHabit;
    const current = calculateCurrentStreak(completedDates);
    const longest = calculateLongestStreak(completedDates);
    const total = completedDates.length;
    const lastCompleted = completedDates.length
      ? completedDates.sort().slice(-1)[0]
      : null;
    return { current, longest, total, lastCompleted };
  }, [selectedHabit]);

  const heatmapWeeks = useMemo(() => {
    return buildHeatmapWeeks(selectedHabit?.completedDates ?? [], currentYear);
  }, [selectedHabit, currentYear]);

  const monthPositions = useMemo(
    () => buildMonthLabelPositions(heatmapWeeks),
    [heatmapWeeks]
  );

  return (
    <LinearGradient colors={colors.background} className="flex-1">
      <ScrollView
        className="flex-1 px-6 pt-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? "#fff" : "#000"}
          />
        }
      >
        <Text className={`${colors.text} text-4xl font-bold mb-2`}>
          History
        </Text>
        <Text className={`${colors.textSecondary} text-sm mb-6`}>
          Check your habit streaks and progress.
        </Text>

        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator
              size="large"
              color={isDark ? "#fff" : "#3AB5F6"}
            />
            <Text className={`${colors.textSecondary} mt-4`}>
              Loading your habits...
            </Text>
          </View>
        ) : habits.length === 0 ? (
          <View className={`${colors.card} p-8 rounded-3xl items-center`}>
            <Text className="text-5xl mb-4">📚</Text>
            <Text className={`${colors.text} text-lg font-semibold mb-2`}>
              No habits yet
            </Text>
            <Text className={`${colors.textSecondary} text-center`}>
              Create a habit to start tracking your progress over time.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
              className="-mx-1"
            >
              {habits.map((habit) => {
                const isSelected =
                  selectedHabit && habit.$id === selectedHabit.$id;
                return (
                  <TouchableOpacity
                    key={habit.$id}
                    onPress={() => setSelectedHabitId(habit.$id)}
                    className={`px-4 py-3 rounded-2xl mr-3 min-w-[150px] ${
                      isSelected ? "bg-white" : colors.card
                    }`}
                    activeOpacity={0.9}
                  >
                    <Text className="text-2xl mb-2">{habit.icon}</Text>
                    <Text
                      className={`font-semibold ${isSelected ? "text-gray-900" : colors.text}`}
                      numberOfLines={1}
                    >
                      {habit.name}
                    </Text>
                    <Text
                      className={`${colors.textSecondary} text-xs capitalize mt-1`}
                    >
                      {habit.category} • {habit.frequency}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedHabit && (
              <>
                <View className="mt-6">
                  <Text className={`${colors.text} text-xl font-semibold mb-3`}>
                    {selectedHabit.name} Overview
                  </Text>
                  <View className="flex-row gap-3">
                    <View className={`${colors.card} flex-1 p-4 rounded-2xl`}>
                      <Text className={`${colors.textSecondary} text-xs mb-1`}>
                        Current Streak
                      </Text>
                      <Text className={`${colors.text} text-3xl font-bold`}>
                        {streakStats.current}
                      </Text>
                      <Text className={`${colors.textSecondary} text-xs`}>
                        days in a row
                      </Text>
                    </View>
                    <View className={`${colors.card} flex-1 p-4 rounded-2xl`}>
                      <Text className={`${colors.textSecondary} text-xs mb-1`}>
                        Best Streak
                      </Text>
                      <Text className={`${colors.text} text-3xl font-bold`}>
                        {streakStats.longest}
                      </Text>
                      <Text className={`${colors.textSecondary} text-xs`}>
                        all-time best
                      </Text>
                    </View>
                  </View>
                  <View className={`${colors.card} mt-3 p-4 rounded-2xl`}>
                    <Text className={`${colors.textSecondary} text-xs mb-1`}>
                      Total Completions
                    </Text>
                    <Text className={`${colors.text} text-3xl font-bold`}>
                      {streakStats.total}
                    </Text>
                    {streakStats.lastCompleted && (
                      <Text className={`${colors.textSecondary} text-xs mt-1`}>
                        Last completed on{" "}
                        {new Date(streakStats.lastCompleted).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </Text>
                    )}
                  </View>
                </View>

                <View className={`${colors.card} mt-6 p-4 rounded-3xl`}>
                  <View className="flex-row justify-between items-center mb-4">
                    <View>
                      <Text className={`${colors.text} text-lg font-semibold`}>
                        Year in dots
                      </Text>
                      <Text className={`${colors.textSecondary} text-xs`}>
                        {currentYear}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-4 h-4 rounded-sm bg-green-500 mr-2" />
                      <Text className={`${colors.textSecondary} text-xs`}>
                        Completed
                      </Text>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      <View
                        className="flex-row mb-2"
                        style={{ marginLeft: WEEKDAY_LABEL_WIDTH }}
                      >
                        {monthPositions.map((label, index) => {
                          const previousWeekIndex =
                            index === 0
                              ? label.weekIndex
                              : monthPositions[index - 1].weekIndex;
                          const offset =
                            index === 0
                              ? label.weekIndex
                              : label.weekIndex - previousWeekIndex;
                          return (
                            <Text
                              key={`${label.month}-${label.weekIndex}`}
                              className={`${colors.textSecondary} text-xs`}
                              style={{
                                marginLeft:
                                  index === 0
                                    ? label.weekIndex * WEEK_COLUMN_WIDTH
                                    : offset * WEEK_COLUMN_WIDTH,
                              }}
                            >
                              {label.month}
                            </Text>
                          );
                        })}
                      </View>

                      <View className="flex-row">
                        <View
                          style={{ width: WEEKDAY_LABEL_WIDTH }}
                          className="mr-1"
                        >
                          {DAY_LABELS.map((day, index) => (
                            <Text
                              key={`${day}-${index}`}
                              className={`${colors.textSecondary} text-xs mb-1`}
                              style={{ height: CELL_SIZE + CELL_GAP }}
                            >
                              {index % 2 === 0 ? day : ""}
                            </Text>
                          ))}
                        </View>

                        <View className="flex-row">
                          {heatmapWeeks.map((week, weekIndex) => (
                            <View
                              key={`week-${weekIndex}`}
                              className="mr-[3px]"
                            >
                              {week.map((day, dayIndex) => {
                                if (!day.date) {
                                  return (
                                    <View
                                      key={`day-${weekIndex}-${dayIndex}`}
                                      style={{
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        marginBottom: CELL_GAP,
                                      }}
                                    />
                                  );
                                }

                                return (
                                  <View
                                    key={day.date}
                                    style={{
                                      width: CELL_SIZE,
                                      height: CELL_SIZE,
                                      marginBottom: CELL_GAP,
                                      backgroundColor: day.completed
                                        ? "#22c55e"
                                        : isDark
                                          ? "rgba(255,255,255,0.15)"
                                          : "#e5e7eb",
                                      borderWidth: day.isToday ? 1 : 0,
                                      borderColor: day.isToday
                                        ? "#facc15"
                                        : "transparent",
                                      borderRadius: 4,
                                    }}
                                  />
                                );
                              })}
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
