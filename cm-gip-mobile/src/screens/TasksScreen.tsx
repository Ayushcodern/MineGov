import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import TaskCard from '../components/TaskCard';
import { useAppTheme } from '../context/ThemeContext';
import { getUserTasks, markTaskComplete } from '../services/taskService';

export default function TasksScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [filter, setFilter] = useState('All');
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    try {
      const userId = 'GUEST_USER';
      const fetchedTasks = await getUserTasks(userId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return task.status !== 'completed';
    if (filter === 'Completed') return task.status === 'completed';
    return true;
  });

  const handleTaskPress = (task) => {
    if (task.status !== 'completed') {
      navigation.navigate('InspectionFlow');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Tasks</Text>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Pending', 'Completed'].map((opt) => (
          <TouchableOpacity 
            key={opt}
            style={[
              styles.filterTab, 
              filter === opt ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}
            onPress={() => setFilter(opt)}
          >
            <Text style={[
              styles.filterText, 
              filter === opt ? { color: '#FFF' } : { color: theme.colors.text }
            ]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {filteredTasks.length === 0 ? (
          <Text style={{color: theme.colors.textLight, textAlign: 'center', marginTop: 40}}>No tasks found.</Text>
        ) : (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onPress={handleTaskPress} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', padding: 16, justifyContent: 'space-between' },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20, marginHorizontal: 4, borderWidth: 1, borderColor: 'transparent' },
  filterText: { fontSize: 14, fontWeight: '600' },
  listContainer: { padding: 16 }
});
