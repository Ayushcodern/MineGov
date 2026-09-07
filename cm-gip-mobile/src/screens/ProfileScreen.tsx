import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { logoutUser } from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';
import NetInfo from '@react-native-community/netinfo';
import { getQueue, processQueue } from '../services/syncService';

export default function ProfileScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Network listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected && queueCount > 0) {
        handleSync(); // Auto-sync when network returns
      }
    });

    const loadData = async () => {
      try {
        const queue = await getQueue();
        setQueueCount(queue.length);
        
        // Dummy user load
        setProfile({
          name: 'Officer Smith',
          role: 'Senior Inspector',
          mineSite: 'Dhanbad Colliery, Block B',
          stats: { inspections: 142, compliance: '94%' }
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Polling queue count every 5 seconds just to keep UI updated
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Profile</Text>
      </View>

      {isLoading || !profile ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.profileCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <Text style={[styles.name, { color: theme.colors.text }]}>{profile.name}</Text>
            <Text style={[styles.role, { color: theme.colors.primary }]}>{profile.role}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{profile.stats?.inspections || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Inspections</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{profile.stats?.compliance || '0%'}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Compliance</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            
            <ThemeToggle />
            
            <View style={[styles.menuDivider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: isOnline ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)' }]}>
                <Ionicons name={isOnline ? "wifi" : "cloud-offline"} size={20} color={isOnline ? theme.colors.success : theme.colors.danger} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Network Status</Text>
              <Text style={{color: isOnline ? theme.colors.success : theme.colors.danger, fontWeight: 'bold'}}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>

            <View style={[styles.menuDivider, { backgroundColor: theme.colors.border }]} />

            <TouchableOpacity style={styles.menuItem} onPress={handleSync} disabled={isSyncing}>
              <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(66, 153, 225, 0.1)' }]}>
                {isSyncing ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Ionicons name="sync" size={20} color={theme.colors.primary} />
                )}
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Sync Now</Text>
              {queueCount > 0 ? (
                <View style={{backgroundColor: theme.colors.warning, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2}}>
                  <Text style={{color: '#FFF', fontSize: 12, fontWeight: 'bold'}}>{queueCount} Pending</Text>
                </View>
              ) : (
                <Text style={{color: theme.colors.textLight}}>Up to date</Text>
              )}
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.danger }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFF" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  profileCard: {
    borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  avatarContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#4A5568',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  role: { fontSize: 16, fontWeight: '600', marginBottom: 24 },
  statsRow: { flexDirection: 'row', width: '100%', borderTopWidth: 1, borderTopColor: 'transparent', paddingTop: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginLeft: 4 },
  menuGroup: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 32, paddingHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  menuIconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '500' },
  menuDivider: { height: 1, width: '100%' },
  logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12 },
  logoutIcon: { marginRight: 8 },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
