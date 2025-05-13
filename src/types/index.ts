export enum UserRole {
  REGULAR = 'regular',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
  fitnessGoal: 'lose_weight' | 'gain_muscle' | 'improve_endurance' | 'maintain';
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  exercises: Exercise[];
  date: string;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  completed: boolean;
  imageUrl?: string;
}

export interface FoodLog {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  servingSize: string;
  date: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardState {
  steps: number;
  caloriesBurned: number;
  caloriesConsumed: number; // For premium users
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

export interface WorkoutState {
  workoutPlan: WorkoutPlan | null;
  isLoading: boolean;
  error: string | null;
}

export interface FoodLogState {
  foodLogs: FoodLog[];
  isLoading: boolean;
  error: string | null;
}

export interface AdminState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  language: string;
}

export interface AppState {
  auth: AuthState;
  dashboard: DashboardState;
  workout: WorkoutState;
  foodLog: FoodLogState;
  admin: AdminState;
  settings: AppSettings;
}
