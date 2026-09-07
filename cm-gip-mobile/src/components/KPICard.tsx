import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useAppTheme } from '../context/ThemeContext';

export default function KPICard({ value, label, trend, colorType }) {
  const { theme } = useAppTheme();
  
  const borderColor = theme.colors[colorType] || theme.colors.primary;
  const trendColor = trend && trend.includes('-') ? theme.colors.danger : theme.colors.success;

  return (
    <View style={[styles.kpiCard, { 
      backgroundColor: theme.colors.card, 
      borderLeftColor: borderColor, 
      shadowColor: theme.colors.border 
    }]}>
      <Text style={[styles.kpiValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.kpiLabel, { color: theme.colors.textLight }]}>{label}</Text>
      {trend ? <Text style={[styles.kpiTrend, { color: trendColor }]}>{trend}</Text> : null}
    </View>
  );
}

KPICard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  trend: PropTypes.string,
  colorType: PropTypes.string,
};

const styles = StyleSheet.create({
  kpiCard: {
    width: '48%',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  kpiLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  kpiTrend: {
    fontSize: 10,
    marginTop: 8,
    fontWeight: '600',
  },
});
