import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KPICard from '../components/KPICard';
import TaskCard from '../components/TaskCard';
import { useAppTheme } from '../context/ThemeContext';
import { getUserTasks } from '../services/taskService';
import { aiService } from '../services/aiService';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

export default function DashboardScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [complianceRate, setComplianceRate] = useState('94%');
  const [predictedRisks, setPredictedRisks] = useState([]);

  const loadData = async () => {
    try {
      const userId = 'GUEST_USER';
      const fetchedTasks = await getUserTasks(userId);
      setTasks(fetchedTasks);
      
      const riskPredictions = await aiService.predictRisks();
      setPredictedRisks(riskPredictions.predictedIncidents || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const recentDeadlines = pendingTasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3);

  const handleTaskPress = (task) => {
    if (task.status !== 'completed') {
      navigation.navigate('InspectionFlow');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.colors.textLight }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>Officer Smith</Text>
          </View>
          <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.colors.card }]} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overview</Text>
        <View style={styles.kpiContainer}>
          <KPICard value={complianceRate} label="Compliance Rate" trend="+2%" colorType="primary" />
          <KPICard value={pendingTasks.length} label="Pending Tasks" trend="-1" colorType="warning" />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24, flexDirection: 'row', alignItems: 'center' }]}>
          ✨ AI Risk Predictions
        </Text>
        
        {predictedRisks.length > 0 ? (
          predictedRisks.map((risk, idx) => (
            <View key={idx} style={[styles.riskCard, { backgroundColor: theme.colors.card, borderLeftColor: risk.probability > 70 ? theme.colors.danger : theme.colors.warning }]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={[styles.riskTitle, { color: theme.colors.text }]}>{risk.type}</Text>
                <Text style={{color: risk.probability > 70 ? theme.colors.danger : theme.colors.warning, fontWeight: 'bold'}}>{risk.probability}% Prob</Text>
              </View>
              <Text style={{color: theme.colors.textLight, marginTop: 4}}><Ionicons name="location" size={14}/> {risk.location}</Text>
              <Text style={{color: theme.colors.textLight, marginTop: 2}}><Ionicons name="time" size={14}/> {risk.timeframe}</Text>
              <View style={{marginTop: 8, padding: 8, backgroundColor: theme.colors.background, borderRadius: 8}}>
                <Text style={{color: theme.colors.text, fontWeight: '600', fontSize: 12}}>Action: {risk.actions[0]}</Text>
              </View>
            </View>
          ))
        ) : (
          <ActivityIndicator color={theme.colors.primary} style={{marginTop: 10}} />
        )}

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>Compliance Trend (30 Days)</Text>
        <View style={[styles.chartContainer, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          <VictoryChart height={220} padding={{ top: 20, bottom: 40, left: 40, right: 20 }} theme={VictoryTheme.material}>
            <VictoryAxis dependentAxis style={{ tickLabels: { fill: theme.colors.textLight, fontSize: 10 } }} />
            <VictoryAxis style={{ tickLabels: { fill: theme.colors.textLight, fontSize: 10 } }} />
            <VictoryLine
              style={{
                data: { stroke: theme.colors.primary, strokeWidth: 3 },
                parent: { border: "1px solid #ccc"}
              }}
              data={[
                { x: 'W1', y: 88 },
                { x: 'W2', y: 92 },
                { x: 'W3', y: 90 },
                { x: 'W4', y: 94 }
              ]}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]} 
            onPress={() => navigation.navigate('InspectionFlow')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(43, 108, 176, 0.1)' }]}>
              <Ionicons name="clipboard-outline" size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Start Inspection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}
            onPress={() => navigation.navigate('ReviewFlow')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(72, 187, 120, 0.1)' }]}>
              <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.success} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Review Reports</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Upcoming Deadlines</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentDeadlines.length === 0 ? (
          <Text style={{color: theme.colors.textLight, marginTop: 8}}>No pending tasks!</Text>
        ) : (
          recentDeadlines.map(task => (
            <TaskCard key={task.id} task={task} onPress={handleTaskPress} />
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  welcomeText: { fontSize: 14 },
  userName: { fontSize: 24, fontWeight: 'bold' },
  profileButton: { borderRadius: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  kpiContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionButton: {
    width: '48%', borderRadius: 12, padding: 16, alignItems: 'center',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2,
  },
  actionIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAllText: { fontSize: 14, fontWeight: '600' },
  chartContainer: { borderRadius: 12, padding: 10, alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2, overflow: 'hidden' },
  riskCard: { padding: 16, borderRadius: 12, borderLeftWidth: 4, marginBottom: 12, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  riskTitle: { fontSize: 16, fontWeight: 'bold' }
});
