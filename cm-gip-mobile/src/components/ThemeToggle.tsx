import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Ionicons 
        name={isDarkMode ? "moon" : "sunny"} 
        size={20} 
        color={isDarkMode ? theme.colors.warning : theme.colors.primary} 
        style={{ marginRight: 8 }}
      />
      <Switch
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={isDarkMode ? theme.colors.warning : theme.colors.card}
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
  },
});
