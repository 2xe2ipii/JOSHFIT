import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UserRole } from '../types';

// Import screens
import DashboardScreen from '../screens/main/DashboardScreen';
import WorkoutScreen from '../screens/main/WorkoutScreen';
import FoodScreen from '../screens/main/FoodScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isPremium = user?.role === UserRole.PREMIUM || user?.role === UserRole.ADMIN;

  return (
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
      {isPremium && <Tab.Screen name="Food" component={FoodScreen} />}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
