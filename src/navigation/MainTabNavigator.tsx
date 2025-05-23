import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UserRole } from '../types';
import { View, StyleSheet, Text } from 'react-native';
// Import screens
import DashboardScreen from '../screens/main/DashboardScreen';
import WorkoutScreen from '../screens/main/WorkoutScreen';
import FoodScreen from '../screens/main/FoodScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import UserListScreen from '../screens/admin/UserListScreen';
// Import components
import FloatingUtilityTool from '../components/FloatingUtilityTool';
// Import icons
import { Ionicons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator<MainTabParamList>();
const MainTabNavigator = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isPremium = user?.role === UserRole.PREMIUM || user?.role === UserRole.ADMIN;
  const { hasUnreadNotifications } = useSelector((state: RootState) => state.notifications);
  const { notifications: notificationsEnabled } = useSelector((state: RootState) => state.settings);
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;
            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Workout') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            } else if (route.name === 'Food') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Manage Users') {
              iconName = focused ? 'people' : 'people-outline';
            }
            // Display notification dot for Dashboard tab when there are unread notifications
            if (route.name === 'Dashboard' && notificationsEnabled && hasUnreadNotifications) {
              return (
                <View style={{ position: 'relative' }}>
                  <Ionicons name={iconName} size={size} color={color} />
                  <View style={styles.notificationDot} />
                </View>
              );
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Workout" component={WorkoutScreen} />
        {user?.role === UserRole.ADMIN && (
          <Tab.Screen name="Manage Users" component={UserListScreen} />
        )}
        {isPremium && <Tab.Screen name="Food" component={FoodScreen} />}
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      {}
      <FloatingUtilityTool />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
export default MainTabNavigator;

