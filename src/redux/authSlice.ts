import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserRole } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkoutPlan } from './workoutSlice';
// Mock API calls for demonstration - In a real app, these would connect to a backend
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // STRICTLY CHECK ADMIN LOGIN
      if (credentials.email === 'admin@joshfit.com' && credentials.password === 'admin123') {
        // Return admin user
        const adminUser = {
          id: 'admin1',
          email: credentials.email,
          nickname: 'Admin',
          gender: 'other' as const,
          height: 175,
          weight: 70,
          bodyType: 'mesomorph' as const,
          fitnessGoal: 'maintain' as const,
          role: UserRole.ADMIN,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const token = 'admin-jwt-token';
        // Store in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(adminUser));
        await AsyncStorage.setItem('token', token);
        return { user: adminUser, token };
      }
      // FIRST - CLEAR ANY EXISTING USER SESSION DATA
      // This ensures we're not accidentally using stale data
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      // STRICTLY CHECK USER LIST
      const allUsersJson = await AsyncStorage.getItem('allUsers');
      let allUsers: User[] = [];
      if (!allUsersJson) {
        // No users exist in the system
        return rejectWithValue('Account not found. Please register to create an account.');
      }
      allUsers = JSON.parse(allUsersJson);
      // Find the user with matching email - STRICT CHECK
      const foundUser = allUsers.find(u => u.email === credentials.email);
      // If no user found with this email, reject login - STRICT REQUIREMENT
      if (!foundUser) {
        // This email doesn't exist in our user list
        return rejectWithValue('Account not found. Please register to create an account.');
      }
      // User found, proceed with login
      const user = foundUser;
      const token = 'mock-jwt-token';
      // Store in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);
      return { user, token };
    } catch (error) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);
export const createUserWithoutLogin = createAsyncThunk(
  'auth/createUserWithoutLogin',
  async (userData: Partial<User> & { password: string }, { dispatch, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Create new user object
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email || '',
        nickname: userData.nickname || '',
        gender: userData.gender || 'other',
        height: userData.height || 0,
        weight: userData.weight || 0,
        bodyType: userData.bodyType || 'mesomorph',
        fitnessGoal: userData.fitnessGoal || 'maintain',
        role: userData.role || UserRole.REGULAR, // Use provided role or default to REGULAR
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Get existing users from AsyncStorage
      const allUsersJson = await AsyncStorage.getItem('allUsers');
      let allUsers: User[] = [];
      if (allUsersJson) {
        allUsers = JSON.parse(allUsersJson);
      }
      // Add the new user to the list of all users
      allUsers.push(user);
      // Save the updated user list back to AsyncStorage
      await AsyncStorage.setItem('allUsers', JSON.stringify(allUsers));
      // Generate a personalized workout plan for the new user
      try {
        await dispatch(generateWorkoutPlan(user));
      } catch (error) {
        console.log('Error generating workout plan:', error);
        // Continue with user creation even if workout plan generation fails
      }
      return user;
    } catch (error) {
      return rejectWithValue('User creation failed. Please try again.');
    }
  }
);
export const register = createAsyncThunk(
  'auth/register',
  async (userData: Partial<User> & { password: string }, { dispatch, rejectWithValue }) => {
    try {
      // Create the user first
      const user = await dispatch(createUserWithoutLogin(userData)).unwrap();
      // Then log them in
      const token = 'mock-jwt-token';
      // Store current user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);
      return { user, token };
    } catch (error) {
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed. Please try again.');
    }
  }
);
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (userJson && token) {
        const user = JSON.parse(userJson) as User;
        return { user, token };
      }
      return { user: null, token: null };
    } catch (error) {
      return rejectWithValue('Authentication check failed.');
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { getState, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;
      if (!currentUser) {
        return rejectWithValue('User not authenticated');
      }
      // Update user data
      const updatedUser: User = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      // Store updated user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return rejectWithValue('Profile update failed. Please try again.');
    }
  }
);
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    upgradeUserRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
        // In a real app, you would make an API call to update the user role
        AsyncStorage.setItem('user', JSON.stringify(state.user)).catch(console.error);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create User Without Login
      .addCase(createUserWithoutLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserWithoutLogin.fulfilled, (state) => {
        state.isLoading = false;
        // Don't update state.user or state.token
      })
      .addCase(createUserWithoutLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});
export const { clearError, upgradeUserRole } = authSlice.actions;
export default authSlice.reducer;

