import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { createHabit } from "../../lib/appwrite";
import type { HabitFormData } from "../../lib/types";

const categories = [
  "Health",
  "Productivity",
  "Mindfulness",
  "Learning",
  "Social",
  "Other",
];

const frequencies = ["daily", "weekly", "monthly"];
const icons = ["📝", "💪", "📚", "🧘", "💧", "🍳", "💰", "🎨", "🎵", "💤"];

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

  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.category.trim()) {
      setError("Give your habit a name and category first.");
      return;
    }

    if (!user) {
      setError("You need to be signed in to create habits.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await createHabit(user.$id, { ...formData, description });
      setFormData({
        name: "",
        category: "",
        frequency: "daily",
        icon: "📝",
      });
      setDescription("");
      router.back();
    } catch (err) {
      console.error("Create habit error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = useMemo(() => {
    return Boolean(
      formData.name.trim() && formData.category.trim() && !loading
    );
  }, [formData, loading]);

  return (
    <LinearGradient colors={colors.background} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-14">
          <View className={`${colors.card} rounded-3xl p-6 mb-5`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className={`${colors.text} text-3xl font-bold mb-2`}>
                  Craft a new habit
                </Text>
                <Text className={`${colors.textSecondary} text-sm`}>
                  Name it, add context, and set the rhythm. We{"'"}ll track the
                  rest.
                </Text>
              </View>
              <View
                className={`${isDark ? "bg-white/20" : "bg-gray-100"} w-16 h-16 rounded-2xl items-center justify-center`}
              >
                <Text className="text-3xl">{formData.icon}</Text>
              </View>
            </View>
          </View>

          <View className={`${colors.card} rounded-3xl p-5 mb-5`}>
            <Text className={`${colors.text} text-base font-semibold`}>
              Habit basics
            </Text>
            <View className="mt-4">
              <Text
                className={`${colors.textSecondary} text-xs mb-2 uppercase tracking-wide`}
              >
                Name
              </Text>
              <View
                className={`${isDark ? "bg-white/15" : "bg-gray-100"} rounded-2xl px-4 py-3 flex-row items-center`}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={18}
                  color={colors.icon}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  className={`flex-1 ${colors.text}`}
                  placeholder="e.g. Morning stretch"
                  placeholderTextColor={
                    isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
                  }
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>
            </View>

            <View className="mt-4">
              <Text
                className={`${colors.textSecondary} text-xs mb-3 uppercase tracking-wide`}
              >
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = formData.category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() =>
                        setFormData({ ...formData, category: cat })
                      }
                      className={`px-4 py-2 rounded-2xl border ${
                        active
                          ? "border-transparent bg-white"
                          : isDark
                            ? "border-white/20"
                            : "border-gray-200"
                      }`}
                    >
                      <Text
                        className={`${active ? "text-gray-900 font-semibold" : colors.textSecondary}`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View className="mt-4">
              <Text
                className={`${colors.textSecondary} text-xs mb-3 uppercase tracking-wide`}
              >
                Frequency
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {frequencies.map((freq) => {
                  const active = formData.frequency === freq;
                  return (
                    <TouchableOpacity
                      key={freq}
                      onPress={() =>
                        setFormData({ ...formData, frequency: freq })
                      }
                      className={`px-4 py-2 rounded-2xl ${
                        active
                          ? "bg-white"
                          : isDark
                            ? "bg-white/10"
                            : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`capitalize ${
                          active ? "text-gray-900 font-semibold" : colors.text
                        }`}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View className={`${colors.card} rounded-3xl p-5 mb-5`}>
            <Text className={`${colors.text} text-base font-semibold`}>
              Describe the ritual
            </Text>
            <Text className={`${colors.textSecondary} text-xs mt-1`}>
              Optional, but it helps you remember why you{"'"}re doing it.
            </Text>
            <View
              className={`${isDark ? "bg-white/15" : "bg-gray-100"} rounded-2xl px-4 py-3 mt-4`}
            >
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholder="I will stretch for 5 minutes right after I wake up."
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)"
                }
                textAlignVertical="top"
                className={`${colors.text}`}
              />
            </View>
          </View>

          <View className={`${colors.card} rounded-3xl p-5 mb-6`}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className={`${colors.text} text-base font-semibold`}>
                Pick an icon
              </Text>
              <Text className={`${colors.textSecondary} text-xs`}>
                Tap to select
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {icons.map((icon) => {
                const active = formData.icon === icon;
                return (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setFormData({ ...formData, icon })}
                    className={`${
                      active
                        ? "bg-white"
                        : isDark
                          ? "bg-white/10"
                          : "bg-gray-100"
                    } w-14 h-14 rounded-2xl items-center justify-center`}
                    activeOpacity={0.9}
                  >
                    <Text className="text-2xl">{icon}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {error && (
            <View className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 mb-4">
              <Text
                className={`${isDark ? "text-red-200" : "text-red-600"} text-sm`}
              >
                {error}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleCreate}
            disabled={!canSubmit}
            className={`${
              canSubmit ? "bg-white" : "bg-white/30"
            } h-14 rounded-2xl items-center justify-center mb-10 shadow-lg`}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#3AB5F6" />
            ) : (
              <Text
                className={`text-lg font-semibold ${canSubmit ? "text-cyan-600" : "text-white/60"}`}
              >
                Create habit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
