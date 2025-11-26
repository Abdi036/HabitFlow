import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * FORGOT PASSWORD SCREEN (UI ONLY - NO FUNCTIONALITY)
 * 
 * This screen is for UI purposes only
 * No actual password recovery functionality implemented
 */

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  
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
      colors={colors.background}
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
              <Ionicons name="arrow-back" size={20} color={colors.icon} />
              <Text className={`${colors.text} text-lg ml-2`}>Back</Text>
            </View>
          </TouchableOpacity>

          {/* Center Content */}
          <View className="flex-1 justify-center">
            {/* Title */}
            <View className="mb-8">
              <Text className={`text-4xl font-bold ${colors.text} text-center mb-2`}>Forgot Password</Text>
              <Text className={`${colors.textSecondary} text-center`}>We'll send you a reset link</Text>
            </View>

            {/* Form Card */}
            <View className={`${colors.card} rounded-3xl p-6 shadow-lg`}>
              {/* Email */}
              <View className="mb-6">
                <Text className={`${colors.text} mb-2 ml-1 font-medium`}>Email</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="mail-outline" size={20} color={colors.icon} />
                  </View>
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`${isDark ? 'bg-white/20 border-white/30' : 'bg-gray-50 border-gray-200'} border ${colors.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

              {/* Send Reset Link Button */}
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading}
                className={`${isDark ? 'bg-white' : 'bg-cyan-500'} h-12 rounded-xl justify-center items-center mb-6 shadow-md ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color={isDark ? "#3AB5F6" : "white"} />
                ) : (
                  <Text className={`${isDark ? 'text-cyan-500' : 'text-white'} text-lg font-semibold`}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <Text className={`${colors.textSecondary} text-center text-sm`}>
                Remember your password?{' '}
                <Text 
                  className={`font-semibold underline ${colors.text}`}
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
