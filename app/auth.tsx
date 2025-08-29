import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleAuth() {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
    }
    setError(null);
  }

  function handleSwitch() {
    setSignUp((prev) => !prev);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="mx-6 p-6 rounded-2xl items-center">
        <Text className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isSignUp ? "Create Account" : "Welcome Back Friend"}
        </Text>
        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email@example.com"
          mode="outlined"
          onChangeText={setEmail}
          style={{ width: 280, marginBottom: 16, backgroundColor: "#fff" }}
        />
        <TextInput
          label="Password"
          secureTextEntry
          autoCapitalize="none"
          mode="outlined"
          onChangeText={setPassword}
          style={{ width: 280, marginBottom: 16, backgroundColor: "#fff" }}
        />

        {error && (
          <Text className="text-red-500 font-bold text-center">{error}</Text>
        )}
        <Button
          mode="contained"
          style={{
            width: 280,
            marginTop: 8,
            marginBottom: 8,
            borderRadius: 8,
            paddingVertical: 4,
          }}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <Button
          onPressIn={handleAuth}
          mode="text"
          onPress={handleSwitch}
          style={{ marginTop: 8 }}
          labelStyle={{ fontSize: 14, color: "#1976d2" }}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
