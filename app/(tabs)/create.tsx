import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { createHabit } from "../../lib/appwrite";
import type { HabitFormData } from "../../lib/types";

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>({
    name: "",
    category: "",
    frequency: "daily",
    icon: "📝",
  });

  const categories = ["Health", "Productivity", "Mindfulness", "Learning", "Social", "Other"];
  const frequencies = ["daily", "weekly", "monthly"];
  const icons = ["📝", "💪", "📚", "🧘", "💧", "🍳", "💰", "🎨", "🎵", "💤"];

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);

  const handleCreate = async () => {
    if (!formData.name || !formData.category) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'You must be logged in to create habits',
      });
      return;
    }

    setLoading(true);
    try {
      await createHabit(user.$id, formData);
      
      Toast.show({
        type: 'success',
        text1: 'Habit Created',
        text2: 'Your new habit has been added successfully',
      });
      
      // Reset form
      setFormData({
        name: "",
        category: "",
        frequency: "daily",
        icon: "📝",
      });
      
      router.back();
    } catch (error: any) {
      console.error('Create habit error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to create habit',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6 pt-12">
        <View className="mb-6">
          <Text className={`${colors.text} text-2xl font-bold mb-2`}>Create New Habit</Text>
          <Text className={`${colors.textSecondary} text-sm`}>Build a better version of yourself</Text>
        </View>

        <View className="space-y-6">
          {/* Name Input */}
          <View>
            <Text className={`${colors.text} font-medium mb-2`}>Habit Name</Text>
            <TextInput
              className={`${colors.card} p-4 rounded-xl ${colors.text}`}
              placeholder="e.g., Morning Meditation"
              placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Category Dropdown */}
          <View className="z-20">
            <Text className={`${colors.text} font-medium mb-2`}>Category</Text>
            <TouchableOpacity
              onPress={() => {
                setShowCategoryPicker(!showCategoryPicker);
                setShowFrequencyPicker(false);
              }}
              className={`${colors.card} p-4 rounded-xl flex-row justify-between items-center`}
            >
              <Text className={formData.category ? colors.text : colors.textSecondary}>
                {formData.category || "Select Category"}
              </Text>
              <Ionicons 
                name={showCategoryPicker ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.icon} 
              />
            </TouchableOpacity>
            
            {showCategoryPicker && (
              <View className={`absolute top-full left-0 right-0 mt-2 ${colors.card} rounded-xl overflow-hidden shadow-lg z-50`}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setFormData({ ...formData, category: cat });
                      setShowCategoryPicker(false);
                    }}
                    className={`p-4 border-b border-gray-100/10 ${
                      formData.category === cat ? (isDark ? 'bg-white/10' : 'bg-gray-100') : ''
                    }`}
                  >
                    <Text className={formData.category === cat ? 'text-cyan-500 font-medium' : colors.text}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className={`${colors.text} font-medium mb-3`}>Description (Optional)</Text>
            <TextInput
              className={`${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'} p-4 rounded-xl`}
              placeholder="Add a description..."
              placeholderTextColor={colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Frequency Dropdown */}
          <View className="z-10">
            <Text className={`${colors.text} font-medium mb-2`}>Frequency</Text>
            <TouchableOpacity
              onPress={() => {
                setShowFrequencyPicker(!showFrequencyPicker);
                setShowCategoryPicker(false);
              }}
              className={`${colors.card} p-4 rounded-xl flex-row justify-between items-center`}
            >
              <Text className={`${colors.text} capitalize`}>
                {formData.frequency}
              </Text>
              <Ionicons 
                name={showFrequencyPicker ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.icon} 
              />
            </TouchableOpacity>

            {showFrequencyPicker && (
              <View className={`absolute top-full left-0 right-0 mt-2 ${colors.card} rounded-xl overflow-hidden shadow-lg z-50`}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    onPress={() => {
                      setFormData({ ...formData, frequency: freq });
                      setShowFrequencyPicker(false);
                    }}
                    className={`p-4 border-b border-gray-100/10 capitalize ${
                      formData.frequency === freq ? (isDark ? 'bg-white/10' : 'bg-gray-100') : ''
                    }`}
                  >
                    <Text className={formData.frequency === freq ? 'text-cyan-500 font-medium' : colors.text}>
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Icon Selection */}
          <View>
            <Text className={`${colors.text} font-medium mb-2`}>Icon</Text>
            <View className="flex-row flex-wrap gap-3">
              {icons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setFormData({ ...formData, icon })}
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    formData.icon === icon
                      ? 'bg-white'
                      : (isDark ? 'bg-white/10' : 'bg-gray-100')
                  }`}
                >
                  <Text className="text-2xl">{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={loading}
            className="bg-white h-14 rounded-xl items-center justify-center mt-4 mb-8 shadow-lg"
          >
            {loading ? (
              <ActivityIndicator color="#3AB5F6" />
            ) : (
              <Text className="text-cyan-600 font-bold text-lg">Create Habit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
