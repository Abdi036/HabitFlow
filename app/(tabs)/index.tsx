import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getHabits, updateHabit } from "../../lib/appwrite";
import type { Habit } from "../../lib/types";

export default function HomeScreen() {
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  const router = useRouter();
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    
    try {
      const fetchedHabits = await getHabits(user.$id);
      setHabits(fetchedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Refetch habits whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [fetchHabits])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHabits();
  };

  const toggleHabitCompletion = async (habitId: string, currentStatus: boolean, currentDates: string[]) => {
    try {
      // Optimistic update
      setHabits(habits.map(h => 
        h.$id === habitId ? { ...h, completed: !currentStatus } : h
      ));
      
      await updateHabit(habitId, !currentStatus, currentDates);
    } catch (error) {
      console.error('Error updating habit:', error);
      // Revert on error
      setHabits(habits.map(h => 
        h.$id === habitId ? { ...h, completed: currentStatus } : h
      ));
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
    >
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={isDark ? "#fff" : "#000"}
          />
        }
      >
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
          
          {loading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color={isDark ? "#fff" : "#3AB5F6"} />
              <Text className={`${colors.textSecondary} mt-4`}>Loading habits...</Text>
            </View>
          ) : habits.length === 0 ? (
            <View className={`${colors.card} p-8 rounded-2xl items-center`}>
              <Text className="text-6xl mb-4">📝</Text>
              <Text className={`${colors.text} font-semibold text-lg mb-2`}>No Habits Yet</Text>
              <Text className={`${colors.textSecondary} text-center mb-4`}>
                Start building better habits by creating your first one!
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/create')}
                className="bg-white px-6 py-3 rounded-xl"
              >
                <Text className="text-cyan-600 font-semibold">Create Habit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            habits.map((habit) => (
              <View 
                key={habit.$id} 
                className={`${colors.card} p-4 rounded-2xl mb-3 flex-row items-center justify-between`}
              >
                <View className="flex-row items-center flex-1">
                  <Text className="text-3xl mr-3">{habit.icon}</Text>
                  <View className="flex-1">
                    <Text className={`${colors.text} font-medium`}>{habit.name}</Text>
                    <Text className={`${colors.textSecondary} text-xs capitalize mt-1`}>
                      {habit.category} • {habit.frequency}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => toggleHabitCompletion(habit.$id, habit.completed, habit.completedDates)}
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    habit.completed ? 'bg-green-400' : (isDark ? 'bg-white/30' : 'bg-gray-200')
                  }`}
                >
                  {habit.completed && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
