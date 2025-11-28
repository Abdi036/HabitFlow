import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';

// Static colors for auth pages (vibrant dark theme)
const AUTH_COLORS = {
  background: ["#3AB5F6", "#5B7EF8", "#8364FF"] as const,
  text: "text-white",
  icon: "white",
};

const SignInScreen = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter both email and password'
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      let errorMessage = 'Invalid email or password';
      
      if (error.message && error.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message) {
        errorMessage = error.message;
      }
     
    } else {      
      router.replace('/(tabs)');
    }
  };

  return (
    <LinearGradient
      colors={AUTH_COLORS.background}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerClassName="min-h-full">
          <View className="flex-1 px-6 flex justify-center">

            <View className="items-center mb-6">
              <Ionicons 
                name="person-circle-outline" 
                size={100} 
                color={AUTH_COLORS.icon} 
              />
            </View>

            <View className="mb-8 mt-2">
              <Text className={`text-4xl font-bold ${AUTH_COLORS.text} text-center mb-4`}>Welcome Back</Text>
              <Text className={`${AUTH_COLORS.text} text-center font-bold`}>Sign in to continue your journey</Text>
            </View>

            <View className="bg-white/20 rounded-3xl p-6 shadow-lg mb-8">
              <View className="mb-4">
                <Text className={`${AUTH_COLORS.text} mb-2 ml-1 font-medium`}>Email</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="mail-outline" size={20} color={AUTH_COLORS.icon} />
                  </View>
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`bg-white/20 border-white/30 border ${AUTH_COLORS.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

              <View className="mb-2">
                <Text className={`${AUTH_COLORS.text} mb-2 ml-1 font-medium`}>Password</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="lock-closed-outline" size={20} color={AUTH_COLORS.icon} />
                  </View>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className={`bg-white/20 border-white/30 border ${AUTH_COLORS.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => router.push('/(auth)/forgotpassword')}
                className="mb-6"
              >
                <Text className={`${AUTH_COLORS.text} text-right font-bold text-sm underline`}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-white h-12 rounded-xl justify-center items-center mb-4 shadow-md ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="#3AB5F6" />
                ) : (
                  <Text className="text-cyan-500 text-lg font-semibold">Sign In</Text>
                )}
              </TouchableOpacity>

              <Text className={`${AUTH_COLORS.text} font-semibold text-center text-sm`}>
                Don't have an account?{' '}
                <Text 
                  className={`p-2 font-bold underline ${AUTH_COLORS.text}`}
                  onPress={() => router.push('/(auth)/signup')}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SignInScreen;
