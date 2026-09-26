import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { logoutUser, getCurrentOfficer, OfficerProfile } from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';
import NetInfo from '@react-native-community/netinfo';
import { getQueue, processQueue } from '../services/syncService';
import { useTranslation } from 'react-i18next';
import { useAppLanguage } from '../context/LanguageContext';

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useAppTheme() as any;
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useAppLanguage();
  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(Boolean(state.isConnected));
      if (state.isConnected && queueCount > 0) {
        handleSync();
      }
    });

    const loadData = async () => {
      try {
        const queue = await getQueue();
        setQueueCount(queue.length);
        
        const officer = await getCurrentOfficer();
        setProfile(officer);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    const interval = setInterval(async () => {
      const q = await getQueue();
      setQueueCount(q.length);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert('Offline', 'Cannot sync while completely offline.');
      return;
    }
    
    setIsSyncing(true);
    const result = await processQueue();
    setIsSyncing(false);
    
    if (result.success) {
      const updatedQueue = await getQueue();
      setQueueCount(updatedQueue.length);
      Alert.alert('Sync Complete', result.message);
    } else {
      Alert.alert('Sync Failed', result.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('profile')}</Text>
      </View>

      {isLoading || !profile ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.profileCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="person" size={48} color={theme.colors.primary} />
            </View>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>{profile.name}</Text>
            <View style={[styles.roleTag, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.roleTagText}>{profile.role.toUpperCase()}</Text>
            </View>
            <Text style={[styles.officerId, { color: theme.colors.textLight }]}>ID: {profile.officer_id} • {profile.email}</Text>
          </View>

          {/* Sync & Offline Status */}
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={isOnline ? "sync-circle" : "cloud-offline"} size={22} color={isOnline ? theme.colors.primary : theme.colors.warning} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {currentLanguage === 'hi' ? 'कार्य सिंक करें (Sync Task)' : 'Sync Task'}
                </Text>
              </View>
              <Text style={[styles.queueCount, { color: theme.colors.textLight }]}>Queue: {queueCount}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.syncBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.syncBtnText}>
                  {currentLanguage === 'hi' ? `कार्य सिंक करें (${queueCount} लंबित)` : `Sync Task Queue (${queueCount} Items)`}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Preferences & Settings */}
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 12 }]}>App Settings & Preferences</Text>
            
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Interface Theme</Text>
              <ThemeToggle />
            </View>

            <View style={[styles.settingRow, { marginTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 12 }]}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Language / भाषा</Text>
              <TouchableOpacity onPress={toggleLanguage} style={styles.langPill}>
                <Ionicons name="language" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {currentLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.logoutBtn, { borderColor: theme.colors.danger }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} style={{ marginRight: 8 }} />
            <Text style={[styles.logoutText, { color: theme.colors.danger }]}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 18, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 18, paddingBottom: 40 },
  profileCard: {
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  profileName: { fontSize: 20, fontWeight: 'bold' },
  roleTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 6 },
  roleTagText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  officerId: { fontSize: 13, marginTop: 8 },
  sectionCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  queueCount: { fontSize: 12, fontWeight: '600' },
  syncBtn: { borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  syncBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  langPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1' },
  logoutBtn: { flexDirection: 'row', borderWidth: 1.5, borderRadius: 10, paddingVertical: 14, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  logoutText: { fontSize: 15, fontWeight: 'bold' }
});
