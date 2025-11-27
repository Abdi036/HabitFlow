import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

// Static colors for auth pages (vibrant dark theme)
const AUTH_COLORS = {
  background: ["#3AB5F6", "#5B7EF8", "#8364FF"] as const,
  text: "text-white",
  textSecondary: "text-white/80",
  icon: "white",
};

/**
 * FORGOT PASSWORD SCREEN (UI ONLY - NO FUNCTIONALITY)
 * 
 * This screen is for UI purposes only
 * No actual password recovery functionality implemented
 */

const ForgotPasswordScreen = () => {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * HANDLE SUBMIT - UI ONLY
   * 
   * Just shows a message, doesn't actually send emails
   */
  const handleSubmit = async () => {
    // VALIDATION: Check email is filled
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter your email address'
      });
      return;
    }

    // Basic email validation
    if (!email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address'
      });
      return;
    }

    // Start loading state (just for UI)
    setLoading(true);
    
    // Simulate delay
    setTimeout(() => {
      setLoading(false);
      
      // Show success message
      Toast.show({
        type: 'info',
        text1: 'Feature Coming Soon',
        text2: 'Password recovery will be available in a future update'
      });
      
      // Go back after delay
      setTimeout(() => {
        router.back();
      }, 2000);
    }, 1000);
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
        <View className="flex-1 px-6 pt-12">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="self-start mb-8"
          >
            <View className="flex-row items-center">
              <Ionicons name="arrow-back" size={20} color={AUTH_COLORS.icon} />
              <Text className={`${AUTH_COLORS.text} text-lg ml-2`}>Back</Text>
            </View>
          </TouchableOpacity>

          {/* Center Content */}
          <View className="flex-1 justify-center">
            {/* Title */}
            <View className="mb-8">
              <Text className={`text-4xl font-bold ${AUTH_COLORS.text} text-center mb-2`}>Forgot Password</Text>
              <Text className={`${AUTH_COLORS.textSecondary} text-center`}>We'll send you a reset link</Text>
            </View>

            {/* Form Card */}
            <View className="bg-white/20 rounded-3xl p-6 shadow-lg">
              {/* Email */}
              <View className="mb-6">
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

              {/* Send Reset Link Button */}
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-white h-12 rounded-xl justify-center items-center mb-6 shadow-md ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="#3AB5F6" />
                ) : (
                  <Text className="text-cyan-500 text-lg font-semibold">Send Reset Link</Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <Text className={`${AUTH_COLORS.textSecondary} text-center text-sm`}>
                Remember your password?{' '}
                <Text 
                  className={`font-semibold underline ${AUTH_COLORS.text}`}
                  onPress={() => router.push('/(auth)/signin')}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ForgotPasswordScreen;
