import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/signin');
  };

  return (
    <LinearGradient
      colors={colors.background}
      className="flex-1"
      key={isDark ? 'dark' : 'light'}
    >
      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="mb-6">
          <Text className={`${colors.text} text-2xl font-bold mb-2`}>Settings</Text>
          <Text className={`${colors.textSecondary} text-sm`}>Manage your preferences</Text>
        </View>

        {/* Profile Section */}
        <View className="mb-6">
          <View className={`${colors.card} rounded-2xl p-6 flex-row items-center gap-4`}>
            <View className={`w-16 h-16 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-100'} items-center justify-center`}>
              <Ionicons name="person" size={32} color={colors.icon} />
            </View>
            <View className="flex-1">
              <Text className={`${colors.text} font-bold text-lg`}>{user?.name || 'User'}</Text>
              <Text className={`${colors.textSecondary} text-sm`}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Settings List */}
        <View className="space-y-6 mb-8">
          {/* Appearance */}
          <View className="space-y-3">
            <Text className={`${colors.textSecondary} font-semibold text-xs uppercase tracking-wide ml-1`}>Appearance</Text>
            <View className={`${colors.card} rounded-2xl overflow-hidden`}>
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                  <View className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} items-center justify-center`}>
                    <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={colors.icon} />
                  </View>
                  <View>
                    <Text className={`${colors.text} font-medium`}>Dark Mode</Text>
                    <Text className={`${colors.textSecondary} text-xs`}>
                      {isDark ? "Dark theme enabled" : "Light theme enabled"}
                    </Text>
                  </View>
                </View>
                <Switch 
                  value={isDark} 
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isDark ? '#3AB5F6' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View className="space-y-3">
            <Text className={`${colors.textSecondary} font-semibold text-xs uppercase tracking-wide ml-1`}>Notifications</Text>
            <View className={`${colors.card} rounded-2xl overflow-hidden`}>
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                  <View className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} items-center justify-center`}>
                    <Ionicons name="notifications" size={20} color={colors.icon} />
                  </View>
                  <View>
                    <Text className={`${colors.text} font-medium`}>Push Notifications</Text>
                    <Text className={`${colors.textSecondary} text-xs`}>Get reminded about habits</Text>
                  </View>
                </View>
                <Switch 
                  value={notifications} 
                  onValueChange={setNotifications}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={notifications ? '#3AB5F6' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          {/* Account */}
          <View className="space-y-3">
            <Text className={`${colors.textSecondary} font-semibold text-xs uppercase tracking-wide ml-1`}>Account</Text>
            <View className={`${colors.card} rounded-2xl overflow-hidden`}>
              <TouchableOpacity className={`flex-row items-center gap-3 p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <View className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} items-center justify-center`}>
                  <Ionicons name="lock-closed" size={20} color={colors.icon} />
                </View>
                <Text className={`${colors.text} font-medium flex-1`}>Change Password</Text>
                <Ionicons name="chevron-forward" size={20} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"} />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-3 p-4">
                <View className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} items-center justify-center`}>
                  <Ionicons name="help-circle" size={20} color={colors.icon} />
                </View>
                <Text className={`${colors.text} font-medium flex-1`}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity 
            onPress={handleSignOut}
            className={`${isDark ? 'bg-red-500/20' : 'bg-red-50'} h-12 rounded-xl flex-row items-center justify-center`}
          >
            <Ionicons name="log-out-outline" size={20} color={isDark ? "#fca5a5" : "#ef4444"} className="mr-2" />
            <Text className={`${isDark ? 'text-red-300' : 'text-red-500'} font-semibold ml-2`}>Sign Out</Text>
          </TouchableOpacity>

          {/* App Info */}
          <Text className={`text-center ${colors.textSecondary} text-xs pt-4 pb-8`}>
            Daily Habit Tracker v1.0.0
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
