import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      if (password === 'temp123') {
        navigation.replace('PasswordChange');
        return;
      }
      
      await loginUser(email, password);
      navigation.replace('Main');
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials provided.';
      Alert.alert('Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/MineGOV Logo.webp')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.colors.text }]}>MineGOV</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textLight }]}>CoalMine Governance Intelligence Platform</Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Email Address"
              placeholderTextColor={theme.colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.textLight}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={[styles.loginButton, { backgroundColor: theme.colors.primary }]} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Secure Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 16 },
  subtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  logoImage: { width: 120, height: 120, borderRadius: 20 },
  formContainer: {
    borderRadius: 16, padding: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05, shadowRadius: 15, elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 8, borderWidth: 1, marginBottom: 16, paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 50, fontSize: 16 },
  loginButton: {
    borderRadius: 8, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  forgotPassword: { alignItems: 'center', marginTop: 20 },
  forgotPasswordText: { fontSize: 14, fontWeight: '600' }
});
