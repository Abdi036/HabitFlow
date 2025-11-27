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

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all fields'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match'
      });
      return;
    }

    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 8 characters'
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    
    if (error) {
      let errorMessage = error.message || 'An error occurred during sign up';
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: errorMessage
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Account created successfully'
      });
      
      setTimeout(() => {
        router.push('/(auth)/signin');
      }, 1000);
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
          <View className="flex-1 px-6 pt-12">

            {/* User Icon */}
            <View className="items-center mb-6">
              <Ionicons 
                name="person-circle-outline" 
                size={100} 
                color={AUTH_COLORS.icon} 
              />
            </View>

            {/* Title */}
            <View className="mb-8">
              <Text className={`text-4xl font-bold ${AUTH_COLORS.text} text-center mb-2`}>Create Account</Text>
              <Text className={`${AUTH_COLORS.text} font-bold text-center`}>Start your habit journey today</Text>
            </View>

            {/* Form Card */}
            <View className="bg-white/20 rounded-3xl p-6 shadow-lg mb-8">
              
              {/* Full Name */}
              <View className="mb-4">
                <Text className={`${AUTH_COLORS.text} mb-2 ml-1 font-medium`}>Full Name</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="person-outline" size={20} color={AUTH_COLORS.icon} />
                  </View>
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={fullName}
                    onChangeText={setFullName}
                    className={`bg-white/20 border-white/30 border ${AUTH_COLORS.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

              {/* Email */}
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

              {/* Password */}
              <View className="mb-4">
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

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className={`${AUTH_COLORS.text} mb-2 ml-1 font-medium`}>Confirm Password</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="lock-closed-outline" size={20} color={AUTH_COLORS.icon} />
                  </View>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    className={`bg-white/20 border-white/30 border ${AUTH_COLORS.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-white h-12 rounded-xl justify-center items-center mb-4 shadow-md ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="#3AB5F6" />
                ) : (
                  <Text className="text-cyan-500 text-lg font-semibold">Sign Up</Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <Text className={`${AUTH_COLORS.text} text-center text-sm`}>
                Already have an account?{' '}
                <Text
                  className={`p-2 font-bold underline ${AUTH_COLORS.text}`}
                  onPress={() => router.push('/(auth)/signin')}
                >
                  Sign In
                </Text>
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SignUpScreen;
