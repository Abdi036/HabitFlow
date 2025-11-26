import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      // You can add toast/alert functionality here
      return;
    }

    setLoading(true);
    // Add your reset password logic here
    // For now, just simulate a delay
    setTimeout(() => {
      setLoading(false);
      // Show success message
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

          {/* Center Content */}
          <View className="flex-1 justify-center">
            {/* Title */}
            <View className="mb-8">
              <Text className="text-4xl font-bold text-white text-center mb-2">Forgot Password</Text>
              <Text className="text-white/80 text-center">We'll send you a reset link</Text>
            </View>

            {/* Form Card */}
            <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
              {/* Email */}
              <View className="mb-6">
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
              <Text className="text-white/80 text-center text-sm">
                Remember your password?{' '}
                <Text 
                  className="font-semibold underline text-white"
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
