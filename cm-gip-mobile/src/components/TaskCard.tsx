import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function TaskCard({ task, onPress }) {
  const { theme } = useAppTheme();
  
  const isCompleted = task.status === 'completed';
  const priorityColor = task.priority === 'High' ? theme.colors.danger : theme.colors.warning;
  const statusColor = isCompleted ? theme.colors.success : theme.colors.warning;

  return (
    <TouchableOpacity 
      style={[styles.taskCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}
      onPress={() => onPress(task)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={isCompleted ? 'checkmark-circle' : 'time'} 
            size={20} 
            color={statusColor} 
            style={styles.statusIcon}
          />
          <Text style={[styles.taskTitle, { color: theme.colors.text }]}>{task.title}</Text>
        </View>
        <View style={[styles.priorityBadge, {backgroundColor: priorityColor}]}>
          <Text style={[styles.priorityText, { color: '#FFFFFF' }]}>{task.priority}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={[styles.taskType, { color: theme.colors.secondary }]}>{task.type}</Text>
        <Text style={[styles.taskDue, { color: isCompleted ? theme.colors.textLight : theme.colors.danger }]}>
          {isCompleted ? 'Completed' : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  taskCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 28,
  },
  taskType: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskDue: {
    fontSize: 12,
    fontWeight: '600',
  }
});
