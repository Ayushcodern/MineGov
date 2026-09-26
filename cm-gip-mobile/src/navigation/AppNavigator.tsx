import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppState, AppStateStatus } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { getCurrentOfficer, UserRole } from '../services/authService';
import { runEscalationEngine } from '../services/escalationService';

// Screens
import LoginScreen from '../screens/LoginScreen';
import PasswordChangeScreen from '../screens/PasswordChangeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TasksScreen from '../screens/TasksScreen';
import InspectionScreen from '../screens/InspectionScreen';
import ComplianceReviewScreen from '../screens/ComplianceReviewScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConsignmentRegistrationScreen from '../screens/ConsignmentRegistrationScreen';
import CheckpointScanScreen from '../screens/CheckpointScanScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import AccessDeniedScreen from '../screens/AccessDeniedScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { useTranslation } from 'react-i18next';
import { useAppLanguage } from '../context/LanguageContext';

function MainTabNavigator({ route }: any) {
  const { theme } = useAppTheme() as any;
  const { t } = useTranslation();
  const { currentLanguage } = useAppLanguage();
  const [role, setRole] = useState<UserRole>(route?.params?.role || 'field_inspector');

  const checkRole = async () => {
    if (route?.params?.role) {
      setRole(route.params.role);
      return;
    }
    const officer = await getCurrentOfficer();
    if (officer?.role) {
      setRole(officer.role);
    }
  };

  useEffect(() => {
    checkRole();
  }, [route?.params?.role, route?.params?.officer]);

  return (
    <Tab.Navigator
      key={`tab-nav-${role}-${currentLanguage}`}
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: any = 'home';
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Inspection') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Review') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        }
      })}
    >
      {/* Role: field_inspector: Dashboard, Inspection, Tasks, Alerts, Profile */}
      {/* Role: mining_official: Dashboard, Tasks, Alerts, Profile */}
      {/* Role: contractor: Tasks, Alerts, Profile */}
      {/* Role: compliance_officer: Dashboard, Review, Alerts, Profile */}
      {/* Role: corporate: Dashboard, Alerts, Profile */}
      {/* Role: regulator: Dashboard, Alerts, Profile */}

      {role !== 'contractor' && (
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ tabBarLabel: t('dashboard', 'Dashboard') }}
        />
      )}

      {role === 'field_inspector' && (
        <Tab.Screen 
          name="Inspection" 
          component={InspectionScreen} 
          options={{ tabBarLabel: t('inspection', 'Inspection') }}
        />
      )}

      {role === 'compliance_officer' && (
        <Tab.Screen 
          name="Review" 
          component={ComplianceReviewScreen} 
          options={{ tabBarLabel: t('review', 'Review') }}
        />
      )}

      {(role === 'field_inspector' || role === 'mining_official' || role === 'contractor') && (
        <Tab.Screen 
          name="Tasks" 
          component={TasksScreen} 
          options={{ tabBarLabel: t('tasks', 'Tasks') }}
        />
      )}

      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{ tabBarLabel: t('alerts', 'Alerts') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: t('profile', 'Profile') }}
      />
    </Tab.Navigator>
  );
}

// Guard Wrapper for InspectionFlow Stack Route
function ProtectedInspectionFlow({ navigation, route }: any) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  useEffect(() => {
    const verify = async () => {
      const officer = await getCurrentOfficer();
      const userRole = officer?.role || 'field_inspector';

      if (userRole === 'contractor') {
        navigation.replace('AccessDenied', {
          reason: 'DEMO Contractor role is not authorized to access the Mine Inspection Flow.'
        });
        setAuthorized(false);
      } else if (userRole === 'mining_official') {
        setReadOnly(true);
        setAuthorized(true);
      } else {
        setReadOnly(false);
        setAuthorized(true);
      }
    };
    verify();
  }, [navigation]);

  if (authorized === null) return null;
  if (!authorized) return null;

  return <InspectionScreen navigation={navigation} route={{ ...route, params: { ...route?.params, readOnly } }} />;
}

export default function AppNavigator() {
  useEffect(() => {
    // Re-check escalation and contracts on app foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        runEscalationEngine().catch(console.warn);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="InspectionFlow" component={ProtectedInspectionFlow} />
      <Stack.Screen name="ReviewFlow" component={ComplianceReviewScreen} />
      <Stack.Screen name="ConsignmentRegistration" component={ConsignmentRegistrationScreen} />
      <Stack.Screen name="CheckpointScan" component={CheckpointScanScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="AccessDenied" component={AccessDeniedScreen} />
    </Stack.Navigator>
  );
}
