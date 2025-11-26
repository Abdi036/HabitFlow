import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';

/**
 * SIGN UP SCREEN
 * 
 * This screen allows new users to create an account
 * It uses the useAuth hook to access the signUp function from AuthContext
 */

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth(); // Get the signUp function from our AuthContext
  
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
              onPress={() => router.back()} 
              className="self-start mb-8"
            >
              <View className="flex-row items-center">
                <Ionicons name="arrow-back" size={20} color="white" />
                <Text className="text-white text-lg ml-2">Back</Text>
              </View>
            </TouchableOpacity>

            {/* Title */}
            <View className="mb-8">
              <Text className="text-4xl font-bold text-white text-center mb-2">Create Account</Text>
              <Text className="text-white/80 text-center">Start your habit journey today</Text>
            </View>

            {/* Form Card */}
            <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg mb-8">
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-white mb-2 ml-1 font-medium">Full Name</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.6)" />
                  </View>
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={fullName}
                    onChangeText={setFullName}
                    className="bg-white/20 border border-white/30 text-white h-12 rounded-xl pl-10 pr-4"
                  />
                </View>
              </View>

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
              <View className="mb-4">
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

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className="text-white mb-2 ml-1 font-medium">Confirm Password</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                  </View>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    className="bg-white/20 border border-white/30 text-white h-12 rounded-xl pl-10 pr-4"
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
              <Text className="text-white/80 text-center text-sm">
                Already have an account?{' '}
                <Text
                  className="font-semibold underline text-white"
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
