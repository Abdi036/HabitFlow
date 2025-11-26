import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * SIGN UP SCREEN
 * 
 * This screen allows new users to create an account
 * It uses the useAuth hook to access the signUp function from AuthContext
 */

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth(); // Get the signUp function from our AuthContext
  const { isDark, colors } = useTheme();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * HANDLE SUBMIT FUNCTION
   * 
   * This is called when user presses the "Sign Up" button
   * 
   * STEPS:
   * 1. Validate all fields are filled
   * 2. Check passwords match
   * 3. Check password meets minimum requirements
   * 4. Call the signUp function from AuthContext
   * 5. Handle success/error responses
   */
  const handleSubmit = async () => {
    // VALIDATION STEP 1: Check all fields are filled
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all fields'
      });
      return;
    }
    
    // VALIDATION STEP 2: Check passwords match
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match'
      });
      return;
    }

    // VALIDATION STEP 3: Check password length (Appwrite requires min 8 characters)
    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 8 characters'
      });
      return;
    }

    // Start loading state
    setLoading(true);
    
    /**
     * Call the signUp function from AuthContext
     * This function will:
     * 1. Create an account in Appwrite
     * 2. Automatically log the user in
     * 3. Store the user in our app state
     */
    const { error } = await signUp(email, password, fullName);

    // Stop loading state
    setLoading(false);
    
    if (error) {
      /**
       * ERROR HANDLING
       * 
       * Common Appwrite errors:
       * - "user_already_exists": Email is already registered
       * - "user_invalid_credentials": Invalid email format
       * - "general_argument_invalid": Password doesn't meet requirements
       */
      let errorMessage = 'An error occurred during sign up';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: errorMessage
      });
    } else {
      /**
       * SUCCESS!
       * 
       * At this point:
       * - User account has been created in Appwrite
       * - User is logged in (session created)
       * - User data is stored in AuthContext
       * 
       * Navigate to signin screen as requested
       */
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Account created successfully'
      });
      
      // Navigate to signin screen after short delay
      setTimeout(() => {
        router.push('/(auth)/signin');
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
              onPress={() => router.back()} 
              className="self-start mb-8"
            >
              <View className="flex-row items-center">
                <Ionicons name="arrow-back" size={20} color={colors.icon} />
                <Text className={`${colors.text} text-lg ml-2`}>Back</Text>
              </View>
            </TouchableOpacity>

            {/* Title */}
            <View className="mb-8">
              <Text className={`text-4xl font-bold ${colors.text} text-center mb-2`}>Create Account</Text>
              <Text className={`${colors.textSecondary} text-center`}>Start your habit journey today</Text>
            </View>

            {/* Form Card */}
            <View className={`${colors.card} rounded-3xl p-6 shadow-lg mb-8`}>
              {/* Full Name */}
              <View className="mb-4">
                <Text className={`${colors.text} mb-2 ml-1 font-medium`}>Full Name</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="person-outline" size={20} color={colors.icon} />
                  </View>
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
                    value={fullName}
                    onChangeText={setFullName}
                    className={`${isDark ? 'bg-white/20 border-white/30' : 'bg-gray-50 border-gray-200'} border ${colors.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

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
              <View className="mb-4">
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

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className={`${colors.text} mb-2 ml-1 font-medium`}>Confirm Password</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="lock-closed-outline" size={20} color={colors.icon} />
                  </View>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    className={`${isDark ? 'bg-white/20 border-white/30' : 'bg-gray-50 border-gray-200'} border ${colors.text} h-12 rounded-xl pl-10 pr-4`}
                  />
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading}
                className={`${isDark ? 'bg-white' : 'bg-cyan-500'} h-12 rounded-xl justify-center items-center mb-4 shadow-md ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color={isDark ? "#3AB5F6" : "white"} />
                ) : (
                  <Text className={`${isDark ? 'text-cyan-500' : 'text-white'} text-lg font-semibold`}>Sign Up</Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <Text className={`${colors.textSecondary} text-center text-sm`}>
                Already have an account?{' '}
                <Text
                  className={`font-semibold underline ${colors.text}`}
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
