import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function PasswordChangeScreen({ navigation }: { navigation: any }) {
  const { theme } = useAppTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call for password update
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        
        <View style={styles.headerContainer}>
          <Ionicons name="lock-closed" size={48} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Update Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textLight }]}>For security reasons, you must change your temporary password.</Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Current Password"
              placeholderTextColor={theme.colors.textLight}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="New Password"
              placeholderTextColor={theme.colors.textLight}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Confirm New Password"
              placeholderTextColor={theme.colors.textLight}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={[styles.policyContainer, { backgroundColor: theme.colors.accent }]}>
            <Text style={[styles.policyTitle, { color: theme.colors.text }]}>Password must contain:</Text>
            <Text style={[styles.policyText, { color: theme.colors.textLight }]}>• Minimum 8 characters</Text>
            <Text style={[styles.policyText, { color: theme.colors.textLight }]}>• At least 1 uppercase letter</Text>
            <Text style={[styles.policyText, { color: theme.colors.textLight }]}>• At least 1 number & special character</Text>
          </View>

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleChangePassword} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Change Password & Continue</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 },
  formContainer: {
    borderRadius: 16, padding: 24, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05, shadowRadius: 15, elevation: 4,
  },
  inputContainer: { borderRadius: 8, borderWidth: 1, marginBottom: 16, paddingHorizontal: 16 },
  input: { height: 50, fontSize: 16 },
  policyContainer: { marginBottom: 24, padding: 16, borderRadius: 8 },
  policyTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  policyText: { fontSize: 12, marginBottom: 2 },
  button: { borderRadius: 8, height: 50, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
