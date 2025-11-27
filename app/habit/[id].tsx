import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { deleteHabit, getHabits, updateHabitDetails } from "../../lib/appwrite";
import type { Habit } from "../../lib/types";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  useEffect(() => {
    fetchHabit();
  }, [id, user]);

  const fetchHabit = async () => {
    if (!user || !id) return;
    try {
      // In a real app we might want a getHabit(id) function, 
      // but for now we can filter from the list or fetch all
      const habits = await getHabits(user.$id);
      const foundHabit = habits.find(h => h.$id === id);
      
      if (foundHabit) {
        setHabit(foundHabit);
        setName(foundHabit.name);
        setDescription(foundHabit.description || "");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Habit not found',
        });
        router.back();
      }
    } catch (error) {
      console.error('Error fetching habit:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load habit details',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!habit || name.trim() === habit.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateHabitDetails(habit.$id, { name: name.trim() });
      setHabit({ ...habit, name: name.trim() });
      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: 'Habit name updated successfully',
      });
    } catch (error) {
      console.error('Error updating name:', error);
      setName(habit.name); // Revert
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update name',
      });
    } finally {
      setIsEditingName(false);
    }
  };

  const handleUpdateDescription = async () => {
    if (!habit || description.trim() === (habit.description || "")) {
      setIsEditingDesc(false);
      return;
    }

    try {
      await updateHabitDetails(habit.$id, { description: description.trim() });
      setHabit({ ...habit, description: description.trim() });
      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: 'Description updated successfully',
      });
    } catch (error) {
      console.error('Error updating description:', error);
      setDescription(habit.description || ""); // Revert
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update description',
      });
    } finally {
      setIsEditingDesc(false);
    }
  };

  const performDelete = async () => {
    if (!habit) return;
    try {
      await deleteHabit(habit.$id);
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Habit deleted successfully',
      });
      // Use replace to ensure we go back to the tabs root and clear history stack if needed
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error deleting habit:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete habit',
      });
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Delete Habit",
        "Are you sure you want to delete this habit? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: performDelete
          }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <ActivityIndicator size="large" color={isDark ? "#fff" : "#3AB5F6"} />
      </View>
    );
  }

  if (!habit) return null;

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
    >
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white'}`}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className={`${colors.text} text-lg font-semibold`}>Habit Details</Text>
          <TouchableOpacity 
            onPress={handleDelete}
            className="w-10 h-10 rounded-full items-center justify-center bg-red-100"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6">
          {/* Icon & Name */}
          <View className="items-center mb-8">
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
              <Text className="text-5xl">{habit.icon}</Text>
            </View>
            
            {isEditingName ? (
              <TextInput
                value={name}
                onChangeText={setName}
                onBlur={handleUpdateName}
                autoFocus
                className={`${colors.text} text-2xl font-bold text-center border-b border-gray-300 pb-1 min-w-[200px]`}
                returnKeyType="done"
                onSubmitEditing={handleUpdateName}
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditingName(true)} className="flex-row items-center gap-2">
                <Text className={`${colors.text} text-2xl font-bold`}>{habit.name}</Text>
                <Ionicons name="pencil" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
            
            <View className="flex-row gap-2 mt-2">
              <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <Text className={`${colors.textSecondary} text-xs capitalize`}>{habit.category}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <Text className={`${colors.textSecondary} text-xs capitalize`}>{habit.frequency}</Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View className={`${colors.card} p-6 rounded-2xl mb-6`}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`${colors.text} font-semibold text-lg`}>Description</Text>
              {!isEditingDesc && (
                <TouchableOpacity onPress={() => setIsEditingDesc(true)}>
                  <Text className="text-cyan-500 text-sm font-medium">Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {isEditingDesc ? (
              <View>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  className={`${isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'} p-3 rounded-xl mb-3`}
                  textAlignVertical="top"
                  autoFocus
                />
                <View className="flex-row justify-end gap-3">
                  <TouchableOpacity 
                    onPress={() => {
                      setDescription(habit.description || "");
                      setIsEditingDesc(false);
                    }}
                    className="px-4 py-2"
                  >
                    <Text className={colors.textSecondary}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleUpdateDescription}
                    className="bg-cyan-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-medium">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingDesc(true)}>
                <Text className={`${colors.textSecondary} leading-6`}>
                  {habit.description || "No description added. Tap to add one."}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Preview */}
          <View className={`${colors.card} p-6 rounded-2xl mb-6`}>
            <Text className={`${colors.text} font-semibold text-lg mb-4`}>Statistics</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className={`${colors.text} text-2xl font-bold`}>{habit.completedDates.length}</Text>
                <Text className={`${colors.textSecondary} text-xs`}>Total Completions</Text>
              </View>
              <View className={`w-[1px] ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              <View className="items-center flex-1">
                <Text className={`${colors.text} text-2xl font-bold`}>
                  {habit.completed ? 'Yes' : 'No'}
                </Text>
                <Text className={`${colors.textSecondary} text-xs`}>Completed Today</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
