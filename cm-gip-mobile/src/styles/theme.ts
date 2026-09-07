export const lightColors = {
  primary: '#2B6CB0',
  secondary: '#4A5568',
  background: '#F7FAFC',
  card: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096',
  border: '#E2E8F0',
  success: '#48BB78',
  danger: '#F56565',
  warning: '#ED8936',
  accent: '#EBF8FF',
};

export const darkColors = {
  primary: '#4299E1', // lighter blue for dark mode
  secondary: '#A0AEC0',
  background: '#1A202C', // dark background
  card: '#2D3748',       // slightly lighter than bg
  text: '#F7FAFC',
  textLight: '#A0AEC0',
  border: '#4A5568',
  success: '#68D391',
  danger: '#FC8181',
  warning: '#F6AD55',
  accent: '#2A4365',     // dark blue tint
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
};

export const borderRadius = {
  sm: 4, md: 8, lg: 16, round: 9999,
};

export const getTheme = (isDarkMode) => ({
  colors: isDarkMode ? darkColors : lightColors,
  spacing,
  borderRadius,
});
