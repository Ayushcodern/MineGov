import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { getAlerts, markAlertAsRead, MineGovAlert } from '../services/alertService';
import AlertCard from '../components/AlertCard';

export default function AlertsScreen() {
  const { theme } = useAppTheme();
  const [alerts, setAlerts] = useState<MineGovAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = async () => {
    try {
      const fetchedAlerts = await getAlerts();
      setAlerts(fetchedAlerts);
    } catch (error) {
      console.error('Failed to load alerts', error);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  }, []);

  const handleAlertPress = async (alert: MineGovAlert) => {
    if (!alert.read) {
      try {
        await markAlertAsRead(alert.id);
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, read: true } : a));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Governance Alerts & Escalations</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {alerts.length === 0 ? (
          <Text style={{color: theme.colors.textLight, textAlign: 'center', marginTop: 40}}>No active alerts.</Text>
        ) : (
          alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} onPress={handleAlertPress} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 18, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  listContainer: { padding: 16 }
});
