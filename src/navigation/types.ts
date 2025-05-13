import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  OnboardingInfo: { email: string; password: string } | undefined;
  OnboardingGoals: {
    email: string;
    password: string;
    nickname?: string;
    gender?: string;
    height?: number;
    weight?: number;
    bodyType?: string;
  } | undefined;
  OnboardingMeasurements: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  Workout: undefined;
  Food: undefined;
  Profile: undefined;
};

// Admin Stack
export type AdminStackParamList = {
  UserList: undefined;
  UserDetail: { userId: string };
  AddUser: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
  Settings: undefined;
};

// Navigation global declaration
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
