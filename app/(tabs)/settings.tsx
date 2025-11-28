import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const SettingRow = ({
  icon,
  title,
  subtitle,
  children,
  colors,
  isDark,
}: any) => (
  <View
    className={`${colors.card} rounded-2xl p-4 flex-row items-center justify-between mb-3`}
  >
    <View className="flex-row items-center gap-3 flex-1">
      <View
        className={`w-11 h-11 rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"} items-center justify-center`}
      >
        <Ionicons name={icon} size={20} color={colors.icon} />
      </View>
      <View className="flex-1">
        <Text className={`${colors.text} font-medium`}>{title}</Text>
        {subtitle ? (
          <Text className={`${colors.textSecondary} text-xs mt-1`}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
    {children}
  </View>
);

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/signin");
  };

  return (
    <LinearGradient colors={colors.background} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className={`${colors.card} rounded-3xl p-6 mb-6`}>
          <View className="flex-row items-center mb-4">
            <View
              className={`w-16 h-16 rounded-2xl ${isDark ? "bg-white/20" : "bg-gray-100"} items-center justify-center mr-4`}
            >
              <Ionicons name="person" size={32} color={colors.icon} />
            </View>
            <View className="flex-1">
              <Text className={`${colors.text} text-lg font-semibold`}>
                {user?.name || "HabitFlow user"}
              </Text>
              <Text className={`${colors.textSecondary} text-xs`}>
                {user?.email}
              </Text>
            </View>
            <View className="bg-white/15 px-3 py-1 rounded-full">
              <Text className="text-white text-xs">Streak 12</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/10 rounded-2xl p-3">
              <Text className="text-white/70 text-xs uppercase">Habits</Text>
              <Text className="text-white text-2xl font-bold mt-1">6</Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-2xl p-3">
              <Text className="text-white/70 text-xs uppercase">
                Completion
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">87%</Text>
            </View>
          </View>
        </View>

        <Text
          className={`${colors.textSecondary} text-xs uppercase tracking-[3px] mb-3`}
        >
          Preferences
        </Text>
        <SettingRow
          icon={isDark ? "moon" : "sunny"}
          title="Dark mode"
          subtitle={isDark ? "Dark theme enabled" : "Light theme enabled"}
          colors={colors}
          isDark={isDark}
        >
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#a1a1aa", true: "#60a5fa" }}
            thumbColor={isDark ? "#3AB5F6" : "#f4f3f4"}
          />
        </SettingRow>
        <SettingRow
          icon="notifications"
          title="Push reminders"
          subtitle="Get nudges right before your habit window"
          colors={colors}
          isDark={isDark}
        >
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#a1a1aa", true: "#60a5fa" }}
            thumbColor={notifications ? "#3AB5F6" : "#f4f3f4"}
          />
        </SettingRow>
        <SettingRow
          icon="calendar"
          title="Weekly email"
          subtitle="Receive a summary every Sunday"
          colors={colors}
          isDark={isDark}
        >
          <Switch
            value={weeklySummary}
            onValueChange={setWeeklySummary}
            trackColor={{ false: "#a1a1aa", true: "#60a5fa" }}
            thumbColor={weeklySummary ? "#3AB5F6" : "#f4f3f4"}
          />
        </SettingRow>

        <Text
          className={`${colors.textSecondary} text-xs uppercase tracking-[3px] mt-6 mb-3`}
        >
          Focus tools
        </Text>
        <View className={`${colors.card} rounded-3xl p-5 mb-6`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className={`${colors.text} text-base font-semibold`}>
                Focus mode
              </Text>
              <Text className={`${colors.textSecondary} text-xs mt-1`}>
                Hide completed habits for the rest of the day to reduce noise.
              </Text>
            </View>
            <TouchableOpacity
              className="bg-white rounded-2xl px-4 py-2"
              activeOpacity={0.9}
            >
              <Text className="text-cyan-600 text-xs font-semibold">
                Configure
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-4 bg-white/10 rounded-2xl p-4">
            <Text className="text-white text-xs uppercase tracking-[2px] mb-1">
              Active windows
            </Text>
            <Text className="text-white text-sm">
              Morning 6-9 AM · Evening 8-10 PM
            </Text>
          </View>
        </View>

        <Text
          className={`${colors.textSecondary} text-xs uppercase tracking-[3px] mb-3`}
        >
          Account
        </Text>
        <View className={`${colors.card} rounded-3xl mb-6`}>
          {[
            { icon: "lock-closed", title: "Change password" },
            { icon: "mail", title: "Contact support" },
            { icon: "document-text", title: "Terms & privacy" },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.title}
              className={`flex-row items-center justify-between px-5 py-4 ${
                index < arr.length - 1
                  ? isDark
                    ? "border-white/10"
                    : "border-gray-200"
                  : ""
              } ${index < arr.length - 1 ? "border-b" : ""}`}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"} items-center justify-center`}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={colors.icon}
                  />
                </View>
                <Text className={`${colors.text} font-medium`}>
                  {item.title}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className={`${isDark ? "bg-red-500/10" : "bg-red-50"} rounded-2xl flex-row items-center justify-center py-4 mb-4`}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={isDark ? "#fca5a5" : "#ef4444"}
          />
          <Text
            className={`${isDark ? "text-red-300" : "text-red-500"} font-semibold ml-2`}
          >
            Sign out
          </Text>
        </TouchableOpacity>

        <Text className={`text-center ${colors.textSecondary} text-xs`}>
          HabitFlow v1.0.0 · Build better rituals every day
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
