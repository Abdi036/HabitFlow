import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * SIGN IN SCREEN
 * 
 * This screen allows existing users to log into their account
 * It uses the useAuth hook to access the signIn function from AuthContext
 */

const SignInScreen = () => {
  const router = useRouter();
  const { signIn } = useAuth(); // Get the signIn function from our AuthContext
  const { isDark, colors } = useTheme();
  
  // Form state
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

    // Start loading state
    setLoading(true);
    
    /**
     * Call the signIn function from AuthContext
     * This function will:
     * 1. Create a session in Appwrite (log in)
     * 2. Fetch and store the user data
     * 3. Return error if credentials are wrong
     */
    const { error } = await signIn(email, password);

    // Stop loading state
    setLoading(false);
    
    if (error) {
      /**
       * ERROR HANDLING
       * 
       * Common Appwrite errors:
       * - "user_invalid_credentials": Wrong email or password
       * - "user_not_found": No account with this email
       * - "user_blocked": Account has been disabled
       */
      let errorMessage = 'Invalid email or password';
      
      // Check for specific error messages
      if (error.message && error.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: errorMessage
      });
    } else {
      /**
       * SUCCESS!
       * 
       * At this point:
       * - User session has been created in Appwrite
       * - User is logged in
       * - User data is stored in AuthContext
       * 
       * Navigate to home screen
       */
      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'You have successfully signed in'
      });
      
      // Navigate to tabs (home screen)
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    }
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
        <ScrollView className="flex-1" contentContainerClassName="min-h-full">
          <View className="flex-1 px-6 pt-12">
            {/* Back Button */}
            <TouchableOpacity 
              onPress={() => router.push("/")} 
              className="self-start mb-8"
            >
              <View className="flex-row items-center">
                <Ionicons name="arrow-back" size={20} color={colors.icon} />
                <Text className={`${colors.text} text-lg ml-2`}>Back</Text>
              </View>
            </TouchableOpacity>

            {/* Title */}
            <View className="mb-8 mt-12">
              <Text className={`text-4xl font-bold ${colors.text} text-center mb-2`}>Welcome Back</Text>
              <Text className={`${colors.textSecondary} text-center`}>Sign in to continue your journey</Text>
            </View>

            {/* Form Card */}
            <View className={`${colors.card} rounded-3xl p-6 shadow-lg mb-8`}>
              {/* Email */}
              <View className="mb-4">
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

              {/* Password */}
              <View className="mb-2">
                <Text className={`${colors.text} mb-2 ml-1 font-medium`}>Password</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="lock-closed-outline" size={20} color={colors.icon} />
                  </View>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className={`${isDark ? 'bg-white/20 border-white/30' : 'bg-gray-50 border-gray-200'} border ${colors.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity 
                onPress={() => router.push('/(auth)/forgotpassword')}
                className="mb-6"
              >
                <Text className={`${colors.textSecondary} text-right text-sm underline`}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading}
                className={`${isDark ? 'bg-white' : 'bg-cyan-500'} h-12 rounded-xl justify-center items-center mb-4 shadow-md ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color={isDark ? "#3AB5F6" : "white"} />
                ) : (
                  <Text className={`${isDark ? 'text-cyan-500' : 'text-white'} text-lg font-semibold`}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Link */}
              <Text className={`${colors.textSecondary} text-center text-sm`}>
                Don't have an account?{' '}
                <Text 
                  className={`font-semibold underline ${colors.text}`}
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
