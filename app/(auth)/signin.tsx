import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <LinearGradient
      colors={["#3AB5F6", "#5B7EF8", "#8364FF"]}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerClassName="min-h-full">
          <View className="flex-1 px-6 pt-12">
            {/* Back Button */}
            <TouchableOpacity 
              onPress={() => router.push("/")} 
              className="self-start mb-8"
            >
              <View className="flex-row items-center">
                <Ionicons name="arrow-back" size={20} color="white" />
                <Text className="text-white text-lg ml-2">Back</Text>
              </View>
            </TouchableOpacity>

            {/* Title */}
            <View className="mb-8 mt-12">
              <Text className="text-4xl font-bold text-white text-center mb-2">Welcome Back</Text>
              <Text className="text-white/80 text-center">Sign in to continue your journey</Text>
            </View>

            {/* Form Card */}
            <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg mb-8">
              {/* Email */}
              <View className="mb-4">
                <Text className="text-white mb-2 ml-1 font-medium">Email</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" />
                  </View>
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-white/20 border border-white/30 text-white h-12 rounded-xl pl-10 pr-4"
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-2">
                <Text className="text-white mb-2 ml-1 font-medium">Password</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                  </View>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="bg-white/20 border border-white/30 text-white h-12 rounded-xl pl-10 pr-4"
                  />
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity 
                onPress={() => router.push('/(auth)/forgotpassword')}
                className="mb-6"
              >
                <Text className="text-white/80 text-right text-sm underline">Forgot password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
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

              {/* Sign Up Link */}
              <Text className="text-white/80 text-center text-sm">
                Don't have an account?{' '}
                <Text 
                  className="font-semibold underline text-white"
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
