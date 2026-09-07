import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function AlertCard({ alert, onPress }) {
  const { theme } = useAppTheme();
  
  const getIconForType = (type) => {
    switch(type) {
      case 'danger': return 'warning';
      case 'success': return 'checkmark-circle';
      case 'warning': return 'alert-circle';
      case 'info':
      default: return 'information-circle';
    }
  };

  const getColorForType = (type) => {
    switch(type) {
      case 'danger': return theme.colors.danger;
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'info':
      default: return theme.colors.primary;
    }
  };

  const typeColor = getColorForType(alert.type);
  const timeString = alert.createdAt && typeof alert.createdAt.toDate === 'function'
      ? alert.createdAt.toDate().toLocaleDateString()
      : 'Recently';

  return (
    <TouchableOpacity 
      style={[
        styles.alertCard, 
        { backgroundColor: theme.colors.card, shadowColor: theme.colors.border },
        !alert.read && { borderLeftWidth: 3, borderLeftColor: theme.colors.primary, backgroundColor: theme.colors.accent }
      ]}
      onPress={() => onPress(alert)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconForType(alert.type)} size={28} color={typeColor} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.alertTitle, { color: theme.colors.text }, !alert.read && styles.unreadText]}>
            {alert.title}
          </Text>
          <Text style={[styles.timeText, { color: theme.colors.textLight }]}>
            {timeString}
          </Text>
        </View>
        <Text style={[styles.alertMessage, { color: theme.colors.textLight }]}>{alert.message}</Text>
      </View>
      {!alert.read && <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />}
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
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
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
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
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
