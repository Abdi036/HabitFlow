import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const { user, signOut, updateName } = useAuth();
  const { isDark, colors } = useTheme();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/signin");
  };

  const handleUpdateName = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    await updateName(editName);
    setSaving(false);
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditName(user?.name || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName(user?.name || "");
  };

  return (
    <LinearGradient colors={colors.background} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className={`${colors.card} rounded-3xl p-6 mb-8 items-center`}>
           <View
              className={`w-24 h-24 rounded-full ${isDark ? "bg-white/20" : "bg-gray-100"} items-center justify-center mb-4`}
            >
              <Ionicons name="person" size={48} color={colors.icon} />
            </View>
            
            <View className="items-center w-full">
              {isEditing ? (
                  <View className="flex-row items-center space-x-2 mb-1 w-full justify-center">
                      <TextInput 
                          value={editName}
                          onChangeText={setEditName}
                          className={`${colors.text} text-xl font-bold border-b border-gray-400 pb-1 text-center min-w-[150px]`}
                          autoFocus
                          onSubmitEditing={handleUpdateName}
                      />
                      <TouchableOpacity onPress={handleUpdateName} disabled={saving} className="p-2">
                         {saving ? <ActivityIndicator size="small" color={colors.tint} /> : <Ionicons name="checkmark-circle" size={24} color="#22c55e" />}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={cancelEditing} disabled={saving} className="p-2">
                          <Ionicons name="close-circle" size={24} color="#ef4444" />
                      </TouchableOpacity>
                  </View>
              ) : (
                  <View className="flex-row items-center mb-1">
                     <Text className={`${colors.text} text-2xl font-bold mr-2`}>
                        {user?.name || "HabitFlow user"}
                    </Text>
                    <TouchableOpacity onPress={startEditing} className="p-1">
                        <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
              )}
              
              <Text className={`${colors.textSecondary} text-sm`}>
                {user?.email}
              </Text>
            </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className={`w-full ${isDark ? "bg-red-500/10" : "bg-red-50"} rounded-2xl flex-row items-center justify-center py-4`}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={isDark ? "#fca5a5" : "#ef4444"}
          />
          <Text
            className={`${isDark ? "text-red-300" : "text-red-500"} font-semibold text-base ml-2`}
          >
            Sign Out
          </Text>
        </TouchableOpacity>

        <View className="mt-8">
            <Text className={`text-center ${colors.textSecondary} text-xs`}>
            HabitFlow v1.0.0
            </Text>
             <Text className={`text-center ${colors.textSecondary} text-[10px] mt-1 opacity-60`}>
            Build better rituals every day
            </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
