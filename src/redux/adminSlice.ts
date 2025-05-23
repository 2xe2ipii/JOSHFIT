import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, User, UserRole } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock API calls for demonstration - In a real app, these would connect to a backend
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the current user from AsyncStorage
      const currentUserJson = await AsyncStorage.getItem('user');
      let currentUser = null;
      if (currentUserJson) {
        currentUser = JSON.parse(currentUserJson);
      }
      
      // Get all registered users from AsyncStorage
      const allUsersJson = await AsyncStorage.getItem('allUsers');
      let allUsers: User[] = [];
      
      if (allUsersJson) {
        allUsers = JSON.parse(allUsersJson);
      }
      
      // Make sure the current admin user is included in the list
      if (currentUser && currentUser.role === UserRole.ADMIN) {
        const adminExists = allUsers.some(user => user.id === currentUser.id);
        if (!adminExists) {
          allUsers.push(currentUser);
        }
      }
      
      // If no users found, provide a default admin user for display
      if (allUsers.length === 0) {
        allUsers = [
          {
            id: 'admin1',
            email: 'admin@joshfit.com',
            nickname: 'Admin',
            gender: 'other',
            height: 175,
            weight: 70,
            bodyType: 'mesomorph',
            fitnessGoal: 'maintain',
            role: UserRole.ADMIN,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
      }
      
      return allUsers;
    } catch (error) {
      return rejectWithValue('Failed to fetch users. Please try again.');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }: { userId: string; role: UserRole }, { rejectWithValue, getState }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current state
      const state = getState() as { admin: AdminState };
      const users = [...state.admin.users];
      
      // Find user in Redux state
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        return rejectWithValue('User not found');
      }
      
      // Get user data
      const userToUpdate = users[userIndex];
      const userEmail = userToUpdate.email;
      
      // Update user role in Redux state
      const updatedUser = {
        ...userToUpdate,
        role,
        updatedAt: new Date().toISOString()
      };
      
      users[userIndex] = updatedUser;
      
      // CRITICAL: Update the user in AsyncStorage 'allUsers' list
      const allUsersJson = await AsyncStorage.getItem('allUsers');
      if (allUsersJson) {
        let allUsers: User[] = JSON.parse(allUsersJson);
        
        // Find and update all instances of this user (by ID and email)
        allUsers = allUsers.map(user => {
          if (user.id === userId || user.email === userEmail) {
            return {
              ...user,
              role,
              updatedAt: new Date().toISOString()
            };
          }
          return user;
        });
        
        // Save updated users list back to AsyncStorage
        await AsyncStorage.setItem('allUsers', JSON.stringify(allUsers));
      }
      
      // Also update the current user data if this is the logged in user
      const currentUserJson = await AsyncStorage.getItem('user');
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        if (currentUser.id === userId || currentUser.email === userEmail) {
          const updatedCurrentUser = {
            ...currentUser,
            role,
            updatedAt: new Date().toISOString()
          };
          await AsyncStorage.setItem('user', JSON.stringify(updatedCurrentUser));
        }
      }
      
      return users;
    } catch (error) {
      return rejectWithValue('Failed to update user role. Please try again.');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current users from Redux state
      const state = getState() as { admin: AdminState };
      const users = [...state.admin.users];
      
      const filteredUsers = users.filter(user => user.id !== userId);
      
      if (filteredUsers.length === users.length) {
        return rejectWithValue('User not found');
      }
      
      // Find the user to be deleted
      const userToDelete = users.find(user => user.id === userId);
      if (!userToDelete) {
        return rejectWithValue('User not found');
      }
      
      // Get the email of the user to be deleted
      const userEmail = userToDelete.email;
      
      // 1. PURGE FROM allUsers IN ASYNC STORAGE
      const allUsersJson = await AsyncStorage.getItem('allUsers');
      if (allUsersJson) {
        let allUsers: User[] = JSON.parse(allUsersJson);
        // Remove by ID and by email to ensure complete removal
        allUsers = allUsers.filter(user => user.id !== userId && user.email !== userEmail);
        await AsyncStorage.setItem('allUsers', JSON.stringify(allUsers));
      }
      
      // 2. CHECK IF THIS IS THE CURRENTLY LOGGED IN USER AND REMOVE FROM 'user' STORAGE
      const currentUserJson = await AsyncStorage.getItem('user');
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        if (currentUser.id === userId || currentUser.email === userEmail) {
          // Remove current user data if it matches the deleted user
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('token');
        }
      }
      
      // 3. ADDITIONAL CLEANUP - REMOVE ANY OTHER INSTANCES OF THIS USER
      // (In a real app, this would include cleanup of related data like workout plans, etc.)
      
      // Remove any potential blacklist to allow re-registration
      await AsyncStorage.removeItem('deletedEmails');
      
      return filteredUsers;
    } catch (error) {
      return rejectWithValue('Failed to delete user. Please try again.');
    }
  }
);

const initialState: AdminState = {
  users: [],
  isLoading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
