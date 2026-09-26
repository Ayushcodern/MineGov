import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { loginUser, DEMO_OFFICERS } from '../services/authService';

export default function LoginScreen({ navigation }: any) {
  const { theme } = useAppTheme() as any;
  const [email, setEmail] = useState('rajesh.sharma@minegov.in');
  const [password, setPassword] = useState('Demo@1234');
  const [isLoading, setIsLoading] = useState(false);

  const QUICK_OFFICERS = [
    { label: '👮 Field Inspector', name: 'Rajesh Sharma', email: 'rajesh.sharma@minegov.in', role: 'field_inspector' },
    { label: '⛏️ Mining Official', name: 'Priya Nair', email: 'priya.nair@minegov.in', role: 'mining_official' },
    { label: '🛡️ Compliance Officer', name: 'Sunita Deshmukh', email: 'sunita.deshmukh@minegov.in', role: 'compliance_officer' },
    { label: '🏗️ Contractor', name: 'Amit Verma', email: 'amit.verma@apexheavy.in', role: 'contractor' },
    { label: '📊 Corporate ESG', name: 'Vikram Malhotra', email: 'vikram.malhotra@cil.gov.in', role: 'corporate' },
    { label: '🏛️ DGMS Regulator', name: 'Dr. Alok Kumar', email: 'alok.kumar@dgms.gov.in', role: 'regulator' },
  ];

  const handleLogin = async (targetEmail?: string) => {
    const finalEmail = targetEmail || email;
    if (!finalEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      if (password === 'first_reset_trigger') {
        navigation.replace('PasswordChange');
        return;
      }
      
      const authRes = await loginUser(finalEmail, password);
      navigation.replace('Main', { 
        officer: authRes.profileData, 
        role: authRes.profileData.role 
      });
    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials provided.';
      Alert.alert('Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (officerItem: any) => {
    setEmail(officerItem.email);
    handleLogin(officerItem.email);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Image 
              source={require('../../assets/MineGOV Logo.webp')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: theme.colors.text }]}>MineGOV</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textLight }]}>
              CoalMine Governance Intelligence Platform
            </Text>
          </View>

          {/* Quick One-Tap Officer Role Switcher */}
          <View style={[styles.quickRolesCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.quickRolesTitle, { color: theme.colors.text }]}>Quick Role Switch (Demo & Testing):</Text>
            <View style={styles.chipsGrid}>
              {QUICK_OFFICERS.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: email === item.email ? theme.colors.primary : theme.colors.background,
                      borderColor: email === item.email ? theme.colors.primary : theme.colors.border
                    }
                  ]}
                  onPress={() => handleQuickSelect(item)}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.chipText,
                    { color: email === item.email ? '#FFF' : theme.colors.text, fontWeight: '700' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.formContainer, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Officer Email / Badge ID"
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

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleLogin()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In to MineGOV Portal</Text>
              )}
            </TouchableOpacity>

            <View style={styles.helpBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.helpText, { color: theme.colors.textLight }]}>
                Secured by Government of India Coal Mining Safety Directorate
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 28, marginTop: 20 },
  title: { fontSize: 26, fontWeight: '800', marginTop: 12, letterSpacing: 0.5 },
  subtitle: { fontSize: 13, marginTop: 4, textAlign: 'center', fontWeight: '500' },
  logoImage: { width: 96, height: 96, borderRadius: 20 },
  formContainer: {
    borderRadius: 16,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 48, fontSize: 15 },
  loginButton: {
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8
  },
  helpText: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500'
  },
  quickRolesCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16
  },
  quickRolesTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  roleChip: {
    width: '48%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center'
  },
  chipText: {
    fontSize: 11,
    textAlign: 'center'
  }
});

