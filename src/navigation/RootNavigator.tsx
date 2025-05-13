import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import { checkAuth } from '../redux/authSlice';
import { UserRole } from '../types';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import AdminNavigator from './AdminNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';

// Import types
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    // Check if user is already authenticated
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    // Display a loading screen
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        ...darkMode ? DarkTheme : DefaultTheme,
        dark: darkMode,
        colors: {
          ...darkMode ? DarkTheme.colors : DefaultTheme.colors,
          primary: '#4CAF50',
          background: darkMode ? '#121212' : '#F5F5F5',
          card: darkMode ? '#1E1E1E' : '#FFFFFF',
          text: darkMode ? '#FFFFFF' : '#000000',
          border: darkMode ? '#333333' : '#E0E0E0',
          notification: '#FF5722',
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          // User is not authenticated, show auth screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // User is authenticated, show main app or admin panel
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            {user?.role === UserRole.ADMIN && (
              <Stack.Screen name="Admin" component={AdminNavigator} />
            )}
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                headerShown: true,
                title: 'Settings',
                headerStyle: {
                  backgroundColor: '#4CAF50',
                },
                headerTintColor: '#fff',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
