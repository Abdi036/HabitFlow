import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface Reminder {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", title: "Morning Meditation", time: "07:00 AM", enabled: true },
    { id: "2", title: "Read 30 Minutes", time: "08:00 PM", enabled: true },
    { id: "3", title: "Workout", time: "06:00 PM", enabled: false },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className={`${isDark ? 'bg-white/20' : 'bg-white'} p-2 rounded-xl mr-4`}
          >
            <Ionicons name="arrow-back" size={24} color={colors.icon} />
          </TouchableOpacity>
          <View>
            <Text className={`${colors.text} text-2xl font-bold`}>Notifications</Text>
            <Text className={`${colors.textSecondary} text-sm`}>Manage your reminders</Text>
          </View>
        </View>

        {/* Reminders List */}
        <View className="space-y-4">
          {reminders.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons name="notifications-off-outline" size={48} color={colors.icon} />
              <Text className={`${colors.text} text-lg font-medium mt-4`}>No reminders set</Text>
              <Text className={`${colors.textSecondary} text-center mt-2`}>
                Add reminders to your habits to stay on track
              </Text>
            </View>
          ) : (
            reminders.map((reminder) => (
              <View 
                key={reminder.id}
                className={`${colors.card} p-4 rounded-2xl flex-row items-center justify-between`}
              >
                <View className="flex-1">
                  <Text className={`${colors.text} font-bold text-lg`}>{reminder.time}</Text>
                  <Text className={`${colors.textSecondary}`}>{reminder.title}</Text>
                </View>
                
                <View className="flex-row items-center gap-4">
                  <Switch
                    value={reminder.enabled}
                    onValueChange={() => toggleReminder(reminder.id)}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={reminder.enabled ? '#3AB5F6' : '#f4f3f4'}
                  />
                  <TouchableOpacity onPress={() => deleteReminder(reminder.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
