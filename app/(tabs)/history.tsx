import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface Habit {
  id: string;
  name: string;
  icon: string;
}

// Mock data
const mockHabits: Habit[] = [
  { id: "1", name: "Morning Meditation", icon: "🧘" },
  { id: "2", name: "Read 30 Minutes", icon: "📚" },
  { id: "3", name: "Workout", icon: "💪" },
];

const mockCompletions = [
  { habitId: "1", date: "2025-11-20" },
  { habitId: "1", date: "2025-11-21" },
  { habitId: "1", date: "2025-11-22" },
  { habitId: "1", date: "2025-11-23" },
  { habitId: "1", date: "2025-11-24" },
  { habitId: "1", date: "2025-11-25" },
  { habitId: "1", date: "2025-11-26" },
  { habitId: "2", date: "2025-11-24" },
  { habitId: "2", date: "2025-11-25" },
  { habitId: "2", date: "2025-11-26" },
  { habitId: "1", date: "2025-11-15" },
  { habitId: "1", date: "2025-11-10" },
  { habitId: "1", date: "2025-11-05" },
];

// Heatmap Component
const HabitHeatmap = ({ habitId }: { habitId: string }) => {
  const { isDark, colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const completedDates = mockCompletions
    .filter(c => c.habitId === habitId)
    .map(c => c.date);

  // Get current year range (Jan 1 - Dec 31)
  const today = new Date();
  const currentYear = today.getFullYear();
  const startDate = new Date(currentYear, 0, 1); // Jan 1
  const endDate = new Date(currentYear, 11, 31); // Dec 31

  // Align start date to the previous Sunday
  const dayOfWeek = startDate.getDay(); // 0 (Sun) - 6 (Sat)
  const alignedStartDate = new Date(startDate);
  alignedStartDate.setDate(startDate.getDate() - dayOfWeek);

  // Generate all dates for the grid
  const allDates: Date[] = [];
  const currentDate = new Date(alignedStartDate);
  
  while (currentDate <= endDate || allDates.length % 7 !== 0) {
    allDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Group dates by week (columns)
  const weekGroups: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weekGroups.push(allDates.slice(i, i + 7));
  }

  const isDateCompleted = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return completedDates.includes(dateStr);
  };

  const getMonthLabels = () => {
    const months: { label: string; index: number }[] = [];
    let lastMonth = -1;
    
    weekGroups.forEach((week, weekIndex) => {
      // Use the first day of the week that falls within the current year to determine the month
      const firstDayInYear = week.find(d => d.getFullYear() === currentYear);
      if (firstDayInYear) {
        const month = firstDayInYear.getMonth();
        if (month !== lastMonth) {
          months.push({
            label: firstDayInYear.toLocaleDateString('en-US', { month: 'short' }),
            index: weekIndex
          });
          lastMonth = month;
        }
      }
    });
    
    return months;
  };

  const monthLabels = getMonthLabels();
  const CELL_SIZE = 12;
  const GAP = 4;
  const CELL_PITCH = CELL_SIZE + GAP;

  return (
    <View className={`${colors.card} rounded-2xl p-4`}>
      <Text className={`${colors.text} font-semibold text-lg mb-4`}>Activity ({currentYear})</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          // Scroll to current date (approximate)
          const weekIndex = Math.floor((today.getTime() - alignedStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          scrollViewRef.current?.scrollTo({ x: weekIndex * CELL_PITCH - 100, animated: false });
        }}
      >
        <View>
          {/* Month labels */}
          <View className="flex-row mb-2 ml-8 h-6 relative">
            {monthLabels.map((month, idx) => (
              <Text
                key={idx}
                className={`${colors.textSecondary} text-xs absolute`}
                style={{ left: month.index * CELL_PITCH }}
              >
                {month.label}
              </Text>
            ))}
          </View>

          {/* Heatmap grid */}
          <View className="flex-row">
            {/* Day labels */}
            <View className="mr-2 pt-[2px]" style={{ gap: GAP }}>
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, idx) => (
                <View key={idx} style={{ height: CELL_SIZE, justifyContent: 'center' }}>
                  <Text className={`${colors.textSecondary} text-[10px]`}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Grid */}
            <View className="flex-row" style={{ gap: GAP }}>
              {weekGroups.map((week, weekIdx) => (
                <View key={weekIdx} style={{ gap: GAP }}>
                  {week.map((date, dayIdx) => {
                    const isCompleted = isDateCompleted(date);
                    const isFuture = date > today;
                    const isCurrentYear = date.getFullYear() === currentYear;
                    
                    // Hide days outside current year (padding days)
                    if (!isCurrentYear) {
                      return <View key={dayIdx} style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
                    }

                    return (
                      <View
                        key={dayIdx}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        className={`rounded-sm ${
                          isFuture
                            ? (isDark ? 'bg-white/5' : 'bg-gray-100')
                            : isCompleted
                            ? 'bg-green-400'
                            : (isDark ? 'bg-white/20' : 'bg-gray-200')
                        }`}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* Legend */}
          <View className="flex-row items-center mt-4 gap-2 ml-8">
            <Text className={`${colors.textSecondary} text-xs`}>Less</Text>
            <View className={`w-3 h-3 rounded-sm ${isDark ? 'bg-white/20' : 'bg-gray-200'}`} />
            <View className="w-3 h-3 rounded-sm bg-green-400/40" />
            <View className="w-3 h-3 rounded-sm bg-green-400/70" />
            <View className="w-3 h-3 rounded-sm bg-green-400" />
            <Text className={`${colors.textSecondary} text-xs`}>More</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default function HistoryScreen() {
  const { isDark, colors } = useTheme();
  const [selectedHabitId, setSelectedHabitId] = useState<string>(mockHabits[0]?.id || "");

  const calculateStreak = (habitId: string) => {
    const completions = mockCompletions
      .filter(c => c.habitId === habitId)
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    if (completions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < completions.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasCompletion = completions.some(d => {
        const completionDate = new Date(d);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === checkDate.getTime();
      });

      if (hasCompletion) {
        streak++;
      } else if (i === 0) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const hasYesterday = completions.some(d => {
          const completionDate = new Date(d);
          completionDate.setHours(0, 0, 0, 0);
          return completionDate.getTime() === yesterday.getTime();
        });
        if (hasYesterday) {
          streak = 1;
          continue;
        }
        break;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak(selectedHabitId);

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6 pt-12">
        <View className="mb-6">
          <Text className={`${colors.text} text-2xl font-bold mb-2`}>History</Text>
          <Text className={`${colors.textSecondary} text-sm`}>Track your progress over time</Text>
        </View>

        {mockHabits.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-6xl mb-4">📅</Text>
            <Text className={`${colors.text} text-xl font-semibold mb-2`}>No habits yet</Text>
            <Text className={`${colors.textSecondary}`}>Create habits to see your history</Text>
          </View>
        ) : (
          <View className="space-y-6">
            {/* Habit Selector */}
            <View>
              <Text className={`${colors.text} font-medium mb-3`}>Select Habit</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {mockHabits.map((habit) => (
                  <TouchableOpacity
                    key={habit.id}
                    onPress={() => setSelectedHabitId(habit.id)}
                    className={`px-4 py-3 rounded-xl flex-row items-center ${
                      selectedHabitId === habit.id
                        ? 'bg-white shadow-lg'
                        : (isDark ? 'bg-white/20' : 'bg-gray-200')
                    }`}
                  >
                    <Text className="text-xl mr-2">{habit.icon}</Text>
                    <Text className={`font-medium ${
                      selectedHabitId === habit.id ? 'text-cyan-500' : colors.text
                    }`}>
                      {habit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Streak Display */}
            <View className={`${colors.card} rounded-2xl p-6`}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className={`${colors.textSecondary} text-sm mb-1`}>Current Streak</Text>
                  <Text className={`${colors.text} text-4xl font-bold`}>{currentStreak} days</Text>
                </View>
                <View className="bg-orange-400/30 p-4 rounded-full">
                  <Ionicons name="flame" size={40} color="#fb923c" />
                </View>
              </View>
            </View>

            {/* Heatmap */}
            <HabitHeatmap habitId={selectedHabitId} />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
