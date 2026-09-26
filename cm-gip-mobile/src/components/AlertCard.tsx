import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function AlertCard({ alert, onPress }: any) {
  const { theme } = useAppTheme() as any;
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'escalation': return 'alert-circle';
      case 'contract_expiry': return 'calendar';
      case 'gas_leak': return 'flame';
      case 'short_shift_violation': return 'time';
      case 'danger':
      case 'critical': return 'warning';
      case 'success': return 'checkmark-circle';
      case 'warning': return 'alert-circle';
      default: return 'notifications';
    }
  };

  const getColorForType = (type: string, priority?: string) => {
    if (type === 'escalation' || priority === 'critical') return theme.colors.danger;
    if (type === 'contract_expiry' || type === 'short_shift_violation') return theme.colors.warning;
    if (type === 'success') return theme.colors.success;
    return theme.colors.primary;
  };

  const typeColor = getColorForType(alert.type, alert.priority);
  const timeString = alert.created_at || alert.createdAt
    ? new Date(alert.created_at || alert.createdAt).toLocaleDateString()
    : 'Today';

  const titleText = alert.title || (
    alert.type === 'escalation' ? '🚨 Overdue Action Escalation' :
    alert.type === 'contract_expiry' ? '⚠️ Contractor Contract Expiry' :
    alert.type === 'short_shift_violation' ? '⏱️ Labour Shift Violation' :
    'Safety Notification'
  );

  return (
    <TouchableOpacity 
      style={[
        styles.alertCard, 
        { backgroundColor: theme.colors.card, shadowColor: theme.colors.border },
        !alert.read && { borderLeftWidth: 3.5, borderLeftColor: typeColor, backgroundColor: theme.colors.accent }
      ]}
      onPress={() => onPress(alert)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconForType(alert.type) as any} size={26} color={typeColor} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.alertTitle, { color: theme.colors.text }, !alert.read && styles.unreadText]}>
            {titleText}
          </Text>
          <Text style={[styles.timeText, { color: theme.colors.textLight }]}>
            {timeString}
          </Text>
        </View>
        <Text style={[styles.alertMessage, { color: theme.colors.textLight }]}>{alert.message}</Text>
      </View>
      {!alert.read && <View style={[styles.unreadDot, { backgroundColor: typeColor }]} />}
    </TouchableOpacity>
  );
}

AlertCard.propTypes = {
  alert: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  alertCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 11,
    marginLeft: 8,
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  }
});
