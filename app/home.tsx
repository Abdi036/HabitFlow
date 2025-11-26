import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <LinearGradient
      colors={["#3AB5F6", "#8364FF"]}
      className="flex-1 justify-center items-center px-6"
    >
      <View className="items-center mb-10">
        <Text className="text-5xl mb-4">🎉</Text>
        <Text className="text-white text-3xl font-bold text-center mb-2">
          Welcome to HabitFlow
        </Text>
        <Text className="text-white/90 text-center mb-4">
          {user?.name || 'User'}
        </Text>
        <Text className="text-white/70 text-center text-sm">
          {user?.email}
        </Text>
      </View>

      <TouchableOpacity 
        className="bg-white px-10 py-4 rounded-full shadow-lg"
        onPress={handleSignOut}
      >
        <Text className="text-blue-600 font-semibold text-lg">Sign Out</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
