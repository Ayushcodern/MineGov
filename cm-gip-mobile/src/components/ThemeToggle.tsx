import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent }]}>
        <Ionicons 
          name={isDarkMode ? "moon" : "sunny"} 
          size={20} 
          color={theme.colors.secondary} 
        />
      </View>
      <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
      <Switch
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.card}
        ios_backgroundColor={theme.colors.border}
        onValueChange={toggleTheme}
        value={isDarkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
