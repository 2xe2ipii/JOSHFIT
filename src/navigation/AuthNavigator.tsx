import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';

// Import screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OnboardingInfoScreen from '../screens/auth/OnboardingInfoScreen';
import OnboardingGoalsScreen from '../screens/auth/OnboardingGoalsScreen';
import OnboardingMeasurementsScreen from '../screens/auth/OnboardingMeasurementsScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OnboardingInfo" component={OnboardingInfoScreen} />
      <Stack.Screen name="OnboardingGoals" component={OnboardingGoalsScreen} />
      <Stack.Screen name="OnboardingMeasurements" component={OnboardingMeasurementsScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
